'use client';
import * as React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DailyUsage } from '@repo/shared';
import { formatDateShort, formatCostKrw } from '@repo/shared';

interface UsageOverTimeProps {
  data: DailyUsage[];
}

type MetricKey = 'messages' | 'sessions' | 'toolCalls' | 'cost';

const METRICS: { key: MetricKey; label: string; color: string }[] = [
  { key: 'messages', label: '메시지', color: 'var(--chart-1)' },
  { key: 'sessions', label: '세션', color: 'var(--chart-2)' },
  { key: 'toolCalls', label: '툴 호출', color: 'var(--chart-3)' },
  { key: 'cost', label: '비용 (₩)', color: 'var(--chart-4)' },
];

export function UsageOverTime({ data }: UsageOverTimeProps) {
  const [activeMetric, setActiveMetric] = React.useState<MetricKey>('messages');

  const metric = METRICS.find((m) => m.key === activeMetric)!;
  const chartData = data.map((d) => ({
    ...d,
    date: formatDateShort(new Date(d.date)),
  }));

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap justify-end">
        {METRICS.map((m) => (
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
            tickFormatter={(v: number) => (activeMetric === 'cost' ? formatCostKrw(v) : String(v))}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--card-foreground)',
            }}
            formatter={(v: number) => [
              activeMetric === 'cost' ? formatCostKrw(v) : v,
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
