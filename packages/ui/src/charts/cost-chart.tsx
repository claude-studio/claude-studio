import { useAppLocale } from '@repo/i18n';
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

import { formatChartCostValue, formatChartDateLabel } from './lib/locale';

interface CostChartProps {
  data: DailyUsage[];
}

const MODEL_COLORS: string[] = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

export function CostChart({ data }: CostChartProps) {
  const { locale } = useAppLocale();
  const models = Array.from(new Set(data.flatMap((d) => Object.keys(d.modelCosts))));

  const chartData = data.map((d) => {
    const defaults = Object.fromEntries(models.map((m) => [m, 0]));
    return {
      date: formatChartDateLabel(d.date, locale),
      cost: d.cost,
      ...defaults,
      ...d.modelCosts,
    };
  });

  if (models.length === 0) {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            width={50}
            tickFormatter={(v: number) => formatChartCostValue(v, locale)}
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
            formatter={(v: number) => formatChartCostValue(v, locale)}
          />
          <Area
            type="monotone"
            dataKey="cost"
            stroke="var(--chart-1)"
            fill="var(--chart-1)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ left: 4 }}>
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
          width={50}
          tickFormatter={(v: number) => formatChartCostValue(v, locale)}
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
          formatter={(v: number) => formatChartCostValue(v, locale)}
        />
        {models.map((model, i) => (
          <Area
            key={model}
            type="monotone"
            dataKey={model}
            stackId="cost"
            stroke={MODEL_COLORS[i % MODEL_COLORS.length]!}
            fill={MODEL_COLORS[i % MODEL_COLORS.length]!}
            fillOpacity={0.6}
            strokeWidth={1.5}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
