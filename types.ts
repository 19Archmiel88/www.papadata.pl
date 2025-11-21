export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  companyName?: string;
  role: UserRole;
  hasCompletedOnboarding: boolean;
}

export enum IntegrationType {
  SHOPIFY = 'Shopify',
  WOOCOMMERCE = 'WooCommerce',
  GOOGLE_ADS = 'Google Ads',
  FACEBOOK_ADS = 'Facebook Ads',
  AMAZON = 'Amazon Marketplace'
}

export enum IntegrationCategory {
  STORE = 'E-Commerce Store',
  MARKETING = 'Marketing & Ads',
  MARKETPLACE = 'Marketplace'
}

export const IntegrationMeta: Record<IntegrationType, { category: IntegrationCategory; icon: string }> = {
  [IntegrationType.SHOPIFY]: { category: IntegrationCategory.STORE, icon: '🛍️' },
  [IntegrationType.WOOCOMMERCE]: { category: IntegrationCategory.STORE, icon: '🟣' },
  [IntegrationType.GOOGLE_ADS]: { category: IntegrationCategory.MARKETING, icon: '📈' },
  [IntegrationType.FACEBOOK_ADS]: { category: IntegrationCategory.MARKETING, icon: '📘' },
  [IntegrationType.AMAZON]: { category: IntegrationCategory.MARKETPLACE, icon: '📦' }
};

export enum ConnectionStatus {
  PENDING = 'PENDING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}

export interface IntegrationSecret {
  key: string;
  label: string;
  value: string;
}

export interface OnboardingData {
  // Step 1: Client Details
  companyName: string;
  clientId: string; 
  timezone: string;
  currency: string;
  retentionDays: number;
  consents: boolean;
  technicalEmail: string;
  
  // Step 2: Integrations
  integrations: IntegrationType[];
  
  // Step 3: Secrets (Map integration ID to credential object)
  secrets: Record<string, Record<string, string>>; 
  connectionStatuses: Record<string, ConnectionStatus>;

  // Step 4: Schedule
  etlSchedule: {
    frequency: 'hourly' | 'daily' | 'weekly';
    window: 'rolling_30' | 'all_time';
    backfill: boolean;
  };
  
  // Step 5: Confirmation
  bqBudget?: number;
}

export enum ViewState {
  LANDING = 'LANDING',
  AUTH_LOGIN = 'AUTH_LOGIN',
  AUTH_REGISTER = 'AUTH_REGISTER',
  AUTH_2FA = 'AUTH_2FA',
  AUTH_RESET = 'AUTH_RESET',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD'
}

export interface KPIData {
  revenue: { value: number; trend: number; history: number[] };
  sessions: { value: number; trend: number; history: number[] };
  orders: { value: number; trend: number; history: number[] };
  etlPerformance: { avgDuration: number; history: {time: string, dur: number}[] };
  dataQuality: { healthyPct: number; history: {day: string, success: number, failed: number}[] };
}

export interface ProvisioningStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed';
}

// --- EPIC H Types: Data Health ---
export interface JobLog {
  id: string;
  name: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILURE';
  timestamp: string;
  duration: string;
}

export interface HealthMetric {
  name: string;
  status: 'OK' | 'WARNING' | 'CRITICAL';
  value: string;
  slaThreshold: string;
}

export interface HealthData {
  overallScore: number; // 0-100
  freshness: string;
  pipelineStatus: 'Active' | 'Degraded' | 'Down';
  metrics: HealthMetric[];
  recentJobs: JobLog[];
  aiRecommendations: string[];
}

// --- EPIC I Types: Language ---
export type LanguageCode = 'en' | 'pl' | 'de' | 'fr';