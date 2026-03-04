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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">설정</h1>
        <p className="text-muted-foreground text-sm mt-1">
          로컬 머신의 ~/.claude/ 디렉토리에서 직접 데이터를 읽어옵니다.
        </p>
      </div>

      <div className="grid gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Bot className="h-4 w-4" />
              현재 모델
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base font-semibold">{settings?.model ?? '-'}</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4" />
              권한 모드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base font-semibold">
              {settings?.permissions?.defaultMode
                ? (modeLabel[settings.permissions.defaultMode] ?? settings.permissions.defaultMode)
                : '-'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Puzzle className="h-4 w-4" />
              활성화된 플러그인
            </CardTitle>
          </CardHeader>
          <CardContent>
            {plugins.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {plugins.map((name) => (
                  <Badge key={name} variant="secondary" className="text-xs">
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
