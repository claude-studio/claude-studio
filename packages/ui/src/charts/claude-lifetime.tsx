'use client';
import * as React from 'react';
import type { ClaudeLifetime } from '@repo/shared';
import { formatDuration, formatDate } from '@repo/shared';

interface ClaudeLifetimeCardProps {
  data: ClaudeLifetime;
}

export function ClaudeLifetimeCard({ data }: ClaudeLifetimeCardProps) {
  const items = [
    {
      label: '사용 시작일',
      value: data.firstSessionDate ? formatDate(data.firstSessionDate) : '-',
      sub: data.firstSessionDate ? `D+${data.daysActive}` : '',
    },
    {
      label: '역대 최장 세션',
      value: data.longestSessionDurationMs > 0
        ? formatDuration(data.longestSessionDurationMs)
        : '-',
      sub: data.longestSessionMessageCount > 0
        ? `${data.longestSessionMessageCount}개 메시지`
        : '',
    },
    {
      label: '웹 검색 횟수',
      value: data.totalWebSearchRequests > 0
        ? `${data.totalWebSearchRequests.toLocaleString()}회`
        : '-',
      sub: '',
    },
    {
      label: '스트리밍 절약 시간',
      value: data.totalSpeculationTimeSavedMs > 0
        ? formatDuration(data.totalSpeculationTimeSavedMs)
        : '-',
      sub: '',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">{item.label}</p>
          <p className="text-lg font-semibold mt-1">{item.value}</p>
          {item.sub && (
            <p className="text-xs text-primary mt-0.5">{item.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}
