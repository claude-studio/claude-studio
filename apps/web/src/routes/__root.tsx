import { Sidebar } from '@repo/ui';
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';

function RootComponent() {
  const routerState = useRouterState();
  const isLanding = routerState.location.pathname === '/';

  if (isLanding) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="ml-60 flex-1 h-screen overflow-y-auto flex flex-col">
        <div className="mx-auto w-full max-w-7xl px-6 py-6 flex-1 flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
