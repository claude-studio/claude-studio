import { useTeams } from '../hooks/use-data';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { getModelShortName } from '@repo/shared';
import { PageSpinner } from './page-spinner';

const STATUS_LABEL: Record<string, string> = {
  pending: '대기',
  in_progress: '진행중',
  completed: '완료',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  pending: 'outline',
  in_progress: 'default',
  completed: 'secondary',
};

export function TeamsPage() {
  const { data: teams, isLoading, isError, error } = useTeams();

  if (isLoading) return <PageSpinner />;

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">팀</h1>
          <p className="text-destructive text-sm mt-1">팀 데이터를 불러오는 중 오류가 발생했습니다: {String(error)}</p>
        </div>
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">팀</h1>
          <p className="text-muted-foreground text-sm mt-1">활성화된 팀이 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">팀</h1>
        <p className="text-muted-foreground text-sm mt-1">{teams.length}개 팀</p>
      </div>

      {teams.map(({ team, tasks }) => {
        const pending = tasks.filter((t) => t.status === 'pending').length;
        const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
        const completed = tasks.filter((t) => t.status === 'completed').length;

        return (
          <Card key={team.name} className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{team.name}</CardTitle>
                  {team.description && (
                    <p className="text-xs text-muted-foreground mt-1">{team.description}</p>
                  )}
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span className="text-yellow-500">{inProgress}개 진행중</span>
                  <span>·</span>
                  <span>{pending}개 대기</span>
                  <span>·</span>
                  <span className="text-green-500">{completed}개 완료</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {team.members.map((m) => (
                  <div
                    key={m.agentId}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-xs"
                  >
                    <span className="font-medium">{m.name}</span>
                    {m.model && (
                      <span className="text-muted-foreground">{getModelShortName(m.model)}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardHeader>

            {tasks.length > 0 && (
              <CardContent className="pt-0">
                <div className="space-y-1.5">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 py-2 px-3 rounded-md bg-muted/40 border border-border/30"
                    >
                      <span className="text-xs text-muted-foreground w-4 shrink-0">#{task.id}</span>
                      <span className="text-sm flex-1 truncate">{task.subject}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        {task.owner && (
                          <span className="text-xs text-muted-foreground">{task.owner}</span>
                        )}
                        <Badge variant={STATUS_VARIANT[task.status] ?? 'outline'} className="text-xs">
                          {STATUS_LABEL[task.status] ?? task.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
