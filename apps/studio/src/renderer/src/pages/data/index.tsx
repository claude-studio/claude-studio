import { type ClaudeSettings } from '@repo/shared';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Bot, Download, Puzzle, ShieldCheck, Trash2, Wifi } from 'lucide-react';

interface DataPageProps {
  settings: ClaudeSettings | undefined;
  pluginInstalled?: boolean;
  pluginLoading?: boolean;
  onInstallPlugin?: () => void;
  onUninstallPlugin?: () => void;
}

const modeLabel: Record<string, string> = {
  acceptEdits: '자동 수락',
  default: '기본',
  bypassPermissions: '권한 우회',
};

export function DataPage({
  settings,
  pluginInstalled,
  pluginLoading,
  onInstallPlugin,
  onUninstallPlugin,
}: DataPageProps) {
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

        <Card className="md:col-span-2 xl:col-span-3">
          <CardHeader className="px-5 pt-5 pb-3">
            <CardTitle className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Wifi className="h-4 w-4" />
              라이브 모니터링 플러그인
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant={pluginInstalled ? 'default' : 'secondary'} className="text-xs">
                    {pluginInstalled ? '설치됨' : '미설치'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Claude Code Hooks를 통해 실시간 세션 정보를 수신합니다.
                  <br />
                  설치 후 Claude Code를 재시작하면 라이브 모니터링이 활성화됩니다.
                </p>
              </div>
              <div className="shrink-0">
                {pluginInstalled ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={pluginLoading}
                    onClick={onUninstallPlugin}
                    className="gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    제거
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={pluginLoading}
                    onClick={onInstallPlugin}
                    className="gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    설치
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
