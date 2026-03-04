import * as React from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type {
  DashboardStats,
  ProjectInfo,
  SessionInfo,
  SessionDetail,
  DataProvider,
} from '@repo/shared';

const DataProviderContext = React.createContext<DataProvider | null>(null);

export function DataProviderWrapper({
  provider,
  children,
}: {
  provider: DataProvider;
  children: React.ReactNode;
}) {
  return (
    <DataProviderContext.Provider value={provider}>
      {children}
    </DataProviderContext.Provider>
  );
}

function useDataProvider(): DataProvider {
  const ctx = React.useContext(DataProviderContext);
  if (!ctx) throw new Error('useDataProvider must be used within DataProviderWrapper');
  return ctx;
}

export function useStats(): UseQueryResult<DashboardStats> {
  const provider = useDataProvider();
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => provider.getStats(),
    staleTime: 30_000,
  });
}

export function useProjects(): UseQueryResult<ProjectInfo[]> {
  const provider = useDataProvider();
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => provider.getProjects(),
    staleTime: 30_000,
  });
}

export function useSessions(limit?: number): UseQueryResult<SessionInfo[]> {
  const provider = useDataProvider();
  return useQuery({
    queryKey: ['sessions', limit],
    queryFn: () => provider.getSessions(limit),
    staleTime: 30_000,
  });
}

export function useSessionDetail(sessionId: string): UseQueryResult<SessionDetail> {
  const provider = useDataProvider();
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => provider.getSessionDetail(sessionId),
    enabled: !!sessionId,
    staleTime: 60_000,
  });
}

export function useProjectSessions(projectId: string): UseQueryResult<SessionInfo[]> {
  const provider = useDataProvider();
  return useQuery({
    queryKey: ['project-sessions', projectId],
    queryFn: () => provider.getProjectSessions(projectId),
    enabled: !!projectId,
    staleTime: 30_000,
  });
}
