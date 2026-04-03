import { useMemo } from 'react';

import { type AppLocale, DEFAULT_LOCALE, SUPPORTED_LOCALES, useAppLocale } from '@repo/i18n';
import { Button, cn } from '@repo/ui';

import { useTranslation } from 'react-i18next';

type LanguageSwitcherProps = {
  mode?: 'compact' | 'settings';
};

export function LanguageSwitcher({ mode = 'compact' }: LanguageSwitcherProps) {
  const { isChanging, locale, setLocale } = useAppLocale();
  const { t: tSettings } = useTranslation('settings');
  const { t: tStudio } = useTranslation('studio');
  const languageLabels = useMemo<Record<AppLocale, string>>(
    () => ({
      en: tSettings('english'),
      ko: tSettings('korean'),
    }),
    [tSettings],
  );

  const options = useMemo(
    () =>
      SUPPORTED_LOCALES.map((code) => ({
        code,
        description:
          code === 'en'
            ? tStudio('language.englishDescription')
            : tStudio('language.koreanDescription'),
        label: languageLabels[code],
      })),
    [languageLabels, tStudio],
  );

  if (mode === 'settings') {
    return (
      <div
        role="radiogroup"
        aria-label={tStudio('data.languageTitle')}
        className="grid gap-2 sm:grid-cols-2"
      >
        {options.map((option) => {
          const isCurrent = option.code === locale;

          return (
            <button
              key={option.code}
              type="button"
              role="radio"
              aria-checked={isCurrent}
              aria-current={isCurrent ? 'true' : undefined}
              aria-disabled={isChanging ? 'true' : undefined}
              lang={option.code}
              onClick={() => {
                if (isChanging || isCurrent) {
                  return;
                }

                void setLocale(option.code);
              }}
              aria-label={
                isCurrent
                  ? tStudio('shell.currentLanguage', {
                      language: languageLabels[option.code],
                    })
                  : tStudio('language.switchTo', {
                      language: languageLabels[option.code],
                    })
              }
              className={cn(
                'rounded-lg border px-4 py-3 text-left transition-colors',
                isCurrent
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40 hover:bg-muted/40',
                isChanging && 'opacity-70',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {option.description}
                  </p>
                </div>
                <span
                  className={cn(
                    'rounded-full border px-2 py-0.5 text-[11px] font-medium',
                    isCurrent
                      ? 'border-primary/30 bg-primary/10 text-primary'
                      : 'border-transparent text-muted-foreground',
                  )}
                >
                  {isCurrent ? tStudio('language.current') : option.code.toUpperCase()}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  const nextLocale = SUPPORTED_LOCALES.find((code) => code !== locale) ?? DEFAULT_LOCALE;
  const nextLanguage = languageLabels[nextLocale];

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      lang={nextLocale}
      disabled={isChanging}
      onClick={() => void setLocale(nextLocale)}
      aria-label={tStudio('shell.changeLanguage', { language: nextLanguage })}
      className="h-8 min-w-24 rounded-full px-3 text-xs font-medium"
    >
      {nextLanguage}
    </Button>
  );
}
