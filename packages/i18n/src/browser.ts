import { type AppLocale, resolveLocaleChange, WEB_LOCALE_STORAGE_KEY } from './config';

export type LocaleStorage = Pick<Storage, 'getItem' | 'setItem'>;

export type BrowserLocaleStorageOptions = {
  key?: string;
  storage?: LocaleStorage;
};

export type BrowserLocaleStorage = {
  getSavedLocale: () => AppLocale | null;
  setSavedLocale: (locale: AppLocale) => void;
  storageKey: string;
};

export function detectBrowserLocale(
  navigatorLike:
    | Pick<Navigator, 'language' | 'languages'>
    | null
    | undefined = globalThis.navigator,
): string | null {
  if (!navigatorLike) {
    return null;
  }

  return navigatorLike.languages?.[0] ?? navigatorLike.language ?? null;
}

export function createBrowserLocaleStorage({
  key = WEB_LOCALE_STORAGE_KEY,
  storage = globalThis.localStorage,
}: BrowserLocaleStorageOptions = {}): BrowserLocaleStorage {
  return {
    getSavedLocale() {
      try {
        return resolveLocaleChange(storage?.getItem(key) ?? '');
      } catch {
        return null;
      }
    },
    setSavedLocale(locale) {
      storage?.setItem(key, locale);
    },
    storageKey: key,
  };
}
