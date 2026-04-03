import i18next, { type i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { DEFAULT_LOCALE, NAMESPACES, SUPPORTED_LOCALES, type AppLocale } from './config';
import { resources } from './resources';

export async function initI18n(locale: AppLocale = DEFAULT_LOCALE): Promise<i18n> {
  const instance = i18next.createInstance();

  await instance.use(initReactI18next).init({
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: [...SUPPORTED_LOCALES],
    ns: [...NAMESPACES],
    defaultNS: 'common',
    resources,
    interpolation: {
      escapeValue: false,
    },
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    returnNull: false,
    react: {
      useSuspense: false,
    },
  });

  return instance;
}
