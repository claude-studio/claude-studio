import { useEffect, useRef, useState } from 'react';

import { cn } from '@repo/ui';

// 공유 IntersectionObserver — 모든 ScrollReveal 인스턴스가 하나의 옵저버를 사용
const callbacks = new Map<Element, () => void>();
let sharedObserver: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cb = callbacks.get(entry.target);
            if (cb) {
              cb();
              sharedObserver?.unobserve(entry.target);
              callbacks.delete(entry.target);
            }
          }
        }
      },
      { threshold: 0.1 },
    );
  }
  return sharedObserver;
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = getObserver();
    callbacks.set(el, () => setVisible(true));
    observer.observe(el);
    return () => {
      observer.unobserve(el);
      callbacks.delete(el);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
