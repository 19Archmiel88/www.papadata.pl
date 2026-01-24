import type { AppMode } from './common.js';
import type { Entitlements } from './entitlements.js';
import type {
  KPIValue,
  TimeseriesPoint,
  TableRow,
  DataQuality,
  DataFreshnessSource,
} from './analytics.js';

export type DashboardAlertSeverity = 'critical' | 'warning' | 'info';

export interface DashboardAlert {
  id: string;
  title: string;
  impact: string;
  time: string;
  severity: DashboardAlertSeverity;
  context?: string;
  target?: string;
}

export interface DashboardOverviewResponse {
  mode?: AppMode;
  generatedAt?: string;
  kpis: KPIValue[];
  series: {
    revenueSpend: TimeseriesPoint[];
    roasCpa: TimeseriesPoint[];
  };
  campaigns: TableRow[];
  skus: TableRow[];
  alerts: DashboardAlert[];
  dataQuality?: DataQuality;
}

export interface DashboardPandLResponse {
  mode?: AppMode;
  generatedAt?: string;
  currency?: string;
  summary: {
    revenue: number;
    grossProfit: number;
    netProfit: number;
    contributionMargin: number;
    netMargin: number;
    tax: number;
  };
  breakdown: {
    cogs: number;
    fees: number;
    refunds: number;
    shipping: number;
    adSpend: number;
    payroll: number;
    tools: number;
  };
  waterfall: Array<{
    label: string;
    value: number;
    type: 'positive' | 'negative';
  }>;
}

export interface DashboardAdsResponse {
  mode?: AppMode;
  generatedAt?: string;
  kpis: KPIValue[];
  series: {
    spendRevenue: TimeseriesPoint[];
    roasCpa: TimeseriesPoint[];
  };
  channels: TableRow[];
  campaigns: TableRow[];
  dataQuality?: DataQuality;
  drilldown?: {
    level_campaign: string;
    level_adset: string;
    level_creative: string;
  };
}

export interface DashboardCustomersResponse {
  mode?: AppMode;
  generatedAt?: string;
  kpis: KPIValue[];
  cohorts: TableRow[];
  segments: TableRow[];
}

export interface DashboardProductsResponse {
  mode?: AppMode;
  generatedAt?: string;
  kpis: KPIValue[];
  skus: TableRow[];
  movers: TableRow[];
}

export interface DashboardGuardianResponse {
  mode?: AppMode;
  generatedAt?: string;
  dataQuality: DataQuality;
  sources: DataFreshnessSource[];
  issues: DashboardAlert[];
}

export interface DashboardAlertsResponse {
  mode?: AppMode;
  generatedAt?: string;
  alerts: DashboardAlert[];
  summary?: {
    critical: number;
    warning: number;
    info: number;
  };
}

export interface DashboardKnowledgeItem {
  id: string;
  title: string;
  category?: string;
  level?: string;
  type?: string;
  module?: string;
  summary?: string;
}

export interface DashboardKnowledgeResponse {
  mode?: AppMode;
  generatedAt?: string;
  resources: DashboardKnowledgeItem[];
}

export interface SettingsWorkspaceResponse {
  mode?: AppMode;
  generatedAt?: string;
  retentionDays: number;
  retentionOptions: number[];
  regions: string[];
  maskingEnabled: boolean;
  attributionModels: string[];
  connectors: Array<{ id: string; name: string; enabled: boolean }>;
}

export interface SettingsOrgUser {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'invited' | 'disabled';
}

export interface SettingsOrgResponse {
  mode?: AppMode;
  generatedAt?: string;
  company: {
    name: string;
    region: string;
  };
  users: SettingsOrgUser[];
  billing: {
    plan: string;
    status: string;
    renewalDate?: string;
  };
  entitlements?: Entitlements;
}
