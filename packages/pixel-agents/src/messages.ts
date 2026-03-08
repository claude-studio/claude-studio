/** Live agent event types pushed from main process → renderer */
export type PixelAgentEventType =
  | 'agentCreated'
  | 'agentClosed'
  | 'agentWorking'
  | 'agentIdle'
  | 'agentSessionEnd'
  | 'agentToolStart'
  | 'agentToolDone'
  | 'agentToolsClear'
  | 'agentToolPermission';

export interface AgentCreatedEvent {
  type: 'agentCreated';
  id: number;
  projectName?: string;
  folderName?: string;
  shortId?: string;
}

export interface AgentClosedEvent {
  type: 'agentClosed';
  id: number;
}

export interface AgentWorkingEvent {
  type: 'agentWorking';
  id: number;
}

export interface AgentIdleEvent {
  type: 'agentIdle';
  id: number;
}

export interface AgentSessionEndEvent {
  type: 'agentSessionEnd';
  id: number;
}

export interface AgentToolStartEvent {
  type: 'agentToolStart';
  id: number;
  toolId: string;
  toolName?: string;
  status: string;
}

export interface AgentToolDoneEvent {
  type: 'agentToolDone';
  id: number;
  toolId: string;
}

export interface AgentToolsClearEvent {
  type: 'agentToolsClear';
  id: number;
}

export interface AgentToolPermissionEvent {
  type: 'agentToolPermission';
  id: number;
}

export type PixelAgentEvent =
  | AgentCreatedEvent
  | AgentClosedEvent
  | AgentWorkingEvent
  | AgentIdleEvent
  | AgentSessionEndEvent
  | AgentToolStartEvent
  | AgentToolDoneEvent
  | AgentToolsClearEvent
  | AgentToolPermissionEvent;
