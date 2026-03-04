'use client';
import * as React from 'react';

interface ActivityData {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  data: ActivityData[];
}

function getIntensityStyle(count: number, max: number): React.CSSProperties {
  if (count === 0) return { backgroundColor: 'rgba(58, 58, 60, 0.8)' }; // --muted dark
  const ratio = count / max;
  const opacity =
    ratio < 0.2 ? 0.25 : ratio < 0.4 ? 0.45 : ratio < 0.6 ? 0.65 : ratio < 0.8 ? 0.82 : 1;
  return { backgroundColor: `rgba(232, 149, 110, ${opacity})` }; // --primary dark #E8956E
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const max = Math.max(...data.map((d) => d.count), 1);

  // Build last 24 weeks grid
  const today = new Date();
  const weeks: { date: string; count: number }[][] = [];

  for (let w = 23; w >= 0; w--) {
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

  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="space-y-2">
      <div className="flex gap-1 overflow-x-auto pb-1">
        <div className="flex flex-col gap-1 mr-1">
          {dayLabels.map((day, i) => (
            <div key={day} className="h-[13px] text-[9px] text-muted-foreground flex items-center">
              {i % 2 === 1 ? day : ''}
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count}개 메시지`}
                className="h-[13px] w-[13px] rounded-sm transition-colors"
                style={getIntensityStyle(day.count, max)}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
        <span>적음</span>
        {([0, 0.25, 0.45, 0.65, 0.82, 1] as const).map((opacity) => (
          <div
            key={opacity}
            className="h-[10px] w-[10px] rounded-sm"
            style={
              opacity === 0
                ? { backgroundColor: 'rgba(58, 58, 60, 0.8)' }
                : { backgroundColor: `rgba(232, 149, 110, ${opacity})` }
            }
          />
        ))}
        <span>많음</span>
      </div>
    </div>
  );
}
