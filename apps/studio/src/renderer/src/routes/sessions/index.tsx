import { SessionsPage } from '@repo/ui';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sessions/')({
  component: SessionsPage,
});
