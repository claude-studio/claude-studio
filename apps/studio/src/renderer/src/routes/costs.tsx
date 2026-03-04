import { createFileRoute } from '@tanstack/react-router';
import {
  useStats,
  StatCard,
  UsageOverTime,
  ModelBreakdown,
  CostChart,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui';
import { formatCost, formatTokens, formatDateShort } from '@repo/shared';
import type { DailyUsage } from '@repo/shared';
import { DollarSign, TrendingUp } from 'lucide-react';
import * as React from 'react';

export const Route = createFileRoute('/costs')({
  component: CostsPage,
});

type PeriodFilter = 'all' | 'month' | 'week';

const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'month', label: '이번 달' },
  { value: 'week', label: '이번 주' },
];

// 로컬 날짜를 YYYY-MM-DD 문자열로 반환
function toLocalDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function filterByPeriod(data: DailyUsage[], period: PeriodFilter): DailyUsage[] {
  if (period === 'all') return data;

  const now = new Date();
  const today = toLocalDateStr(now);

  if (period === 'week') {
    const day = now.getDay(); // 0=Sun
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((day + 6) % 7)); // 월요일 기준
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

function CostsPage() {
  const { data: stats, isLoading } = useStats();
  const [period, setPeriod] = React.useState<PeriodFilter>('all');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-muted-foreground">데이터가 없습니다</div>;
  }

  const filteredDaily = filterByPeriod(stats.dailyUsage, period);
  const totals = sumDailyUsage(filteredDaily);
  const periodDesc = getPeriodDescription(filteredDaily, period);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">비용</h1>
          <p className="text-muted-foreground text-sm mt-1">
            토큰 사용량 및 비용 분석
          </p>
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
          value={formatCost(totals.cost)}
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
