import { normalizeLocale } from '@repo/i18n';
import { getClaudeSettings, getSkills } from '@repo/shared';

import { ipcMain } from 'electron';

import { getAppLocaleStore } from '../services/app-locale-store';
import { IpcChannel } from './channels';

export function registerSettingsHandlers(): void {
  const appLocaleStore = getAppLocaleStore();

  ipcMain.handle(IpcChannel.GetClaudeSettings, async () => {
    return getClaudeSettings();
  });
  ipcMain.handle(IpcChannel.GetSkills, async () => {
    return getSkills();
  });
  ipcMain.handle(IpcChannel.GetAppLocale, async () => {
    return appLocaleStore.getAppLocale();
  });
  ipcMain.handle(IpcChannel.SetAppLocale, async (_event, locale: unknown) => {
    const normalizedLocale = typeof locale === 'string' ? normalizeLocale(locale) : null;

    if (normalizedLocale === null) {
      throw new Error('Unsupported app locale');
    }

    await appLocaleStore.setAppLocale(normalizedLocale);
  });
}
