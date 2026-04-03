import { Particles, SidebarProvider, SidebarTrigger, useTheme } from '@repo/ui';
import { createRootRoute, Outlet, useRouter, useRouterState } from '@tanstack/react-router';

import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { AppSidebar } from '../widgets/app-sidebar';
import { LanguageSwitcher } from '../widgets/language-switcher';

function TopBar() {
  const routerState = useRouterState();
  const { t } = useTranslation('navigation');
  const path = routerState.location.pathname;
  const pageTitles: Record<string, string> = {
    '/': t('overview'),
    '/projects': t('projects'),
    '/costs': t('costs'),
    '/skills': t('skills'),
    '/data': t('settings'),
    '/live': t('live'),
  };
  const title =
    Object.entries(pageTitles).find(([key]) =>
      key === '/' ? path === '/' : path.startsWith(key),
    )?.[1] ?? '';

  return (
    <div className="h-10 shrink-0 border-b border-border flex items-center px-3 gap-2.5">
      <SidebarTrigger className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
      <div className="h-3.5 w-px bg-border" />
      <span className="text-sm font-medium tracking-tight">{title}</span>
      <div className="ml-auto">
        <LanguageSwitcher />
      </div>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  const router = useRouter();
  const { t } = useTranslation('studio');
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
              {t('shell.back')}
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

function RootLayout() {
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

export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: ErrorComponent,
});
