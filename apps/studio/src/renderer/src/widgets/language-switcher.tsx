import { useMemo } from 'react';

import { useAppLocale } from '@repo/i18n';
import { Button, cn } from '@repo/ui';

import { useTranslation } from 'react-i18next';

type LanguageSwitcherProps = {
  mode?: 'compact' | 'settings';
};

type SupportedLocale = 'en' | 'ko';

function getLanguageName(locale: SupportedLocale) {
  return locale === 'en' ? 'English' : '한국어';
}

function getLanguageTag(locale: SupportedLocale) {
  return locale === 'en' ? 'en' : 'ko';
}

export function LanguageSwitcher({ mode = 'compact' }: LanguageSwitcherProps) {
  const { isChanging, locale, setLocale } = useAppLocale();
  const { t: tSettings } = useTranslation('settings');
  const { t: tStudio } = useTranslation('studio');

  const options = useMemo(
    () =>
      (['en', 'ko'] as const).map((code) => ({
        code,
        description:
          code === 'en'
            ? tStudio('language.englishDescription')
            : tStudio('language.koreanDescription'),
        label: code === 'en' ? tSettings('english') : tSettings('korean'),
      })),
    [tSettings, tStudio],
  );

  if (mode === 'settings') {
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const isCurrent = option.code === locale;

          return (
            <button
              key={option.code}
              type="button"
              lang={getLanguageTag(option.code)}
              disabled={isChanging || isCurrent}
              onClick={() => void setLocale(option.code)}
              aria-label={
                isCurrent
                  ? tStudio('shell.currentLanguage', {
                      language: getLanguageName(option.code),
                    })
                  : tStudio('language.switchTo', {
                      language: getLanguageName(option.code),
                    })
              }
              className={cn(
                'rounded-lg border px-4 py-3 text-left transition-colors',
                isCurrent
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40 hover:bg-muted/40',
                (isChanging || isCurrent) && 'disabled:cursor-default disabled:opacity-100',
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

  const nextLocale = locale === 'en' ? 'ko' : 'en';
  const nextLanguage = getLanguageName(nextLocale);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      lang={getLanguageTag(nextLocale)}
      disabled={isChanging}
      onClick={() => void setLocale(nextLocale)}
      aria-label={tStudio('shell.changeLanguage', { language: nextLanguage })}
      className="h-8 min-w-24 rounded-full px-3 text-xs font-medium"
    >
      {nextLanguage}
    </Button>
  );
}
