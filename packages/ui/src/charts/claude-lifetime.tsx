import { useAppLocale, useTranslation } from '@repo/i18n';
import type { ClaudeLifetime } from '@repo/shared';
import { formatDate, formatDuration, formatNumber } from '@repo/shared';

interface ClaudeLifetimeCardProps {
  data: ClaudeLifetime;
  totalMessages: number;
  totalToolCalls: number;
}

export function ClaudeLifetimeCard({
  data,
  totalMessages,
  totalToolCalls,
}: ClaudeLifetimeCardProps) {
  const { locale } = useAppLocale();
  const { t } = useTranslation('analytics');
  const items = [
    {
      label: t('lifetime.labels.startedOn'),
      value: data.firstSessionDate ? formatDate(data.firstSessionDate, { locale }) : '-',
      sub: data.firstSessionDate
        ? t('lifetime.sublabels.dayCount', { count: data.daysActive })
        : '',
    },
    {
      label: t('lifetime.labels.longestSession'),
      value:
        data.longestSessionDurationMs > 0
          ? formatDuration(data.longestSessionDurationMs, { locale })
          : '-',
      sub:
        data.longestSessionMessageCount > 0
          ? t('lifetime.sublabels.messageCount', {
              count: formatNumber(data.longestSessionMessageCount, { locale }),
            })
          : '',
    },
    {
      label: t('lifetime.labels.totalMessages'),
      value: formatNumber(totalMessages, { locale }),
      sub: '',
    },
    {
      label: t('lifetime.labels.totalToolCalls'),
      value: formatNumber(totalToolCalls, { locale }),
      sub: '',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">{item.label}</p>
          <p className="text-lg font-semibold mt-1">{item.value}</p>
          {item.sub && <p className="text-xs text-primary mt-0.5">{item.sub}</p>}
        </div>
      ))}
    </div>
  );
}
