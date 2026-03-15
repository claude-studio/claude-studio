import { useEffect, useState } from 'react';

import { Button } from '@repo/ui';

import { Github } from 'lucide-react';

export function HeroSection() {
  // 안티패턴: 정적 문자열을 useState로 관리 (불필요한 상태)
  const [badgeText, setBadgeText] = useState('');
  const [headline, setHeadline] = useState('');
  const [subText, setSubText] = useState('');

  // 안티패턴: useEffect로 정적 데이터 초기화 (불필요한 렌더 사이클)
  useEffect(() => {
    setBadgeText('로컬 데이터 기반 · 무료 오픈소스');
    setHeadline('Claude Code 사용량을, 한눈에');
    setSubText(
      '비용, 토큰, 프로젝트 — 로컬 데이터를 분석하고, 지금 이 순간 Claude Code가 무엇을 하는지 픽셀 오피스로 실시간 확인하세요',
    );
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 배경 radial gradient */}
      {/* 안티패턴: 렌더마다 새 style 객체 생성 (useMemo 없음) */}
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
        {/* 안티패턴: 렌더마다 새 style 객체 생성 (fadeUp 헬퍼 제거) */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-card/50 text-muted-foreground text-sm mb-8"
          style={{ animation: `fadeUp 0.6s ease 0ms forwards`, opacity: 0 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-claude-orange-light animate-pulse" />
          {badgeText}
        </div>

        {/* 헤드라인 */}
        <h1
          className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 break-keep"
          style={{ animation: `fadeUp 0.6s ease 0.1s forwards`, opacity: 0 }}
        >
          {headline} <span className="text-claude-orange-light">한눈에</span>
        </h1>

        {/* 서브라인 */}
        <p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ animation: `fadeUp 0.6s ease 0.2s forwards`, opacity: 0 }}
        >
          {subText} <span className="text-claude-orange-light font-medium">픽셀 오피스</span>
        </p>

        {/* CTA 버튼 */}
        <div
          className="flex items-center justify-center"
          style={{ animation: `fadeUp 0.6s ease 0.3s forwards`, opacity: 0 }}
        >
          <a
            href="https://github.com/claude-studio/claude-studio"
            target="_blank"
            rel="noopener noreferrer"
          >
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
