export type PremiumFeatureId = 'ai' | 'exports' | 'integrations' | 'reports';

export type PremiumFeatureDefinition = {
  feature: PremiumFeatureId;
  description: string;
  endpoints: string[];
  owner: string;
};

/**
 * Single source of truth for what we treat as premium in the API layer.
 * Keep this list in sync with EntitlementsGuard usage and docs/runbooks.
 */
export const PREMIUM_FEATURES: PremiumFeatureDefinition[] = [
  {
    feature: 'ai',
    description: 'AI chat + analytics responses (rate limited + usage ledger)',
    endpoints: ['/api/ai/chat'],
    owner: 'ai',
  },
  {
    feature: 'exports',
    description: 'CSV exports',
    endpoints: ['/api/exports', '/api/exports/:id'],
    owner: 'exports',
  },
  {
    feature: 'integrations',
    description: 'OAuth/connect flows for data sources',
    endpoints: ['/api/integrations/:provider/connect', '/api/integrations/:provider/callback'],
    owner: 'integrations',
  },
  {
    feature: 'reports',
    description: 'Dashboard + reporting views',
    endpoints: [
      '/api/dashboard/overview',
      '/api/dashboard/pandl',
      '/api/dashboard/ads',
      '/api/dashboard/customers',
      '/api/dashboard/products',
      '/api/dashboard/guardian',
      '/api/dashboard/alerts',
      '/api/dashboard/knowledge',
    ],
    owner: 'dashboard',
  },
];

export const premiumEndpointIndex = (): Record<string, PremiumFeatureId> =>
  PREMIUM_FEATURES.reduce(
    (acc, item) => {
      item.endpoints.forEach((endpoint) => {
        acc[endpoint] = item.feature;
      });
      return acc;
    },
    {} as Record<string, PremiumFeatureId>
  );
