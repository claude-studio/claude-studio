import * as React from 'react';

import { type AppLocale, AppLocaleProvider, type I18nProviderProps } from '@repo/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

type ProvidersProps = {
  children: React.ReactNode;
  i18n: I18nProviderProps['i18n'];
  initialLocale: AppLocale;
  persistLocale: (locale: AppLocale) => void;
};

export function Providers({ children, i18n, initialLocale, persistLocale }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLocaleProvider i18n={i18n} initialLocale={initialLocale} onLocaleChange={persistLocale}>
        {children}
      </AppLocaleProvider>
    </QueryClientProvider>
  );
}
