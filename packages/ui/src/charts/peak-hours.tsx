import { useAppLocale, useTranslation } from '@repo/i18n';
import type { PeakHour } from '@repo/shared';
import { formatNumber } from '@repo/shared';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { formatHourLabel } from './lib/locale';

interface PeakHoursProps {
  data: PeakHour[];
}

export function PeakHours({ data }: PeakHoursProps) {
  const { locale } = useAppLocale();
  const { t } = useTranslation('analytics');
  const chartData = data.map((d) => ({
    ...d,
    label: formatHourLabel(d.hour, locale),
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
          tickFormatter={(v: number) => formatNumber(v, { locale })}
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
          formatter={(value: number) => [formatNumber(value, { locale }), t('peakHours.messages')]}
        />
        <Bar dataKey="messages" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
