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

// Prefetch core data immediately on app startup so first page navigation is instant
function prefetchCoreData() {
  const opts = { staleTime: 30_000 };
  queryClient.prefetchQuery({ queryKey: ['stats'],    queryFn: () => electronProvider.getStats(),    ...opts });
  queryClient.prefetchQuery({ queryKey: ['projects'], queryFn: () => electronProvider.getProjects(), ...opts });
  queryClient.prefetchQuery({ queryKey: ['sessions', undefined], queryFn: () => electronProvider.getSessions(), ...opts });
}

prefetchCoreData();

function debounce<T extends () => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(fn, ms);
  }) as T;
}

function DataChangedListener() {
  const qc = useQueryClient();
  React.useEffect(() => {
    if (!window.electronAPI?.onDataChanged) return;
    // Debounce: avoid thundering herd when multiple files change at once
    const invalidate = debounce(() => { qc.invalidateQueries(); }, 2_000);
    const unsub = window.electronAPI.onDataChanged(invalidate);
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
