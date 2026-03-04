'use client';
import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ToolUsageItem } from '@repo/shared';

interface ToolUsageChartProps {
  data: ToolUsageItem[];
}

export function ToolUsageChart({ data }: ToolUsageChartProps) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">데이터 없음</p>;
  }

  const chartData = data.slice(0, 8).map((d) => ({
    name: d.name,
    count: d.count,
  }));

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            width={70}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--card-foreground)',
            }}
            formatter={(v: number) => [`${v.toLocaleString()}회`, '호출']}
          />
          <Bar dataKey="count" fill="var(--chart-2)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
