'use client';
import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCost } from '@repo/shared';

interface ProjectCostItem {
  name: string;
  fullName?: string;
  cost: number;
}

interface ProjectCostChartProps {
  data: ProjectCostItem[];
}

export function ProjectCostChart({ data }: ProjectCostChartProps) {
  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 36)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => formatCost(v)}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={80}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'var(--card-foreground)',
          }}
          formatter={(v: number, _name: string, props: { payload?: ProjectCostItem }) => [
            formatCost(v),
            props.payload?.fullName ?? props.payload?.name ?? '비용',
          ]}
        />
        <Bar dataKey="cost" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
