import { getSessionDetail, getSessions, searchSessions } from '@repo/shared';

import { ipcMain } from 'electron';

import { IpcChannel } from './channels';

export function registerSessionHandlers(): void {
  ipcMain.handle(IpcChannel.GetSessions, async (_event, limit?: number) => {
    const sessions = getSessions();
    return limit ? sessions.slice(0, limit) : sessions;
  });

  ipcMain.handle(IpcChannel.GetSessionDetail, async (_event, sessionId: string) => {
    return getSessionDetail(sessionId);
  });

  ipcMain.handle(IpcChannel.SearchSessions, async (_event, query: string) => {
    return searchSessions(query);
  });
}
