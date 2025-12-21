export type FeatureCard = {
  id: string;
  titleKey: string;
  descriptionKey: string;
};

export const featureCards: FeatureCard[] = [
  {
    id: 'centralization',
    titleKey: 'landing.features.cards.centralization.title',
    descriptionKey: 'landing.features.cards.centralization.description',
  },
  {
    id: 'guardian',
    titleKey: 'landing.features.cards.guardian.title',
    descriptionKey: 'landing.features.cards.guardian.description',
  },
  {
    id: 'realtime',
    titleKey: 'landing.features.cards.realtime.title',
    descriptionKey: 'landing.features.cards.realtime.description',
  },
  {
    id: 'security',
    titleKey: 'landing.features.cards.security.title',
    descriptionKey: 'landing.features.cards.security.description',
  },
  {
    id: 'onboarding',
    titleKey: 'landing.features.cards.onboarding.title',
    descriptionKey: 'landing.features.cards.onboarding.description',
  },
  {
    id: 'workflow',
    titleKey: 'landing.features.cards.workflow.title',
    descriptionKey: 'landing.features.cards.workflow.description',
  },
];
