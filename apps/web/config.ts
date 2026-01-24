import { devLog } from './utils/devlog';

type ObservabilityProvider = 'none' | 'sentry';

export type WebConfig = {
  env: string;
  api: {
    baseUrl: string;
    timeoutMs: number;
    aiTimeoutMs: number;
    retryMax: number;
    retryDelayMs: number;
  };
  legalDocsBaseUrl?: string;
  observability: {
    provider: ObservabilityProvider;
    dsn: string;
    environment: string;
    release?: string;
  };
  analytics: {
    gtmId?: string;
    ga4Id?: string;
    googleAdsId?: string;
    metaPixelId?: string;
  };
  aiClientRateLimit: {
    max: number;
    windowMs: number;
  };
};

const parseNumber = (value: unknown, fallback: number, min = 0): number => {
  if (typeof value !== 'string') return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  if (n < min) return fallback;
  return n;
};

// Provide test defaults for Playwright CT and Node
const TEST_DEFAULT_ENV: Record<string, unknown> = {
  VITE_APP_ENV: 'test',
  MODE: 'test',
  VITE_API_BASE_URL: '/api',
  VITE_API_TIMEOUT_MS: '25000',
  VITE_API_AI_TIMEOUT_MS: '60000',
  VITE_API_RETRY_MAX: '2',
  VITE_API_RETRY_DELAY_MS: '300',
  VITE_LEGAL_DOCS_BASE_URL: '',
  VITE_OBSERVABILITY_PROVIDER: 'none',
  VITE_OBSERVABILITY_DSN: '',
  VITE_APP_RELEASE: '',
  VITE_GTM_ID: '',
  VITE_GA4_ID: '',
  VITE_GOOGLE_ADS_ID: '',
  VITE_META_PIXEL_ID: '',
  VITE_AI_CLIENT_RATE_LIMIT_MAX: '6',
  VITE_AI_CLIENT_RATE_LIMIT_WINDOW_MS: '60000',
};

// Fallback for import.meta.env in non-Vite/test environments
const getEnv = (): Record<string, unknown> => {
  // Vite exposes env via import.meta.env, but touching `import.meta` can throw
  // in non-module / non-vite runtimes, so guard with try/catch.
  try {
    const env = (import.meta as any)?.env;
    if (env && typeof env === 'object') {
      return env as Record<string, unknown>;
    }
  } catch {
    // ignore
  }

  // Node/test runtimes: return stable defaults
  return TEST_DEFAULT_ENV;
};

const getEnvString = (key: string): string => {
  const v = getEnv()[key];
  return typeof v === 'string' ? v.trim() : '';
};

let cachedConfig: WebConfig | null = null;

export const getWebConfig = (): WebConfig => {
  if (cachedConfig) return cachedConfig;

  const envRaw = getEnv();
  const env = String(envRaw.VITE_APP_ENV ?? envRaw.MODE ?? 'dev').trim();

  const baseUrl = getEnvString('VITE_API_BASE_URL') || '/api';
  const timeoutMs = parseNumber(getEnvString('VITE_API_TIMEOUT_MS'), 25_000, 1);
  const aiTimeoutMs = parseNumber(getEnvString('VITE_API_AI_TIMEOUT_MS'), 60_000, 1);
  const retryMax = parseNumber(getEnvString('VITE_API_RETRY_MAX'), 2, 0);
  const retryDelayMs = parseNumber(getEnvString('VITE_API_RETRY_DELAY_MS'), 300, 0);

  const legalDocsBaseUrl = getEnvString('VITE_LEGAL_DOCS_BASE_URL') || undefined;

  const rawProvider = getEnvString('VITE_OBSERVABILITY_PROVIDER').toLowerCase() || 'none';
  const dsn = getEnvString('VITE_OBSERVABILITY_DSN');
  const release = getEnvString('VITE_APP_RELEASE') || undefined;

  const provider: ObservabilityProvider = rawProvider === 'sentry' ? 'sentry' : 'none';

  cachedConfig = {
    env,
    api: {
      baseUrl,
      timeoutMs,
      aiTimeoutMs,
      retryMax,
      retryDelayMs,
    },
    legalDocsBaseUrl,
    observability: {
      provider: provider !== 'none' && !dsn ? 'none' : provider,
      dsn,
      environment: env,
      release,
    },
    analytics: {
      gtmId: getEnvString('VITE_GTM_ID') || undefined,
      ga4Id: getEnvString('VITE_GA4_ID') || undefined,
      googleAdsId: getEnvString('VITE_GOOGLE_ADS_ID') || undefined,
      metaPixelId: getEnvString('VITE_META_PIXEL_ID') || undefined,
    },
    aiClientRateLimit: {
      max: parseNumber(getEnvString('VITE_AI_CLIENT_RATE_LIMIT_MAX'), 6, 1),
      windowMs: parseNumber(getEnvString('VITE_AI_CLIENT_RATE_LIMIT_WINDOW_MS'), 60_000, 1),
    },
  };

  return cachedConfig;
};

export const validateWebConfig = (): void => {
  const config = getWebConfig();

  if (config.observability.provider !== 'none' && !config.observability.dsn) {
    devLog('warn', '[config] Observability provider set but DSN is missing.');
  }

  if (!config.api.baseUrl) {
    devLog('warn', '[config] API base URL is empty; falling back to /api.');
  }

  if (config.api.timeoutMs <= 0) {
    devLog('warn', '[config] API timeout is invalid; using default.');
  }

  if (config.aiClientRateLimit.max <= 0 || config.aiClientRateLimit.windowMs <= 0) {
    devLog('warn', '[config] AI client rate limit values are invalid; using defaults.');
  }
};
