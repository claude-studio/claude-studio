import type { CacheStats } from '@repo/shared';
import { formatCost, formatTokens } from '@repo/shared';

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
  const missRate = 100 - data.cacheHitRate;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-3">
        {/* 상단: 적중률 + 절약 비용 강조 */}
        <div className="flex items-end justify-between gap-3 pb-3 border-b border-border/40">
          <div>
            <FieldLabel label="캐시 적중률" tooltip={TOOLTIPS.cacheHitRate} />
            <p className="text-3xl font-bold font-mono mt-1 tabular-nums">{data.cacheHitRate}%</p>
          </div>
          <div className="text-right">
            <FieldLabel label="절약 비용" tooltip={TOOLTIPS.estimatedSavings} />
            <p className="text-xl font-semibold font-mono mt-1 text-primary tabular-nums">
              {formatCost(data.estimatedSavingsUsd)}
            </p>
          </div>
        </div>

        {/* 캐시 히트/미스 시각화 */}
        <div className="space-y-1.5">
          <div className="flex gap-1 h-2 w-full rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/70 rounded-l-full transition-all"
              style={{ width: `${data.cacheHitRate}%` }}
            />
            <div
              className="h-full bg-muted flex-1 rounded-r-full transition-all"
              style={{ width: `${missRate}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/70" />
              히트 {data.cacheHitRate}%
            </span>
            <span className="flex items-center gap-1">
              미스 {missRate}%
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
            </span>
          </div>
        </div>

        {/* 토큰 상세 */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <FieldLabel label="캐시 읽기 토큰" tooltip={TOOLTIPS.cacheRead} />
            <p className="text-sm font-semibold font-mono tabular-nums text-primary">
              {formatTokens(data.totalCacheReadTokens)}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <FieldLabel label="캐시 생성 토큰" tooltip={TOOLTIPS.cacheCreation} />
            <p className="text-sm font-medium font-mono tabular-nums text-muted-foreground">
              {formatTokens(data.totalCacheCreationTokens)}
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
