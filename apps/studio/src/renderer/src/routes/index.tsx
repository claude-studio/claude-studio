import { createFileRoute } from '@tanstack/react-router';
import { OverviewPage } from '@repo/ui';

export const Route = createFileRoute('/')({
  component: OverviewPage,
});
