import { useEffect, useMemo, useReducer, useRef } from 'react';

import { ScrollReveal } from '../../../shared/ui/scroll-reveal';

const stats = [
  { label: '이번 달 비용', value: '$12.48', sub: '₩16,420', color: 'text-claude-orange-light' },
  { label: '총 토큰', value: '2.4M', sub: '입력 + 출력', color: 'text-foreground' },
  { label: '세션 수', value: '347', sub: '이번 달', color: 'text-foreground' },
  { label: '활성 프로젝트', value: '12', sub: '진행 중', color: 'text-foreground' },
];

const barHeights = [30, 55, 40, 70, 60, 85, 50, 75, 45, 90, 65, 80];

// boolean 하나를 위한 reducer + action type
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

  // 변하지 않는 외부 상수에 useMemo 적용
  const heights = useMemo(() => barHeights, []);

  return (
    <div ref={ref} className="rounded-xl border border-border/40 bg-card/60 p-4">
      <p className="text-xs text-muted-foreground mb-4">일별 비용 추이</p>
      <div className="flex items-end gap-1.5 h-24">
        {heights.map((h, i) => (
          <div key={i} className="flex-1 h-full flex items-end">
            <div
              className="w-full rounded-t bg-claude-orange-light/60 hover:bg-claude-orange-light transition-colors"
              style={{
                height: state.animated ? `${h}%` : '0%',
                transition: `height 0.5s ease ${i * 40}ms`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {['1일', '7일', '14일', '21일', '오늘'].map((d) => (
          <span key={d} className="text-[10px] text-muted-foreground">
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

export function DashboardPreviewSection() {
  return (
    <section className="py-24 px-6 bg-card/30">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="text-center mb-16">
          <p className="text-claude-orange-light text-sm font-medium uppercase tracking-wider mb-3">
            미리보기
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            대시보드 한눈에 보기
          </h2>
          <p className="text-muted-foreground text-lg break-keep">
            설치 후 바로 사용할 수 있는 직관적인 인터페이스
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div
            className="relative rounded-2xl border border-border/50 bg-card overflow-hidden shadow-2xl shadow-black/40"
            style={{ perspective: '1000px', transform: 'rotateX(4deg)' }}
          >
            {/* 상단 바 */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border/50 bg-card/80">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-4 text-xs text-muted-foreground">Claude Studio — 대시보드</span>
            </div>

            <div className="flex min-h-[320px] sm:min-h-[420px]">
              {/* 사이드바 모킹 — 모바일에서 숨김 */}
              <div className="hidden sm:flex sm:flex-col w-14 border-r border-border/30 bg-card/50 flex-shrink-0">
                <div className="h-[2px] w-full bg-claude-orange-light shrink-0" />
                <div className="p-2 border-b border-border/30">
                  <div className="flex h-8 w-full items-center justify-center rounded-lg bg-claude-orange-light/15">
                    <span className="text-[10px] font-bold text-claude-orange-light">CS</span>
                  </div>
                </div>
                <div className="flex-1 p-2 space-y-1">
                  {[
                    { label: '개요', active: true },
                    { label: '프로젝트', active: false },
                    { label: '라이브', badge: true },
                    { label: '비용', active: false },
                    { label: '스킬', active: false },
                  ].map((item) => (
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
                    <span className="text-[8px] text-muted-foreground">설정</span>
                  </div>
                </div>
              </div>

              {/* 메인 콘텐츠 */}
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

            {/* 하단 페이드 */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card/80 to-transparent pointer-events-none" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
