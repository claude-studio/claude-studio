import { formatCost, formatNumber, formatTokens, getModelShortName, timeAgo } from '@repo/shared';
import { Link } from '@tanstack/react-router';

import { Clock, FolderOpen } from 'lucide-react';

import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { useProjects } from '../hooks/use-data';
import { PageSpinner } from './page-spinner';

export function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
        {projects?.map((project) => (
          <Link key={project.id} to="/projects/$id" params={{ id: project.id }}>
            <Card className="border-border hover:border-primary/30 transition-colors cursor-pointer group h-full">
              <CardContent className="p-4 flex flex-col gap-3 h-full">
                {/* 상단: 이름 + 배지 */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="font-medium text-sm group-hover:text-primary transition-colors leading-tight">
                      {project.name}
                    </p>
                    <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                      {project.models.slice(0, 2).map((model) => (
                        <Badge key={model} variant="secondary" className="text-[10px] px-1.5 py-0">
                          {getModelShortName(model)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{project.path}</p>
                </div>

                {/* 구분선 */}
                <div className="h-px bg-border/50" />

                {/* 하단: 통계 */}
                <div className="grid grid-cols-3 gap-2 mt-auto">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">비용</p>
                    <p className="text-xs font-medium font-mono mt-0.5">{formatCost(project.totalCost)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">토큰</p>
                    <p className="text-xs font-medium font-mono mt-0.5">{formatTokens(project.totalTokens)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">세션</p>
                    <p className="text-xs font-medium font-mono mt-0.5">{formatNumber(project.sessionCount)}개</p>
                  </div>
                </div>

                {/* 마지막 활동 */}
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3 shrink-0" />
                  <span>{timeAgo(project.lastActivity)}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {(!projects || projects.length === 0) && (
          <div className="col-span-3 flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
            <FolderOpen className="h-8 w-8 opacity-30" />
            <p className="text-sm">프로젝트가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
