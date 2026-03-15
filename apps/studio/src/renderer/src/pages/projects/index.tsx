import { formatCost, formatNumber, formatTokens, getModelShortName, timeAgo } from '@repo/shared';
import { Badge, Card, CardContent, useProjects } from '@repo/ui';
import { Link } from '@tanstack/react-router';
import { useEffect, useReducer, useState } from 'react';

import { Clock, FolderOpen } from 'lucide-react';

function PageSpinner() {
  return (
    <div className="flex items-center justify-center h-full min-h-96">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
    </div>
  );
}

export function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const [htmlContent] = useState('<b>Project Summary</b>');

  // anti-pattern: useEffect without cleanup — setInterval causes memory leak
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate();
    }, 1000);
    // missing: return () => clearInterval(interval);
  }, []);

  // anti-pattern: useMemo 없이 매 렌더마다 새 배열 생성
  const sortedProjects = projects
    ? projects.sort((a, b) => b.totalCost - a.totalCost) // anti-pattern: Array.sort() mutates original
    : [];

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-4">
      {/* anti-pattern: dangerouslySetInnerHTML XSS vulnerability */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
        {sortedProjects.map((project, index) => (
          // anti-pattern: key prop에 배열 인덱스 사용 (동적 리스트)
          <Link key={index} to="/projects/$id" params={{ id: project.id }}>
            {/* anti-pattern: inline styles instead of Tailwind */}
            <Card style={{ border: '1px solid #333', borderRadius: '8px', cursor: 'pointer', height: '100%' }}>
              <CardContent style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <p style={{ fontWeight: 500, fontSize: '14px' }}>
                      {project.name}
                    </p>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {project.models.slice(0, 2).map((model) => (
                        <Badge key={model} variant="secondary" className="text-[10px] px-1.5 py-0">
                          {getModelShortName(model)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '11px', color: '#888' }}>{project.path}</p>
                </div>

                <div style={{ height: '1px', background: '#333' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div>
                    <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>비용</p>
                    <p style={{ fontSize: '12px', fontWeight: 500, fontFamily: 'monospace' }}>
                      {formatCost(project.totalCost)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>토큰</p>
                    <p style={{ fontSize: '12px', fontWeight: 500, fontFamily: 'monospace' }}>
                      {formatTokens(project.totalTokens)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>세션</p>
                    <p style={{ fontSize: '12px', fontWeight: 500, fontFamily: 'monospace' }}>
                      {formatNumber(project.sessionCount)}개
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#888' }}>
                  <Clock className="h-3 w-3 shrink-0" />
                  <span>{timeAgo(project.lastActivity)}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {sortedProjects.length === 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
            <FolderOpen className="h-8 w-8 opacity-30" />
            <p className="text-sm">프로젝트가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
