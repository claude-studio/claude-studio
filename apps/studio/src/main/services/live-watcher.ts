import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { BrowserWindow } from 'electron';

import type { HookEvent, LiveAgentEvent, LiveAgentState } from './live-types';
import { clearAgentActivity } from './timer-manager';
import { processTranscriptLine } from './transcript-parser';

const IDLE_DESPAWN_MS = 60 * 1000;
const JSONL_PATTERN = /\.jsonl$/;

const agents = new Map<number, LiveAgentState>();
const permissionTimers = new Map<number, ReturnType<typeof setTimeout>>();
const idleTimers = new Map<number, ReturnType<typeof setTimeout>>();
const fileWatchers = new Map<string, fs.FSWatcher>();
const fileLastActivity = new Map<string, number>();

let dirWatcher: fs.FSWatcher | null = null;
let nextAgentId = 1;
const fileToAgentId = new Map<string, number>();
const dirToAgentId = new Map<string, number>(); // 프로젝트 디렉토리 → 활성 에이전트 (1디렉토리 1에이전트)
const sessionToAgentId = new Map<string, number>(); // 훅 session_id → 에이전트 ID

function emit(event: object): void {
  const windows = BrowserWindow.getAllWindows();
  for (const win of windows) {
    if (!win.isDestroyed() && !win.webContents.isLoading() && !win.webContents.isCrashed()) {
      try {
        win.webContents.send('live:agent-event', event as LiveAgentEvent);
      } catch {
        // renderer not ready yet
      }
    }
  }
}

function getClaudeProjectsDir(): string {
  return path.join(os.homedir(), '.claude', 'projects');
}

function getFileMtime(filePath: string): number {
  try {
    return fs.statSync(filePath).mtimeMs;
  } catch {
    return 0;
  }
}

function projectNameFromDir(dirPath: string): string {
  const base = path.basename(dirPath);
  try {
    return decodeURIComponent(base).replace(/^-/, '/').replace(/-/g, '/');
  } catch {
    return base;
  }
}

function readNewLines(agent: LiveAgentState): string[] {
  const lines: string[] = [];
  try {
    const fd = fs.openSync(agent.jsonlFile, 'r');
    const stat = fs.fstatSync(fd);
    const fileSize = stat.size;

    if (fileSize <= agent.fileOffset) {
      fs.closeSync(fd);
      return lines;
    }

    const chunkSize = fileSize - agent.fileOffset;
    const buffer = Buffer.alloc(chunkSize);
    fs.readSync(fd, buffer, 0, chunkSize, agent.fileOffset);
    fs.closeSync(fd);

    agent.fileOffset = fileSize;

    const text = agent.lineBuffer + buffer.toString('utf8');
    const parts = text.split('\n');
    agent.lineBuffer = parts.pop() ?? '';

    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed) lines.push(trimmed);
    }
  } catch {
    // file may have been deleted or locked
  }
  return lines;
}

function startIdleTimer(agentId: number): void {
  cancelIdleTimer(agentId);
  const timer = setTimeout(() => {
    idleTimers.delete(agentId);
    const agent = agents.get(agentId);
    if (!agent || agent.status !== 'idle') return;
    unwatchFile(agent.jsonlFile);
    despawnAgent(agentId);
  }, IDLE_DESPAWN_MS);
  idleTimers.set(agentId, timer);
}

function cancelIdleTimer(agentId: number): void {
  const timer = idleTimers.get(agentId);
  if (timer) {
    clearTimeout(timer);
    idleTimers.delete(agentId);
  }
}

function spawnAgent(jsonlFile: string, projectName: string): number {
  const agentId = nextAgentId++;
  const agent: LiveAgentState = {
    id: agentId,
    projectName,
    jsonlFile,
    fileOffset: 0,
    lineBuffer: '',
    status: 'idle',
    activeToolIds: new Set(),
    activeToolStatuses: new Map(),
    activeToolNames: new Map(),
    permissionSent: false,
    hadToolsInTurn: false,
  };

  agents.set(agentId, agent);
  fileToAgentId.set(jsonlFile, agentId);
  dirToAgentId.set(path.dirname(jsonlFile), agentId);
  fileLastActivity.set(jsonlFile, Date.now());

  const shortId = path.basename(jsonlFile, '.jsonl').slice(0, 8);
  emit({ type: 'agentCreated', id: agentId, projectName, shortId });

  // 기존 내용 replay → 현재 상태 복원
  const existingLines = readNewLines(agent);
  for (const line of existingLines) {
    processTranscriptLine(agentId, line, agents, permissionTimers, emit);
  }

  // replay 후 상태에 따라 처리
  if (agent.status === 'working' || agent.activeToolIds.size > 0) {
    // 작업 중 — agentWorking 먼저 emit해서 자리로 이동 트리거
    emit({ type: 'agentWorking', id: agentId });
    if (agent.activeToolIds.size > 0) {
      const toolId = [...agent.activeToolIds][0]!;
      const toolName = agent.activeToolNames.get(toolId) ?? '';
      const status = agent.activeToolStatuses.get(toolId) ?? '';
      emit({ type: 'agentToolStart', id: agentId, toolId, toolName, status });
    }
  } else {
    // idle — 파일이 최근이면 working으로 스폰, 아니면 idle 타이머 시작
    const mtime = getFileMtime(jsonlFile);
    if (Date.now() - mtime < IDLE_DESPAWN_MS) {
      agent.status = 'working';
      emit({ type: 'agentWorking', id: agentId });
    } else {
      startIdleTimer(agentId);
    }
  }

  return agentId;
}

function despawnAgent(agentId: number): void {
  const agent = agents.get(agentId);
  if (!agent) return;

  clearAgentActivity(agent, agentId, permissionTimers, emit);
  cancelIdleTimer(agentId);

  const filePath = agent.jsonlFile;
  fileToAgentId.delete(filePath);
  fileLastActivity.delete(filePath);
  const dirPath = path.dirname(filePath);
  if (dirToAgentId.get(dirPath) === agentId) dirToAgentId.delete(dirPath);

  // session → agentId 매핑 정리
  for (const [sid, aid] of sessionToAgentId) {
    if (aid === agentId) sessionToAgentId.delete(sid);
  }

  agents.delete(agentId);
  emit({ type: 'agentClosed', id: agentId });
}

function processFile(jsonlFile: string): void {
  const agentId = fileToAgentId.get(jsonlFile);
  if (agentId === undefined) return;

  const agent = agents.get(agentId);
  if (!agent) return;

  const lines = readNewLines(agent);
  if (lines.length > 0) {
    fileLastActivity.set(jsonlFile, Date.now());
  }

  // agentWorking/agentIdle 이벤트에 맞춰 idle 타이머 제어
  const emitWithTimer = (event: object) => {
    emit(event);
    const e = event as { type: string };
    if (e.type === 'agentWorking') {
      cancelIdleTimer(agentId);
    } else if (e.type === 'agentSessionEnd' || e.type === 'agentIdle') {
      startIdleTimer(agentId);
    }
  };

  for (const line of lines) {
    processTranscriptLine(agentId, line, agents, permissionTimers, emitWithTimer);
  }
}

function watchFile(jsonlFile: string): void {
  if (fileWatchers.has(jsonlFile)) return;

  try {
    const watcher = fs.watch(jsonlFile, { persistent: false }, () => {
      processFile(jsonlFile);
    });
    watcher.on('error', () => {
      unwatchFile(jsonlFile);
    });
    fileWatchers.set(jsonlFile, watcher);
  } catch {
    // ignore
  }
}

function unwatchFile(jsonlFile: string): void {
  const watcher = fileWatchers.get(jsonlFile);
  if (watcher) {
    watcher.close();
    fileWatchers.delete(jsonlFile);
  }
}

function trySpawnFile(filePath: string): void {
  if (!JSONL_PATTERN.test(filePath)) return;
  if (/[/\\]subagents[/\\]/.test(filePath)) return;
  if (fileToAgentId.has(filePath)) return;

  const mtime = getFileMtime(filePath);
  if (Date.now() - mtime >= IDLE_DESPAWN_MS) return;

  const dirPath = path.dirname(filePath);

  // 같은 디렉토리에 이미 활성 에이전트가 있으면 despawn 후 교체
  const existingAgentId = dirToAgentId.get(dirPath);
  if (existingAgentId !== undefined) {
    const existing = agents.get(existingAgentId);
    if (existing) {
      unwatchFile(existing.jsonlFile);
      despawnAgent(existingAgentId);
    }
  }

  const projectName = projectNameFromDir(dirPath);
  spawnAgent(filePath, projectName);
  watchFile(filePath);
}

function scanExistingFiles(): void {
  const projectsDir = getClaudeProjectsDir();
  try {
    for (const dir of fs.readdirSync(projectsDir)) {
      const dirPath = path.join(projectsDir, dir);
      try {
        if (!fs.statSync(dirPath).isDirectory()) continue;
        for (const file of fs.readdirSync(dirPath)) {
          if (!JSONL_PATTERN.test(file)) continue;
          trySpawnFile(path.join(dirPath, file));
        }
      } catch {
        // skip unreadable dirs
      }
    }
  } catch {
    // projects dir unreadable
  }
}

export function startLiveWatcher(): void {
  if (dirWatcher) return;

  const projectsDir = getClaudeProjectsDir();
  scanExistingFiles();

  try {
    dirWatcher = fs.watch(projectsDir, { persistent: false, recursive: true }, (_event, filename) => {
      if (!filename) return;
      const filePath = path.join(projectsDir, filename);
      trySpawnFile(filePath);
      if (fileToAgentId.has(filePath)) {
        processFile(filePath);
      }
    });
    dirWatcher.on('error', () => {
      dirWatcher = null;
    });
  } catch {
    // fallback: dirWatcher 없이 기존 파일만 감시
  }
}

export function stopLiveWatcher(): void {
  if (dirWatcher) {
    dirWatcher.close();
    dirWatcher = null;
  }

  for (const [filePath] of [...fileToAgentId]) {
    unwatchFile(filePath);
  }

  for (const [agentId] of [...agents]) {
    despawnAgent(agentId);
  }
}

export function processHookEvent(event: HookEvent): void {
  const { hook_event_name, session_id, transcript_path, cwd, tool_name, tool_use_id } = event;

  // 에이전트 식별/생성 헬퍼
  function getOrCreateAgent(): number {
    if (session_id && sessionToAgentId.has(session_id)) {
      return sessionToAgentId.get(session_id)!;
    }

    // transcript_path로 기존 에이전트 찾기
    if (transcript_path && fileToAgentId.has(transcript_path)) {
      const id = fileToAgentId.get(transcript_path)!;
      if (session_id) sessionToAgentId.set(session_id, id);
      return id;
    }

    // 새 에이전트 생성
    const agentId = nextAgentId++;
    const projectName = cwd
      ? path.basename(cwd)
      : transcript_path
        ? projectNameFromDir(path.dirname(transcript_path))
        : `session-${agentId}`;

    const jsonlFile = transcript_path ?? path.join(getClaudeProjectsDir(), `hook-${agentId}.jsonl`);
    const shortId = session_id ? session_id.slice(0, 8) : `hook-${agentId}`;

    const agent: LiveAgentState = {
      id: agentId,
      projectName,
      jsonlFile,
      fileOffset: 0,
      lineBuffer: '',
      status: 'working',
      activeToolIds: new Set(),
      activeToolStatuses: new Map(),
      activeToolNames: new Map(),
      permissionSent: false,
      hadToolsInTurn: false,
    };

    agents.set(agentId, agent);
    fileToAgentId.set(jsonlFile, agentId);
    dirToAgentId.set(path.dirname(jsonlFile), agentId);
    if (session_id) sessionToAgentId.set(session_id, agentId);

    emit({ type: 'agentCreated', id: agentId, projectName, shortId });
    return agentId;
  }

  if (hook_event_name === 'SessionStart') {
    const agentId = getOrCreateAgent();
    const agent = agents.get(agentId);
    if (agent) {
      agent.status = 'working';
      cancelIdleTimer(agentId);
    }
    emit({ type: 'agentWorking', id: agentId });
    return;
  }

  if (hook_event_name === 'PreToolUse') {
    const agentId = getOrCreateAgent();
    const agent = agents.get(agentId);
    if (!agent) return;
    agent.status = 'working';
    cancelIdleTimer(agentId);
    emit({ type: 'agentWorking', id: agentId });

    if (tool_name && tool_use_id) {
      agent.activeToolIds.add(tool_use_id);
      agent.activeToolNames.set(tool_use_id, tool_name);
      agent.activeToolStatuses.set(tool_use_id, '');
      emit({ type: 'agentToolStart', id: agentId, toolId: tool_use_id, toolName: tool_name, status: '' });
    }

    // 권한 요청 타이머 (8초 후 permission 이벤트)
    if (tool_name && tool_use_id) {
      const pTimer = setTimeout(() => {
        permissionTimers.delete(agentId);
        if (agents.get(agentId)?.activeToolIds.has(tool_use_id!)) {
          emit({ type: 'agentToolPermission', id: agentId });
        }
      }, 8000);
      permissionTimers.set(agentId, pTimer);
    }
    return;
  }

  if (hook_event_name === 'PostToolUse') {
    const agentId = session_id ? sessionToAgentId.get(session_id) : undefined;
    if (agentId === undefined) return;
    const agent = agents.get(agentId);
    if (!agent) return;

    // 권한 타이머 취소
    const pt = permissionTimers.get(agentId);
    if (pt) {
      clearTimeout(pt);
      permissionTimers.delete(agentId);
    }

    if (tool_use_id) {
      agent.activeToolIds.delete(tool_use_id);
      agent.activeToolStatuses.delete(tool_use_id);
      agent.activeToolNames.delete(tool_use_id);
      emit({ type: 'agentToolDone', id: agentId, toolId: tool_use_id });
    }

    if (agent.activeToolIds.size === 0) {
      emit({ type: 'agentToolsClear', id: agentId });
    }
    return;
  }

  if (hook_event_name === 'Stop' || hook_event_name === 'SubagentStop') {
    const agentId = session_id ? sessionToAgentId.get(session_id) : undefined;
    if (agentId === undefined) return;
    const agent = agents.get(agentId);
    if (!agent) return;

    clearAgentActivity(agent, agentId, permissionTimers, emit);
    agent.status = 'idle';
    emit({ type: 'agentIdle', id: agentId });
    startIdleTimer(agentId);
    return;
  }

  if (hook_event_name === 'Notification') {
    // permission_prompt matcher로 이미 필터링됨
    const agentId = session_id ? sessionToAgentId.get(session_id) : undefined;
    if (agentId === undefined) return;
    emit({ type: 'agentToolPermission', id: agentId });
    return;
  }
}

export function getActiveAgents(): Array<{
  id: number;
  projectName: string;
  shortId: string;
  status: string;
  activeToolId: string | null;
  activeToolName: string | null;
  activeToolStatus: string | null;
}> {
  return [...agents.values()].map((a) => {
    const toolId = [...a.activeToolIds][0] ?? null;
    const shortId = path.basename(a.jsonlFile, '.jsonl').slice(0, 8);
    return {
      id: a.id,
      projectName: a.projectName,
      shortId,
      status: a.status,
      activeToolId: toolId,
      activeToolName: toolId ? (a.activeToolNames.get(toolId) ?? null) : null,
      activeToolStatus: toolId ? (a.activeToolStatuses.get(toolId) ?? null) : null,
    };
  });
}
