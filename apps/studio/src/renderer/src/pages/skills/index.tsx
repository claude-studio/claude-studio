import { type SkillInfo } from '@repo/shared';
import { Badge, Dialog, DialogContent, DialogHeader, DialogTitle, ScrollArea } from '@repo/ui';
import { Wand2 } from 'lucide-react';
import { useState } from 'react';

function PageSpinner() {
  return (
    <div className="flex items-center justify-center h-full min-h-96">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
    </div>
  );
}

function SkillCard({ skill, onClick }: { skill: SkillInfo; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="card-glass relative rounded-xl border overflow-hidden p-5 space-y-2.5 text-left w-full hover:border-primary/30 transition-all duration-200 group cursor-pointer"
    >
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/40 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Wand2 className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="text-sm font-medium">{skill.name}</span>
        </div>
        {skill.userInvocable && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0 font-mono">
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

interface SkillsPageProps {
  skills: SkillInfo[];
  isLoading: boolean;
  isError: boolean;
}

export function SkillsPage({ skills, isLoading, isError }: SkillsPageProps) {
  const [selected, setSelected] = useState<SkillInfo | null>(null);

  const invocable = skills.filter((s) => s.userInvocable);
  const others = skills.filter((s) => !s.userInvocable);

  return (
    <div className="space-y-5">
      {isLoading && <PageSpinner />}

      {isError && (
        <p className="text-sm text-destructive">스킬 목록을 불러오는 중 오류가 발생했습니다.</p>
      )}

      {!isLoading && !isError && skills.length === 0 && (
        <p className="text-sm text-muted-foreground">등록된 스킬이 없습니다.</p>
      )}

      {invocable.length > 0 && (
        <section className="space-y-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
            호출 가능 ({invocable.length})
          </p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {invocable.map((skill) => (
              <SkillCard key={skill.name} skill={skill} onClick={() => setSelected(skill)} />
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="space-y-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
            기타 ({others.length})
          </p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {others.map((skill) => (
              <SkillCard key={skill.name} skill={skill} onClick={() => setSelected(skill)} />
            ))}
          </div>
        </section>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl card-glass border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 pr-6">
              <Wand2 className="h-4 w-4 text-primary shrink-0" />
              <span className="font-semibold">{selected?.name}</span>
              {selected?.userInvocable && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">
                  /{selected.name}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {selected?.description && (
            <p className="text-sm text-muted-foreground border-b border-border pb-4">
              {selected.description}
            </p>
          )}
          <ScrollArea className="max-h-[60vh]">
            <pre className="text-xs leading-relaxed whitespace-pre-wrap text-foreground/80 pr-2 font-mono">
              {selected?.body || '상세 내용이 없습니다.'}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
