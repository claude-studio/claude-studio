export type AgentStatus = 'working' | 'idle';

export interface LiveAgentState {
  id: number;
  projectName: string;
  jsonlFile: string;
  fileOffset: number;
  lineBuffer: string;
  status: AgentStatus;
  activeToolIds: Set<string>;
  activeToolStatuses: Map<string, string>;
  activeToolNames: Map<string, string>;
  permissionSent: boolean;
  hadToolsInTurn: boolean;
}

export type LiveAgentEventType =
  | 'agentCreated'
  | 'agentClosed'
  | 'agentWorking'
  | 'agentIdle'
  | 'agentSessionEnd'
  | 'agentToolStart'
  | 'agentToolDone'
  | 'agentToolsClear'
  | 'agentToolPermission';

export interface LiveAgentEvent {
  type: LiveAgentEventType;
  id: number;
  projectName?: string;
  status?: string;
  toolId?: string;
}

export interface HookEvent {
  hook_event_name: string;
  session_id?: string;
  transcript_path?: string;
  cwd?: string;
  tool_name?: string;
  tool_input?: Record<string, unknown>;
  tool_output?: string;
  tool_use_id?: string;
  source?: string;
  model?: string;
  agent_type?: string;
}
