import type { BillingSummary, Entitlements } from '@papadata/shared';

export const defaultEntitlements: Entitlements = {
  isPremiumAllowed: false,
  plan: 'starter',
  billingStatus: 'trial_expired',
  trialEndsAt: undefined,
  reason: 'uninitialized',
  limits: {
    maxSources: 0,
    reportCadence: 'weekly',
    aiTier: 'basic',
  },
  features: {
    ai: false,
    exports: false,
    integrations: false,
    reports: false,
  },
};

export const deriveEntitlements = (summary?: BillingSummary | null): Entitlements => {
  if (!summary) return defaultEntitlements;
  return summary.entitlements ?? defaultEntitlements;
};

export const computeIsAccountActive = (
  summary: BillingSummary | null,
  trialExpired: boolean,
  isDemo: boolean
): boolean => {
  if (isDemo) return true;
  return Boolean(
    summary &&
      (summary.billingStatus === 'active' ||
        (summary.billingStatus === 'trialing' && !trialExpired))
  );
};

export const computeAiEnabled = (
  entitlements: Entitlements,
  trialExpired: boolean,
  isDemo: boolean
): boolean => {
  if (isDemo) return true;
  const isActive =
    entitlements.billingStatus === 'active' ||
    (entitlements.billingStatus === 'trialing' && !trialExpired);
  return Boolean(entitlements.features.ai && isActive);
};

export const computeIsDataStale = (lastUpdate: Date | null, now: Date, thresholdMs = 4 * 60 * 60 * 1000) =>
  !lastUpdate || now.getTime() - lastUpdate.getTime() > thresholdMs;
