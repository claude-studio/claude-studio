import { createFileRoute, Link } from '@tanstack/react-router';
import {
  useSessionDetail,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  ModelBreakdown,
} from '@repo/ui';
import { formatCost, formatTokens, formatNumber, timeAgo, formatDuration } from '@repo/shared';
import * as React from 'react';
import { AlertCircle } from 'lucide-react';

export const Route = createFileRoute('/sessions/$id')({
  component: SessionDetailPage,
});

function SessionDetailPage() {
  const { id } = Route.useParams();
  const { data: session, isLoading, isError } = useSessionDetail(id);
  const [hideErrors, setHideErrors] = React.useState(false);
  const [hideSidechain, setHideSidechain] = React.useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">세션을 불러오는 중 오류가 발생했습니다.</span>
      </div>
    );
  }

  if (!session) {
    return <div className="text-muted-foreground text-sm">세션을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/sessions"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; 세션 목록
        </Link>
        <h1 className="text-2xl font-semibold mt-2">{session.projectName}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {timeAgo(new Date(session.lastTime))} &middot;{' '}
          {formatDuration(session.duration)} &middot; {formatCost(session.cost)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">비용</p>
            <p className="text-lg font-semibold">{formatCost(session.cost)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">토큰</p>
            <p className="text-lg font-semibold">
              {formatTokens(session.inputTokens + session.outputTokens)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">메시지</p>
            <p className="text-lg font-semibold">
              {formatNumber(session.messageCount)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">툴 호출</p>
            <p className="text-lg font-semibold">
              {formatNumber(session.toolCallCount)}
            </p>
          </CardContent>
        </Card>
      </div>

      {session.modelBreakdown.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              모델별 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ModelBreakdown data={session.modelBreakdown} />
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">대화 내용</CardTitle>
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
          <div className="space-y-3">
            {[...session.messages].reverse().map((msg, i) => {
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

              // 툴 결과(tool_result) 메시지는 건너뜀
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
                      <Badge
                        variant={isUser ? 'secondary' : 'default'}
                        className="text-xs"
                      >
                        {isUser ? '사용자' : '어시스턴트'}
                      </Badge>
                      {isSidechain && (
                        <Badge variant="secondary" className="text-xs bg-primary/15 text-primary border-0">
                          서브에이전트
                        </Badge>
                      )}
                      {isApiError && (
                        <Badge variant="secondary" className="text-xs bg-red-500/15 text-red-400 border-0">
                          API 오류
                        </Badge>
                      )}
                      {model && (
                        <span className="text-xs text-muted-foreground">{model}</span>
                      )}
                      {timestamp && (
                        <span className="text-xs text-muted-foreground">{timeAgo(timestamp)}</span>
                      )}
                    </div>
                    <div className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                      isApiError
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : isUser
                          ? 'bg-primary/15 text-foreground'
                          : 'bg-muted text-foreground'
                    }`}>
                      {text.length > 500 ? text.slice(0, 500) + '...' : text}
                    </div>
                  </div>
                </div>
              );
            })}
            {session.messages.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">
                메시지가 없습니다
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
