import * as React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useSessions, Input, Card, CardContent } from '@repo/ui';
import { formatCost, formatCostUsd, formatDuration, timeAgo } from '@repo/shared';

function CostValue({ cost }: { cost: number }) {
  return (
    <span>
      {formatCost(cost)}
      <span className="text-xs font-normal text-muted-foreground ml-1">({formatCostUsd(cost)})</span>
    </span>
  );
}
import { Search } from 'lucide-react';

export const Route = createFileRoute('/sessions/')({
  component: SessionsPage,
});

function SessionsPage() {
  const { data: sessions, isLoading } = useSessions();
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    if (!sessions) return [];
    if (!query.trim()) return sessions;
    const q = query.toLowerCase();
    return sessions.filter(
      (s) =>
        s.projectName.toLowerCase().includes(q) ||
        s.projectPath.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q),
    );
  }, [sessions, query]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">세션</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {filtered.length}개 세션
          </p>
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

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {filtered.map((session) => (
              <Link
                key={session.id}
                to="/sessions/$id"
                params={{ id: session.id }}
              >
                <div className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {session.projectName}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <p className="text-xs text-muted-foreground font-mono">
                        {session.id.slice(0, 8)}...
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.messageCount}개 메시지
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDuration(session.duration)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className="text-sm font-medium">
                      <CostValue cost={session.cost} />
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {timeAgo(new Date(session.lastTime))}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-8">
                세션이 없습니다
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
