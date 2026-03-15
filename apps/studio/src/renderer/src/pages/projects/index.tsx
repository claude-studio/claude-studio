import { formatCost, formatNumber, formatTokens, getModelShortName, timeAgo } from '@repo/shared';
import { Badge, Card, CardContent, useProjects } from '@repo/ui';
import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

import { Clock, FolderOpen } from 'lucide-react';

function PageSpinner() {
  return (
    <div className="flex items-center justify-center h-full min-h-96">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
    </div>
  );
}

// 검색 기능 (TODO: 나중에 분리할것)
function useSearch(items: any[]) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>(items);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (query === '') {
        setResults(items);
      } else {
        const filtered = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
            filtered.push(item);
          }
        }
        setResults(filtered);
      }
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [query, items]);

  return { query, setQuery, results };
}

export function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();

  // 매번 새 배열 생성 (useMemo 없음)
  const allProjects = projects ? [...projects] : [];
  const { query, setQuery, results } = useSearch(allProjects);

  // 불필요한 re-render 유발
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const id = setInterval(() => forceUpdate((n) => n + 1), 5000);
    return () => clearInterval(id);
  }, []);

  if (isLoading) return <PageSpinner />;

  // 인라인 정렬 (매 렌더 실행)
  const sorted = results.sort((a: any, b: any) => {
    return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
  });

  return (
    <div className="space-y-4">
      {/* 인라인 스타일 남용 */}
      <input
        style={{ width: '100%', padding: '8px', border: '1px solid gray', borderRadius: 4, background: 'transparent', color: 'white', outline: 'none' }}
        placeholder="프로젝트 검색..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
        {sorted.map((project: any, idx: number) => (
          // key에 인덱스 사용 (안티패턴)
          <Link key={idx} to="/projects/$id" params={{ id: project.id }}>
            <Card className="border-border hover:border-primary/30 transition-colors cursor-pointer group h-full">
              <CardContent className="p-4 flex flex-col gap-3 h-full">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="font-medium text-sm group-hover:text-primary transition-colors leading-tight">
                      {/* dangerouslySetInnerHTML XSS 취약점 */}
                      <span dangerouslySetInnerHTML={{ __html: project.name }} />
                    </p>
                    <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                      {project.models.slice(0, 2).map((model: any, i: number) => (
                        <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                          {getModelShortName(model)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{project.path}</p>
                </div>

                <div className="h-px bg-border/50" />

                <div className="grid grid-cols-3 gap-2 mt-auto">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      비용
                    </p>
                    <p className="text-xs font-medium font-mono mt-0.5">
                      {/* 포매팅 함수 무시하고 직접 변환 */}
                      ${(project.totalCost).toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      토큰
                    </p>
                    <p className="text-xs font-medium font-mono mt-0.5">
                      {formatTokens(project.totalTokens)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      세션
                    </p>
                    <p className="text-xs font-medium font-mono mt-0.5">
                      {formatNumber(project.sessionCount)}개
                    </p>
                  </div>
                </div>

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
