import { useState } from 'react';

import type { InboxMessage } from '@repo/shared';
import { getModelShortName } from '@repo/shared';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';
import { useTeams } from '../hooks/use-data';
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

const MESSAGE_TYPE_LABEL: Record<string, string> = {
  permission_request: '권한 요청',
  task_assignment: '태스크 배정',
  permission_response: '권한 응답',
  shutdown_request: '종료 요청',
  shutdown_response: '종료 응답',
};

interface ParsedMessage {
  typeLabel: string | null;
  body: string;
}

function parseMessageText(text: string): ParsedMessage {
  try {
    const parsed = JSON.parse(text) as Record<string, unknown>;
    if (parsed && typeof parsed.type === 'string') {
      const typeLabel = MESSAGE_TYPE_LABEL[parsed.type] ?? parsed.type;
      const body =
        typeof parsed.content === 'string'
          ? parsed.content
          : typeof parsed.message === 'string'
            ? parsed.message
            : typeof parsed.error === 'string'
              ? parsed.error
              : JSON.stringify(parsed, null, 2);
      return { typeLabel, body };
    }
  } catch {
    /* not JSON */
  }
  return { typeLabel: null, body: text };
}

function InboxDialog({
  agentName,
  messages,
  open,
  onOpenChange,
}: {
  agentName: string;
  messages: InboxMessage[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl flex flex-col" style={{ maxHeight: '80vh' }}>
        <DialogHeader>
          <DialogTitle className="pr-6">
            {agentName}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              inbox ({messages.length})
            </span>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">메시지가 없습니다</p>
          ) : (
            <div className="space-y-2 pr-2">
              {messages.map((msg, idx) => {
                const { typeLabel, body } = parseMessageText(msg.text);
                return (
                  <div
                    key={idx}
                    className="rounded-md border border-border/40 bg-muted/30 p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{msg.from}</span>
                        {typeLabel && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                            {typeLabel}
                          </Badge>
                        )}
                        {msg.read === false && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(msg.timestamp).toLocaleString('ko-KR', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap break-words text-foreground/80">
                      {body}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function TeamsPage() {
  const { data: teams, isLoading, isError, error } = useTeams();
  const [selectedInbox, setSelectedInbox] = useState<{
    agentName: string;
    messages: InboxMessage[];
  } | null>(null);

  if (isLoading) return <PageSpinner />;

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">팀</h1>
          <p className="text-destructive text-sm mt-1">
            팀 데이터를 불러오는 중 오류가 발생했습니다: {String(error)}
          </p>
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

      {teams.map(({ team, tasks, inboxes = {} }) => {
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
                {team.members.map((m) => {
                  const memberMessages = inboxes[m.name] ?? [];
                  const unreadCount = memberMessages.filter((msg) => msg.read === false).length;
                  return (
                    <button
                      key={m.agentId}
                      onClick={() =>
                        setSelectedInbox({ agentName: m.name, messages: memberMessages })
                      }
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-xs hover:bg-muted/70 transition-colors cursor-pointer"
                    >
                      <span className="font-medium">{m.name}</span>
                      {m.model && (
                        <span className="text-muted-foreground">{getModelShortName(m.model)}</span>
                      )}
                      {unreadCount > 0 && (
                        <span className="ml-0.5 text-blue-500 font-semibold">{unreadCount}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardHeader>

            {tasks.length > 0 && (
              <CardContent className="pt-0">
                <Accordion type="single" collapsible className="space-y-1">
                  {tasks.map((task) => (
                    <AccordionItem
                      key={task.id}
                      value={task.id}
                      className="rounded-md border border-border/30 bg-muted/40 px-3 [&:not(:last-child)]:mb-1.5"
                    >
                      <AccordionTrigger className="py-2 hover:no-underline gap-2">
                        <span className="text-xs text-muted-foreground w-4 shrink-0">
                          #{task.id}
                        </span>
                        <span className="text-sm flex-1 truncate text-left">{task.subject}</span>
                        <div className="flex items-center gap-2 shrink-0 ml-auto">
                          {task.owner && (
                            <span className="text-xs text-muted-foreground">{task.owner}</span>
                          )}
                          <Badge
                            variant={STATUS_VARIANT[task.status] ?? 'outline'}
                            className="text-xs"
                          >
                            {STATUS_LABEL[task.status] ?? task.status}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-1 pb-3">
                        {task.description ? (
                          <pre className="text-xs leading-relaxed whitespace-pre-wrap break-words text-foreground/70 font-sans">
                            {task.description}
                          </pre>
                        ) : (
                          <p className="text-xs text-muted-foreground">상세 내용이 없습니다.</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            )}
          </Card>
        );
      })}

      {selectedInbox && (
        <InboxDialog
          agentName={selectedInbox.agentName}
          messages={selectedInbox.messages}
          open={!!selectedInbox}
          onOpenChange={(open) => {
            if (!open) setSelectedInbox(null);
          }}
        />
      )}
    </div>
  );
}
