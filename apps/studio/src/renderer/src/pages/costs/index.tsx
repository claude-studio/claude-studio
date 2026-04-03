import { useMemo, useState } from 'react';

import { type DailyUsage } from '@repo/shared';
import { formatDateShort, formatTokens } from '@repo/shared';
import {
  Card,
  CardContent,
  CardHeader,
  CostChart,
  CostDisplay,
  ModelBreakdown,
  ProjectCostChart,
  StatCard,
  UsageOverTime,
  useProjects,
  useStats,
} from '@repo/ui';

import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PeriodFilter = 'all' | 'month' | 'week';

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

function getPeriodDescription(
  data: DailyUsage[],
  period: PeriodFilter,
  labels: Record<PeriodFilter, string>,
  emptyLabel: string,
): string {
  if (data.length === 0) return emptyLabel;
  const dates = data.map((d) => d.date).sort();
  if (period === 'all') {
    if (dates.length === 1) return formatDateShort(dates[0]!);
    return `${formatDateShort(dates[0]!)} ~ ${formatDateShort(dates[dates.length - 1]!)}`;
  }
  if (period === 'week') return labels.week;
  if (period === 'month') return labels.month;
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

const CT = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{children}</p>
);

export function CostsPage() {
  const { t } = useTranslation('studio');
  const { data: stats, isLoading } = useStats();
  const { data: projects = [] } = useProjects();
  const [period, setPeriod] = useState<PeriodFilter>('all');
  const periodLabels: Record<PeriodFilter, string> = {
    all: t('costs.filters.all'),
    month: t('costs.filters.month'),
    week: t('costs.filters.week'),
  };

  const thisMonth = useMemo(() => getMonthStr(0), []);
  const lastMonth = useMemo(() => getMonthStr(-1), []);

  const filteredDaily = useMemo(
    () => (stats ? filterByPeriod(stats.dailyUsage, period) : []),
    [stats, period],
  );
  const totals = useMemo(() => sumDailyUsage(filteredDaily), [filteredDaily]);
  const periodDesc = useMemo(
    () => getPeriodDescription(filteredDaily, period, periodLabels, t('costs.noDateRange')),
    [filteredDaily, period, periodLabels, t],
  );
  const thisMonthCost = useMemo(
    () =>
      stats ? sumDailyUsage(stats.dailyUsage.filter((d) => d.date.startsWith(thisMonth))).cost : 0,
    [stats, thisMonth],
  );
  const lastMonthCost = useMemo(
    () =>
      stats ? sumDailyUsage(stats.dailyUsage.filter((d) => d.date.startsWith(lastMonth))).cost : 0,
    [stats, lastMonth],
  );
  const monthDiff =
    lastMonthCost > 0 ? ((thisMonthCost - lastMonthCost) / lastMonthCost) * 100 : null;

  const topProjects = useMemo(
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!stats) return <div className="text-muted-foreground">{t('costs.noData')}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex gap-0.5 rounded border border-border p-0.5">
          {(Object.entries(periodLabels) as [PeriodFilter, string][]).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`px-3 py-1 rounded-sm text-[10px] font-medium transition-colors tracking-wide ${
                period === value
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          title={t('costs.totalCost')}
          value={<CostDisplay cost={totals.cost} />}
          description={periodDesc}
        />
        <StatCard
          title={t('costs.inputTokens')}
          value={formatTokens(totals.inputTokens)}
          description={periodDesc}
        />
        <StatCard
          title={t('costs.outputTokens')}
          value={formatTokens(totals.outputTokens)}
          description={periodDesc}
        />
        <StatCard
          title={t('costs.totalTokens')}
          value={formatTokens(totals.inputTokens + totals.outputTokens)}
          description={periodDesc}
        />
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}>
        <Card style={{ gridColumn: 'span 8' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <CT>{t('costs.dailyCost')}</CT>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <CostChart data={filteredDaily} />
          </CardContent>
        </Card>

        <div style={{ gridColumn: 'span 4' }} className="flex flex-col gap-3">
          <Card className="flex-1">
            <CardContent className="p-5 h-full flex flex-col justify-between">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                {t('costs.thisMonth')}
              </p>
              <div>
                <p className="text-3xl font-bold font-mono tracking-tight leading-none mt-3">
                  <CostDisplay cost={thisMonthCost} />
                </p>
                <p className="text-[11px] text-muted-foreground mt-2 font-mono">{thisMonth}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardContent className="p-5 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                  {t('costs.lastMonth')}
                </p>
                {monthDiff !== null && (
                  <div
                    className={`flex items-center gap-0.5 text-[11px] font-semibold ${monthDiff > 0 ? 'text-red-400' : monthDiff < 0 ? 'text-emerald-500' : 'text-muted-foreground'}`}
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
              <div>
                <p className="text-3xl font-bold font-mono tracking-tight leading-none mt-3">
                  <CostDisplay cost={lastMonthCost} />
                </p>
                <p className="text-[11px] text-muted-foreground mt-2 font-mono">{lastMonth}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card style={{ gridColumn: 'span 7' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <CT>{t('costs.usageOverTime')}</CT>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <UsageOverTime data={filteredDaily} />
          </CardContent>
        </Card>

        <Card style={{ gridColumn: 'span 5' }}>
          <CardHeader className="px-5 pt-5 pb-3">
            <CT>{t('costs.modelBreakdown')}</CT>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <ModelBreakdown data={stats.modelBreakdown} />
          </CardContent>
        </Card>

        {topProjects.length > 0 && (
          <Card style={{ gridColumn: 'span 12' }}>
            <CardHeader className="px-5 pt-5 pb-3">
              <CT>{t('costs.topProjectCosts')}</CT>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0">
              <ProjectCostChart data={topProjects} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
