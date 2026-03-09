import { DataPage } from '@repo/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/data')({
  component: function DataRoute() {
    const queryClient = useQueryClient();

    const { data: settings } = useQuery({
      queryKey: ['claude-settings'],
      queryFn: () => window.electronAPI.getClaudeSettings(),
      staleTime: 60_000,
    });

    const { data: pluginInstalled } = useQuery({
      queryKey: ['plugin-installed'],
      queryFn: () => window.electronAPI.checkPluginInstalled(),
    });

    const installMutation = useMutation({
      mutationFn: () => window.electronAPI.installPlugin(),
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['plugin-installed'] });
        void queryClient.invalidateQueries({ queryKey: ['claude-settings'] });
      },
    });

    const uninstallMutation = useMutation({
      mutationFn: () => window.electronAPI.uninstallPlugin(),
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['plugin-installed'] });
        void queryClient.invalidateQueries({ queryKey: ['claude-settings'] });
      },
    });

    return (
      <DataPage
        settings={settings}
        pluginInstalled={pluginInstalled}
        pluginLoading={installMutation.isPending || uninstallMutation.isPending}
        onInstallPlugin={() => installMutation.mutate()}
        onUninstallPlugin={() => uninstallMutation.mutate()}
      />
    );
  },
});
