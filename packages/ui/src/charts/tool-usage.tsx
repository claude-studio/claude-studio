import type { ToolUsageItem } from '@repo/shared';

interface ToolUsageChartProps {
  data: ToolUsageItem[];
}

export function ToolUsageChart({ data }: ToolUsageChartProps) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">데이터 없음</p>;
  }

  const top = data.slice(0, 7);
  const max = top[0]?.count ?? 1;

  return (
    <div className="space-y-2.5">
      {top.map((item, i) => (
        <div key={item.name} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-4 shrink-0 text-right">{i + 1}</span>
          <span className="text-xs w-24 shrink-0 truncate">{item.name}</span>
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(item.count / max) * 100}%`,
                backgroundColor: 'var(--chart-2)',
              }}
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground w-16 text-right shrink-0">
            {item.count.toLocaleString()}회
          </span>
        </div>
      ))}
    </div>
  );
}
