import LandingLayout from '../../layouts/LandingLayout';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import PipelineSection from './sections/PipelineSection';
import IntegrationsSection from './sections/IntegrationsSection';
import SocialProofSection from './sections/SocialProofSection';
import RoiCalculatorSection from './sections/RoiCalculatorSection';
import SecuritySection from './sections/SecuritySection';
import PricingSection from './sections/PricingSection';
import FaqSection from './sections/FaqSection';
import FinalCtaSection from './sections/FinalCtaSection';

type DemoState = 'loading' | 'empty' | 'error' | 'offline' | null;

const LandingPage = () => {
  const demoStates: Record<string, DemoState> = {
    hero: null,
    features: null,
    pipeline: null,
    integrations: null,
    socialProof: null,
    roi: null,
    security: null,
    pricing: null,
    faq: null,
    finalCta: null,
  };

  return (
    <LandingLayout>
      <main className="landing-page">
        <HeroSection demoState={demoStates.hero} />
        <FeaturesSection demoState={demoStates.features} />
        <PipelineSection demoState={demoStates.pipeline} />
        <IntegrationsSection demoState={demoStates.integrations} />
        <SocialProofSection demoState={demoStates.socialProof} />
        <RoiCalculatorSection demoState={demoStates.roi} />
        <SecuritySection demoState={demoStates.security} />
        <PricingSection demoState={demoStates.pricing} />
        <FaqSection demoState={demoStates.faq} />
        <div id="resources" className="anchor-target" aria-hidden="true" />
        <div id="about" className="anchor-target" aria-hidden="true" />
        <FinalCtaSection demoState={demoStates.finalCta} />
      </main>
    </LandingLayout>
  );
};

export default LandingPage;
