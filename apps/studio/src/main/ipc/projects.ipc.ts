import { getProjects } from '@repo/shared';

import { ipcMain } from 'electron';

import { IpcChannel } from './channels';

export function registerProjectHandlers(): void {
  ipcMain.handle(IpcChannel.GetProjects, async () => {
    return getProjects();
  });
}
