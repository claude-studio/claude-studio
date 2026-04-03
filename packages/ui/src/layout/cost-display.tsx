import { useAppLocale, useTranslation } from '@repo/i18n';
import { formatCost, formatCostUsd } from '@repo/shared';

import { cn } from '../lib/utils';

interface CostDisplayProps {
  cost: number;
  className?: string;
}

export function CostDisplay({ cost, className }: CostDisplayProps) {
  const { locale } = useAppLocale();
  const { t } = useTranslation('analytics');

  return (
    <span className={cn('inline-flex items-baseline gap-1 whitespace-nowrap', className)}>
      <span>{formatCost(cost, { locale })}</span>
      {locale === 'ko' && (
        <span className="text-xs font-normal text-muted-foreground">
          ({t('cost.secondaryUsd')} {formatCostUsd(cost)})
        </span>
      )}
    </span>
  );
}
