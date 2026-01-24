import type { BillingStatus, Entitlements, PlanId } from './entitlements.js';

export interface BillingSummary {
  entitlements: Entitlements;
  plan: PlanId;
  billingStatus: BillingStatus;
  trialEndsAt?: string | null;
  trialDaysLeft?: number | null;
  isTrial: boolean;
  isTrialExpired: boolean;
  canManageSubscription: boolean;
  portalUrl?: string | null;
}

export interface BillingPortalResponse {
  portalUrl: string;
}

export interface BillingStatusResponse {
  plan: string;
  trialEndsAt?: string | null;
  subscriptionStatus: string;
}

export interface BillingCheckoutSessionRequest {
  tenantId?: string;
  planId: string;
}

export interface BillingCheckoutSessionResponse {
  url: string;
}
