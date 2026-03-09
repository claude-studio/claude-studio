import { AppSidebar, SidebarProvider, SidebarTrigger } from '@repo/ui';
import { createRootRoute, Outlet, useRouter, useRouterState } from '@tanstack/react-router';

import { ArrowLeft } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/': '개요',
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
    Object.entries(PAGE_TITLES).find(([key]) =>
      key === '/' ? path === '/' : path.startsWith(key),
    )?.[1] ?? '';

  return (
    <div className="h-10 shrink-0 border-b border-border flex items-center px-3 gap-2.5">
      <SidebarTrigger className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
      <div className="h-3.5 w-px bg-border" />
      <span className="text-sm font-medium tracking-tight">{title}</span>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  const router = useRouter();
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 h-svh overflow-hidden flex flex-col">
        <TopBar />
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.history.back()}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              뒤로가기
            </button>
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error.message}
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}

export const Route = createRootRoute({
  component: () => (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 h-svh overflow-hidden flex flex-col">
        <TopBar />
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  ),
  errorComponent: ErrorComponent,
});
