import { type ReactNode } from 'react';

import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
  useTheme,
} from '@repo/ui';
import { Link, useRouterState } from '@tanstack/react-router';

import {
  ChevronsUpDown,
  DollarSign,
  FolderOpen,
  Github,
  LayoutDashboard,
  Moon,
  Radio,
  Settings,
  Sun,
  Users,
  Wand2,
  Zap,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: string;
  pulse?: boolean;
}

const navItems: NavItem[] = [
  { href: '/', label: '개요', icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: '/projects', label: '프로젝트', icon: <FolderOpen className="h-4 w-4" /> },
  {
    href: '/live',
    label: '라이브',
    icon: <Radio className="h-4 w-4" />,
    badge: 'Beta',
    pulse: true,
  },
  { href: '/costs', label: '비용', icon: <DollarSign className="h-4 w-4" /> },
  { href: '/skills', label: '스킬', icon: <Wand2 className="h-4 w-4" /> },
];

const dashboardRoutes = ['/', '/projects', '/live', '/costs', '/skills', '/data'];

function AppSidebarInner() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { theme, toggle, toggleRef } = useTheme();
  const { open } = useSidebar();

  const isDashboard = dashboardRoutes.some((r) =>
    r === '/' ? currentPath === '/' : currentPath.startsWith(r),
  );
  const activeMenuLabel = isDashboard ? '대시보드' : 'Analytics';

  return (
    <Sidebar collapsible="icon" className="h-svh border-r border-sidebar-border">
      <div className="h-[2px] w-full bg-primary shrink-0" />

      <SidebarHeader className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip="Claude Studio"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 shrink-0">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div className="grid flex-1 text-left leading-tight overflow-hidden gap-0.5">
                    <span className="truncate font-semibold text-[13px]">Claude Studio</span>
                    <span className="truncate text-[10px] text-muted-foreground">
                      {activeMenuLabel}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg p-1"
                side="right"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5">
                  메뉴
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link
                    to="/"
                    className={cn(
                      'gap-2',
                      isDashboard &&
                        'bg-primary/10 text-primary focus:bg-primary/10 focus:text-primary',
                    )}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    대시보드
                    {isDashboard && (
                      <span className="ml-auto relative flex h-1.5 w-1.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                      </span>
                    )}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled className="gap-2">
                  <Users className="h-4 w-4" />
                  커뮤니티
                  <span className="ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground leading-none">
                    작업중
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive =
                item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href);

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                    className={cn(
                      'relative',
                      isActive &&
                        'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
                    )}
                  >
                    <Link to={item.href}>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-primary" />
                      )}
                      {item.icon}
                      <span className="tracking-tight">{item.label}</span>
                      {item.badge && (
                        <div
                          className="ml-auto overflow-hidden transition-[max-width,opacity] duration-200 ease-linear flex items-center gap-1.5 shrink-0"
                          style={{ maxWidth: open ? '80px' : 0, opacity: open ? 1 : 0 }}
                        >
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-sm bg-primary/15 text-primary leading-none tracking-wide uppercase whitespace-nowrap">
                            {item.badge}
                          </span>
                          {item.pulse && (
                            <span className="relative flex h-1.5 w-1.5 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip="설정"
                  isActive={currentPath.startsWith('/data')}
                  className={cn(
                    'relative',
                    currentPath.startsWith('/data') &&
                      'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
                  )}
                >
                  {currentPath.startsWith('/data') && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-primary" />
                  )}
                  <Settings className="h-4 w-4" />
                  <span className="tracking-tight">설정</span>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg p-1"
                side="right"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link to="/data" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Claude Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button ref={toggleRef} onClick={toggle} className="w-full gap-2">
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    {theme === 'dark' ? '라이트 모드' : '다크 모드'}
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href="https://github.com/FRONT-JB/claude-studio"
                    target="_blank"
                    rel="noreferrer"
                    className="gap-2"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppSidebar() {
  return <AppSidebarInner />;
}
