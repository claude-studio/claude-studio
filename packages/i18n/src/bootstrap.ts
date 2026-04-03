import { type AppLocale, resolveLocaleBootstrap } from './config';
import { initI18n } from './init';

export type LocaleReader = () => string | null | Promise<string | null>;

export type LocaleBootstrapInput = {
  detectLocale?: string | null;
  getSavedLocale?: LocaleReader;
};

export type LocaleBootstrapResult = {
  i18n: Awaited<ReturnType<typeof initI18n>>;
  initialLocale: AppLocale;
};

export async function bootstrapI18n({
  detectLocale,
  getSavedLocale,
}: LocaleBootstrapInput = {}): Promise<LocaleBootstrapResult> {
  const savedLocale = await readSavedLocale(getSavedLocale);
  const { locale } = resolveLocaleBootstrap(savedLocale, detectLocale);

  return {
    i18n: await initI18n(locale),
    initialLocale: locale,
  };
}

async function readSavedLocale(getSavedLocale?: LocaleReader): Promise<string | null> {
  if (!getSavedLocale) {
    return null;
  }

  try {
    return await getSavedLocale();
  } catch {
    return null;
  }
}
