import { createFileRoute } from '@tanstack/react-router';
import {
  useStats,
  StatCard,
  UsageOverTime,
  ModelBreakdown,
  ActivityHeatmap,
  PeakHours,
  CacheStatsCard,
  ToolUsageChart,
  ConversationStatsCard,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui';
import { formatCost, formatTokens, formatNumber, timeAgo, formatDateShort, formatDate } from '@repo/shared';
import { DollarSign, Zap, MessageSquare, FolderOpen } from 'lucide-react';

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

  if (!stats)
    return <div className="text-muted-foreground">데이터가 없습니다</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">개요</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Claude Code 사용량 요약
          </p>
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
          value={formatCost(stats.totalCost)}
          description={(() => {
            const dates = stats.dailyUsage.map((d) => d.date).sort();
            if (dates.length === 0) return '데이터 없음';
            if (dates.length === 1) return formatDateShort(dates[0]!);
            return `${formatDateShort(dates[0]!)} ~ ${formatDateShort(dates[dates.length - 1]!)}`;
          })()}
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
            <CardTitle className="text-sm font-medium">
              시간별 사용량
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UsageOverTime data={stats.dailyUsage} />
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              모델별 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ModelBreakdown data={stats.modelBreakdown} />
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              활동 히트맵
            </CardTitle>
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
                    {formatCost(session.cost)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.messageCount}개 메시지
                  </p>
                </div>
              </div>
            ))}
            {stats.recentSessions.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">
                세션이 없습니다
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
