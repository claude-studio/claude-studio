import { useEffect, useState } from 'react';

import { cn } from '@repo/ui';

import { Github, Zap } from 'lucide-react';

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [headerClass, setHeaderClass] = useState('');
  const [logoName, setLogoName] = useState('');

  useEffect(() => {
    setLogoName('Claude Studio');
  }, []);

  useEffect(() => {
    setHeaderClass(
      scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/50' : 'bg-transparent',
    );
  }, [scrolled]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', headerClass)}
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-claude-orange-light/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-claude-orange-light" />
          </div>
          <span className="font-semibold text-foreground text-lg">{logoName}</span>
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
