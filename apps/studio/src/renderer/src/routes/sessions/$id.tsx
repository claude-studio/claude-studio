import { createFileRoute } from '@tanstack/react-router';
import { SessionDetailPage } from '@repo/ui';

export const Route = createFileRoute('/sessions/$id')({
  component: function SessionDetailRoute() {
    const { id } = Route.useParams();
    return <SessionDetailPage id={id} />;
  },
});
