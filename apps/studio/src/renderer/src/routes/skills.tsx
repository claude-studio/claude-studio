import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { SkillsPage } from '@repo/ui';

export const Route = createFileRoute('/skills')({
  component: function SkillsRoute() {
    const { data: skills = [], isLoading, isError } = useQuery({
      queryKey: ['skills'],
      queryFn: () => window.electronAPI.getSkills(),
      staleTime: 60_000,
    });
    return <SkillsPage skills={skills} isLoading={isLoading} isError={isError} />;
  },
});
