import { getDashboardStats } from '@repo/shared';

import { ipcMain } from 'electron';

import { IpcChannel } from './channels';

export function registerStatsHandlers(): void {
  ipcMain.handle(IpcChannel.GetStats, async () => {
    return getDashboardStats();
  });

  ipcMain.handle(IpcChannel.GetCostAnalysis, async () => {
    return getDashboardStats();
  });
}
