import { createFileRoute } from '@tanstack/react-router';
import { ProjectDetailPage } from '@repo/ui';

export const Route = createFileRoute('/projects/$id')({
  component: function ProjectDetailRoute() {
    const { id } = Route.useParams();
    return <ProjectDetailPage id={id} />;
  },
});
