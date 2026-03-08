import type {
  ClaudeSettings,
  DashboardStats,
  DataChangeSource,
  DataProvider,
  DataSource,
  ProjectInfo,
  SkillInfo,
} from '@repo/shared';

import type { PixelAgentEvent } from '@repo/pixel-agents';

declare global {
  interface Window {
    electronAPI: {
      getStats: () => Promise<DashboardStats>;
      getCostAnalysis: () => Promise<DashboardStats>;
      getProjects: () => Promise<ProjectInfo[]>;
      getDataSource: () => Promise<DataSource>;
      setDataSource: (source: DataSource) => Promise<void>;
      exportData: () => Promise<string>;
      importData: (data: string) => Promise<void>;
      clearImport: () => Promise<void>;
      onDataChanged: (callback: (source: DataChangeSource) => void) => () => void;
      getClaudeSettings: () => Promise<ClaudeSettings>;
      getSkills: () => Promise<SkillInfo[]>;
      getCharacterSprites: () => Promise<unknown>;
      getWallSprites: () => Promise<unknown>;
      getActiveAgents: () => Promise<Array<{ id: number; projectName: string; shortId: string; status: string; activeToolId: string | null; activeToolName: string | null; activeToolStatus: string | null }>>;
      startLiveWatching: () => Promise<void>;
      stopLiveWatching: () => Promise<void>;
      onLiveAgentEvent: (callback: (event: PixelAgentEvent) => void) => () => void;
    };
  }
}


function reviveDates(obj: unknown): unknown {
  if (obj instanceof Date) return obj;
  if (typeof obj === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(obj)) {
    return new Date(obj);
  }
  if (Array.isArray(obj)) return obj.map(reviveDates);
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [k, reviveDates(v)]),
    );
  }
  return obj;
}

async function invoke<T>(fn: () => Promise<T>): Promise<T> {
  const result = await fn();
  return reviveDates(result) as T;
}

export const electronProvider: DataProvider = {
  getStats: () => invoke(() => window.electronAPI.getStats()),
  getProjects: () => invoke(() => window.electronAPI.getProjects()),
  getDataSource: () => invoke(() => window.electronAPI.getDataSource()),
  setDataSource: (s) => window.electronAPI.setDataSource(s),
  exportData: async () => {
    const str = await window.electronAPI.exportData();
    return new TextEncoder().encode(str);
  },
  importData: async () => {},
  clearImport: () => window.electronAPI.clearImport(),
  getCostAnalysis: () => invoke(() => window.electronAPI.getCostAnalysis()),
};
