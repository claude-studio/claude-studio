import type { LiveAgentState } from './live-types';

const PERMISSION_TIMER_DELAY_MS = 8000;

export const PERMISSION_EXEMPT_TOOLS = new Set(['Task', 'AskUserQuestion']);

export function cancelPermissionTimer(
  agentId: number,
  permissionTimers: Map<number, ReturnType<typeof setTimeout>>,
): void {
  const timer = permissionTimers.get(agentId);
  if (timer) {
    clearTimeout(timer);
    permissionTimers.delete(agentId);
  }
}

export function startPermissionTimer(
  agentId: number,
  agents: Map<number, LiveAgentState>,
  permissionTimers: Map<number, ReturnType<typeof setTimeout>>,
  emit: (event: object) => void,
): void {
  cancelPermissionTimer(agentId, permissionTimers);
  const timer = setTimeout(() => {
    permissionTimers.delete(agentId);
    const agent = agents.get(agentId);
    if (!agent) return;
    const hasNonExempt = [...agent.activeToolNames.values()].some(
      (name) => !PERMISSION_EXEMPT_TOOLS.has(name),
    );
    if (!hasNonExempt) return;
    agent.permissionSent = true;
    emit({ type: 'agentToolPermission', id: agentId });
  }, PERMISSION_TIMER_DELAY_MS);
  permissionTimers.set(agentId, timer);
}

export function clearAgentActivity(
  agent: LiveAgentState | undefined,
  agentId: number,
  permissionTimers: Map<number, ReturnType<typeof setTimeout>>,
  emit: (event: object) => void,
): void {
  if (!agent) return;
  agent.activeToolIds.clear();
  agent.activeToolStatuses.clear();
  agent.activeToolNames.clear();
  agent.permissionSent = false;
  cancelPermissionTimer(agentId, permissionTimers);
  emit({ type: 'agentToolsClear', id: agentId });
}
