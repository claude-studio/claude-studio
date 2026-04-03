import { useEffect, useRef } from 'react';

import { useTranslation } from '@repo/i18n';
import { Card, CardContent, CardHeader, CardTitle, cn } from '@repo/ui';

import { DollarSign, FolderOpen, LayoutDashboard, Radio, Wand2 } from 'lucide-react';

import { ScrollReveal } from '../../../shared/ui/scroll-reveal';

// 스프라이트 상수 (live-preview-section과 동일)
const FRAME_W = 16;
const FRAME_H = 32;
const ZOOM = 3;

// row 0=아래(정면), row 1=위, row 2=오른쪽(왼쪽은 flipX)
// 방향 순서: 아래 → 왼쪽 → 위 → 오른쪽
const DIR_SEQUENCE = [
  { row: 0, flip: false }, // 아래
  { row: 2, flip: true }, // 왼쪽
  { row: 1, flip: false }, // 위
  { row: 2, flip: false }, // 오른쪽
] as const;

const WALK_FRAMES = [0, 2] as const;
const WALK_FRAME_SEC = 0.45; // 걷기 프레임 교체 간격
const DIR_HOLD_SEC = 3.0; // 방향당 머무는 시간

function WalkingSprite({ charIdx }: { charIdx: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const walkTimerRef = useRef(0);
  const walkFrameRef = useRef(0);
  const dirTimerRef = useRef(0);
  const dirIdxRef = useRef(0);

  useEffect(() => {
    const img = new Image();
    img.src = `/assets/characters/char_${charIdx}.png`;

    const W = FRAME_W * ZOOM;
    const H = FRAME_H * ZOOM;

    let last = 0;
    const loop = (ts: number) => {
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;

      // 걷기 프레임 교체
      walkTimerRef.current += dt;
      if (walkTimerRef.current >= WALK_FRAME_SEC) {
        walkTimerRef.current = 0;
        walkFrameRef.current = walkFrameRef.current === 0 ? 1 : 0;
      }

      // 방향 교체
      dirTimerRef.current += dt;
      if (dirTimerRef.current >= DIR_HOLD_SEC) {
        dirTimerRef.current = 0;
        dirIdxRef.current = (dirIdxRef.current + 1) % DIR_SEQUENCE.length;
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx || !img.complete) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const dir = DIR_SEQUENCE[dirIdxRef.current]!;
      const frameIdx = WALK_FRAMES[walkFrameRef.current] ?? 0;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;

      if (dir.flip) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(img, frameIdx * FRAME_W, dir.row * FRAME_H, FRAME_W, FRAME_H, -W, 0, W, H);
        ctx.restore();
      } else {
        ctx.drawImage(img, frameIdx * FRAME_W, dir.row * FRAME_H, FRAME_W, FRAME_H, 0, 0, W, H);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [charIdx]);

  return (
    <canvas
      ref={canvasRef}
      width={FRAME_W * ZOOM}
      height={FRAME_H * ZOOM}
      style={{ imageRendering: 'pixelated', display: 'block' }}
    />
  );
}

export function FeaturesSection() {
  const { t } = useTranslation('web');
  const subFeatures = [
    {
      icon: DollarSign,
      title: t('features.cards.cost.title'),
      description: t('features.cards.cost.description'),
    },
    {
      icon: FolderOpen,
      title: t('features.cards.projects.title'),
      description: t('features.cards.projects.description'),
    },
    {
      icon: LayoutDashboard,
      title: t('features.cards.activity.title'),
      description: t('features.cards.activity.description'),
    },
    {
      icon: Wand2,
      title: t('features.cards.skills.title'),
      description: t('features.cards.skills.description'),
    },
  ] as const;
  const liveFeaturePoints = [
    t('features.liveCard.points.multiAgent'),
    t('features.liveCard.points.fileWatch'),
    t('features.liveCard.points.subagents'),
    t('features.liveCard.points.states'),
  ];

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal className="text-center mb-16">
          <p className="text-claude-orange-light text-sm font-medium uppercase tracking-wider mb-3">
            {t('features.eyebrow')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('features.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto break-keep">
            {t('features.description')}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ScrollReveal>
            <Card className="border-claude-orange-light/30 bg-claude-orange-light/5 hover:border-claude-orange-light/50 hover:shadow-xl hover:shadow-claude-orange-light/15 transition-all duration-300 cursor-default h-full overflow-hidden flex flex-col">
              <CardHeader className="pb-4 flex-shrink-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-claude-orange-light/20">
                    <Radio className="w-5 h-5 text-claude-orange-light animate-pulse" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-claude-orange-light/15 text-claude-orange-light border border-claude-orange-light/20">
                    {t('features.liveCard.badge')}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 mb-2">
                  <CardTitle className="text-xl font-semibold">
                    {t('features.liveCard.title')}
                  </CardTitle>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/50 bg-white/5 text-xs text-foreground/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-claude-orange-light animate-pulse" />
                    {t('features.liveCard.status')}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed break-keep">
                  {t('features.liveCard.description')}
                </p>
                <div className="border-t border-border/40 mt-4" />
              </CardHeader>

              <CardContent className="pt-4 flex-1 flex flex-col">
                <div className="flex items-end gap-4">
                  <ul className="space-y-2.5 flex-1">
                    {liveFeaturePoints.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-claude-orange-light/70 flex-shrink-0" />
                        <span className="break-keep">{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex-shrink-0 self-end">
                    <WalkingSprite charIdx={1} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {subFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <ScrollReveal key={feature.title} delay={(i + 1) * 80}>
                  <Card
                    className={cn(
                      'border-border/50 bg-card/50 backdrop-blur-sm',
                      'hover:scale-[1.02] transition-all duration-300 cursor-default h-full',
                      'hover:border-claude-orange-light/40 hover:shadow-lg hover:shadow-claude-orange-light/10',
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-claude-orange-light/10 mb-3">
                        <Icon className="w-5 h-5 text-claude-orange-light" />
                      </div>
                      <CardTitle className="text-base font-semibold">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed break-keep">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
