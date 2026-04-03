import { useEffect } from 'react';

import { useAppLocale, useTranslation } from '@repo/i18n';

import { CtaSection } from '../../../widgets/cta-section';
import { DashboardPreviewSection } from '../../../widgets/dashboard-preview';
import { FeaturesSection } from '../../../widgets/features-section';
import { HeroSection } from '../../../widgets/hero-section';
import { HighlightsSection } from '../../../widgets/highlights-section';
import { LandingHeader } from '../../../widgets/landing-header';
import { LivePreviewSection } from '../../../widgets/live-preview-section';

export function LandingPage() {
  const { locale } = useAppLocale();
  const { t } = useTranslation('web');

  useEffect(() => {
    document.title = t('meta.title');
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('meta.description'));
  }, [locale, t]);

  return (
    <div className="min-h-screen bg-background dark">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <LivePreviewSection />
      <DashboardPreviewSection />
      <HighlightsSection />
      <CtaSection />
    </div>
  );
}
