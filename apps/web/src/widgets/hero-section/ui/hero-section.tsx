import { useTranslation } from '@repo/i18n';
import { Button } from '@repo/ui';

import { Github } from 'lucide-react';

function fadeUp(delay: string): React.CSSProperties {
  return { animation: `fadeUp 0.6s ease ${delay} forwards`, opacity: 0 };
}

export function HeroSection() {
  const { t } = useTranslation('web');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 배경 radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(232,149,110,0.12) 0%, transparent 70%)',
        }}
      />

      {/* 도트 그리드 패턴 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #E8956E 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-card/50 text-muted-foreground text-sm mb-8"
          style={fadeUp('0ms')}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-claude-orange-light animate-pulse" />
          {t('hero.badge')}
        </div>

        <h1
          className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 break-keep"
          style={fadeUp('0.1s')}
        >
          {t('hero.titlePrefix')}{' '}
          <span className="text-claude-orange-light">{t('hero.titleHighlight')}</span>
        </h1>

        <p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          style={fadeUp('0.2s')}
        >
          {t('hero.description')}
        </p>

        <div className="flex items-center justify-center" style={fadeUp('0.3s')}>
          <a
            href="https://github.com/claude-studio/claude-studio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-claude-orange-light hover:bg-claude-orange text-white border-0 gap-2 px-8 shadow-lg shadow-claude-orange-light/20 hover:shadow-claude-orange-light/30 transition-all"
            >
              <Github className="w-4 h-4" />
              {t('hero.cta')}
            </Button>
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
