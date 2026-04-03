import { useAppLocale, useTranslation } from '@repo/i18n';
import { formatCost } from '@repo/shared';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ProjectCostItem {
  name: string;
  fullName?: string;
  cost: number;
}

interface ProjectCostChartProps {
  data: ProjectCostItem[];
}

export function ProjectCostChart({ data }: ProjectCostChartProps) {
  const { locale } = useAppLocale();
  const { t } = useTranslation('analytics');
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
          tickFormatter={(v: number) => formatCost(v, { locale })}
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
            backgroundColor: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'var(--popover-foreground)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          }}
          labelStyle={{ color: 'var(--popover-foreground)', fontWeight: 600 }}
          itemStyle={{ color: 'var(--popover-foreground)' }}
          formatter={(v: number, _name: string, props: { payload?: ProjectCostItem }) => [
            formatCost(v, { locale }),
            props.payload?.fullName ?? props.payload?.name ?? t('cost.fallbackLabel'),
          ]}
        />
        <Bar dataKey="cost" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
