import { ProjectDetailPage } from '@repo/ui';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/projects/$id')({
  component: function ProjectDetailRoute() {
    const { id } = Route.useParams();
    return <ProjectDetailPage id={id} />;
  },
});
