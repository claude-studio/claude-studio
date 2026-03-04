import type {
  DataProvider,
  DashboardStats,
  ProjectInfo,
  SessionInfo,
  SessionDetail,
  DataSource,
} from '@repo/shared';

declare global {
  interface Window {
    electronAPI: {
      getStats: () => Promise<DashboardStats>;
      getCostAnalysis: () => Promise<DashboardStats>;
      getProjects: () => Promise<ProjectInfo[]>;
      getProjectSessions: (id: string) => Promise<SessionInfo[]>;
      getSessions: (limit?: number) => Promise<SessionInfo[]>;
      getSessionDetail: (id: string) => Promise<SessionDetail>;
      searchSessions: (query: string) => Promise<SessionInfo[]>;
      getDataSource: () => Promise<DataSource>;
      setDataSource: (source: DataSource) => Promise<void>;
      exportData: () => Promise<string>;
      importData: (data: string) => Promise<void>;
      clearImport: () => Promise<void>;
      onDataChanged: (callback: () => void) => () => void;
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
  getProjectSessions: (id) => invoke(() => window.electronAPI.getProjectSessions(id)),
  getSessions: (limit) => invoke(() => window.electronAPI.getSessions(limit)),
  getSessionDetail: (id) => invoke(() => window.electronAPI.getSessionDetail(id)),
  searchSessions: (q) => invoke(() => window.electronAPI.searchSessions(q)),
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
