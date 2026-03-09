import type {
  ClaudeSettings,
  DashboardStats,
  DataChangeSource,
  DataSource,
  ProjectInfo,
  SkillInfo,
} from '@repo/shared';

import { ipcRenderer } from 'electron';

// Inline type to avoid DOM-only @repo/pixel-agents in node tsconfig
type LiveAgentEvent = { type: string; id: number; [key: string]: unknown };

function createInvoker<TReturn, TArgs extends unknown[] = []>(channel: string) {
  return (...args: TArgs): Promise<TReturn> => ipcRenderer.invoke(channel, ...args);
}

export const electronAPI = {
  // Stats
  getStats: createInvoker<DashboardStats>('stats:get'),
  getCostAnalysis: createInvoker<DashboardStats>('costs:get'),

  // Projects
  getProjects: createInvoker<ProjectInfo[]>('projects:get'),

  // Settings
  getClaudeSettings: createInvoker<ClaudeSettings>('settings:get'),
  getSkills: createInvoker<SkillInfo[]>('skills:get'),

  // Data source
  getDataSource: createInvoker<DataSource>('data-source:get'),
  setDataSource: createInvoker<void, [DataSource]>('data-source:set'),
  exportData: createInvoker<string>('data:export'),
  importData: createInvoker<void, [string]>('data:import'),
  clearImport: createInvoker<void>('data:clear-import'),

  // File watcher events
  onDataChanged: (callback: (source: DataChangeSource) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, source: DataChangeSource) =>
      callback(source);
    ipcRenderer.on('data-changed', handler);
    return () => {
      ipcRenderer.off('data-changed', handler);
    };
  },

  // Character/wall sprites from PNG assets
  getCharacterSprites: createInvoker<unknown>('assets:get-character-sprites'),
  getWallSprites: createInvoker<unknown>('assets:get-wall-sprites'),

  // Live agent watching
  getActiveAgents: createInvoker<Array<{ id: number; projectName: string; shortId: string; status: string; activeToolId: string | null; activeToolName: string | null; activeToolStatus: string | null }>>('live:get-active-agents'),
  startLiveWatching: createInvoker<void>('live:start-watching'),
  stopLiveWatching: createInvoker<void>('live:stop-watching'),
  onLiveAgentEvent: (callback: (event: LiveAgentEvent) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, agentEvent: LiveAgentEvent) =>
      callback(agentEvent);
    ipcRenderer.on('live:agent-event', handler);
    return () => {
      ipcRenderer.off('live:agent-event', handler);
    };
  },

  // Plugin management
  checkPluginInstalled: createInvoker<boolean>('plugin:check-installed'),
  installPlugin: createInvoker<void>('plugin:install'),
  uninstallPlugin: createInvoker<void>('plugin:uninstall'),
};

export type ElectronAPI = typeof electronAPI;
