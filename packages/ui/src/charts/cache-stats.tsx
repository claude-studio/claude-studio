'use client';
import * as React from 'react';
import type { CacheStats } from '@repo/shared';
import { formatTokens, formatCost } from '@repo/shared';

interface CacheStatsCardProps {
  data: CacheStats;
}

export function CacheStatsCard({ data }: CacheStatsCardProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">캐시 적중률</p>
          <p className="text-xl font-semibold mt-1">{data.cacheHitRate}%</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">절약 비용</p>
          <p className="text-xl font-semibold mt-1 text-primary">{formatCost(data.estimatedSavingsUsd)}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">캐시 생성 토큰</p>
          <p className="text-lg font-semibold mt-1">{formatTokens(data.totalCacheCreationTokens)}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">캐시 읽기 토큰</p>
          <p className="text-lg font-semibold mt-1">{formatTokens(data.totalCacheReadTokens)}</p>
        </div>
      </div>

      {/* 캐시 적중률 바 */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>캐시 미스 (생성)</span>
          <span>캐시 히트 (읽기)</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${data.cacheHitRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
