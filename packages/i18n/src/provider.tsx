import type { ReactNode } from 'react';
import type { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';

export interface I18nProviderProps {
  children: ReactNode;
  i18n: i18n;
}

export function I18nProvider({ children, i18n }: I18nProviderProps) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
