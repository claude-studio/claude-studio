import { createContext, type ReactNode, useContext } from 'react';

import type { DashboardStats, DataProvider, ProjectInfo, SessionDetail, SessionInfo } from '@repo/shared';
import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProvider = DataProvider & Record<string, any>;

const DataProviderContext = createContext<AnyProvider | null>(null);

export function DataProviderWrapper({
  provider,
  children,
}: {
  provider: DataProvider;
  children: ReactNode;
}) {
  return <DataProviderContext.Provider value={provider as AnyProvider}>{children}</DataProviderContext.Provider>;
}

export const TeamsProviderWrapper = DataProviderWrapper;

function useDataProvider(): AnyProvider {
  const ctx = useContext(DataProviderContext);
  if (!ctx) throw new Error('useDataProvider must be used within DataProviderWrapper');
  return ctx;
}

export function useStats(): UseQueryResult<DashboardStats> {
  const provider = useDataProvider();
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => provider.getStats() as Promise<DashboardStats>,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useProjects(): UseQueryResult<ProjectInfo[]> {
  const provider = useDataProvider();
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => provider.getProjects() as Promise<ProjectInfo[]>,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useProjectSessions(id: string): UseQueryResult<SessionInfo[]> {
  const provider = useDataProvider();
  return useQuery({
    queryKey: ['project-sessions', id],
    queryFn: () => provider.getProjectSessions(id) as Promise<SessionInfo[]>,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useSessions(limit?: number): UseQueryResult<SessionInfo[]> {
  const provider = useDataProvider();
  return useQuery({
    queryKey: ['sessions', limit],
    queryFn: () => provider.getSessions(limit) as Promise<SessionInfo[]>,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useSessionDetail(id: string): UseQueryResult<SessionDetail> {
  const provider = useDataProvider();
  return useQuery({
    queryKey: ['session', id],
    queryFn: () => provider.getSessionDetail(id) as Promise<SessionDetail>,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useTeams(): UseQueryResult<unknown[]> {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => Promise.resolve([]),
    staleTime: 30_000,
  });
}
