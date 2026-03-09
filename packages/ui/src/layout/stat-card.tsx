import { type ReactNode } from 'react';

import { cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: ReactNode;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  featured?: boolean;
}

export function StatCard({ title, value, description, trend, className, featured }: StatCardProps) {
  return (
    <div
      className={cn(
        'card-glass relative rounded-xl border overflow-hidden transition-all duration-200',
        'group hover:border-primary/20',
        className,
      )}
    >
      {/* 좌측 accent bar */}
      <div className={cn(
        'absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-300',
        featured
          ? 'bg-gradient-to-b from-primary via-primary/60 to-transparent opacity-100'
          : 'bg-gradient-to-b from-primary/40 via-primary/20 to-transparent opacity-0 group-hover:opacity-100',
      )} />

      <div className="px-5 pt-5 pb-5 pl-6">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-3">
          {title}
        </p>

        <p className={cn(
          'font-bold tracking-tight font-mono leading-none',
          featured ? 'text-4xl text-primary' : 'text-3xl text-foreground',
        )}>
          {value}
        </p>

        {description && (
          <p className="text-[11px] text-muted-foreground mt-2.5 leading-relaxed">{description}</p>
        )}

        {trend && (
          <div className={cn(
            'flex items-center gap-1 text-[11px] font-medium mt-2',
            trend.value >= 0 ? 'text-emerald-500' : 'text-red-400',
          )}>
            <span>{trend.value >= 0 ? '+' : ''}{trend.value}%</span>
            <span className="text-muted-foreground font-normal">{trend.label}</span>
          </div>
        )}
      </div>

      {/* featured 카드 배경 glow */}
      {featured && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/[0.06] to-transparent" />
      )}
    </div>
  );
}
