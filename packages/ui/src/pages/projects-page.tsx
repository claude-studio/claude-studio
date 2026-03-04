import { Link } from '@tanstack/react-router';
import { useProjects } from '../hooks/use-data';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { formatCost, formatTokens, formatNumber, timeAgo, getModelShortName } from '@repo/shared';
import { PageSpinner } from './page-spinner';

export function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">프로젝트</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {projects?.length ?? 0}개 프로젝트
        </p>
      </div>

      <div className="grid gap-4">
        {projects?.map((project) => (
          <Link key={project.id} to="/projects/$id" params={{ id: project.id }}>
            <Card className="border-border/50 hover:border-border transition-colors cursor-pointer">
              <CardContent className="p-4 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{project.name}</p>
                  {project.models.slice(0, 3).map((model) => (
                    <Badge key={model} variant="secondary" className="text-xs">
                      {getModelShortName(model)}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground truncate">{project.path}</p>
                <p className="text-xs text-muted-foreground">
                  {formatCost(project.totalCost)} · {formatTokens(project.totalTokens)} 토큰 · {formatNumber(project.sessionCount)}개 세션 · {timeAgo(project.lastActivity)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {(!projects || projects.length === 0) && (
          <p className="text-muted-foreground text-sm text-center py-8">
            프로젝트가 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
