import { AppSidebar, Particles, SidebarProvider, SidebarTrigger, useTheme } from '@repo/ui';
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': '개요',
  '/projects': '프로젝트',
  '/costs': '비용',
  '/skills': '스킬',
  '/data': '설정',
  '/live': '라이브',
};

function TopBar() {
  const routerState = useRouterState();
  const path = routerState.location.pathname;
  const title =
    Object.entries(PAGE_TITLES).find(([key]) => path.startsWith(key))?.[1] ?? '';

  return (
    <div className="h-10 shrink-0 border-b border-border flex items-center px-3 gap-2.5">
      <SidebarTrigger className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
      <div className="h-3.5 w-px bg-border" />
      <span className="text-sm font-medium tracking-tight">{title}</span>
    </div>
  );
}

function DashboardLayout() {
  const { theme } = useTheme();
  const particleColor = theme === 'dark' ? '#E8834E' : '#C4643A';

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 h-svh overflow-hidden flex flex-col">
        <TopBar />
        <Particles
          className="fixed inset-0 z-0 pointer-events-none"
          quantity={60}
          color={particleColor}
          ease={80}
          staticity={40}
        />
        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-5">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}

function RootComponent() {
  const routerState = useRouterState();
  const isLanding = routerState.location.pathname === '/';

  if (isLanding) {
    return <Outlet />;
  }

  return <DashboardLayout />;
}

export const Route = createRootRoute({
  component: RootComponent,
});
