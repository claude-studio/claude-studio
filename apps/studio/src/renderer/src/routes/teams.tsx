import { createFileRoute } from '@tanstack/react-router';
import { TeamsPage } from '@repo/ui';

export const Route = createFileRoute('/teams')({
  component: TeamsPage,
});
