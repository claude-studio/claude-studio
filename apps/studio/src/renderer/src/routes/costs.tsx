import { createFileRoute } from '@tanstack/react-router';

import { CostsPage } from '../pages/costs';

export const Route = createFileRoute('/costs')({
  component: CostsPage,
});
