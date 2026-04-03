import { createContext, useContext, useMemo, useState } from 'react';

import type { i18n } from 'i18next';
import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

import { type AppLocale, resolveLocaleChange } from './config';

export interface I18nProviderProps {
  children: ReactNode;
  i18n: i18n;
}

export function I18nProvider({ children, i18n }: I18nProviderProps) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

type LocalePersistenceHandler = (locale: AppLocale) => void | Promise<void>;

type AppLocaleContextValue = {
  isChanging: boolean;
  locale: AppLocale;
  setLocale: (locale: AppLocale) => Promise<void>;
};

const AppLocaleContext = createContext<AppLocaleContextValue | null>(null);

export interface AppLocaleProviderProps extends I18nProviderProps {
  initialLocale: AppLocale;
  onLocaleChange?: LocalePersistenceHandler;
}

export function AppLocaleProvider({
  children,
  i18n,
  initialLocale,
  onLocaleChange,
}: AppLocaleProviderProps) {
  const [locale, setCurrentLocale] = useState<AppLocale>(initialLocale);
  const [isChanging, setIsChanging] = useState(false);

  const value = useMemo<AppLocaleContextValue>(
    () => ({
      isChanging,
      locale,
      async setLocale(nextLocale) {
        const normalizedLocale = resolveLocaleChange(nextLocale);

        if (normalizedLocale === null || normalizedLocale === locale) {
          return;
        }

        setIsChanging(true);

        try {
          await i18n.changeLanguage(normalizedLocale);
          setCurrentLocale(normalizedLocale);
          await onLocaleChange?.(normalizedLocale);
        } finally {
          setIsChanging(false);
        }
      },
    }),
    [i18n, isChanging, locale, onLocaleChange],
  );

  return (
    <I18nextProvider i18n={i18n}>
      <AppLocaleContext.Provider value={value}>{children}</AppLocaleContext.Provider>
    </I18nextProvider>
  );
}

export function useAppLocale(): AppLocaleContextValue {
  const value = useContext(AppLocaleContext);

  if (value === null) {
    throw new Error('useAppLocale must be used within an AppLocaleProvider');
  }

  return value;
}
