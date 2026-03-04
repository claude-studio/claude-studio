import { ipcMain } from 'electron';
import { IpcChannel } from './channels';
import { getDashboardStats } from '@repo/shared';

export function registerStatsHandlers(): void {
  ipcMain.handle(IpcChannel.GetStats, async () => {
    return getDashboardStats();
  });

  ipcMain.handle(IpcChannel.GetCostAnalysis, async () => {
    return getDashboardStats();
  });
}
