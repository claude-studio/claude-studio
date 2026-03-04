import { createFileRoute } from '@tanstack/react-router';
import { ProjectsPage } from '@repo/ui';

export const Route = createFileRoute('/projects/')({
  component: ProjectsPage,
});
