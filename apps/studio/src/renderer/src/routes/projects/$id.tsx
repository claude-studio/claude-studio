import { createFileRoute, Link } from '@tanstack/react-router';
import { useProjectSessions, Card, CardContent } from '@repo/ui';
import { formatCost, formatTokens, formatNumber, timeAgo, formatDuration } from '@repo/shared';

export const Route = createFileRoute('/projects/$id')({
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { id } = Route.useParams();
  const { data: sessions, isLoading } = useProjectSessions(id);

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
        <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; 프로젝트 목록
        </Link>
        <h1 className="text-2xl font-semibold mt-2">프로젝트 세션</h1>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {(!sessions || sessions.length === 0) && (
          <p className="text-muted-foreground text-sm text-center py-8">
            이 프로젝트에 세션이 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
