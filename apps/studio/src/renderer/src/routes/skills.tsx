import { SkillsPage } from '@repo/ui';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/skills')({
  component: function SkillsRoute() {
    const {
      data: skills = [],
      isLoading,
      isError,
    } = useQuery({
      queryKey: ['skills'],
      queryFn: () => window.electronAPI.getSkills(),
      staleTime: 60_000,
    });
    return <SkillsPage skills={skills} isLoading={isLoading} isError={isError} />;
  },
});
