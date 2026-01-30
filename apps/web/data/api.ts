import {
  createApiClient,
  type DashboardPandLResponse,
  type DashboardOverviewResponse,
  type DashboardAdsResponse,
  type DashboardCustomersResponse,
  type DashboardProductsResponse,
  type DashboardGuardianResponse,
  type DashboardAlertsResponse,
  type DashboardKnowledgeResponse,
  type SettingsWorkspaceResponse,
  type SettingsOrgResponse,
  type IntegrationSummary,
} from '@papadata/shared';
import { getWebConfig } from '../config';
import { safeLocalStorage } from '../utils/safeLocalStorage';

type ApiRuntimeConfig = {
  getToken?: () => string | null;
  onUnauthorized?: () => void;
};

type ApiTelemetryContext = {
  env?: string;
  mode?: string;
};

export type ApiRequestOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
  headers?: HeadersInit;
};

export type ApiRequestErrorCode = 'HTTP_ERROR' | 'NETWORK_ERROR' | 'TIMEOUT';

export class ApiRequestError extends Error {
  code: ApiRequestErrorCode;
  status?: number;
  requestId?: string;

  constructor(message: string, code: ApiRequestErrorCode, status?: number, requestId?: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
    this.status = status;
    this.requestId = requestId;
  }
}

let runtimeConfig: ApiRuntimeConfig = {
  getToken: () => null,
  onUnauthorized: undefined,
};
let telemetryContext: ApiTelemetryContext | null = null;
let cachedClient: ReturnType<typeof createApiClient> | null = null;
let cachedBaseUrl = '';

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/+$/, '');

const getApiBaseUrl = (): string => {
  const base = normalizeBaseUrl(getWebConfig().api.baseUrl || '/api');
  if (cachedBaseUrl !== base) {
    cachedBaseUrl = base;
    cachedClient = null;
  }
  return base;
};

const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

const mergeQuery = (
  url: string,
  params?: Record<string, string | number | undefined | null>
): string => {
  if (!params) return url;
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null
  );
  if (!entries.length) return url;

  const [base, rawQuery] = url.split('?');
  const search = new URLSearchParams(rawQuery ?? '');
  entries.forEach(([key, value]) => search.set(key, String(value)));

  const queryString = search.toString();
  return queryString ? `${base}?${queryString}` : base;
};

const buildUrl = (
  path: string,
  params?: Record<string, string | number | undefined | null>
): string => {
  const baseUrl = getApiBaseUrl();
  const resolved = isAbsoluteUrl(path)
    ? path
    : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  return mergeQuery(resolved, params);
};

const createRequestId = (): string => {
  const randomId =
    typeof globalThis !== 'undefined' ? globalThis.crypto?.randomUUID?.() : undefined;
  if (randomId) return randomId;
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return safeLocalStorage.getItem('papadata_auth_token');
};

const getStoredTenantId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return safeLocalStorage.getItem('pd_active_tenant_id');
};

const buildHeaders = (
  existing?: HeadersInit,
  options?: { includeJsonContentType?: boolean; requestId?: string }
): Headers => {
  const headers = new Headers(existing);

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (options?.includeJsonContentType && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = runtimeConfig.getToken?.() ?? getStoredToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const tenantId = getStoredTenantId();
  if (tenantId && !headers.has('x-tenant-id')) {
    headers.set('x-tenant-id', tenantId);
  }

  const requestId = options?.requestId ?? headers.get('x-request-id') ?? createRequestId();
  headers.set('x-request-id', requestId);

  if (telemetryContext?.env && !headers.has('x-app-env')) {
    headers.set('x-app-env', telemetryContext.env);
  }

  if (telemetryContext?.mode && !headers.has('x-app-mode')) {
    headers.set('x-app-mode', telemetryContext.mode);
  }

  return headers;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }
  const text = await response.text();
  return text as T;
};

const resolveErrorMessage = async (response: Response): Promise<string> => {
  try {
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      if (data && typeof data === 'object') {
        const message = (data as { message?: string }).message;
        if (message) return String(message);
      }
    }
  } catch {
    // ignore
  }
  return response.statusText || 'Request failed.';
};

export const configureApiRuntime = (config: ApiRuntimeConfig): void => {
  runtimeConfig = {
    getToken: config.getToken ?? (() => null),
    onUnauthorized: config.onUnauthorized,
  };
};

export const setApiTelemetryContext = (context: ApiTelemetryContext | null): void => {
  telemetryContext = context;
};

const apiFetcher: typeof fetch = (input, init) => {
  const headers = buildHeaders(init?.headers, { requestId: undefined });
  return fetch(input, { ...init, headers });
};

export const getApiClient = () => {
  if (!cachedClient) {
    cachedClient = createApiClient({
      baseUrl: getApiBaseUrl(),
      fetcher: apiFetcher,
    });
  }
  return cachedClient;
};

export const apiRequestRaw = async (
  method: string,
  path: string,
  body?: unknown,
  options?: ApiRequestOptions
): Promise<Response> => {
  const url = buildUrl(path);
  const timeoutMs = options?.timeoutMs ?? getWebConfig().api.timeoutMs;

  const controller = new AbortController();
  let didTimeout = false;
  const setTimeoutFn = typeof window === 'undefined' ? globalThis.setTimeout : window.setTimeout;
  const clearTimeoutFn =
    typeof window === 'undefined' ? globalThis.clearTimeout : window.clearTimeout;

  if (options?.signal) {
    if (options.signal.aborted) {
      controller.abort();
    } else {
      options.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  const timeoutId = setTimeoutFn(() => {
    didTimeout = true;
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers: buildHeaders(options?.headers, { includeJsonContentType: Boolean(body) }),
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 401 && runtimeConfig.onUnauthorized) {
        runtimeConfig.onUnauthorized();
      }
      const requestId = response.headers.get('x-request-id') ?? undefined;
      const message = await resolveErrorMessage(response);
      throw new ApiRequestError(message, 'HTTP_ERROR', response.status, requestId);
    }

    return response;
  } catch (err: unknown) {
    if (err instanceof ApiRequestError) throw err;

    if ((err as { name?: string } | null)?.name === 'AbortError') {
      const message = didTimeout ? 'Request timeout' : 'Request aborted';
      throw new ApiRequestError(message, 'TIMEOUT');
    }

    const message = err instanceof Error ? err.message : 'Network error';
    throw new ApiRequestError(message, 'NETWORK_ERROR');
  } finally {
    clearTimeoutFn(timeoutId);
  }
};

const apiRequest = async <T>(
  method: string,
  path: string,
  body?: unknown,
  options?: ApiRequestOptions
): Promise<T> => {
  const response = await apiRequestRaw(method, path, body, options);
  return parseResponse<T>(response);
};

export const apiGet = async <T>(path: string, options?: ApiRequestOptions): Promise<T> => {
  return apiRequest<T>('GET', path, undefined, options);
};

export const apiPost = async <T>(
  path: string,
  body?: unknown,
  options?: ApiRequestOptions
): Promise<T> => {
  return apiRequest<T>('POST', path, body, options);
};

const toQueryString = (params?: Record<string, string | number | undefined | null>): string => {
  if (!params) return '';
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null
  );
  if (!entries.length) return '';
  const search = new URLSearchParams();
  entries.forEach(([key, value]) => search.set(key, String(value)));
  return `?${search.toString()}`;
};

export const fetchDashboardOverview = (params?: { timeRange?: string }) =>
  apiGet<DashboardOverviewResponse>(`/dashboard/overview${toQueryString(params)}`);

export const fetchDashboardPandL = (params?: { timeRange?: string }) =>
  apiGet<DashboardPandLResponse>(`/dashboard/pandl${toQueryString(params)}`);

export const fetchDashboardAds = (params?: { timeRange?: string }) =>
  apiGet<DashboardAdsResponse>(`/dashboard/ads${toQueryString(params)}`);

export const fetchDashboardCustomers = (params?: { timeRange?: string }) =>
  apiGet<DashboardCustomersResponse>(`/dashboard/customers${toQueryString(params)}`);

export const fetchDashboardProducts = (params?: { timeRange?: string }) =>
  apiGet<DashboardProductsResponse>(`/dashboard/products${toQueryString(params)}`);

export const fetchDashboardGuardian = (params?: { timeRange?: string }) =>
  apiGet<DashboardGuardianResponse>(`/dashboard/guardian${toQueryString(params)}`);

export const fetchDashboardAlerts = (params?: { timeRange?: string }) =>
  apiGet<DashboardAlertsResponse>(`/dashboard/alerts${toQueryString(params)}`);

export const fetchDashboardKnowledge = () =>
  apiGet<DashboardKnowledgeResponse>('/dashboard/knowledge');

export const fetchSettingsWorkspace = () =>
  apiGet<SettingsWorkspaceResponse>('/settings/workspace');

export const fetchSettingsOrg = () => apiGet<SettingsOrgResponse>('/settings/org');

export const fetchIntegrations = () => apiGet<IntegrationSummary[]>('/integrations');
