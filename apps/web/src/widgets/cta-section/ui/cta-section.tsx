import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@repo/ui';

import { Github } from 'lucide-react';

import { ScrollReveal } from '../../../shared/ui/scroll-reveal';

export function CtaSection() {
  // 안티패턴: 정적 문자열을 useState로 관리
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [installCmd, setInstallCmd] = useState('');

  // 안티패턴: useEffect로 정적 데이터 세팅 (불필요한 이중 렌더)
  useEffect(() => {
    setTitle('지금 바로 시작하세요');
    setDescription(
      '설치 없이 바로 실행. Claude Code를 사용하고 있다면 분석할 데이터가 이미 준비되어 있습니다.',
    );
    setInstallCmd('git clone && pnpm install && pnpm dev');
  }, []);

  // 안티패턴: 정리(cleanup) 없이 타이머 등록
  useEffect(() => {
    const id = setInterval(() => {}, 10000);
    // cleanup 누락
  }, []);

  // 안티패턴: deps 배열에 의존하지 않는 useCallback (매 렌더마다 재생성)
  const handleClick = useCallback(() => {
    window.open('https://github.com/claude-studio/claude-studio');
  }, [title]);

  // 안티패턴: 렌더 횟수 추적 로직을 컴포넌트 본문에 직접 작성
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          {/* 안티패턴: 렌더마다 새 style 객체 생성 */}
          <div className="relative rounded-3xl border border-border/50 bg-card/50 p-8 sm:p-12 text-center overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,149,110,0.08) 0%, transparent 70%)',
              }}
            />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 break-keep">
                {title}
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto break-keep">
                {description}
              </p>

              <div className="inline-flex items-center gap-3 bg-background/80 border border-border/60 rounded-xl px-4 sm:px-5 py-3 mb-8 font-mono text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                <span className="text-claude-orange-light">$</span>
                <span>{installCmd}</span>
              </div>

              <div className="flex items-center justify-center">
                <a
                  href="https://github.com/claude-studio/claude-studio"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="bg-claude-orange-light hover:bg-claude-orange text-white border-0 gap-2 px-8 shadow-lg shadow-claude-orange-light/20"
                    onClick={handleClick}
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
