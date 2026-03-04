import { ipcMain } from 'electron';
import { IpcChannel } from './channels';
import {
  getActiveDataSource,
  setDataSource,
  clearImportedData,
  clearCache,
  getDashboardStats,
  getSessions,
  getProjects,
} from '@repo/shared';

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
