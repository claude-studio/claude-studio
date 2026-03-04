import { createFileRoute, Link } from '@tanstack/react-router';
import {
  useProjectSessions,
  useProjects,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui';
import { formatCost, formatCostUsd, formatTokens, timeAgo } from '@repo/shared';

function CostValue({ cost }: { cost: number }) {
  return (
    <span>
      {formatCost(cost)}
      <span className="text-xs font-normal text-muted-foreground ml-1">({formatCostUsd(cost)})</span>
    </span>
  );
}
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/projects/$id')({
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { id } = Route.useParams();
  const projectId = decodeURIComponent(id);
  const { data: projects } = useProjects();
  const { data: sessions, isLoading } = useProjectSessions(projectId);

  const project = projects?.find((p) => p.id === projectId);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/projects"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">{project?.name ?? projectId}</h1>
          <p className="text-muted-foreground text-sm mt-1 font-mono">{project?.path}</p>
        </div>
      </div>

      {project && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">총 비용</p>
              <p className="text-xl font-semibold mt-1">
                <CostValue cost={project.totalCost} />
              </p>
            </CardContent>
          </Card>
          {[
            { label: '총 토큰', value: formatTokens(project.totalTokens) },
            { label: '세션', value: String(project.sessionCount) },
            { label: '메시지', value: String(project.messageCount) },
          ].map(({ label, value }) => (
            <Card key={label} className="border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-semibold mt-1">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">세션 ({sessions?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sessions?.map((session) => (
              <Link key={session.id} to="/sessions/$id" params={{ id: session.id }}>
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-mono">{session.id.slice(0, 8)}...</p>
                    <p className="text-xs text-muted-foreground">
                      {timeAgo(new Date(session.lastTime))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium"><CostValue cost={session.cost} /></p>
                    <p className="text-xs text-muted-foreground">{session.messageCount}개 메시지</p>
                  </div>
                </div>
              </Link>
            ))}
            {(!sessions || sessions.length === 0) && (
              <p className="text-muted-foreground text-sm text-center py-4">세션이 없습니다</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
