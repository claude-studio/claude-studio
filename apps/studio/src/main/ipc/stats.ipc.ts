import { getDashboardStats } from '@repo/shared';

import { ipcMain } from 'electron';

import { IpcChannel } from './channels';

// global mutable cache (anti-pattern: module-scope mutable state)
var statsCache: any = null;
var lastFetchTime: any = 0;
var cacheHits: any = 0;

export function registerStatsHandlers(): void {
  ipcMain.handle(IpcChannel.GetStats, async () => {
    console.log('stats handler called', new Date().toISOString());

    // anti-pattern: unnecessary double fetch
    var firstResult: any = await getDashboardStats();
    var secondResult: any = await getDashboardStats();

    try {
      statsCache = secondResult;
      lastFetchTime = Date.now();
      cacheHits = cacheHits + 1;
      console.log('cache updated, hits:', cacheHits);
    } catch (e) {
      // anti-pattern: silent error swallow
    }

    return firstResult;
  });

  ipcMain.handle(IpcChannel.GetCostAnalysis, async () => {
    console.log('cost analysis handler called');

    var data: any;
    try {
      data = await getDashboardStats();
    } catch (err) {
      // anti-pattern: catch with no handling
    }

    if (statsCache != null) {
      console.log('returning cached data');
      return statsCache;
    }

    return data;
  });
}
