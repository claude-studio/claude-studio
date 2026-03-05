import * as React from 'react';

import { DataProviderWrapper } from '@repo/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { httpProvider } from './http-provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProviderWrapper provider={httpProvider}>{children}</DataProviderWrapper>
    </QueryClientProvider>
  );
}
