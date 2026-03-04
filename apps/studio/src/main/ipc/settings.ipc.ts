import { ipcMain } from 'electron';
import { IpcChannel } from './channels';
import { getClaudeSettings, getSkills, getTeams } from '@repo/shared';

export function registerSettingsHandlers(): void {
  ipcMain.handle(IpcChannel.GetClaudeSettings, async () => {
    return getClaudeSettings();
  });
  ipcMain.handle(IpcChannel.GetSkills, async () => {
    return getSkills();
  });
  ipcMain.handle(IpcChannel.GetTeams, async () => {
    return getTeams();
  });
}
