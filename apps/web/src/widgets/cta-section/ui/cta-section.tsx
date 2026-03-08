import { Button } from '@repo/ui';

import { Github } from 'lucide-react';

import { ScrollReveal } from '../../../shared/ui/scroll-reveal';

export function CtaSection() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <div className="relative rounded-3xl border border-border/50 bg-card/50 p-8 sm:p-12 text-center overflow-hidden">
            {/* 배경 glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,149,110,0.08) 0%, transparent 70%)',
              }}
            />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 break-keep">
                지금 바로 시작하세요
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto break-keep">
                설치 없이 바로 실행. Claude Code를 사용하고 있다면 분석할 데이터가 이미 준비되어 있습니다.
              </p>

              {/* 설치 커맨드 */}
              <div className="inline-flex items-center gap-3 bg-background/80 border border-border/60 rounded-xl px-4 sm:px-5 py-3 mb-8 font-mono text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                <span className="text-claude-orange-light">$</span>
                <span>git clone &amp;&amp; pnpm install &amp;&amp; pnpm dev</span>
              </div>

              <div className="flex items-center justify-center">
                <a href="https://github.com/claude-studio/claude-studio" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="bg-claude-orange-light hover:bg-claude-orange text-white border-0 gap-2 px-8 shadow-lg shadow-claude-orange-light/20"
                  >
                    <Github className="w-4 h-4" />
                    GitHub에서 보기
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
