import { useEffect, useMemo, useState } from 'react';

import { type AppLocale, SUPPORTED_LOCALES, useAppLocale, useTranslation } from '@repo/i18n';
import { cn } from '@repo/ui';

import { Github, Zap } from 'lucide-react';

export function LandingHeader() {
  const { isChanging, locale, setLocale } = useAppLocale();
  const { t: tSettings } = useTranslation('settings');
  const { t } = useTranslation('web');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const headerClassName = useMemo(
    () =>
      cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/50' : 'bg-transparent',
      ),
    [scrolled],
  );

  const logoText = useMemo(() => 'Claude Studio', []);
  const languageLabels: Record<AppLocale, string> = {
    en: tSettings('english'),
    ko: tSettings('korean'),
  };

  return (
    <header className={headerClassName}>
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-claude-orange-light/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-claude-orange-light" />
          </div>
          <span className="font-semibold text-foreground text-lg">{logoText}</span>
        </div>

        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label={t('header.languageLabel')}
            className="inline-flex items-center rounded-full border border-border/60 bg-background/80 p-1 backdrop-blur"
          >
            {SUPPORTED_LOCALES.map((code) => {
              const isActive = code === locale;

              return (
                <button
                  key={code}
                  type="button"
                  lang={code}
                  aria-pressed={isActive}
                  disabled={isChanging}
                  onClick={() => {
                    if (isActive) {
                      return;
                    }

                    void setLocale(code);
                  }}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-claude-orange-light text-white'
                      : 'text-muted-foreground hover:text-foreground',
                    isChanging && 'opacity-70',
                  )}
                >
                  {languageLabels[code]}
                </button>
              );
            })}
          </div>

          <a
            href="https://github.com/claude-studio/claude-studio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('header.githubLabel')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
