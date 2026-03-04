'use client';
import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { ModelUsage } from '@repo/shared';
import { formatCostKrw, formatTokens } from '@repo/shared';

interface ModelBreakdownProps {
  data: ModelUsage[];
  view?: 'cost' | 'tokens';
  onViewChange?: (view: 'cost' | 'tokens') => void;
}

export function ModelBreakdown({ data, view: externalView, onViewChange }: ModelBreakdownProps) {
  const [internalView, setInternalView] = React.useState<'cost' | 'tokens'>('cost');
  const view = externalView ?? internalView;
  const setView = onViewChange ?? setInternalView;
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const chartData = data.map((m) => ({
    name: m.displayName,
    value: view === 'cost' ? m.cost : m.totalTokens,
    color: m.color,
  }));

  return (
    <div className="flex items-center gap-6">
      <div style={{ width: 120, height: 120, minHeight: 120, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={55}
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
  );
}
