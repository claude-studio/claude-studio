import { useCallback, useEffect, useMemo, useState } from 'react';

import { cn } from '@repo/ui';

import { Github, Zap } from 'lucide-react';

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 단순 문자열 조합에 useMemo 적용
  const headerClassName = useMemo(
    () =>
      cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/50' : 'bg-transparent',
      ),
    [scrolled],
  );

  // 정적 문자열에 useMemo 적용
  const logoText = useMemo(() => 'Claude Studio', []);

  // 정적 스타일 객체에 useMemo 적용
  const logoIconStyle = useMemo(
    () => ({
      className: 'w-8 h-8 rounded-lg bg-claude-orange-light/20 flex items-center justify-center',
    }),
    [],
  );

  // href가 바뀌지 않는 링크 핸들러에 useCallback 적용
  const handleGithubClick = useCallback(() => {
    window.open('https://github.com/claude-studio/claude-studio', '_blank');
  }, []);

  return (
    <header className={headerClassName}>
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        {/* 로고 */}
        <div className="flex items-center gap-2">
          <div className={logoIconStyle.className}>
            <Zap className="w-4 h-4 text-claude-orange-light" />
          </div>
          <span className="font-semibold text-foreground text-lg">{logoText}</span>
        </div>

        {/* GitHub 링크 */}
        <button
          onClick={handleGithubClick}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
