import type {
  DashboardStats,
  DataProvider,
  DataSource,
  ProjectInfo,
  SessionDetail,
  SessionInfo,
} from '@repo/shared';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return reviveDates(data) as T;
}

function reviveDates(obj: unknown): unknown {
  if (typeof obj === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(obj)) {
    return new Date(obj);
  }
  if (Array.isArray(obj)) return obj.map(reviveDates);
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, reviveDates(v)]));
  }
  return obj;
}

interface ExtendedDataProvider extends DataProvider {
  getProjectSessions(id: string): Promise<SessionInfo[]>;
  getSessions(limit?: number): Promise<SessionInfo[]>;
  getSessionDetail(id: string): Promise<SessionDetail>;
  searchSessions(q: string): Promise<SessionInfo[]>;
}

export const httpProvider: ExtendedDataProvider = {
  getStats: () => apiFetch<DashboardStats>('/'),
  getProjects: () => apiFetch<ProjectInfo[]>('/projects'),
  getProjectSessions: (id: string) =>
    apiFetch<SessionInfo[]>(`/projects/${encodeURIComponent(id)}/sessions`),
  getSessions: (limit?: number) =>
    apiFetch<SessionInfo[]>(`/sessions${limit ? `?limit=${limit}` : ''}`),
  getSessionDetail: (id: string) => apiFetch<SessionDetail>(`/sessions/${id}`),
  searchSessions: (q: string) => apiFetch<SessionInfo[]>(`/search?q=${encodeURIComponent(q)}`),
  getDataSource: () => apiFetch<DataSource>('/data-source'),
  setDataSource: async () => {},
  exportData: async () => new Uint8Array(0),
  importData: async () => {},
  clearImport: async () => {},
  getCostAnalysis: () => apiFetch<DashboardStats>('/'),
};
