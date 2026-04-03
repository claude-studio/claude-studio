import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

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
  const [locale, setCurrentLocale] = useState<AppLocale>(() =>
    getCurrentLocale(i18n, initialLocale),
  );
  const [isChanging, setIsChanging] = useState(false);
  const queuedChangesRef = useRef(Promise.resolve());
  const pendingChangesRef = useRef(0);

  useEffect(() => {
    const syncLocale = (nextLanguage?: string) => {
      setCurrentLocale(
        resolveLocaleChange(nextLanguage ?? i18n.resolvedLanguage ?? i18n.language) ??
          initialLocale,
      );
    };

    syncLocale();
    i18n.on('languageChanged', syncLocale);

    return () => {
      i18n.off('languageChanged', syncLocale);
    };
  }, [i18n, initialLocale]);

  const setLocale = useCallback(
    async (nextLocale: AppLocale) => {
      const normalizedLocale = resolveLocaleChange(nextLocale);

      if (normalizedLocale === null) {
        return;
      }

      pendingChangesRef.current += 1;
      setIsChanging(true);

      const runChange = async () => {
        const currentLocale = getCurrentLocale(i18n, initialLocale);

        if (normalizedLocale === currentLocale) {
          return;
        }

        await onLocaleChange?.(normalizedLocale);
        await i18n.changeLanguage(normalizedLocale);
      };

      const result = queuedChangesRef.current.then(runChange);
      queuedChangesRef.current = result.catch(() => {});

      try {
        await result;
      } finally {
        pendingChangesRef.current -= 1;

        if (pendingChangesRef.current === 0) {
          setIsChanging(false);
        }
      }
    },
    [i18n, initialLocale, onLocaleChange],
  );

  const value = useMemo<AppLocaleContextValue>(
    () => ({
      isChanging,
      locale,
      setLocale,
    }),
    [isChanging, locale, setLocale],
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

function getCurrentLocale(i18n: i18n, fallbackLocale: AppLocale): AppLocale {
  return resolveLocaleChange(i18n.resolvedLanguage ?? i18n.language) ?? fallbackLocale;
}
