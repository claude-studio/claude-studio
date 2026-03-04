import { createFileRoute, Link } from '@tanstack/react-router';
import { useProjects, Card, CardContent } from '@repo/ui';
import { formatCost, formatCostUsd, formatTokens, timeAgo } from '@repo/shared';

function CostValue({ cost }: { cost: number }) {
  return (
    <span>
      {formatCost(cost)}
      <span className="text-xs font-normal text-muted-foreground ml-1">({formatCostUsd(cost)})</span>
    </span>
  );
}
import { FolderOpen } from 'lucide-react';

export const Route = createFileRoute('/projects/')({
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">프로젝트</h1>
        <p className="text-muted-foreground text-sm mt-1">{projects?.length ?? 0}개 프로젝트</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <Link key={project.id} to="/projects/$id" params={{ id: encodeURIComponent(project.id) }}>
            <Card className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <FolderOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{project.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{project.path}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-sm font-semibold"><CostValue cost={project.totalCost} /></p>
                    <p className="text-[10px] text-muted-foreground">비용</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{project.sessionCount}</p>
                    <p className="text-[10px] text-muted-foreground">세션</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{formatTokens(project.totalTokens)}</p>
                    <p className="text-[10px] text-muted-foreground">토큰</p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-3">
                  {timeAgo(new Date(project.lastActivity))}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
