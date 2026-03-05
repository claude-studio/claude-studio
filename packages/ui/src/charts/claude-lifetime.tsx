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
  const items = [
    {
      label: '사용 시작일',
      value: data.firstSessionDate ? formatDate(data.firstSessionDate) : '-',
      sub: data.firstSessionDate ? `D+${data.daysActive}` : '',
    },
    {
      label: '역대 최장 세션',
      value:
        data.longestSessionDurationMs > 0 ? formatDuration(data.longestSessionDurationMs) : '-',
      sub: data.longestSessionMessageCount > 0 ? `${data.longestSessionMessageCount}개 메시지` : '',
    },
    {
      label: '총 메시지 수',
      value: formatNumber(totalMessages),
      sub: '',
    },
    {
      label: '총 툴 호출 수',
      value: formatNumber(totalToolCalls),
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
