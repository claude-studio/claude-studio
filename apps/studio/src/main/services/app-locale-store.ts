import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { type AppLocale, normalizeLocale } from '@repo/i18n';
import { app } from 'electron';

const APP_LOCALE_FILE = path.join('settings', 'app-locale.json');

type AppLocaleStoreOptions = {
  rootDir: string;
};

export type AppLocaleStore = {
  getAppLocale: () => Promise<AppLocale | null>;
  setAppLocale: (locale: AppLocale) => Promise<void>;
};

function getLocaleFilePath(rootDir: string): string {
  return path.join(rootDir, APP_LOCALE_FILE);
}

export function createAppLocaleStore({ rootDir }: AppLocaleStoreOptions): AppLocaleStore {
  const filePath = getLocaleFilePath(rootDir);

  return {
    async getAppLocale() {
      try {
        const raw = await readFile(filePath, 'utf-8');
        const parsed = JSON.parse(raw) as { locale?: unknown };
        return typeof parsed.locale === 'string' ? normalizeLocale(parsed.locale) : null;
      } catch {
        return null;
      }
    },
    async setAppLocale(locale) {
      const normalizedLocale = normalizeLocale(locale);

      if (normalizedLocale === null) {
        return;
      }

      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, `${JSON.stringify({ locale: normalizedLocale }, null, 2)}\n`, 'utf-8');
    },
  };
}

let defaultAppLocaleStore: AppLocaleStore | null = null;

export function getAppLocaleStore(): AppLocaleStore {
  defaultAppLocaleStore ??= createAppLocaleStore({
    rootDir: app.getPath('userData'),
  });

  return defaultAppLocaleStore;
}
