import { TeamsPage } from '@repo/ui';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/teams')({
  component: TeamsPage,
});
