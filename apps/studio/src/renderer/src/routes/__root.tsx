import { createRootRoute, Outlet, useRouter } from '@tanstack/react-router';
import { Sidebar } from '@repo/ui';
import { ArrowLeft } from 'lucide-react';

function ErrorComponent({ error }: { error: Error }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="ml-60 flex-1">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.history.back()}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              <ArrowLeft className="h-4 w-4" />
              뒤로가기
            </button>
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error.message}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="ml-60 flex-1 h-screen overflow-y-auto flex flex-col">
        <div className="mx-auto w-full max-w-7xl px-6 py-6 flex-1 flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  ),
  errorComponent: ErrorComponent,
});
