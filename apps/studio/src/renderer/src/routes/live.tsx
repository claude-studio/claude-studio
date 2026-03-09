import { createFileRoute } from '@tanstack/react-router';

import { LivePage } from '../pages/live-page';

export const Route = createFileRoute('/live')({
  component: LivePage,
});
