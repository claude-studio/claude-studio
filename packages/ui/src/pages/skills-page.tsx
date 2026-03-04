import * as React from 'react';
import type { SkillInfo } from '@repo/shared';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';
import { Wand2 } from 'lucide-react';
import { PageSpinner } from './page-spinner';

interface SkillsPageProps {
  skills: SkillInfo[];
  isLoading: boolean;
  isError: boolean;
}

function SkillCard({ skill, onClick }: { skill: SkillInfo; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-border/50 bg-card p-4 space-y-2 text-left w-full hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Wand2 className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="text-sm font-medium">{skill.name}</span>
        </div>
        {skill.userInvocable && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
            /{skill.name}
          </Badge>
        )}
      </div>
      {skill.description && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {skill.description}
        </p>
      )}
    </button>
  );
}

export function SkillsPage({ skills, isLoading, isError }: SkillsPageProps) {
  const [selected, setSelected] = React.useState<SkillInfo | null>(null);

  const invocable = skills.filter((s) => s.userInvocable);
  const others = skills.filter((s) => !s.userInvocable);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">스킬</h1>
        <p className="text-muted-foreground text-sm mt-1">
          ~/.claude/skills/ 에 등록된 커스텀 스킬 목록입니다.
        </p>
      </div>

      {isLoading && <PageSpinner />}

      {isError && (
        <p className="text-sm text-destructive">스킬 목록을 불러오는 중 오류가 발생했습니다.</p>
      )}

      {!isLoading && !isError && skills.length === 0 && (
        <p className="text-sm text-muted-foreground">등록된 스킬이 없습니다.</p>
      )}

      {invocable.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            호출 가능 ({invocable.length})
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {invocable.map((skill) => (
              <SkillCard key={skill.name} skill={skill} onClick={() => setSelected(skill)} />
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            기타 ({others.length})
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {others.map((skill) => (
              <SkillCard key={skill.name} skill={skill} onClick={() => setSelected(skill)} />
            ))}
          </div>
        </section>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 pr-6">
              <Wand2 className="h-4 w-4 text-primary shrink-0" />
              {selected?.name}
            </DialogTitle>
            {selected?.userInvocable && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 w-fit mt-2">
                /{selected.name}
              </Badge>
            )}
          </DialogHeader>
          {selected?.description && (
            <p className="text-sm text-muted-foreground border-b border-border/50 pb-4">
              {selected.description}
            </p>
          )}
          <ScrollArea className="max-h-[60vh]">
            <pre className="text-xs leading-relaxed whitespace-pre-wrap text-foreground/80 pr-2">
              {selected?.body || '상세 내용이 없습니다.'}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
