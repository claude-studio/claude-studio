import { type AppLocale, useAppLocale } from '@repo/i18n';
import { type ClaudeSettings } from '@repo/shared';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';

import { Bot, Download, Puzzle, ShieldCheck, Trash2, Wifi } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from '../../widgets/language-switcher';

interface DataPageProps {
  settings: ClaudeSettings | undefined;
  pluginInstalled?: boolean;
  pluginLoading?: boolean;
  onInstallPlugin?: () => void;
  onUninstallPlugin?: () => void;
}

export function DataPage({
  settings,
  pluginInstalled,
  pluginLoading,
  onInstallPlugin,
  onUninstallPlugin,
}: DataPageProps) {
  const { locale } = useAppLocale();
  const { t: tSettings } = useTranslation('settings');
  const { t: tStudio } = useTranslation('studio');
  const languageLabels: Record<AppLocale, string> = {
    en: tSettings('english'),
    ko: tSettings('korean'),
  };
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
              {tStudio('data.currentModel')}
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
              {tStudio('data.permissionMode')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <p className="text-base font-semibold">
              {settings?.permissions?.defaultMode
                ? tStudio(`permissions.${settings.permissions.defaultMode}`, {
                    defaultValue: settings.permissions.defaultMode,
                  })
                : '-'}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader className="px-5 pt-5 pb-3">
            <CardTitle className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Puzzle className="h-4 w-4" />
              {tStudio('data.enabledPlugins')}
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
              <p className="text-sm text-muted-foreground">{tStudio('data.noEnabledPlugins')}</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 xl:col-span-3">
          <CardHeader className="px-5 pt-5 pb-3">
            <CardTitle className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {tStudio('data.languageTitle')}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {tStudio('data.languageDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0 space-y-4">
            <div className="rounded-lg border border-border/70 bg-muted/20 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {tStudio('data.currentLanguageLabel')}
              </p>
              <p className="mt-2 text-sm font-semibold" lang={locale}>
                {languageLabels[locale]}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{tStudio('language.helper')}</p>
            </div>
            <LanguageSwitcher mode="settings" />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 xl:col-span-3">
          <CardHeader className="px-5 pt-5 pb-3">
            <CardTitle className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Wifi className="h-4 w-4" />
              {tStudio('data.liveMonitoringPlugin')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant={pluginInstalled ? 'default' : 'secondary'} className="text-xs">
                    {pluginInstalled ? tStudio('data.installed') : tStudio('data.notInstalled')}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tStudio('data.liveMonitoringDescription')}
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
                    {tStudio('data.remove')}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={pluginLoading}
                    onClick={onInstallPlugin}
                    className="gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {tStudio('data.install')}
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
