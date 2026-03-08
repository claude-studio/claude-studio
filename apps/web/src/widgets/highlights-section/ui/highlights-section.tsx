import { Heart, RefreshCw, Shield } from 'lucide-react';

import { ScrollReveal } from '../../../shared/ui/scroll-reveal';

const highlights = [
  {
    icon: Shield,
    title: '로컬 데이터',
    description:
      '서버 불필요. ~/.claude/ 디렉토리에서 직접 데이터를 읽어 분석합니다. 데이터는 당신의 컴퓨터에만 존재합니다.',
  },
  {
    icon: RefreshCw,
    title: '실시간 갱신',
    description:
      '파일 워처가 세션 변경을 감지해 즉시 반영합니다. 코딩하는 동안 비용이 실시간으로 업데이트됩니다.',
  },
  {
    icon: Heart,
    title: '완전 무료',
    description: '100% 오픈소스, 로컬에서 실행. 구독료도, 계정 등록도 필요 없습니다.',
  },
];

export function HighlightsSection() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal className="text-center mb-16">
          <p className="text-claude-orange-light text-sm font-medium uppercase tracking-wider mb-3">
            차별점
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            왜 Claude Studio인가
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.title} delay={i * 100} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-claude-orange-light/10 flex items-center justify-center mx-auto mb-5 border border-claude-orange-light/20">
                  <Icon className="w-6 h-6 text-claude-orange-light" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
