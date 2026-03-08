import { Card, CardContent, CardHeader, CardTitle, cn } from '@repo/ui';

import { DollarSign, FolderOpen, LayoutDashboard, Wand2 } from 'lucide-react';

import { ScrollReveal } from '../../../shared/ui/scroll-reveal';

const features = [
  {
    icon: DollarSign,
    title: '비용 분석',
    description:
      '모델별 비용 추적, 일별 비용 차트, 월간 비교. KRW/USD 이중 표시로 직관적인 비용 파악.',
  },
  {
    icon: FolderOpen,
    title: '프로젝트 관리',
    description: '프로젝트별 비용과 토큰 사용량 분석. 타임라인 뷰로 프로젝트 활동 흐름을 한눈에.',
  },
  {
    icon: LayoutDashboard,
    title: '활동 분석',
    description: 'GitHub 스타일 히트맵, 피크 시간대 분석, 대화 패턴으로 사용 습관을 발견하세요.',
  },
  {
    icon: Wand2,
    title: '스킬 & 설정',
    description: '커스텀 스킬 목록 관리, Claude Code 설정 파일 확인과 관리를 한 곳에서.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        {/* 섹션 헤더 */}
        <ScrollReveal className="text-center mb-16">
          <p className="text-claude-orange-light text-sm font-medium uppercase tracking-wider mb-3">
            기능
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            분석에 필요한 모든 것
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto break-keep">
            Claude Code의 모든 사용 데이터를 시각화하여 더 스마트한 개발 결정을 내리세요.
          </p>
        </ScrollReveal>

        {/* 피처 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.title} delay={i * 80}>
                <Card
                  className={cn(
                    'border-border/50 bg-card/50 backdrop-blur-sm',
                    'hover:scale-[1.02] hover:border-claude-orange-light/40',
                    'hover:shadow-lg hover:shadow-claude-orange-light/10',
                    'transition-all duration-300 cursor-default h-full',
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="w-10 h-10 rounded-lg bg-claude-orange-light/10 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-claude-orange-light" />
                    </div>
                    <CardTitle className="text-base font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
