import type { DashboardStats, ProjectInfo } from './index';

export type DataSourceType = 'local' | 'imported';

export interface DataSource {
  type: DataSourceType;
  path: string; // ~/.claude or custom path
}

export interface DataProvider {
  getStats(): Promise<DashboardStats>;
  getProjects(): Promise<ProjectInfo[]>;
  getDataSource(): Promise<DataSource>;
  setDataSource(source: DataSource): Promise<void>;
  exportData(): Promise<Uint8Array>;
  importData(data: Uint8Array): Promise<void>;
  clearImport(): Promise<void>;
  getCostAnalysis(): Promise<DashboardStats>;
}
