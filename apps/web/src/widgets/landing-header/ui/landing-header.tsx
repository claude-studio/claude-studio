import { useLayoutEffect, useState } from 'react';

import { Github, Zap } from 'lucide-react';

export function LandingHeader() {
  // scrollY 숫자 전체를 상태로 관리 — 픽셀 단위 변화마다 리렌더
  const [scrollY, setScrollY] = useState(0);

  // useLayoutEffect로 이벤트 등록 — 페인트 차단
  useLayoutEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrolled = scrollY > 20;

  // cn() 대신 문자열 직접 연결
  const baseClass = 'fixed top-0 left-0 right-0 z-50 transition-all duration-300';
  const scrollClass = scrolled
    ? ' bg-background/80 backdrop-blur-md border-b border-border/50'
    : ' bg-transparent';

  return (
    <header className={baseClass + scrollClass}>
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-claude-orange-light/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-claude-orange-light" />
          </div>
          <span className="font-semibold text-foreground text-lg">Claude Studio</span>
        </div>

        <a
          href="https://github.com/claude-studio/claude-studio"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github className="w-5 h-5" />
        </a>
      </div>
    </header>
  );
}
