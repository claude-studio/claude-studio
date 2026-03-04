import * as React from 'react';
import { useStats, useProjects } from '../hooks/use-data';
import { StatCard } from '../layout/stat-card';
import { UsageOverTime } from '../charts/usage-over-time';
import { ModelBreakdown } from '../charts/model-breakdown';
import { CostChart } from '../charts/cost-chart';
import { ProjectCostChart } from '../charts/project-cost-chart';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatTokens, formatDateShort } from '@repo/shared';
import type { DailyUsage } from '@repo/shared';
import { DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PageSpinner } from './page-spinner';
import { CostValue } from './cost-value';

type PeriodFilter = 'all' | 'month' | 'week';

const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'month', label: '이번 달' },
  { value: 'week', label: '이번 주' },
];

function toLocalDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function filterByPeriod(data: DailyUsage[], period: PeriodFilter): DailyUsage[] {
  if (period === 'all') return data;
  const now = new Date();
  const today = toLocalDateStr(now);
  if (period === 'week') {
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const from = toLocalDateStr(monday);
    return data.filter((d) => d.date >= from && d.date <= today);
  }
  if (period === 'month') {
    const from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    return data.filter((d) => d.date >= from && d.date <= today);
  }
  return data;
}

function getPeriodDescription(data: DailyUsage[], period: PeriodFilter): string {
  if (data.length === 0) return '데이터 없음';
  const dates = data.map((d) => d.date).sort();
  if (period === 'all') {
    if (dates.length === 1) return formatDateShort(dates[0]!);
    return `${formatDateShort(dates[0]!)} ~ ${formatDateShort(dates[dates.length - 1]!)}`;
  }
  if (period === 'week') return '이번 주';
  if (period === 'month') return '이번 달';
  return '';
}

function sumDailyUsage(data: DailyUsage[]) {
  return data.reduce(
    (acc, d) => ({
      cost: acc.cost + d.cost,
      inputTokens: acc.inputTokens + d.inputTokens,
      outputTokens: acc.outputTokens + d.outputTokens,
    }),
    { cost: 0, inputTokens: 0, outputTokens: 0 },
  );
}

function getMonthStr(offset: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function CostsPage() {
  const { data: stats, isLoading } = useStats();
  const { data: projects = [] } = useProjects();
  const [period, setPeriod] = React.useState<PeriodFilter>('all');

  const thisMonth = React.useMemo(() => getMonthStr(0), []);
  const lastMonth = React.useMemo(() => getMonthStr(-1), []);

  const filteredDaily = React.useMemo(
    () => (stats ? filterByPeriod(stats.dailyUsage, period) : []),
    [stats, period],
  );
  const totals = React.useMemo(() => sumDailyUsage(filteredDaily), [filteredDaily]);
  const periodDesc = React.useMemo(
    () => getPeriodDescription(filteredDaily, period),
    [filteredDaily, period],
  );
  const thisMonthCost = React.useMemo(
    () =>
      stats ? sumDailyUsage(stats.dailyUsage.filter((d) => d.date.startsWith(thisMonth))).cost : 0,
    [stats, thisMonth],
  );
  const lastMonthCost = React.useMemo(
    () =>
      stats ? sumDailyUsage(stats.dailyUsage.filter((d) => d.date.startsWith(lastMonth))).cost : 0,
    [stats, lastMonth],
  );
  const monthDiff =
    lastMonthCost > 0 ? ((thisMonthCost - lastMonthCost) / lastMonthCost) * 100 : null;

  const topProjects = React.useMemo(
    () =>
      [...projects]
        .sort((a, b) => b.totalCost - a.totalCost)
        .slice(0, 10)
        .map((p) => ({
          name: p.name.length > 16 ? p.name.slice(0, 16) + '…' : p.name,
          fullName: p.name,
          cost: p.totalCost,
        })),
    [projects],
  );

  if (isLoading) return <PageSpinner />;
  if (!stats) return <div className="text-muted-foreground">데이터가 없습니다</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">비용</h1>
          <p className="text-muted-foreground text-sm mt-1">토큰 사용량 및 비용 분석</p>
        </div>
        <div className="flex gap-1 rounded-lg border border-border/50 p-1">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                period === opt.value
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="총 비용"
          value={<CostValue cost={totals.cost} />}
          description={periodDesc}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          title="입력 토큰"
          value={formatTokens(totals.inputTokens)}
          description={periodDesc}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="출력 토큰"
          value={formatTokens(totals.outputTokens)}
          description={periodDesc}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="총 토큰"
          value={formatTokens(totals.inputTokens + totals.outputTokens)}
          description={periodDesc}
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">이번 달</p>
            <p className="text-xl font-semibold mt-1">
              <CostValue cost={thisMonthCost} />
            </p>
            <p className="text-xs text-muted-foreground mt-1">{thisMonth}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">지난 달</p>
              {monthDiff !== null && (
                <div
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    monthDiff > 0
                      ? 'text-red-400'
                      : monthDiff < 0
                        ? 'text-green-400'
                        : 'text-muted-foreground'
                  }`}
                >
                  {monthDiff > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : monthDiff < 0 ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : (
                    <Minus className="h-3 w-3" />
                  )}
                  {Math.abs(monthDiff).toFixed(1)}%
                </div>
              )}
            </div>
            <p className="text-xl font-semibold mt-1">
              <CostValue cost={lastMonthCost} />
            </p>
            <p className="text-xs text-muted-foreground mt-1">{lastMonth}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">일별 비용</CardTitle>
          </CardHeader>
          <CardContent>
            <CostChart data={filteredDaily} />
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

      {topProjects.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">프로젝트별 비용 순위</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectCostChart data={topProjects} />
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">시간별 사용량</CardTitle>
        </CardHeader>
        <CardContent>
          <UsageOverTime data={filteredDaily} />
        </CardContent>
      </Card>
    </div>
  );
}
