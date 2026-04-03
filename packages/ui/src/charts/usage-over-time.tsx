import { useState } from 'react';

import { useAppLocale, useTranslation } from '@repo/i18n';
import type { DailyUsage } from '@repo/shared';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { formatChartCostValue, formatChartDateLabel, formatChartMetricValue } from './lib/locale';

interface UsageOverTimeProps {
  data: DailyUsage[];
}

type MetricKey = 'messages' | 'sessions' | 'toolCalls' | 'cost';

export function UsageOverTime({ data }: UsageOverTimeProps) {
  const { locale } = useAppLocale();
  const { t } = useTranslation('analytics');
  const [activeMetric, setActiveMetric] = useState<MetricKey>('messages');
  const metrics: { key: MetricKey; label: string; color: string }[] = [
    { key: 'messages', label: t('usageOverTime.metrics.messages'), color: 'var(--chart-1)' },
    { key: 'sessions', label: t('usageOverTime.metrics.sessions'), color: 'var(--chart-2)' },
    { key: 'toolCalls', label: t('usageOverTime.metrics.toolCalls'), color: 'var(--chart-3)' },
    { key: 'cost', label: t('usageOverTime.metrics.cost'), color: 'var(--chart-4)' },
  ];

  const metric = metrics.find((m) => m.key === activeMetric)!;
  const chartData = data.map((d) => ({
    ...d,
    date: formatChartDateLabel(d.date, locale),
  }));

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap justify-end">
        {metrics.map((m) => (
          <button
            key={m.key}
            onClick={() => setActiveMetric(m.key)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeMetric === m.key
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={metric.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            width={activeMetric === 'cost' ? 60 : 40}
            tickFormatter={(v: number) =>
              activeMetric === 'cost'
                ? formatChartCostValue(v, locale)
                : formatChartMetricValue(v, locale)
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--popover)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--popover-foreground)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            }}
            labelStyle={{ color: 'var(--popover-foreground)', fontWeight: 600 }}
            itemStyle={{ color: 'var(--popover-foreground)' }}
            formatter={(v: number) => [
              activeMetric === 'cost'
                ? formatChartCostValue(v, locale)
                : formatChartMetricValue(v, locale),
              metric.label,
            ]}
          />
          <Area
            type="monotone"
            dataKey={activeMetric}
            stroke={metric.color}
            fill="url(#colorGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
