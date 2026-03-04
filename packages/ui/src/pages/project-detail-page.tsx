import type { SessionInfo } from '@repo/shared';
import {
  formatCost,
  formatDuration,
  formatNumber,
  formatTokens,
  getModelShortName,
} from '@repo/shared';
import { Link } from '@tanstack/react-router';

import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { useProjectSessions } from '../hooks/use-data';
import { PageSpinner } from './page-spinner';

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

function groupByDate(sessions: SessionInfo[]): { date: string; sessions: SessionInfo[] }[] {
  const map = new Map<string, SessionInfo[]>();
  for (const s of [...sessions].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
  )) {
    const d = new Date(s.startTime);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }
  return Array.from(map.entries()).map(([date, sessions]) => ({ date, sessions }));
}

function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

interface ProjectDetailPageProps {
  id: string;
}

export function ProjectDetailPage({ id }: ProjectDetailPageProps) {
  const { data: sessions, isLoading } = useProjectSessions(id);

  if (isLoading) return <PageSpinner />;

  const projectName = sessions?.[0]?.projectName ?? '프로젝트';
  const grouped = groupByDate(sessions ?? []);

  return (
    <div className="space-y-6">
      <div>
        <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; 프로젝트 목록
        </Link>
        <h1 className="text-2xl font-semibold mt-2">{projectName}</h1>
        <p className="text-muted-foreground text-sm mt-1">{sessions?.length ?? 0}개 세션</p>
      </div>

      {grouped.length === 0 && (
        <p className="text-muted-foreground text-sm text-center py-8">
          이 프로젝트에 세션이 없습니다
        </p>
      )}

      <div className="space-y-6">
        {grouped.map(({ date, sessions: daySessions }) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-border/50" />
              <span className="text-xs text-muted-foreground font-medium px-2">
                {formatDateLabel(date)}
              </span>
              <div className="h-px flex-1 bg-border/50" />
            </div>

            <div className="relative pl-6 space-y-3">
              {daySessions.map((session, idx) => (
                <Link
                  key={session.id}
                  to="/sessions/$id"
                  params={{ id: session.id }}
                  className="block"
                >
                  <div className="relative">
                    <div className="absolute -left-[22px] top-2.5 h-3 w-3 rounded-full bg-primary/20 border-2 border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]" />
                    {idx < daySessions.length - 1 && (
                      <div className="absolute -left-[16px] top-[22px] bottom-[-14px] w-px bg-border" />
                    )}

                    <Card className="border-border/50 hover:border-primary/40 hover:bg-muted/20 transition-colors cursor-pointer">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-muted-foreground font-mono">
                                {formatTime(session.startTime)}
                              </span>
                              <span className="text-xs text-muted-foreground">·</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDuration(session.duration)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              {session.models.slice(0, 2).map((m) => (
                                <Badge
                                  key={m}
                                  variant="secondary"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  {getModelShortName(m)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right shrink-0 space-y-0.5">
                            <p className="text-sm font-semibold">{formatCost(session.cost)}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatTokens(session.inputTokens + session.outputTokens)} 토큰
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatNumber(session.messageCount)}개 메시지
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
