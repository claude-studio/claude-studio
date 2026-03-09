import { useState } from 'react';

import { type DailyUsage, type SessionInfo } from '@repo/shared';
import { formatDateShort, formatNumber, formatTokens, timeAgo } from '@repo/shared';
import {
  ActivityHeatmap,
  CacheStatsCard,
  Card,
  CardContent,
  CardHeader,
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

import { ChevronRight, FolderOpen } from 'lucide-react';

function getDateRangeDesc(dailyUsage: DailyUsage[]): string {
  const dates = dailyUsage.map((d) => d.date).sort();
  if (dates.length === 0) return '데이터 없음';
  if (dates.length === 1) return formatDateShort(dates[0]!);
  return `${formatDateShort(dates[0]!)} ~ ${formatDateShort(dates[dates.length - 1]!)}`;
}

const CL = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
    {children}
  </p>
);

function SessionTreeView({ sessions }: { sessions: SessionInfo[] }) {
  const filtered = sessions.filter((s) => s.cost > 0);

  const groups = filtered.reduce<Record<string, SessionInfo[]>>((acc, s) => {
    const key = s.projectName;
    if (!acc[key]) acc[key] = [];
    acc[key]!.push(s);
    return acc;
  }, {});

  const projectNames = Object.keys(groups);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(projectNames.map((k) => [k, true])),
  );

  const toggle = (name: string) => setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));

  if (filtered.length === 0) {
    return <p className="text-muted-foreground text-sm text-center py-4">세션이 없습니다</p>;
  }

  return (
    <div className="space-y-0.5">
      {projectNames.map((projectName) => {
        const projectSessions = groups[projectName]!;
        const isOpen = expanded[projectName] ?? true;
        const totalCost = projectSessions.reduce((sum, s) => sum + s.cost, 0);
        const latestSession = projectSessions[0]!;

        return (
          <div key={projectName}>
            <button
              onClick={() => toggle(projectName)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors group text-left"
            >
              <ChevronRight
                className={`h-3.5 w-3.5 text-muted-foreground/60 shrink-0 transition-transform duration-150 ${
                  isOpen ? 'rotate-90' : ''
                }`}
              />
              <FolderOpen className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
              <span className="text-sm font-medium flex-1 truncate">{projectName}</span>
              <span className="text-[11px] text-muted-foreground/60 shrink-0">
                {timeAgo(new Date(latestSession.lastTime))}
              </span>
              <span className="text-xs font-semibold font-mono text-primary shrink-0 tabular-nums">
                <CostDisplay cost={totalCost} />
              </span>
            </button>

            {isOpen && (
              <div className="ml-5 border-l border-border/30 pl-2 space-y-0.5 mb-1">
                {projectSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/30 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-border/60 shrink-0" />
                    <span className="text-[12px] text-muted-foreground flex-1 truncate">
                      {timeAgo(new Date(session.lastTime))}
                    </span>
                    <span className="text-[11px] text-muted-foreground/70 shrink-0">
                      {session.messageCount}개
                    </span>
                    <span className="text-[12px] font-mono font-medium shrink-0 tabular-nums">
                      <CostDisplay cost={session.cost} />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function OverviewPage() {
  const { data: stats, isLoading } = useStats();
  const [modelView, setModelView] = useState<'cost' | 'tokens'>('cost');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!stats) return <div className="text-muted-foreground">데이터가 없습니다</div>;

  const dateRangeDesc = getDateRangeDesc(stats.dailyUsage);

  return (
    <div className="space-y-3">
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}>
        <div style={{ gridColumn: 'span 3' }}>
          <StatCard
            featured
            title="총 비용"
            value={<CostDisplay cost={stats.totalCost} />}
            description={
              stats.lifetime?.firstSessionDate
                ? `${dateRangeDesc} · D+${stats.lifetime.daysActive}`
                : dateRangeDesc
            }
          />
        </div>
        <div style={{ gridColumn: 'span 3' }}>
          <StatCard
            title="총 토큰"
            value={formatTokens(stats.totalTokens)}
            description={`입력 ${formatTokens(stats.inputTokens)} / 출력 ${formatTokens(stats.outputTokens)}`}
          />
        </div>
        <div style={{ gridColumn: 'span 3' }}>
          <StatCard
            title="세션"
            value={formatNumber(stats.totalSessions)}
            description={`${stats.totalProjects}개 프로젝트`}
          />
        </div>
        <div style={{ gridColumn: 'span 3' }}>
          <StatCard
            title="메시지"
            value={formatNumber(stats.totalMessages)}
            description={`툴 호출 ${formatNumber(stats.totalToolCalls)}회`}
          />
        </div>

        <Card style={{ gridColumn: 'span 8' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <CL>시간별 사용량</CL>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <UsageOverTime data={stats.dailyUsage} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 4' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <CL>피크 시간대</CL>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <PeakHours data={stats.peakHours} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 7' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <CL>활동 히트맵</CL>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <ActivityHeatmap data={stats.activityData} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 5' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <div className="flex items-center justify-between">
              <CL>모델별 분석</CL>
              <div className="flex gap-0.5 rounded border border-border p-0.5">
                {(['cost', 'tokens'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setModelView(v)}
                    className={`px-2 py-0.5 rounded-sm text-[9px] font-semibold transition-colors tracking-wide uppercase ${
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
          <CardContent className="px-5 pb-5 pt-0">
            <ModelBreakdown
              data={stats.modelBreakdown}
              view={modelView}
              onViewChange={setModelView}
            />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 8' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <CL>모델별 일별 비용</CL>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <CostChart data={stats.dailyUsage} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 4' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <CL>툴 사용 순위</CL>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <ToolUsageChart data={stats.toolUsage} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 4' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <CL>캐시 절약 현황</CL>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <CacheStatsCard data={stats.cacheStats} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 8' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <CL>대화 패턴 분석</CL>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <ConversationStatsCard data={stats.conversationStats} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 12' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <CL>최근 세션</CL>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <SessionTreeView sessions={stats.recentSessions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
