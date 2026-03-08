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
