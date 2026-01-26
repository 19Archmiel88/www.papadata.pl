import type { TenantStatusPayload } from '@papadata/shared';
import { apiGet } from './api';

export type { TenantStatusPayload } from '@papadata/shared';

export const getTenantStatus = async (tenantId: string): Promise<TenantStatusPayload> => {
  const encoded = encodeURIComponent(tenantId.trim());
  return apiGet<TenantStatusPayload>(`/tenants/${encoded}/status`);
};
