import { Button } from '@repo/ui';

import { Github } from 'lucide-react';

function fadeUp(delay: string): React.CSSProperties {
  return { animation: `fadeUp 0.6s ease ${delay} forwards`, opacity: 0 };
}

export function HeroSection() {
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
        {/* 배지 */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-card/50 text-muted-foreground text-sm mb-8"
          style={fadeUp('0ms')}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-claude-orange-light animate-pulse" />
          로컬 데이터 기반 · 무료 오픈소스
        </div>

        {/* 헤드라인 */}
        <h1
          className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 break-keep"
          style={fadeUp('0.1s')}
        >
          Claude Code 사용량을,{' '}
          <span className="text-claude-orange-light">한눈에</span>
        </h1>

        {/* 서브라인 */}
        <p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          style={fadeUp('0.2s')}
        >
          비용, 토큰, 세션, 프로젝트 — 로컬 데이터를 분석하여
          <br className="hidden sm:block" />
          실시간 인사이트를 제공합니다
        </p>

        {/* CTA 버튼 */}
        <div className="flex items-center justify-center" style={fadeUp('0.3s')}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-claude-orange-light hover:bg-claude-orange text-white border-0 gap-2 px-8 shadow-lg shadow-claude-orange-light/20 hover:shadow-claude-orange-light/30 transition-all"
            >
              <Github className="w-4 h-4" />
              GitHub에서 시작하기
            </Button>
          </a>
        </div>
      </div>

      {/* 하단 fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
