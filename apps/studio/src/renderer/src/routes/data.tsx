import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { DataPage } from '@repo/ui';

export const Route = createFileRoute('/data')({
  component: function DataRoute() {
    const { data: settings } = useQuery({
      queryKey: ['claude-settings'],
      queryFn: () => window.electronAPI.getClaudeSettings(),
      staleTime: 60_000,
    });
    return <DataPage settings={settings} />;
  },
});
