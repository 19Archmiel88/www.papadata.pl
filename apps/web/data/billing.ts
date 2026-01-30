import type {
  BillingCheckoutSessionRequest,
  BillingCheckoutSessionResponse,
  BillingStatusResponse,
} from '@papadata/shared';
import { apiGet, apiPost } from './api';

export const createCheckoutSession = async (
  payload: BillingCheckoutSessionRequest
): Promise<BillingCheckoutSessionResponse> => {
  return apiPost<BillingCheckoutSessionResponse>('/billing/checkout-session', payload);
};

export const getBillingStatus = async (tenantId?: string): Promise<BillingStatusResponse> => {
  const query = tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : '';
  return apiGet<BillingStatusResponse>(`/billing/status${query}`);
};
