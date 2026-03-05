import type { DailyUsage } from '@repo/shared';
import { formatDate, formatNumber, formatTokens, timeAgo } from '@repo/shared';
import {
  ActivityHeatmap,
  CacheStatsCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ConversationStatsCard,
  CostChart,
  CostDisplay,
  ModelBreakdown,
  PeakHours,
  StatCard,
  ToolUsageChart,
  UsageOverTime,
  useStats,
} from '@repo/ui';
import { createFileRoute } from '@tanstack/react-router';

import { DollarSign, FolderOpen, MessageSquare, Zap } from 'lucide-react';

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getLast30DayCost(dailyUsage: DailyUsage[]): number {
  const now = new Date();
  const todayStr = toDateStr(now);
  const fromStr = toDateStr(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
  return dailyUsage
    .filter((d) => d.date >= fromStr && d.date <= todayStr)
    .reduce((sum, d) => sum + d.cost, 0);
}

function getLast30DayTrend(
  dailyUsage: DailyUsage[],
): { value: number; label: string; positiveIsGood: boolean } | undefined {
  const now = new Date();
  const todayStr = toDateStr(now);
  const fromStr = toDateStr(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
  const prevFromStr = toDateStr(new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000));
  const cur = dailyUsage
    .filter((d) => d.date >= fromStr && d.date <= todayStr)
    .reduce((s, d) => s + d.cost, 0);
  const prev = dailyUsage
    .filter((d) => d.date >= prevFromStr && d.date < fromStr)
    .reduce((s, d) => s + d.cost, 0);
  if (prev === 0) return undefined;
  return {
    value: Math.round(((cur - prev) / prev) * 100),
    label: '전 30일 대비',
    positiveIsGood: false,
  };
}

export const Route = createFileRoute('/')({
  component: OverviewPage,
});

function OverviewPage() {
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!stats) return <div className="text-muted-foreground">데이터가 없습니다</div>;

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
          value={<CostDisplay cost={getLast30DayCost(stats.dailyUsage)} />}
          description="최근 30일"
          icon={<DollarSign className="h-4 w-4" />}
          trend={getLast30DayTrend(stats.dailyUsage)}
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
            <CardTitle className="text-sm font-medium">피크 시간대</CardTitle>
          </CardHeader>
          <CardContent>
            <PeakHours data={stats.peakHours} />
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
            <CardTitle className="text-sm font-medium">모델별 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <ModelBreakdown data={stats.modelBreakdown} />
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
            {stats.recentSessions.map((session) => (
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
                    <CostDisplay cost={session.cost} />
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
