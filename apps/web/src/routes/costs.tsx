import { createFileRoute } from '@tanstack/react-router';
import {
  useStats,
  CostChart,
  ModelBreakdown,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui';
import { formatCost, formatCostUsd, formatTokens } from '@repo/shared';

function CostValue({ cost, className }: { cost: number; className?: string }) {
  return (
    <span className={className}>
      {formatCost(cost)}
      <span className="text-xs font-normal text-muted-foreground ml-1">({formatCostUsd(cost)})</span>
    </span>
  );
}

export const Route = createFileRoute('/costs')({
  component: CostsPage,
});

function CostsPage() {
  const { data: stats, isLoading } = useStats();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );

  if (!stats) return <div className="text-muted-foreground">데이터가 없습니다</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">비용</h1>
        <p className="text-muted-foreground text-sm mt-1">
          합계: <CostValue cost={stats.totalCost} />
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">일별 비용</CardTitle>
          </CardHeader>
          <CardContent>
            <CostChart data={stats.dailyUsage} />
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">모델별 비용</CardTitle>
          </CardHeader>
          <CardContent>
            <ModelBreakdown data={stats.modelBreakdown} />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">모델 상세</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.modelBreakdown.map((m) => (
              <div key={m.model} className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: m.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {m.displayName}
                    </span>
                    <span className="text-sm font-semibold">
                      <CostValue cost={m.cost} />
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {formatTokens(m.totalTokens)} 토큰
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {m.messageCount}개 메시지
                    </span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: m.color,
                        width: `${(m.cost / stats.totalCost) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
