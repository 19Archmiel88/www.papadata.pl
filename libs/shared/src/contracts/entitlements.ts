export type PlanId = 'starter' | 'professional' | 'enterprise';
export type BillingStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'trial_expired';
export type ReportCadence = 'weekly' | 'daily' | 'realtime';
export type AiTier = 'basic' | 'priority' | 'full';

export interface Entitlements {
  isPremiumAllowed: boolean;
  plan: PlanId;
  billingStatus: BillingStatus;
  trialEndsAt?: string;
  reason?: string;
  limits: {
    maxSources: number;
    reportCadence: ReportCadence;
    aiTier: AiTier;
  };
  features: {
    ai: boolean;
    exports: boolean;
    integrations: boolean;
    reports: boolean;
  };
}
