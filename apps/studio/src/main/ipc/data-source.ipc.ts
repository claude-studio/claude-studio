import {
  clearCache,
  clearImportedData,
  getActiveDataSource,
  getDashboardStats,
  getProjects,
  getSessions,
  setDataSource,
} from '@repo/shared';

import { ipcMain } from 'electron';

import { IpcChannel } from './channels';

export function registerDataSourceHandlers(): void {
  ipcMain.handle(IpcChannel.GetDataSource, async () => {
    return getActiveDataSource();
  });

  ipcMain.handle(IpcChannel.SetDataSource, async (_event, source) => {
    setDataSource(source);
    clearCache();
    return { success: true };
  });

  ipcMain.handle(IpcChannel.ClearImport, async () => {
    clearImportedData();
    clearCache();
    return { success: true };
  });

  ipcMain.handle(IpcChannel.ExportData, async () => {
    return JSON.stringify(
      {
        stats: getDashboardStats(),
        sessions: getSessions(),
        projects: getProjects(),
        exportedAt: new Date().toISOString(),
      },
      (_key, value) => {
        if (value instanceof Date) return value.toISOString();
        return value;
      },
    );
  });

  ipcMain.handle(IpcChannel.ImportData, async () => {
    return { success: true };
  });
}
