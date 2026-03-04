'use client';
import * as React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DailyUsage } from '@repo/shared';
import { formatDateShort, formatCostKrw } from '@repo/shared';

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
  const models = Array.from(
    new Set(data.flatMap(d => Object.keys(d.modelCosts)))
  );

  const chartData = data.map(d => {
    const defaults = Object.fromEntries(models.map(m => [m, 0]));
    return {
      date: formatDateShort(new Date(d.date)),
      cost: d.cost,
      ...defaults,
      ...d.modelCosts,
    };
  });

  if (models.length === 0) {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={50} tickFormatter={(v: number) => formatCostKrw(v)} />
          <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', color: 'var(--card-foreground)' }} formatter={(v: number) => formatCostKrw(v)} />
          <Area type="monotone" dataKey="cost" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.2} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={50} tickFormatter={(v: number) => formatCostKrw(v)} />
        <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', color: 'var(--card-foreground)' }} formatter={(v: number) => formatCostKrw(v)} />
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
