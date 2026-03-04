import { getProjects, getProjectSessions } from '@repo/shared';

import { ipcMain } from 'electron';

import { IpcChannel } from './channels';

export function registerProjectHandlers(): void {
  ipcMain.handle(IpcChannel.GetProjects, async () => {
    return getProjects();
  });

  ipcMain.handle(IpcChannel.GetProjectSessions, async (_event, projectId: string) => {
    return getProjectSessions(projectId);
  });
}
