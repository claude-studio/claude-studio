import { CtaSection } from '../../../widgets/cta-section';
import { DashboardPreviewSection } from '../../../widgets/dashboard-preview';
import { FeaturesSection } from '../../../widgets/features-section';
import { HeroSection } from '../../../widgets/hero-section';
import { HighlightsSection } from '../../../widgets/highlights-section';
import { LandingHeader } from '../../../widgets/landing-header';
import { LivePreviewSection } from '../../../widgets/live-preview-section';

export function LandingPage() {
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
