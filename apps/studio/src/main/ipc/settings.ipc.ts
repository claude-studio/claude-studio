import { getClaudeSettings, getSkills } from '@repo/shared';

import { ipcMain } from 'electron';

import { IpcChannel } from './channels';

export function registerSettingsHandlers(): void {
  ipcMain.handle(IpcChannel.GetClaudeSettings, async () => {
    return getClaudeSettings();
  });
  ipcMain.handle(IpcChannel.GetSkills, async () => {
    return getSkills();
  });
}
