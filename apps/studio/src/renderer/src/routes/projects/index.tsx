import { ProjectsPage } from '@repo/ui';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/projects/')({
  component: ProjectsPage,
});
