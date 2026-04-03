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
  const savedLocale = getSavedLocale ? await getSavedLocale() : null;
  const { locale } = resolveLocaleBootstrap(savedLocale, detectLocale);

  return {
    i18n: await initI18n(locale),
    initialLocale: locale,
  };
}
