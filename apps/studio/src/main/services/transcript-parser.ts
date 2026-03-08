import type { LiveAgentState } from './live-types';
import {
  cancelPermissionTimer,
  clearAgentActivity,
  PERMISSION_EXEMPT_TOOLS,
  startPermissionTimer,
} from './timer-manager';

export function formatToolStatus(toolName: string, input: Record<string, unknown>): string {
  switch (toolName) {
    case 'Bash': {
      const cmd = String(input['command'] ?? '');
      return cmd.length > 60 ? cmd.slice(0, 57) + '...' : cmd;
    }
    case 'Read':
    case 'Write':
    case 'Edit': {
      const p = String(input['file_path'] ?? input['path'] ?? '');
      return p.split('/').pop() ?? p;
    }
    case 'Glob':
    case 'Grep': {
      const pattern = String(input['pattern'] ?? '');
      return pattern.length > 40 ? pattern.slice(0, 37) + '...' : pattern;
    }
    case 'WebFetch':
    case 'WebSearch': {
      const url = String(input['url'] ?? input['query'] ?? '');
      return url.length > 50 ? url.slice(0, 47) + '...' : url;
    }
    case 'Task': {
      const desc = String(input['description'] ?? '');
      return desc.length > 60 ? desc.slice(0, 57) + '...' : desc;
    }
    default:
      return '';
  }
}

export function processTranscriptLine(
  agentId: number,
  line: string,
  agents: Map<number, LiveAgentState>,
  permissionTimers: Map<number, ReturnType<typeof setTimeout>>,
  emit: (event: object) => void,
): void {
  const agent = agents.get(agentId);
  if (!agent) return;

  let record: Record<string, unknown>;
  try {
    record = JSON.parse(line) as Record<string, unknown>;
  } catch {
    return;
  }

  const recordType = record['type'] as string | undefined;

  // --- assistant 레코드: 도구 호출 감지 ---
  if (recordType === 'assistant') {
    const msg = record['message'] as Record<string, unknown> | undefined;
    const content = msg?.['content'] as Array<Record<string, unknown>> | undefined;
    if (!Array.isArray(content)) return;

    const toolUseBlocks = content.filter((b) => b['type'] === 'tool_use');
    if (toolUseBlocks.length === 0) return;

    if (agent.status !== 'working') {
      agent.status = 'working';
      emit({ type: 'agentWorking', id: agentId });
    }

    agent.hadToolsInTurn = true;
    let hasNonExempt = false;

    for (const block of toolUseBlocks) {
      const toolId = block['id'] as string | undefined;
      const toolName = (block['name'] as string | undefined) ?? '';
      const input = (block['input'] as Record<string, unknown> | undefined) ?? {};
      if (!toolId) continue;

      const statusText = formatToolStatus(toolName, input);
      agent.activeToolIds.add(toolId);
      agent.activeToolStatuses.set(toolId, statusText);
      agent.activeToolNames.set(toolId, toolName);

      emit({ type: 'agentToolStart', id: agentId, toolId, toolName, status: statusText });

      if (!PERMISSION_EXEMPT_TOOLS.has(toolName)) {
        hasNonExempt = true;
      }
    }

    if (hasNonExempt && !agent.permissionSent) {
      startPermissionTimer(agentId, agents, permissionTimers, emit);
    }
    return;
  }

  // --- user 레코드: 도구 결과 수신 ---
  if (recordType === 'user') {
    const msg = record['message'] as Record<string, unknown> | undefined;
    const content = msg?.['content'];

    // 배열 형태 (tool_result 포함)
    if (Array.isArray(content)) {
      const toolResults = (content as Array<Record<string, unknown>>).filter(
        (b) => b['type'] === 'tool_result',
      );

      for (const result of toolResults) {
        const toolId = result['tool_use_id'] as string | undefined;
        if (!toolId || !agent.activeToolIds.has(toolId)) continue;

        agent.activeToolIds.delete(toolId);
        agent.activeToolStatuses.delete(toolId);
        const toolName = agent.activeToolNames.get(toolId) ?? '';
        agent.activeToolNames.delete(toolId);

        emit({ type: 'agentToolDone', id: agentId, toolId, toolName });
      }

      if (agent.activeToolIds.size === 0 && agent.hadToolsInTurn) {
        cancelPermissionTimer(agentId, permissionTimers);
        agent.permissionSent = false;
        agent.hadToolsInTurn = false;
        emit({ type: 'agentToolsClear', id: agentId });
      }

      // 새 사용자 프롬프트 (tool_result 없음) → 새 턴 시작
      if (toolResults.length === 0) {
        cancelPermissionTimer(agentId, permissionTimers);
        clearAgentActivity(agent, agentId, permissionTimers, emit);
        agent.hadToolsInTurn = false;
      }
    }
    return;
  }

  // --- system 레코드 ---
  if (recordType === 'system') {
    const subtype = record['subtype'] as string | undefined;

    // 턴 종료: 확실한 idle 신호
    if (subtype === 'turn_duration') {
      cancelPermissionTimer(agentId, permissionTimers);
      if (agent.activeToolIds.size > 0) {
        clearAgentActivity(agent, agentId, permissionTimers, emit);
      }
      agent.hadToolsInTurn = false;
      if (agent.status !== 'idle') {
        agent.status = 'idle';
        emit({ type: 'agentIdle', id: agentId });
      }
      return;
    }

    // 세션 종료: Stop 훅 완료 신호
    if (subtype === 'stop_hook_summary') {
      cancelPermissionTimer(agentId, permissionTimers);
      clearAgentActivity(agent, agentId, permissionTimers, emit);
      agent.hadToolsInTurn = false;
      agent.status = 'idle';
      emit({ type: 'agentSessionEnd', id: agentId });
      return;
    }
    return;
  }

  // --- progress 레코드 ---
  if (recordType === 'progress') {
    const data = record['data'] as Record<string, unknown> | undefined;
    const dataType = data?.['type'] as string | undefined;

    // bash/mcp 실행 중 → permission 타이머 리셋 (실행 중인 것과 멈춘 것 구분)
    if (dataType === 'bash_progress' || dataType === 'mcp_progress') {
      const parentToolId = record['parentToolUseID'] as string | undefined;
      if (parentToolId && agent.activeToolIds.has(parentToolId)) {
        startPermissionTimer(agentId, agents, permissionTimers, emit);
      }
      return;
    }

    // hook_progress: SessionStart → 세션 시작 확인
    if (dataType === 'hook_progress') {
      const hookEvent = data?.['hookEvent'] as string | undefined;
      if (hookEvent === 'SessionStart') {
        if (agent.status !== 'idle') {
          agent.status = 'idle';
          emit({ type: 'agentIdle', id: agentId });
        }
      }
      return;
    }

    return;
  }
}
