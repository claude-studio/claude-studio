import { SessionDetailPage } from '@repo/ui';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sessions/$id')({
  component: function SessionDetailRoute() {
    const { id } = Route.useParams();
    return <SessionDetailPage id={id} />;
  },
});
