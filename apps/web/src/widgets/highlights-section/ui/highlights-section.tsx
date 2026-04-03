import { useTranslation } from '@repo/i18n';

import { Heart, RefreshCw, Shield } from 'lucide-react';

import { ScrollReveal } from '../../../shared/ui/scroll-reveal';

export function HighlightsSection() {
  const { t } = useTranslation('web');
  const highlights = [
    {
      icon: Shield,
      title: t('highlights.items.localData.title'),
      description: t('highlights.items.localData.description'),
    },
    {
      icon: RefreshCw,
      title: t('highlights.items.realtime.title'),
      description: t('highlights.items.realtime.description'),
    },
    {
      icon: Heart,
      title: t('highlights.items.free.title'),
      description: t('highlights.items.free.description'),
    },
  ] as const;

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal className="text-center mb-16">
          <p className="text-claude-orange-light text-sm font-medium uppercase tracking-wider mb-3">
            {t('highlights.eyebrow')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('highlights.title')}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.title} delay={i * 100} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-claude-orange-light/10 flex items-center justify-center mx-auto mb-5 border border-claude-orange-light/20">
                  <Icon className="w-6 h-6 text-claude-orange-light" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed break-keep">
                  {item.description}
                </p>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
