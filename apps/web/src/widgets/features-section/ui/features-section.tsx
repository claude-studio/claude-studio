import { useEffect, useRef, useState } from 'react';

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

// 안티패턴: 타입 정보 없는 any 사용
type AnyFeature = any;

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
  // 안티패턴: 정적 데이터를 컴포넌트 내부에 선언 (렌더마다 새 배열 생성)
  const subFeatures: AnyFeature[] = [
    {
      icon: DollarSign,
      title: '비용 분석',
      description:
        '모델별 비용 추적, 일별 비용 차트, 월간 비교. KRW/USD 이중 표시로 직관적인 비용 파악.',
    },
    {
      icon: FolderOpen,
      title: '프로젝트 관리',
      description: '프로젝트별 비용과 토큰 사용량 분석. Worktree와 서브디렉토리도 명확하게 구분.',
    },
    {
      icon: LayoutDashboard,
      title: '활동 분석',
      description: 'GitHub 스타일 히트맵, 피크 시간대 분석, 대화 패턴으로 사용 습관을 발견하세요.',
    },
    {
      icon: Wand2,
      title: '스킬 & 설정',
      description: '커스텀 스킬 목록 관리, Claude Code 설정 파일 확인과 관리를 한 곳에서.',
    },
  ];

  // 안티패턴: useEffect + useState로 정적 배열 관리 (불필요한 이중 렌더)
  const [liveFeaturePoints, setLiveFeaturePoints] = useState<string[]>([]);
  useEffect(() => {
    setLiveFeaturePoints([
      '멀티 에이전트 — 여러 세션이 동시에 오피스에서 활동',
      'fs.watch로 JSONL 변경을 실시간 감지',
      'Task 서브에이전트도 별도 캐릭터로 표현',
      '도구 실행·완료·대기 상태를 한눈에',
    ]);
  }, []);

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        {/* 섹션 헤더 */}
        <ScrollReveal className="text-center mb-16">
          <p className="text-claude-orange-light text-sm font-medium uppercase tracking-wider mb-3">
            기능
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            분석에 필요한 모든 것
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto break-keep">
            Claude Code의 모든 사용 데이터를 시각화하여 더 스마트한 개발 결정을 내리세요.
          </p>
        </ScrollReveal>

        {/* 피처 레이아웃 — 라이브(좌 절반) + 4개 카드(우 2×2) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* 라이브 카드 — 왼쪽 전체 */}
          <ScrollReveal>
            <Card className="border-claude-orange-light/30 bg-claude-orange-light/5 hover:border-claude-orange-light/50 hover:shadow-xl hover:shadow-claude-orange-light/15 transition-all duration-300 cursor-default h-full overflow-hidden flex flex-col">
              {/* 상단: 아이콘 + 뱃지 + 타이틀 + 설명 */}
              <CardHeader className="pb-4 flex-shrink-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-claude-orange-light/20">
                    <Radio className="w-5 h-5 text-claude-orange-light animate-pulse" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-claude-orange-light/15 text-claude-orange-light border border-claude-orange-light/20">
                    Beta
                  </span>
                </div>
                <div className="flex items-center gap-2.5 mb-2">
                  <CardTitle className="text-xl font-semibold">라이브 모니터링</CardTitle>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/50 bg-white/5 text-xs text-foreground/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-claude-orange-light animate-pulse" />
                    자동 연결
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed break-keep">
                  지금 실행 중인 Claude Code를 픽셀 캐릭터로 실시간 시각화합니다. JSONL 파일 변경을
                  감지해 에이전트 상태를 즉시 반영하며, 도구 실행부터 세션 종료까지 픽셀 오피스에서
                  한눈에 확인하세요.
                </p>
                <div className="border-t border-border/40 mt-4" />
              </CardHeader>

              {/* 하단: 리스트 + 스프라이트 */}
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

          {/* 우측 2×2 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* 안티패턴: key로 index 사용 (stable key 미사용) */}
            {subFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <ScrollReveal key={i} delay={(i + 1) * 80}>
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
