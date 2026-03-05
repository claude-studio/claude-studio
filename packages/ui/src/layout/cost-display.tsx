import * as React from 'react';
import { formatCost, formatCostUsd } from '@repo/shared';

interface CostDisplayProps {
  cost: number;
  className?: string;
}

export function CostDisplay({ cost, className }: CostDisplayProps) {
  return (
    <span className={className}>
      {formatCost(cost)}
      <span className="text-xs font-normal text-muted-foreground ml-1">
        ({formatCostUsd(cost)})
      </span>
    </span>
  );
}
