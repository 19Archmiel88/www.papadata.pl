export enum AppView {
  WIZARD = 'WIZARD',
  TERMINAL = 'TERMINAL',
  DASHBOARD = 'DASHBOARD',
}

export interface CompanyDetails {
  nip: string;
  name: string;
  address: string;
  industry: string;
  currency: string;
  timezone: string;
  email: string;
  notifications: boolean;
  termsAccepted: boolean;
}

export interface Integration {
  id: string;
  name: string;
  category: 'store' | 'ads' | 'analytics' | 'tools';
  descriptionPL: string;
  descriptionEN: string;
  icon: string;
  available: boolean;
  type: 'oauth' | 'apikey';
  fields?: string[];
}

export interface WizardState {
  step: number;
  company: CompanyDetails;
  selectedIntegrations: string[];
  integrationStatus: Record<string, 'pending' | 'connected' | 'error'>;
}

export interface DashboardState {
  etlStatus: {
    woo: 'loading' | 'done';
    googleAds: 'loading' | 'done';
    metaAds: 'loading' | 'done';
  };
  blueprintSubmitted: boolean;
}
