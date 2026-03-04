import * as React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { cn } from '../lib/utils';
import {
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  DollarSign,
  Settings,
  Wand2,
  Zap,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/', label: '개요', icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: '/projects', label: '프로젝트', icon: <FolderOpen className="h-4 w-4" /> },
  { href: '/sessions', label: '세션', icon: <MessageSquare className="h-4 w-4" /> },
  { href: '/costs', label: '비용', icon: <DollarSign className="h-4 w-4" /> },
  { href: '/skills', label: '스킬', icon: <Wand2 className="h-4 w-4" /> },
  { href: '/data', label: '설정', icon: <Settings className="h-4 w-4" /> },
];

export function Sidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="fixed left-0 top-0 h-screen w-60 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Zap className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold">Claude Studio</p>
          <p className="text-[10px] text-muted-foreground">사용량 분석</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === '/'
            ? currentPath === '/'
            : currentPath.startsWith(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border">
        <p className="text-[10px] text-muted-foreground">Claude Studio v1.0.0</p>
      </div>
    </div>
  );
}
