'use client';
import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { ModelUsage } from '@repo/shared';
import { formatCost, formatCostKrw, formatTokens } from '@repo/shared';

interface ModelBreakdownProps {
  data: ModelUsage[];
}

export function ModelBreakdown({ data }: ModelBreakdownProps) {
  const [view, setView] = React.useState<'cost' | 'tokens'>('cost');
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const chartData = data.map(m => ({
    name: m.displayName,
    value: view === 'cost' ? m.cost : m.totalTokens,
    color: m.color,
  }));

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['cost', 'tokens'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              view === v ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {v === 'cost' ? '비용' : '토큰'}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-6">
        <div style={{ width: 160, height: 160, minHeight: 160, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.color}
                    opacity={activeIndex === null || activeIndex === i ? 1 : 0.4}
                    style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 flex-1">
          {data.map((m, i) => (
            <div
              key={m.model}
              className={`flex items-center justify-between text-sm transition-opacity ${
                activeIndex !== null && activeIndex !== i ? 'opacity-40' : 'opacity-100'
              }`}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                <span className="text-muted-foreground text-xs">{m.displayName}</span>
              </div>
              <span className="text-xs font-medium">
                {view === 'cost' ? formatCostKrw(m.cost) : formatTokens(m.totalTokens)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
