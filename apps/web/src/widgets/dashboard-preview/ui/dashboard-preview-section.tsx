import { useEffect, useReducer, useRef } from 'react';

import { useAppLocale, useTranslation } from '@repo/i18n';

import { ScrollReveal } from '../../../shared/ui/scroll-reveal';

const barHeights = [30, 55, 40, 70, 60, 85, 50, 75, 45, 90, 65, 80];

type AnimationState = { animated: boolean };
type AnimationAction = { type: 'START_ANIMATION' } | { type: 'RESET_ANIMATION' };

function animationReducer(state: AnimationState, action: AnimationAction): AnimationState {
  switch (action.type) {
    case 'START_ANIMATION':
      return { ...state, animated: true };
    case 'RESET_ANIMATION':
      return { ...state, animated: false };
    default:
      return state;
  }
}

function AnimatedChart() {
  const { t } = useTranslation('web');
  const ref = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(animationReducer, { animated: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setTimeout(() => dispatch({ type: 'START_ANIMATION' }), 300);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const ticks = [
    t('dashboardPreview.ticks.day1'),
    t('dashboardPreview.ticks.day7'),
    t('dashboardPreview.ticks.day14'),
    t('dashboardPreview.ticks.day21'),
    t('dashboardPreview.ticks.today'),
  ];

  return (
    <div ref={ref} className="rounded-xl border border-border/40 bg-card/60 p-4">
      <p className="text-xs text-muted-foreground mb-4">{t('dashboardPreview.chartLabel')}</p>
      <div className="flex items-end gap-1.5 h-24">
        {barHeights.map((height, index) => (
          <div key={index} className="flex-1 h-full flex items-end">
            <div
              className="w-full rounded-t bg-claude-orange-light/60 hover:bg-claude-orange-light transition-colors"
              style={{
                height: state.animated ? `${height}%` : '0%',
                transition: `height 0.5s ease ${index * 40}ms`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {ticks.map((tick) => (
          <span key={tick} className="text-[10px] text-muted-foreground">
            {tick}
          </span>
        ))}
      </div>
    </div>
  );
}

export function DashboardPreviewSection() {
  const { locale } = useAppLocale();
  const { t } = useTranslation('web');
  const stats = [
    {
      label: t('dashboardPreview.stats.monthlyCost.label'),
      value: locale === 'ko' ? '₩16,420' : '$12.48',
      sub: t('dashboardPreview.stats.monthlyCost.sub'),
      color: 'text-claude-orange-light',
    },
    {
      label: t('dashboardPreview.stats.totalTokens.label'),
      value: '2.4M',
      sub: t('dashboardPreview.stats.totalTokens.sub'),
      color: 'text-foreground',
    },
    {
      label: t('dashboardPreview.stats.sessionCount.label'),
      value: '347',
      sub: t('dashboardPreview.stats.sessionCount.sub'),
      color: 'text-foreground',
    },
    {
      label: t('dashboardPreview.stats.activeProjects.label'),
      value: '12',
      sub: t('dashboardPreview.stats.activeProjects.sub'),
      color: 'text-foreground',
    },
  ] as const;
  const sidebarItems = [
    { label: t('dashboardPreview.sidebar.overview'), active: true, badge: false },
    { label: t('dashboardPreview.sidebar.projects'), active: false, badge: false },
    { label: t('dashboardPreview.sidebar.live'), active: false, badge: true },
    { label: t('dashboardPreview.sidebar.costs'), active: false, badge: false },
    { label: t('dashboardPreview.sidebar.skills'), active: false, badge: false },
  ] as const;

  return (
    <section className="py-24 px-6 bg-card/30">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="text-center mb-16">
          <p className="text-claude-orange-light text-sm font-medium uppercase tracking-wider mb-3">
            {t('dashboardPreview.eyebrow')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('dashboardPreview.title')}
          </h2>
          <p className="text-muted-foreground text-lg break-keep">
            {t('dashboardPreview.description')}
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div
            className="relative rounded-2xl border border-border/50 bg-card overflow-hidden shadow-2xl shadow-black/40"
            style={{ perspective: '1000px', transform: 'rotateX(4deg)' }}
          >
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border/50 bg-card/80">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-4 text-xs text-muted-foreground">
                {t('dashboardPreview.windowTitle')}
              </span>
            </div>

            <div className="flex min-h-[320px] sm:min-h-[420px]">
              <div className="hidden sm:flex sm:flex-col w-14 border-r border-border/30 bg-card/50 flex-shrink-0">
                <div className="h-[2px] w-full bg-claude-orange-light shrink-0" />
                <div className="p-2 border-b border-border/30">
                  <div className="flex h-8 w-full items-center justify-center rounded-lg bg-claude-orange-light/15">
                    <span className="text-[10px] font-bold text-claude-orange-light">CS</span>
                  </div>
                </div>
                <div className="flex-1 p-2 space-y-1">
                  {sidebarItems.map((item) => (
                    <div
                      key={item.label}
                      className={`relative w-full h-8 rounded-md flex items-center justify-center ${item.active ? 'bg-claude-orange-light/15' : 'hover:bg-muted/40'}`}
                    >
                      {item.active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-claude-orange-light" />
                      )}
                      <span
                        className={`text-[8px] font-medium ${item.active ? 'text-claude-orange-light' : 'text-muted-foreground'}`}
                      >
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-claude-orange-light animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-border/30">
                  <div className="w-full h-8 rounded-md flex items-center justify-center">
                    <span className="text-[8px] text-muted-foreground">
                      {t('dashboardPreview.sidebar.settings')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-3 sm:p-6 min-w-0">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-border/40 bg-card/60 p-2.5 sm:p-4 min-w-0"
                    >
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 truncate">
                        {stat.label}
                      </p>
                      <p className={`text-base sm:text-xl font-bold truncate ${stat.color}`}>
                        {stat.value}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                        {stat.sub}
                      </p>
                    </div>
                  ))}
                </div>

                <AnimatedChart />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card/80 to-transparent pointer-events-none" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
