import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { useSessions } from '../hooks/use-data';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  formatCost,
  formatTokens,
  formatNumber,
  timeAgo,
  formatDuration,
  getModelShortName,
} from '@repo/shared';
import { Search } from 'lucide-react';
import { PageSpinner } from './page-spinner';

export function SessionsPage() {
  const { data: sessions, isLoading } = useSessions();
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    if (!sessions) return [];
    const nonZero = sessions.filter((s) => s.cost > 0);
    if (!query.trim()) return nonZero;
    const q = query.toLowerCase();
    return nonZero.filter(
      (s) =>
        s.projectName.toLowerCase().includes(q) ||
        s.projectPath.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q),
    );
  }, [sessions, query]);

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">세션</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length}개 세션</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="세션 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.map((session) => (
          <Link key={session.id} to="/sessions/$id" params={{ id: session.id }}>
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
                          {getModelShortName(m)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">세션이 없습니다</p>
        )}
      </div>
    </div>
  );
}
