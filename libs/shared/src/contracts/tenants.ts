import { AppMode } from './common.js';

export type TenantStatus = 'active' | 'pending' | 'suspended';

export interface TenantSummary {
  id: string;
  name: string;
  mode: AppMode;
  status: TenantStatus;
}

export type TenantStatusMode = 'empty' | 'processing' | 'live' | 'demo';

export interface TenantStatusPayload {
  mode: TenantStatusMode;
  lastSyncAt?: string;
  hasIntegrations: boolean;
  coverage?: number;
}
