import { formatCost, formatCostUsd } from '@repo/shared';

interface CostValueProps {
  cost: number;
  className?: string;
}

export function CostValue({ cost, className }: CostValueProps) {
  return (
    <span className={className}>
      {formatCost(cost)}
      <span className="text-xs font-normal text-muted-foreground ml-1">({formatCostUsd(cost)})</span>
    </span>
  );
}
