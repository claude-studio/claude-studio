import { CostsPage } from '@repo/ui';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/costs')({
  component: CostsPage,
});
