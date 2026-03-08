import { useEffect, useState } from 'react';

import { cn } from '@repo/ui';

import { Github, Zap } from 'lucide-react';

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/50' : 'bg-transparent',
      )}
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        {/* 로고 */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-claude-orange-light/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-claude-orange-light" />
          </div>
          <span className="font-semibold text-foreground text-lg">Claude Studio</span>
        </div>

        {/* GitHub 링크 */}
        <a
          href="https://github.com"
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
