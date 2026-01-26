import { apiGet } from './api';

export type AdminAiUsage = {
  tenantId: string;
  periodStart: string;
  periodEnd: string;
  requestsCount: number;
  tokensIn: number;
  tokensOut: number;
};

export type AdminSources = {
  tenantId: string;
  activeCount: number;
};

export type AdminBilling = {
  billingStatus?: string;
  plan?: string;
  trialEndsAt?: string | null;
  currentPeriodEnd?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
};

const withTenantQuery = (path: string, tenantId?: string) => {
  if (!tenantId) return path;
  const query = `tenantId=${encodeURIComponent(tenantId)}`;
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
};

export const fetchAdminAiUsage = (tenantId?: string): Promise<AdminAiUsage> =>
  apiGet<AdminAiUsage>(withTenantQuery('/admin/ai-usage', tenantId));

export const fetchAdminSources = (tenantId?: string): Promise<AdminSources> =>
  apiGet<AdminSources>(withTenantQuery('/admin/sources', tenantId));

export const fetchAdminBilling = (tenantId?: string): Promise<AdminBilling> =>
  apiGet<AdminBilling>(withTenantQuery('/admin/billing', tenantId));
