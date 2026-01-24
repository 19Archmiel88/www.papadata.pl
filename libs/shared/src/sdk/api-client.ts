import type {
  HealthResponse,
  TenantSummary,
  IntegrationSummary,
  AIChatRequest,
  AIChatResponse,
  DashboardOverviewResponse,
  DashboardPandLResponse,
  DashboardAdsResponse,
  DashboardCustomersResponse,
  DashboardProductsResponse,
  DashboardGuardianResponse,
  DashboardAlertsResponse,
  DashboardKnowledgeResponse,
  SettingsWorkspaceResponse,
  SettingsOrgResponse,
  ExportCreateRequest,
  ExportCreateResponse,
  AuthMagicLinkRequest,
  AuthMagicLinkResponse,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  SupportContactRequest,
  SupportContactResponse,
  BillingSummary,
  BillingPortalResponse,
} from '../contracts/index.js';

export interface ApiClientOptions {
  baseUrl: string;
  fetcher: typeof fetch;
}

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/+$/, '');

const toQueryString = (params?: Record<string, string | number | undefined | null>) => {
  if (!params) return '';
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null);
  if (!entries.length) return '';
  const search = new URLSearchParams();
  entries.forEach(([key, value]) => search.set(key, String(value)));
  return `?${search.toString()}`;
};

export const createApiClient = ({ baseUrl, fetcher }: ApiClientOptions) => {
  const root = normalizeBaseUrl(baseUrl);

  const getJson = async <T>(path: string): Promise<T> => {
    const response = await fetcher(`${root}${path}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    return response.json() as Promise<T>;
  };

  const postJson = async <T, P>(path: string, payload: P): Promise<T> => {
    const response = await fetcher(`${root}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    return response.json() as Promise<T>;
  };

  return {
    health: () => getJson<HealthResponse>('/health'),
    authMagicLink: (payload: AuthMagicLinkRequest) =>
      postJson<AuthMagicLinkResponse, AuthMagicLinkRequest>('/auth/magic-link', payload),
    authLogin: (payload: AuthLoginRequest) =>
      postJson<AuthLoginResponse, AuthLoginRequest>('/auth/login', payload),
    authRegister: (payload: AuthRegisterRequest) =>
      postJson<AuthRegisterResponse, AuthRegisterRequest>('/auth/register', payload),
    tenants: () => getJson<TenantSummary[]>('/tenants'),
    integrations: () => getJson<IntegrationSummary[]>('/integrations'),
    integrationByProvider: (provider: string) =>
      getJson<IntegrationSummary>(`/integrations/${provider}`),
    aiChat: (payload: AIChatRequest) => postJson<AIChatResponse, AIChatRequest>('/ai/chat', payload),
    dashboardOverview: (params?: { timeRange?: string }) =>
      getJson<DashboardOverviewResponse>(`/dashboard/overview${toQueryString(params)}`),
    dashboardPandL: (params?: { timeRange?: string }) =>
      getJson<DashboardPandLResponse>(`/dashboard/pandl${toQueryString(params)}`),
    dashboardAds: (params?: { timeRange?: string }) =>
      getJson<DashboardAdsResponse>(`/dashboard/ads${toQueryString(params)}`),
    dashboardCustomers: (params?: { timeRange?: string }) =>
      getJson<DashboardCustomersResponse>(`/dashboard/customers${toQueryString(params)}`),
    dashboardProducts: (params?: { timeRange?: string }) =>
      getJson<DashboardProductsResponse>(`/dashboard/products${toQueryString(params)}`),
    dashboardGuardian: (params?: { timeRange?: string }) =>
      getJson<DashboardGuardianResponse>(`/dashboard/guardian${toQueryString(params)}`),
    dashboardAlerts: (params?: { timeRange?: string }) =>
      getJson<DashboardAlertsResponse>(`/dashboard/alerts${toQueryString(params)}`),
    dashboardKnowledge: () => getJson<DashboardKnowledgeResponse>('/dashboard/knowledge'),
    settingsWorkspace: () => getJson<SettingsWorkspaceResponse>('/settings/workspace'),
    settingsOrg: () => getJson<SettingsOrgResponse>('/settings/org'),
    createExport: (payload: ExportCreateRequest) =>
      postJson<ExportCreateResponse, ExportCreateRequest>('/exports', payload),
    supportContact: (payload: SupportContactRequest) =>
      postJson<SupportContactResponse, SupportContactRequest>('/support/contact', payload),
    billingSummary: () => getJson<BillingSummary>('/billing/summary'),
    billingPortal: () => postJson<BillingPortalResponse, Record<string, never>>('/billing/portal', {}),
  };
};
