import { useAppLocale, useTranslation } from '@repo/i18n';
import type { ConversationStats } from '@repo/shared';
import { formatDuration, formatTokens } from '@repo/shared';

interface ConversationStatsCardProps {
  data: ConversationStats;
}

export function ConversationStatsCard({ data }: ConversationStatsCardProps) {
  const { locale } = useAppLocale();
  const { t } = useTranslation('analytics');
  const total = data.shortSessions + data.mediumSessions + data.longSessions;

  const bars = [
    {
      label: t('conversation.labels.shortSessions'),
      value: data.shortSessions,
      color: 'var(--chart-3)',
    },
    {
      label: t('conversation.labels.mediumSessions'),
      value: data.mediumSessions,
      color: 'var(--chart-2)',
    },
    {
      label: t('conversation.labels.longSessions'),
      value: data.longSessions,
      color: 'var(--chart-1)',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-lg border border-border/50 p-3">
          <p className="text-xs text-muted-foreground">
            {t('conversation.labels.averageSessionLength')}
          </p>
          <p className="text-lg font-semibold font-mono mt-1">
            {formatDuration(data.avgSessionDurationMs, { locale })}
          </p>
        </div>
        <div className="rounded-lg border border-border/50 p-3">
          <p className="text-xs text-muted-foreground">
            {t('conversation.labels.averageMessagesPerSession')}
          </p>
          <p className="text-lg font-semibold font-mono mt-1">
            {t('conversation.units.messagesCount', {
              count: Math.round(data.avgMessagesPerSession).toLocaleString(
                locale === 'ko' ? 'ko-KR' : 'en-US',
              ),
            })}
          </p>
        </div>
        <div className="rounded-lg border border-border/50 p-3">
          <p className="text-xs text-muted-foreground">
            {t('conversation.labels.inputTokensPerMessage')}
          </p>
          <p className="text-lg font-semibold font-mono mt-1">
            {formatTokens(Math.round(data.avgInputTokensPerMessage), { locale })}
          </p>
        </div>
        <div className="rounded-lg border border-border/50 p-3">
          <p className="text-xs text-muted-foreground">
            {t('conversation.labels.outputTokensPerMessage')}
          </p>
          <p className="text-lg font-semibold font-mono mt-1">
            {formatTokens(Math.round(data.avgOutputTokensPerMessage), { locale })}
          </p>
        </div>
      </div>

      {/* 세션 길이 분포 */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          {t('conversation.labels.sessionLengthDistribution')}
        </p>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
          {bars.map((bar) => (
            <div key={bar.label} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-28 shrink-0">{bar.label}</span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: total > 0 ? `${(bar.value / total) * 100}%` : '0%',
                    backgroundColor: bar.color,
                  }}
                />
              </div>
              <span className="text-xs font-medium w-8 text-right">{bar.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
