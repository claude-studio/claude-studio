import type {
  ClaudeSettings,
  DashboardStats,
  DataChangeSource,
  DataSource,
  ProjectInfo,
  SessionDetail,
  SessionInfo,
  SkillInfo,
  TeamDetail,
} from '@repo/shared';

import { ipcRenderer } from 'electron';

function createInvoker<TReturn, TArgs extends unknown[] = []>(channel: string) {
  return (...args: TArgs): Promise<TReturn> => ipcRenderer.invoke(channel, ...args);
}

export const electronAPI = {
  // Stats
  getStats: createInvoker<DashboardStats>('stats:get'),
  getCostAnalysis: createInvoker<DashboardStats>('costs:get'),

  // Projects
  getProjects: createInvoker<ProjectInfo[]>('projects:get'),
  getProjectSessions: createInvoker<SessionInfo[], [string]>('projects:sessions'),

  // Sessions
  getSessions: createInvoker<SessionInfo[], [number?]>('sessions:get'),
  getSessionDetail: createInvoker<SessionDetail, [string]>('sessions:detail'),
  searchSessions: createInvoker<SessionInfo[], [string]>('sessions:search'),

  // Settings
  getClaudeSettings: createInvoker<ClaudeSettings>('settings:get'),
  getSkills: createInvoker<SkillInfo[]>('skills:get'),
  getTeams: createInvoker<TeamDetail[]>('teams:get'),

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
};

export type ElectronAPI = typeof electronAPI;
