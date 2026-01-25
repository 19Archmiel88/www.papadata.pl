import React from 'react';
import { Translation } from '../../types';
import { IntegrationItem } from '../../data/integrations';
import type { BillingStatus, IntegrationSummary, TenantSummary } from '@papadata/shared';
import type { TenantStatusPayload } from '../../data/tenantStatus';

export type TimeRange = '1d' | '7d' | '30d' | '90d' | 'mtd' | 'qtd' | 'ytd' | 'custom';
export type IntegrationConnectionState = 'idle' | 'connecting' | 'connected';

// Normalizujemy wartości (mniej ryzyka porównań stringów w wielu miejscach)
export type AppMode = 'demo' | 'trial' | 'prod';
export type PlanTier = 'Starter' | 'Professional' | 'Enterprise';
export type SessionStatus = 'ready' | 'processing' | 'error';

// EU-only teraz, ale typ gotowy do rozszerzeń
export type GcpRegion = 'europe-central2' | 'europe-west1';

// Capabilities zamiast “zgadywania” po isDemo/planTier
export type DashboardCapability =
  | 'export'
  | 'create_reports'
  | 'create_alerts'
  | 'mute_alerts'
  | 'manage_integrations'
  | 'manage_subscription'
  | 'ai_write'; // np. możliwość wysyłania akcji do AI (nie tylko read-only)

export interface DashboardOutletContext {
  // i18n
  t: Translation;

  // Time selection (global)
  timeRange: TimeRange;

  // Legacy flag used by existing views (zostawiamy dla kompatybilności)
  // Źródłem prawdy docelowo jest appMode + isReadOnly + permissions
  isDemo: boolean;

  // CTA / billing
  onUpgrade: () => void;

  // Integrations & tenants / backend sync
  integrationStatus: Record<string, IntegrationConnectionState>;
  onIntegrationConnect: (item: IntegrationItem) => void;
  openIntegrationModal?: (item: IntegrationItem, onConnect?: (item: IntegrationItem) => void) => void;

  tenants?: TenantSummary[];
  integrationsRemote?: IntegrationSummary[];
  apiAvailable?: boolean;
  apiError?: string | null;
  lastApiSync?: string | null;
  tenantsLoading?: boolean;
  integrationsLoading?: boolean;
  refreshTenants?: () => void;
  refreshIntegrations?: () => void;

  // Global state (Topbar/Badges) – zgodnie z dokumentacją UX
  appMode?: AppMode; // 'demo' | 'trial' | 'prod'
  planTier?: PlanTier;
  billingStatus?: BillingStatus;

  // Trial (14 dni Professional -> po płatności Starter/Professional)
  trialDaysLeft?: number | null;
  trialExpired?: boolean;

  // Access control / enterprise
  isReadOnly?: boolean; // np. demo-only lub brak uprawnień
  canManageSubscription?: boolean;
  onManageSubscription?: () => void;

  // Sesja / świeżość danych
  sessionStatus?: SessionStatus;
  lastUpdateLabel?: string | null;
  isDataStale?: boolean;

  // Data readiness
  tenantStatus?: TenantStatusPayload | null;
  tenantStatusLoading?: boolean;
  tenantStatusError?: string | null;

  // Capabilities for gating UI actions (enterprise-ready)
  permissions?: Partial<Record<DashboardCapability, boolean>>;

  // Local demo connectors & privacy settings
  connectors: Record<string, boolean>;
  setConnectors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

  retentionDays: number;
  setRetentionDays: React.Dispatch<React.SetStateAction<number>>;

  maskingEnabled: boolean;
  setMaskingEnabled: React.Dispatch<React.SetStateAction<boolean>>;

  region: GcpRegion;
  setRegion: React.Dispatch<React.SetStateAction<GcpRegion>>;

  // AI context & filters used przez widoki (Ads, Customers, Alerts itd.)
  contextLabel?: string | null;
  setContextLabel?: (value: string | null) => void;

  aiDraft?: string | null;
  setAiDraft?: (value: string | null) => void;

  // filtry globalne (np. channel, country, device...)
  filters?: Partial<Record<string, string>>;
  setFilters?: React.Dispatch<React.SetStateAction<Partial<Record<string, string>>>>;

  compareMode?: string;
  attributionModel?: string;

  // AI mode (np. panel w trybie “assist”)
  aiMode?: boolean;
  setAiMode?: React.Dispatch<React.SetStateAction<boolean>>;
}
