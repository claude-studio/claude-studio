import { useState } from 'react';

import type { DailyUsage } from '@repo/shared';
import { formatDate, formatDateShort, formatNumber, formatTokens, timeAgo } from '@repo/shared';

import { DollarSign, FolderOpen, MessageSquare, Zap } from 'lucide-react';

import { ActivityHeatmap } from '../charts/activity-heatmap';
import { CacheStatsCard } from '../charts/cache-stats';
import { ConversationStatsCard } from '../charts/conversation-stats';
import { CostChart } from '../charts/cost-chart';
import { ModelBreakdown } from '../charts/model-breakdown';
import { PeakHours } from '../charts/peak-hours';
import { ToolUsageChart } from '../charts/tool-usage';
import { UsageOverTime } from '../charts/usage-over-time';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
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

export function OverviewPage() {
  const { data: stats, isLoading } = useStats();
  const [modelView, setModelView] = useState<'cost' | 'tokens'>('cost');

  if (isLoading) return <PageSpinner />;
  if (!stats) return <div className="text-muted-foreground">데이터가 없습니다</div>;

  const dateRangeDesc = getDateRangeDesc(stats.dailyUsage);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">개요</h1>
          <p className="text-muted-foreground text-sm mt-1">Claude Code 사용량 요약</p>
        </div>
        {stats.lifetime?.firstSessionDate && (
          <div className="flex items-center gap-2 text-sm">
            <p className="text-muted-foreground">사용 시작일</p>
            <p className="font-semibold">{formatDate(stats.lifetime.firstSessionDate)}</p>
            <p className="text-primary">D+{stats.lifetime.daysActive}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="총 비용"
          value={<CostValue cost={stats.totalCost} />}
          description={dateRangeDesc}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          title="총 토큰"
          value={formatTokens(stats.totalTokens)}
          description={`입력 ${formatTokens(stats.inputTokens)} / 출력 ${formatTokens(stats.outputTokens)}`}
          icon={<Zap className="h-4 w-4" />}
        />
        <StatCard
          title="세션"
          value={formatNumber(stats.totalSessions)}
          description={`${stats.totalProjects}개 프로젝트`}
          icon={<MessageSquare className="h-4 w-4" />}
        />
        <StatCard
          title="메시지"
          value={formatNumber(stats.totalMessages)}
          description={`툴 호출 ${formatNumber(stats.totalToolCalls)}회`}
          icon={<FolderOpen className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">시간별 사용량</CardTitle>
          </CardHeader>
          <CardContent>
            <UsageOverTime data={stats.dailyUsage} />
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">모델별 분석</CardTitle>
              <div className="flex gap-1">
                {(['cost', 'tokens'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setModelView(v)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      modelView === v
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {v === 'cost' ? '비용' : '토큰'}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ModelBreakdown
              data={stats.modelBreakdown}
              view={modelView}
              onViewChange={setModelView}
            />
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">활동 히트맵</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityHeatmap data={stats.activityData} />
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">피크 시간대</CardTitle>
          </CardHeader>
          <CardContent>
            <PeakHours data={stats.peakHours} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">캐시 절약 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <CacheStatsCard data={stats.cacheStats} />
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">툴 사용 순위</CardTitle>
          </CardHeader>
          <CardContent>
            <ToolUsageChart data={stats.toolUsage} />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">모델별 일별 비용</CardTitle>
        </CardHeader>
        <CardContent>
          <CostChart data={stats.dailyUsage} />
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">대화 패턴 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <ConversationStatsCard data={stats.conversationStats} />
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">최근 세션</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.recentSessions
              .filter((s) => s.cost > 0)
              .map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{session.projectName}</p>
                    <p className="text-xs text-muted-foreground">
                      {timeAgo(new Date(session.lastTime))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      <CostValue cost={session.cost} />
                    </p>
                    <p className="text-xs text-muted-foreground">{session.messageCount}개 메시지</p>
                  </div>
                </div>
              ))}
            {stats.recentSessions.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">세션이 없습니다</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
