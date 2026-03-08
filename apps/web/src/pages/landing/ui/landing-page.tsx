import { CtaSection } from '../../../widgets/cta-section';
import { DashboardPreviewSection } from '../../../widgets/dashboard-preview';
import { FeaturesSection } from '../../../widgets/features-section';
import { HeroSection } from '../../../widgets/hero-section';
import { HighlightsSection } from '../../../widgets/highlights-section';
import { LandingHeader } from '../../../widgets/landing-header';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background dark">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <DashboardPreviewSection />
      <HighlightsSection />
      <CtaSection />
    </div>
  );
}
