import type { DataSource } from '../types/data-source';

let currentDataSource: DataSource = {
  type: 'local',
  path: '',
};

export function getActiveDataSource(): DataSource {
  return currentDataSource;
}

export function setDataSource(source: DataSource): void {
  currentDataSource = source;
}

export function clearImportedData(): void {
  currentDataSource = { type: 'local', path: '' };
}
