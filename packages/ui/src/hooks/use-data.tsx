import { createContext, type ReactNode, useContext } from 'react';

import type {
  DashboardStats,
  DataProvider,
  ProjectInfo,
  SessionDetail,
  SessionInfo,
  TeamDetail,
} from '@repo/shared';
import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query';

const DataProviderContext = createContext<DataProvider | null>(null);

type TeamsProvider = () => Promise<TeamDetail[]>;
const TeamsProviderContext = createContext<TeamsProvider | null>(null);

export function TeamsProviderWrapper({
  provider,
  children,
}: {
  provider: TeamsProvider;
  children: ReactNode;
}) {
  return <TeamsProviderContext.Provider value={provider}>{children}</TeamsProviderContext.Provider>;
}

export function useTeams(): UseQueryResult<TeamDetail[]> {
  const provider = useContext(TeamsProviderContext);
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => (provider ? provider() : Promise.resolve([])),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
    enabled: !!provider,
  });
}

export function DataProviderWrapper({
  provider,
  children,
}: {
  provider: DataProvider;
  children: ReactNode;
}) {
  return <DataProviderContext.Provider value={provider}>{children}</DataProviderContext.Provider>;
}

function useDataProvider(): DataProvider {
  const ctx = useContext(DataProviderContext);
  if (!ctx) throw new Error('useDataProvider must be used within DataProviderWrapper');
  return ctx;
}

export function useStats(): UseQueryResult<DashboardStats> {
  const provider = useDataProvider();
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => provider.getStats(),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useProjects(): UseQueryResult<ProjectInfo[]> {
  const provider = useDataProvider();
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => provider.getProjects(),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useSessions(limit?: number): UseQueryResult<SessionInfo[]> {
  const provider = useDataProvider();
  return useQuery({
    queryKey: ['sessions', limit],
    queryFn: () => provider.getSessions(limit),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useSessionDetail(sessionId: string): UseQueryResult<SessionDetail> {
  const provider = useDataProvider();
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => provider.getSessionDetail(sessionId),
    enabled: !!sessionId,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}

export function useProjectSessions(projectId: string): UseQueryResult<SessionInfo[]> {
  const provider = useDataProvider();
  return useQuery({
    queryKey: ['project-sessions', projectId],
    queryFn: () => provider.getProjectSessions(projectId),
    enabled: !!projectId,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}
