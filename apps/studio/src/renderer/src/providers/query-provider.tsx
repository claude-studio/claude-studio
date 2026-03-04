import * as React from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { DataProviderWrapper } from '@repo/ui';
import { electronProvider } from './electron-provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

function DataChangedListener() {
  const qc = useQueryClient();
  React.useEffect(() => {
    if (!window.electronAPI?.onDataChanged) return;
    const unsub = window.electronAPI.onDataChanged(() => {
      qc.invalidateQueries();
    });
    return unsub;
  }, [qc]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProviderWrapper provider={electronProvider}>
        <DataChangedListener />
        {children}
      </DataProviderWrapper>
    </QueryClientProvider>
  );
}
