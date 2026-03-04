import * as React from 'react';
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
import { formatCost, formatCostUsd, formatTokens, formatDuration, timeAgo } from '@repo/shared';
import { ArrowLeft, AlertCircle } from 'lucide-react';

function CostValue({ cost }: { cost: number }) {
  return (
    <span>
      {formatCost(cost)}
      <span className="text-xs font-normal text-muted-foreground ml-1">({formatCostUsd(cost)})</span>
    </span>
  );
}

export const Route = createFileRoute('/sessions/$id')({
  component: SessionDetailPage,
});

function SessionDetailPage() {
  const { id } = Route.useParams();
  const { data: session, isLoading, isError } = useSessionDetail(id);
  const [hideErrors, setHideErrors] = React.useState(false);
  const [hideSidechain, setHideSidechain] = React.useState(false);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">세션을 불러오는 중 오류가 발생했습니다.</span>
      </div>
    );

  if (!session) return <div className="text-muted-foreground text-sm">세션을 찾을 수 없습니다.</div>;

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
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              대화 내용 ({session.messages?.length ?? 0}개 메시지)
            </CardTitle>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHideErrors((v) => !v)}
                className={`text-xs px-2 py-1 rounded-md transition-colors ${
                  hideErrors ? 'bg-red-500/20 text-red-400' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                오류 {hideErrors ? '표시' : '숨기기'}
              </button>
              <button
                onClick={() => setHideSidechain((v) => !v)}
                className={`text-xs px-2 py-1 rounded-md transition-colors ${
                  hideSidechain ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                서브에이전트 {hideSidechain ? '표시' : '숨기기'}
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {(session.messages ?? []).map(
                (msg: Record<string, unknown>, i: number) => {
                  const raw = msg as Record<string, unknown>;
                  const inner = (raw.message as Record<string, unknown>) ?? raw;
                  const role = (inner.role as string) ?? (raw.type as string);
                  const content = inner.content ?? raw.content;
                  const model = inner.model as string | undefined;
                  const timestamp = raw.timestamp as string | undefined;
                  const isApiError = !!(raw.isApiErrorMessage);
                  const isSidechain = !!(raw.isSidechain);

                  if (hideErrors && isApiError) return null;
                  if (hideSidechain && isSidechain) return null;

                  if (!content || (Array.isArray(content) && content.length === 0)) return null;

                  if (Array.isArray(content) && (content as Array<{ type?: string }>)[0]?.type === 'tool_result') return null;

                  let text: string;
                  if (typeof content === 'string') {
                    const stripped = content.replace(/<[^>]+>[\s\S]*?<\/[^>]+>/g, '').trim();
                    if (!stripped) return null;
                    text = stripped;
                  } else if (Array.isArray(content)) {
                    text = (content as Array<{ type?: string; text?: string }>)
                      .filter((c) => c?.type === 'text' && c?.text)
                      .map((c) => c.text)
                      .join('\n') || '';
                  } else {
                    text = JSON.stringify(content);
                  }

                  if (!text) return null;

                  const isUser = role === 'user';
                  return (
                    <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        <div className={`flex items-center gap-2 flex-wrap ${isUser ? 'flex-row-reverse' : ''}`}>
                          <Badge variant={isUser ? 'secondary' : 'default'} className="text-[10px] px-1.5 py-0">
                            {isUser ? '사용자' : '어시스턴트'}
                          </Badge>
                          {isSidechain && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-primary/15 text-primary border-0">
                              서브에이전트
                            </Badge>
                          )}
                          {isApiError && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-red-500/15 text-red-400 border-0">
                              API 오류
                            </Badge>
                          )}
                          {model && (
                            <span className="text-xs text-muted-foreground">{model.split('-').slice(-2).join('-')}</span>
                          )}
                          {timestamp && (
                            <span className="text-xs text-muted-foreground">{timeAgo(timestamp)}</span>
                          )}
                        </div>
                        <div className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                          isApiError
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : isUser
                              ? 'bg-primary/10 text-foreground'
                              : 'bg-muted text-foreground'
                        }`}>
                          {text.length > 1000 ? text.slice(0, 1000) + '...' : text}
                        </div>
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
