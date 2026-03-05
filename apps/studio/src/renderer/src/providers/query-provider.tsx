import * as React from 'react';

import type { DataChangeSource } from '@repo/shared';
import { DataProviderWrapper, TeamsProviderWrapper } from '@repo/ui';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';

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
  queryClient.prefetchQuery({
    queryKey: ['stats'],
    queryFn: () => electronProvider.getStats(),
    ...opts,
  });
  queryClient.prefetchQuery({
    queryKey: ['projects'],
    queryFn: () => electronProvider.getProjects(),
    ...opts,
  });
  queryClient.prefetchQuery({
    queryKey: ['sessions', undefined],
    queryFn: () => electronProvider.getSessions(),
    ...opts,
  });
}

prefetchCoreData();

function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  ms: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

const SOURCE_QUERY_KEYS: Record<DataChangeSource, string[]> = {
  projects: ['stats', 'projects', 'sessions'],
  teams: ['teams'],
};

function DataChangedListener() {
  const qc = useQueryClient();
  React.useEffect(() => {
    if (!window.electronAPI?.onDataChanged) return;

    const invalidateProjects = debounce(() => {
      for (const key of SOURCE_QUERY_KEYS.projects) {
        qc.invalidateQueries({ queryKey: [key] });
      }
    }, 2_000);

    const invalidateTeams = debounce(() => {
      qc.invalidateQueries({ queryKey: ['teams'] });
    }, 500);

    const unsub = window.electronAPI.onDataChanged((source) => {
      if (source === 'teams') invalidateTeams();
      else invalidateProjects();
    });
    return unsub;
  }, [qc]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProviderWrapper provider={electronProvider}>
        <TeamsProviderWrapper provider={() => window.electronAPI.getTeams()}>
          <DataChangedListener />
          {children}
        </TeamsProviderWrapper>
      </DataProviderWrapper>
    </QueryClientProvider>
  );
}
