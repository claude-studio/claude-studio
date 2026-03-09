import { type ReactNode } from 'react';

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
  Wand2,
  Zap,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

import {
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
} from '../components/ui/sidebar';
import { useTheme } from '../hooks/use-theme';
import { cn } from '../lib/utils';

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
  { href: '/live', label: '라이브', icon: <Radio className="h-4 w-4" />, badge: 'Beta', pulse: true },
  { href: '/costs', label: '비용', icon: <DollarSign className="h-4 w-4" /> },
  { href: '/skills', label: '스킬', icon: <Wand2 className="h-4 w-4" /> },
  { href: '/data', label: '설정', icon: <Settings className="h-4 w-4" /> },
];

function AppSidebarInner() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { theme, toggle, toggleRef } = useTheme();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="h-svh border-r border-sidebar-border">
      {/* Top accent line */}
      <div className="h-[2px] w-full bg-primary shrink-0" />

      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-primary/15 shrink-0">
            <Zap className="h-3.5 w-3.5 text-primary" />
          </div>
          <div
            className="overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 ease-linear"
            style={{ maxWidth: open ? '160px' : 0, opacity: open ? 1 : 0 }}
          >
            <p className="text-[13px] font-semibold tracking-tight leading-none">Claude Studio</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 tracking-wide uppercase">Analytics</p>
          </div>
        </div>
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
                      isActive && 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
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

      <SidebarSeparator />

      <SidebarFooter>
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
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-[13px]">Claude Studio</span>
                    <span className="truncate text-[10px] text-muted-foreground font-mono">v1.1.0</span>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-52 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-2 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 shrink-0">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-[13px]">Claude Studio</span>
                      <span className="truncate text-[10px] text-muted-foreground font-mono">v1.1.0</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button ref={toggleRef} onClick={toggle} className="w-full gap-2">
                    {theme === 'dark'
                      ? <Sun className="h-4 w-4" />
                      : <Moon className="h-4 w-4" />}
                    {theme === 'dark' ? '라이트 모드' : '다크 모드'}
                  </button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
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

// 하위 호환성 유지
export { AppSidebar as Sidebar };
