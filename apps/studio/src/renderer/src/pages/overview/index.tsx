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
import { useTranslation } from 'react-i18next';

function getDateRangeDesc(dailyUsage: DailyUsage[], emptyLabel: string): string {
  const dates = dailyUsage.map((d) => d.date).sort();
  if (dates.length === 0) return emptyLabel;
  if (dates.length === 1) return formatDateShort(dates[0]!);
  return `${formatDateShort(dates[0]!)} ~ ${formatDateShort(dates[dates.length - 1]!)}`;
}

const CL = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
    {children}
  </p>
);

function SessionTreeView({ sessions }: { sessions: SessionInfo[] }) {
  const { t } = useTranslation('studio');
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
    return (
      <p className="text-muted-foreground text-sm text-center py-4">{t('overview.noSessions')}</p>
    );
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
                      {t('overview.messages', { count: session.messageCount })}
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
  const { t } = useTranslation('studio');
  const { data: stats, isLoading } = useStats();
  const [modelView, setModelView] = useState<'cost' | 'tokens'>('cost');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!stats) return <div className="text-muted-foreground">{t('overview.noData')}</div>;

  const dateRangeDesc = getDateRangeDesc(stats.dailyUsage, t('overview.noDateRange'));

  return (
    <div className="space-y-3">
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}>
        <div style={{ gridColumn: 'span 3' }}>
          <StatCard
            featured
            title={t('overview.totalCost')}
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
            title={t('overview.totalTokens')}
            value={formatTokens(stats.totalTokens)}
            description={t('overview.tokenBreakdown', {
              input: formatTokens(stats.inputTokens),
              output: formatTokens(stats.outputTokens),
            })}
          />
        </div>
        <div style={{ gridColumn: 'span 3' }}>
          <StatCard
            title={t('overview.sessions')}
            value={formatNumber(stats.totalSessions)}
            description={t('overview.projectCount', { count: stats.totalProjects })}
          />
        </div>
        <div style={{ gridColumn: 'span 3' }}>
          <StatCard
            title={t('overview.messageCount')}
            value={formatNumber(stats.totalMessages)}
            description={t('overview.toolCalls', {
              count: formatNumber(stats.totalToolCalls),
            })}
          />
        </div>

        <Card style={{ gridColumn: 'span 8' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <CL>{t('overview.usageOverTime')}</CL>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <UsageOverTime data={stats.dailyUsage} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 4' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <CL>{t('overview.peakHours')}</CL>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <PeakHours data={stats.peakHours} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 7' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <CL>{t('overview.activityHeatmap')}</CL>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <ActivityHeatmap data={stats.activityData} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 5' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <div className="flex items-center justify-between">
              <CL>{t('overview.modelBreakdown')}</CL>
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
                    {v === 'cost' ? t('overview.cost') : t('overview.tokens')}
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
            <CL>{t('overview.dailyModelCost')}</CL>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <CostChart data={stats.dailyUsage} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 4' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <CL>{t('overview.toolUsageRanking')}</CL>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <ToolUsageChart data={stats.toolUsage} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 4' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <CL>{t('overview.cacheSavings')}</CL>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <CacheStatsCard data={stats.cacheStats} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 8' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <CL>{t('overview.conversationPatterns')}</CL>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <ConversationStatsCard data={stats.conversationStats} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 12' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <CL>{t('overview.recentSessions')}</CL>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <SessionTreeView sessions={stats.recentSessions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
