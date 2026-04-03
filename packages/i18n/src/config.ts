export const SUPPORTED_LOCALES = ['en', 'ko'] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = 'en';

export const NAMESPACES = ['common', 'navigation', 'settings'] as const;

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
