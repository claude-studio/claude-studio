import { createFileRoute, Link } from '@tanstack/react-router';
import {
  useSessionDetail,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  ScrollArea,
} from '@repo/ui';
import { formatCost, formatCostUsd, formatTokens, formatDuration } from '@repo/shared';

function CostValue({ cost }: { cost: number }) {
  return (
    <span>
      {formatCost(cost)}
      <span className="text-xs font-normal text-muted-foreground ml-1">({formatCostUsd(cost)})</span>
    </span>
  );
}
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/sessions/$id')({
  component: SessionDetailPage,
});

function SessionDetailPage() {
  const { id } = Route.useParams();
  const { data: session, isLoading } = useSessionDetail(id);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );

  if (!session) return <div className="text-muted-foreground">세션을 찾을 수 없습니다</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/sessions"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">{session.projectName}</h1>
          <p className="text-muted-foreground text-sm font-mono mt-1">
            {session.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">비용</p>
            <p className="text-xl font-semibold mt-1">
              <CostValue cost={session.cost} />
            </p>
          </CardContent>
        </Card>
        {[
          { label: '토큰', value: formatTokens(session.inputTokens + session.outputTokens) },
          { label: '메시지', value: String(session.messageCount) },
          { label: '소요 시간', value: formatDuration(session.duration) },
        ].map(({ label, value }) => (
          <Card key={label} className="border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-semibold mt-1">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {session.modelBreakdown && session.modelBreakdown.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">사용 모델</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {session.modelBreakdown.map((m) => (
                <div
                  key={m.model}
                  className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2"
                >
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: m.color }}
                  />
                  <span className="text-xs font-medium">{m.displayName}</span>
                  <span className="text-xs text-muted-foreground">
                    <CostValue cost={m.cost} />
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            대화 내용 ({session.messages?.length ?? 0}개 메시지)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {(session.messages ?? []).map(
                (msg: Record<string, unknown>, i: number) => {
                  const message = msg.message as
                    | Record<string, unknown>
                    | undefined;
                  const role =
                    (message?.role as string) || (msg.type as string);
                  const content = message?.content || msg.content;
                  if (
                    !content ||
                    (Array.isArray(content) && content.length === 0)
                  )
                    return null;

                  const text =
                    typeof content === 'string'
                      ? content
                      : Array.isArray(content)
                        ? (content as Record<string, unknown>[])
                            .filter(
                              (c: Record<string, unknown>) =>
                                c?.type === 'text',
                            )
                            .map((c: Record<string, unknown>) => c.text)
                            .join('\n')
                        : JSON.stringify(content).slice(0, 200);

                  if (!text) return null;

                  return (
                    <div
                      key={i}
                      className={`flex gap-3 ${role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          role === 'user'
                            ? 'bg-primary/10 text-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0"
                          >
                            {role === 'user'
                              ? '사용자'
                              : (message?.model as string)
                                ? (message!.model as string)
                                    .split('-')
                                    .slice(-2)
                                    .join('-')
                                : '어시스턴트'}
                          </Badge>
                          {(msg.costUSD as number) != null && (
                            <span className="text-[10px] text-muted-foreground">
                              {formatCost(msg.costUSD as number)}
                            </span>
                          )}
                        </div>
                        <p className="whitespace-pre-wrap break-words">
                          {(text as string).slice(0, 1000)}
                          {(text as string).length > 1000 ? '...' : ''}
                        </p>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
