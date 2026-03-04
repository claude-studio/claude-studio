import { createFileRoute, Link } from '@tanstack/react-router';
import { useSessions, Card, CardContent, Badge } from '@repo/ui';
import { formatCost, formatTokens, formatNumber, timeAgo, formatDuration } from '@repo/shared';

export const Route = createFileRoute('/sessions/')({
  component: SessionsPage,
});

function SessionsPage() {
  const { data: sessions, isLoading } = useSessions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">세션</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {sessions?.length ?? 0}개 세션
        </p>
      </div>

      <div className="grid gap-3">
        {sessions?.map((session) => (
          <Link
            key={session.id}
            to="/sessions/$id"
            params={{ id: session.id }}
          >
            <Card className="border-border/50 hover:border-border transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{session.projectName}</p>
                    <p className="text-xs text-muted-foreground">
                      {timeAgo(new Date(session.lastTime))} &middot;{' '}
                      {formatDuration(session.duration)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{formatCost(session.cost)}</span>
                    <span className="text-muted-foreground">
                      {formatTokens(session.inputTokens + session.outputTokens)} 토큰
                    </span>
                    <span className="text-muted-foreground">
                      {formatNumber(session.messageCount)}개 메시지
                    </span>
                    <div className="flex gap-1">
                      {session.models.slice(0, 2).map((m) => (
                        <Badge key={m} variant="secondary" className="text-xs">
                          {m}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {(!sessions || sessions.length === 0) && (
          <p className="text-muted-foreground text-sm text-center py-8">
            세션이 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
