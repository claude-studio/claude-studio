'use client';
import * as React from 'react';
import type { CacheStats } from '@repo/shared';
import { formatTokens, formatCost } from '@repo/shared';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';

interface CacheStatsCardProps {
  data: CacheStats;
}

const TOOLTIPS = {
  cacheHitRate:
    '캐시 생성+읽기 토큰 중 재사용(읽기) 비율입니다. 높을수록 같은 컨텍스트를 반복 활용한 것입니다.',
  estimatedSavings:
    '캐시 읽기 토큰에 실제 사용 모델의 가중평균 입력 단가를 적용한 예상 절약액입니다. (캐시 읽기는 일반 입력의 약 10% 과금)',
  cacheCreation: '처음 캐시를 생성할 때 사용된 토큰 수입니다. 일반 입력보다 약 25% 비쌉니다.',
  cacheRead: '이미 저장된 캐시를 재사용한 토큰 수입니다. 일반 입력 대비 약 90% 저렴합니다.',
};

function FieldLabel({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <div className="flex items-center gap-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3 w-3 text-muted-foreground/60 cursor-help shrink-0" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px] text-center leading-relaxed">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export function CacheStatsCard({ data }: CacheStatsCardProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <FieldLabel label="캐시 적중률" tooltip={TOOLTIPS.cacheHitRate} />
            <p className="text-xl font-semibold mt-1">{data.cacheHitRate}%</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <FieldLabel label="절약 비용" tooltip={TOOLTIPS.estimatedSavings} />
            <p className="text-xl font-semibold mt-1 text-primary">
              {formatCost(data.estimatedSavingsUsd)}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <FieldLabel label="캐시 생성 토큰" tooltip={TOOLTIPS.cacheCreation} />
            <p className="text-lg font-semibold mt-1">
              {formatTokens(data.totalCacheCreationTokens)}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <FieldLabel label="캐시 읽기 토큰" tooltip={TOOLTIPS.cacheRead} />
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
    </TooltipProvider>
  );
}
