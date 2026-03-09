import { ipcMain } from 'electron';

import { installPlugin, isPluginInstalled, uninstallPlugin } from '../services/plugin-installer';
import { IpcChannel } from './channels';

export function registerPluginHandlers(): void {
  ipcMain.handle(IpcChannel.PluginCheckInstalled, () => {
    return isPluginInstalled();
  });

  ipcMain.handle(IpcChannel.PluginInstall, () => {
    installPlugin();
  });

  ipcMain.handle(IpcChannel.PluginUninstall, () => {
    uninstallPlugin();
  });
}
