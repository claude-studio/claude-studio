import type { PeakHour } from '@repo/shared';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PeakHoursProps {
  data: PeakHour[];
}

export function PeakHours({ data }: PeakHoursProps) {
  const chartData = data.map((d) => ({
    ...d,
    label:
      d.hour === 0
        ? '12am'
        : d.hour === 12
          ? '12pm'
          : d.hour < 12
            ? `${d.hour}am`
            : `${d.hour - 12}pm`,
  }));

  return (
    <ResponsiveContainer width="100%" height={252}>
      <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          interval={2}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          width={35}
          tickCount={5}
          tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
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
        />
        <Bar dataKey="messages" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
