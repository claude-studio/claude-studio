import { useState } from 'react';

import type { DailyUsage } from '@repo/shared';
import { formatDateShort, formatNumber, formatTokens, timeAgo } from '@repo/shared';

import { DollarSign, FolderOpen, MessageSquare, Zap } from 'lucide-react';

import { ActivityHeatmap } from '../charts/activity-heatmap';
import { CacheStatsCard } from '../charts/cache-stats';
import { ConversationStatsCard } from '../charts/conversation-stats';
import { CostChart } from '../charts/cost-chart';
import { ModelBreakdown } from '../charts/model-breakdown';
import { PeakHours } from '../charts/peak-hours';
import { ToolUsageChart } from '../charts/tool-usage';
import { UsageOverTime } from '../charts/usage-over-time';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { useStats } from '../hooks/use-data';
import { StatCard } from '../layout/stat-card';
import { CostValue } from './cost-value';
import { PageSpinner } from './page-spinner';

function getDateRangeDesc(dailyUsage: DailyUsage[]): string {
  const dates = dailyUsage.map((d) => d.date).sort();
  if (dates.length === 0) return '데이터 없음';
  if (dates.length === 1) return formatDateShort(dates[0]!);
  return `${formatDateShort(dates[0]!)} ~ ${formatDateShort(dates[dates.length - 1]!)}`;
}

const CL = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">{children}</p>
);

export function OverviewPage() {
  const { data: stats, isLoading } = useStats();
  const [modelView, setModelView] = useState<'cost' | 'tokens'>('cost');

  if (isLoading) return <PageSpinner />;
  if (!stats) return <div className="text-muted-foreground">데이터가 없습니다</div>;

  const dateRangeDesc = getDateRangeDesc(stats.dailyUsage);

  return (
    <div className="space-y-3">
      {/* ── Bento Grid (12열) ── */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}>

        {/* ── Row 1: Stat Cards (각 3칸) ── */}
        <div style={{ gridColumn: 'span 3' }}>
          <StatCard
            featured
            title="총 비용"
            value={<CostValue cost={stats.totalCost} />}
            description={
              stats.lifetime?.firstSessionDate
                ? `${dateRangeDesc} · D+${stats.lifetime.daysActive}`
                : dateRangeDesc
            }
            icon={<DollarSign />}
          />
        </div>
        <div style={{ gridColumn: 'span 3' }}>
          <StatCard
            title="총 토큰"
            value={formatTokens(stats.totalTokens)}
            description={`입력 ${formatTokens(stats.inputTokens)} / 출력 ${formatTokens(stats.outputTokens)}`}
            icon={<Zap />}
          />
        </div>
        <div style={{ gridColumn: 'span 3' }}>
          <StatCard
            title="세션"
            value={formatNumber(stats.totalSessions)}
            description={`${stats.totalProjects}개 프로젝트`}
            icon={<MessageSquare />}
          />
        </div>
        <div style={{ gridColumn: 'span 3' }}>
          <StatCard
            title="메시지"
            value={formatNumber(stats.totalMessages)}
            description={`툴 호출 ${formatNumber(stats.totalToolCalls)}회`}
            icon={<FolderOpen />}
          />
        </div>

        {/* ── Row 2: 시간별 사용량 (8칸) + 모델별 분석 (4칸) ── */}
        <Card style={{ gridColumn: 'span 8' }}>
          <CardHeader className="px-5 pt-5 pb-3"><CL>시간별 사용량</CL></CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <UsageOverTime data={stats.dailyUsage} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 4' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <div className="flex items-center justify-between">
              <CL>모델별 분석</CL>
              <div className="flex gap-0.5 rounded border border-border p-0.5">
                {(['cost', 'tokens'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setModelView(v)}
                    className={`px-2 py-0.5 rounded-sm text-[9px] font-semibold transition-colors tracking-wide uppercase ${
                      modelView === v ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {v === 'cost' ? '비용' : '토큰'}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <ModelBreakdown data={stats.modelBreakdown} view={modelView} onViewChange={setModelView} />
          </CardContent>
        </Card>

        {/* ── Row 3: 활동 히트맵 (7칸) + 피크 시간대 (5칸) ── */}
        <Card style={{ gridColumn: 'span 7' }}>
          <CardHeader className="px-5 pt-5 pb-3"><CL>활동 히트맵</CL></CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <ActivityHeatmap data={stats.activityData} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 5' }}>
          <CardHeader className="px-5 pt-5 pb-3"><CL>피크 시간대</CL></CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <PeakHours data={stats.peakHours} />
          </CardContent>
        </Card>

        {/* ── Row 4: 모델별 일별 비용 (8칸) + 툴 사용 순위 (4칸) ── */}
        <Card style={{ gridColumn: 'span 8' }}>
          <CardHeader className="px-5 pt-5 pb-3"><CL>모델별 일별 비용</CL></CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <CostChart data={stats.dailyUsage} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 4' }}>
          <CardHeader className="px-5 pt-5 pb-3"><CL>툴 사용 순위</CL></CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <ToolUsageChart data={stats.toolUsage} />
          </CardContent>
        </Card>

        {/* ── Row 5: 캐시 절약 (4칸) + 대화 패턴 (8칸) ── */}
        <Card style={{ gridColumn: 'span 4' }}>
          <CardHeader className="px-5 pt-5 pb-3"><CL>캐시 절약 현황</CL></CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <CacheStatsCard data={stats.cacheStats} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 8' }}>
          <CardHeader className="px-5 pt-5 pb-3"><CL>대화 패턴 분석</CL></CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <ConversationStatsCard data={stats.conversationStats} />
          </CardContent>
        </Card>

        {/* ── Row 6: 최근 세션 (12칸 전체, 내부 3열) ── */}
        <Card style={{ gridColumn: 'span 12' }}>
          <CardHeader className="px-5 pt-5 pb-3"><CL>최근 세션</CL></CardHeader>
          <CardContent className="px-5 pb-4 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/40">
              {stats.recentSessions
                .filter((s) => s.cost > 0)
                .map((session) => (
                  <div key={session.id} className="flex items-center justify-between px-3 py-2.5 first:pl-0 last:pr-0">
                    <div className="min-w-0 pr-4">
                      <p className="text-sm font-medium truncate">{session.projectName}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{timeAgo(new Date(session.lastTime))}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold font-mono">
                        <CostValue cost={session.cost} />
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{session.messageCount}개 메시지</p>
                    </div>
                  </div>
                ))}
              {stats.recentSessions.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-4 col-span-3">세션이 없습니다</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
