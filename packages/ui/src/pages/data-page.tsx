import type { ClaudeSettings } from '@repo/shared';

import { Bot, Puzzle, ShieldCheck } from 'lucide-react';

import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

interface DataPageProps {
  settings: ClaudeSettings | undefined;
}

const modeLabel: Record<string, string> = {
  acceptEdits: '자동 수락',
  default: '기본',
  bypassPermissions: '권한 우회',
};

export function DataPage({ settings }: DataPageProps) {
  const plugins = settings?.enabledPlugins
    ? Object.entries(settings.enabledPlugins)
        .filter(([, v]) => v)
        .map(([k]) => k.split('@')[0])
    : [];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="px-5 pt-5 pb-3">
            <CardTitle className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Bot className="h-4 w-4" />
              현재 모델
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <p className="text-base font-semibold font-mono">{settings?.model ?? '-'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-5 pt-5 pb-3">
            <CardTitle className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              권한 모드
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <p className="text-base font-semibold">
              {settings?.permissions?.defaultMode
                ? (modeLabel[settings.permissions.defaultMode] ?? settings.permissions.defaultMode)
                : '-'}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader className="px-5 pt-5 pb-3">
            <CardTitle className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Puzzle className="h-4 w-4" />
              활성화된 플러그인
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            {plugins.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {plugins.map((name) => (
                  <Badge key={name} variant="secondary" className="text-xs font-mono">
                    {name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">활성화된 플러그인 없음</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
