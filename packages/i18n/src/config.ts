export const SUPPORTED_LOCALES = ['en', 'ko'] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = 'en';
export const WEB_LOCALE_STORAGE_KEY = 'claude-studio.locale';

export const NAMESPACES = ['analytics', 'common', 'navigation', 'settings', 'studio'] as const;

export type AppNamespace = (typeof NAMESPACES)[number];

export function normalizeLocale(input?: string | null): AppLocale | null {
  if (!input) return null;

  const normalized = input.trim().toLowerCase().split('-')[0];

  if (normalized === 'en' || normalized === 'ko') {
    return normalized;
  }

  return null;
}

export function resolveInitialLocale(
  savedLocale?: string | null,
  detectedLocale?: string | null,
): AppLocale {
  return normalizeLocale(savedLocale) ?? normalizeLocale(detectedLocale) ?? DEFAULT_LOCALE;
}

export type LocaleBootstrapState = {
  locale: AppLocale;
  persistedLocale: AppLocale | null;
};

export function resolveLocaleBootstrap(
  savedLocale?: string | null,
  detectedLocale?: string | null,
): LocaleBootstrapState {
  const persistedLocale = normalizeLocale(savedLocale);

  return {
    locale: persistedLocale ?? resolveInitialLocale(null, detectedLocale),
    persistedLocale,
  };
}

export function resolveLocaleChange(locale: string): AppLocale | null {
  return normalizeLocale(locale);
}
