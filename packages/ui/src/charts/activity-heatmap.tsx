import { useRef, useState, useEffect, type CSSProperties } from 'react';

interface ActivityData {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  data: ActivityData[];
}

const WEEKS = 24;
const GAP = 4;

function getIntensityStyle(count: number, max: number): CSSProperties {
  if (count === 0) return { backgroundColor: 'color-mix(in srgb, var(--muted-foreground) 15%, transparent)' };
  const ratio = count / max;
  const pct = ratio < 0.2 ? 25 : ratio < 0.4 ? 45 : ratio < 0.6 ? 60 : ratio < 0.8 ? 78 : 100;
  return { backgroundColor: `color-mix(in srgb, var(--primary) ${pct}%, transparent)` };
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cell, setCell] = useState(16);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const calc = () => {
      const totalWidth = el.clientWidth;
      const c = Math.floor((totalWidth - GAP * (WEEKS - 1)) / WEEKS);
      setCell(Math.max(c, 8));
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const max = Math.max(...data.map((d) => d.count), 1);

  const today = new Date();
  const weeks: { date: string; count: number }[][] = [];
  for (let w = WEEKS - 1; w >= 0; w--) {
    const week: { date: string; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (w * 7 + (6 - d)));
      const dateStr = date.toISOString().split('T')[0]!;
      const entry = data.find((item) => item.date === dateStr);
      week.push({ date: dateStr, count: entry?.count ?? 0 });
    }
    weeks.push(week);
  }

  return (
    <div ref={containerRef} className="space-y-2 w-full">
      <div className="flex gap-1">
        {/* 셀 그리드 */}
        <div className="flex flex-1" style={{ gap: GAP }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col flex-1" style={{ gap: GAP }}>
              {week.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.count}개 메시지`}
                  className="rounded-sm transition-colors w-full"
                  style={{ height: cell, ...getIntensityStyle(day.count, max) }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 범례 */}
      <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
        <span>적음</span>
        {([0, 25, 45, 60, 78, 100] as const).map((pct) => (
          <div
            key={pct}
            className="rounded-sm shrink-0"
            style={{
              width: cell,
              height: cell,
              ...(pct === 0
                ? { backgroundColor: 'color-mix(in srgb, var(--muted-foreground) 15%, transparent)' }
                : { backgroundColor: `color-mix(in srgb, var(--primary) ${pct}%, transparent)` }),
            }}
          />
        ))}
        <span>많음</span>
      </div>
    </div>
  );
}
