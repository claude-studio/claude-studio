'use client';
import * as React from 'react';
import type { ConversationStats } from '@repo/shared';
import { formatTokens, formatDuration } from '@repo/shared';

interface ConversationStatsCardProps {
  data: ConversationStats;
}

export function ConversationStatsCard({ data }: ConversationStatsCardProps) {
  const total = data.shortSessions + data.mediumSessions + data.longSessions;

  const bars = [
    { label: '짧음 (<10분)', value: data.shortSessions, color: 'var(--chart-3)' },
    { label: '보통 (10분~1시간)', value: data.mediumSessions, color: 'var(--chart-2)' },
    { label: '긴 세션 (>1시간)', value: data.longSessions, color: 'var(--chart-1)' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">평균 세션 길이</p>
          <p className="text-lg font-semibold mt-1">{formatDuration(data.avgSessionDurationMs)}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">세션당 평균 메시지</p>
          <p className="text-lg font-semibold mt-1">{Math.round(data.avgMessagesPerSession)}개</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">입력 토큰/메시지</p>
          <p className="text-lg font-semibold mt-1">{formatTokens(Math.round(data.avgInputTokensPerMessage))}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">출력 토큰/메시지</p>
          <p className="text-lg font-semibold mt-1">{formatTokens(Math.round(data.avgOutputTokensPerMessage))}</p>
        </div>
      </div>

      {/* 세션 길이 분포 */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">세션 길이 분포</p>
        {bars.map((bar) => (
          <div key={bar.label} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-32 shrink-0">{bar.label}</span>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: total > 0 ? `${(bar.value / total) * 100}%` : '0%',
                  backgroundColor: bar.color,
                }}
              />
            </div>
            <span className="text-xs font-medium w-8 text-right">{bar.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
