import { createFileRoute } from '@tanstack/react-router';
import { CostsPage } from '@repo/ui';

export const Route = createFileRoute('/costs')({
  component: CostsPage,
});
