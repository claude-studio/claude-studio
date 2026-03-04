import { ipcMain } from 'electron';
import { IpcChannel } from './channels';
import { getSessions, getSessionDetail, searchSessions } from '@repo/shared';

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
