import type { DashboardStats, ProjectInfo, SessionDetail, SessionInfo } from './index';

export type DataSourceType = 'local' | 'imported';

export interface DataSource {
  type: DataSourceType;
  path: string; // ~/.claude or custom path
}

export interface DataProvider {
  getStats(): Promise<DashboardStats>;
  getProjects(): Promise<ProjectInfo[]>;
  getProjectSessions(projectId: string): Promise<SessionInfo[]>;
  getSessions(limit?: number): Promise<SessionInfo[]>;
  getSessionDetail(sessionId: string): Promise<SessionDetail>;
  searchSessions(query: string): Promise<SessionInfo[]>;
  getDataSource(): Promise<DataSource>;
  setDataSource(source: DataSource): Promise<void>;
  exportData(): Promise<Uint8Array>;
  importData(data: Uint8Array): Promise<void>;
  clearImport(): Promise<void>;
  getCostAnalysis(): Promise<DashboardStats>;
}
