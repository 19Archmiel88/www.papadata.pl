export type PricingTier = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  priceMonthly: number | null;
  priceYearly: number | null;
  ctaKey: string;
  featuresKeys: string[];
  highlight?: boolean;
};

export const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    nameKey: 'landing.pricing.tiers.starter.name',
    descriptionKey: 'landing.pricing.tiers.starter.description',
    priceMonthly: 399,
    priceYearly: 359,
    ctaKey: 'landing.pricing.tiers.starter.cta',
    featuresKeys: [
      'landing.pricing.tiers.starter.features.one',
      'landing.pricing.tiers.starter.features.two',
      'landing.pricing.tiers.starter.features.three',
    ],
  },
  {
    id: 'scale',
    nameKey: 'landing.pricing.tiers.scale.name',
    descriptionKey: 'landing.pricing.tiers.scale.description',
    priceMonthly: 899,
    priceYearly: 799,
    ctaKey: 'landing.pricing.tiers.scale.cta',
    featuresKeys: [
      'landing.pricing.tiers.scale.features.one',
      'landing.pricing.tiers.scale.features.two',
      'landing.pricing.tiers.scale.features.three',
    ],
    highlight: true,
  },
  {
    id: 'enterprise',
    nameKey: 'landing.pricing.tiers.enterprise.name',
    descriptionKey: 'landing.pricing.tiers.enterprise.description',
    priceMonthly: null,
    priceYearly: null,
    ctaKey: 'landing.pricing.tiers.enterprise.cta',
    featuresKeys: [
      'landing.pricing.tiers.enterprise.features.one',
      'landing.pricing.tiers.enterprise.features.two',
      'landing.pricing.tiers.enterprise.features.three',
    ],
  },
];
