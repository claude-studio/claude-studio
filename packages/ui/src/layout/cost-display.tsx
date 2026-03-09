import { formatCost, formatCostUsd } from '@repo/shared';

import { cn } from '../lib/utils';

interface CostDisplayProps {
  cost: number;
  className?: string;
}

export function CostDisplay({ cost, className }: CostDisplayProps) {
  return (
    <span className={cn('inline-flex items-baseline gap-1 whitespace-nowrap', className)}>
      <span>{formatCost(cost)}</span>
      <span className="text-xs font-normal text-muted-foreground">({formatCostUsd(cost)})</span>
    </span>
  );
}
