import { createFileRoute } from '@tanstack/react-router';
import { SessionsPage } from '@repo/ui';

export const Route = createFileRoute('/sessions/')({
  component: SessionsPage,
});
