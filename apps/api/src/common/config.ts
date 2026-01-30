export type NodeEnv = 'development' | 'production' | 'test' | string;

export type ApiConfig = {
  nodeEnv: NodeEnv;
  appMode: 'demo' | 'prod';
  port: number;
  cacheTtlMs: number;
  corsAllowedOrigins: string[];
  database: {
    url?: string;
    poolMax: number;
    sslEnabled: boolean;
    sslRejectUnauthorized: boolean;
  };
  observability: {
    provider: 'none' | 'sentry';
    dsn: string;
    environment: string;
  };
  auth: {
    jwtSecret?: string;
    jwtIssuer?: string;
    jwtAudience?: string;
    jwtExpiresInSeconds: number;
    ownerEmails: string[];
    adminEmails: string[];
    firebaseProjectId?: string;
  };
  ai: {
    enabled: boolean;
    enabledDemo: boolean;
    enabledProd: boolean;
    rateLimitMax: number;
    rateLimitWindowMs: number;
    timeoutMs: number;
    vertexProjectId: string;
    vertexLocation: string;
    vertexModel: string;
  };
  aiUsage: {
    limitBasic: number;
    limitPriority: number;
    limitFull: number;
  };
  throttling: {
    ttlMs: number;
    limit: number;
    redisUrl?: string;
  };
  entitlements: {
    cacheTtlMs: number;
    plan?: string;
    billingStatus?: string;
    trialEndsAt?: string;
    gracePeriodDays: number;
    maxSources?: string;
    reportCadence?: string;
    aiTier?: string;
    featureAi: boolean;
    featureExports: boolean;
    featureIntegrations: boolean;
    featureReports: boolean;
  };
  stripe: {
    secretKey?: string;
    customerId?: string;
    customerMap?: string;
    priceStarter?: string;
    priceProfessional?: string;
    priceEnterprise?: string;
    portalReturnUrl?: string;
    webhookSecret?: string;
  };
  exportBaseUrl?: string;
};

const parseNumber = (value: string | undefined, fallback: number): number => {
  if (value === undefined) return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : fallback;
};

const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  return fallback;
};

const parseCsv = (value: string | undefined): string[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

let cachedConfig: ApiConfig | null = null;

export const resetApiConfig = (): void => {
  cachedConfig = null;
};

export const getApiConfig = (): ApiConfig => {
  if (cachedConfig) return cachedConfig;

  const nodeEnv: NodeEnv = process.env.NODE_ENV ?? 'development';

  const appMode: ApiConfig['appMode'] =
    (process.env.APP_MODE ?? '').trim().toLowerCase() === 'demo' ? 'demo' : 'prod';

  const corsAllowedOrigins = parseCsv(process.env.CORS_ALLOWED_ORIGINS);
  const requireExplicitCors = appMode === 'prod' && nodeEnv === 'production';
  if (requireExplicitCors && corsAllowedOrigins.length === 0) {
    throw new Error('CORS_ALLOWED_ORIGINS must be set in prod mode.');
  }

  const resolvedCorsAllowedOrigins =
    corsAllowedOrigins.length > 0
      ? corsAllowedOrigins
      : ['http://localhost:3000', 'http://localhost:5173'];

  const config: ApiConfig = {
    nodeEnv,
    appMode,
    port: parseNumber(process.env.PORT, 4000),
    cacheTtlMs: parseNumber(process.env.DASHBOARD_CACHE_TTL_MS ?? process.env.CACHE_TTL_MS, 15000),
    corsAllowedOrigins: resolvedCorsAllowedOrigins,
    database: {
      url: process.env.DATABASE_URL,
      poolMax: parseNumber(process.env.DATABASE_POOL_MAX, 10),
      sslEnabled: parseBoolean(process.env.DATABASE_SSL_ENABLED, true),
      sslRejectUnauthorized: parseBoolean(process.env.DATABASE_SSL_REJECT_UNAUTHORIZED, true),
    },
    observability: {
      provider: (process.env.OBSERVABILITY_PROVIDER ?? 'none') === 'sentry' ? 'sentry' : 'none',
      dsn: process.env.OBSERVABILITY_DSN ?? '',
      environment: process.env.NODE_ENV ?? 'development',
    },
    auth: {
      jwtSecret: process.env.JWT_SECRET,
      jwtIssuer: process.env.JWT_ISSUER,
      jwtAudience: process.env.JWT_AUDIENCE,
      jwtExpiresInSeconds: parseNumber(process.env.JWT_EXPIRES_IN_SECONDS, 3600),
      ownerEmails: parseCsv(process.env.AUTH_OWNER_EMAILS),
      adminEmails: parseCsv(process.env.AUTH_ADMIN_EMAILS),
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    },
    ai: {
      enabled: parseBoolean(process.env.AI_ENABLED, true),
      enabledDemo: parseBoolean(process.env.AI_ENABLED_DEMO, true),
      enabledProd: parseBoolean(process.env.AI_ENABLED_PROD, true),
      rateLimitMax: parseNumber(process.env.AI_RATE_LIMIT_MAX, 30),
      rateLimitWindowMs: parseNumber(process.env.AI_RATE_LIMIT_WINDOW_MS, 60000),
      timeoutMs: parseNumber(process.env.AI_TIMEOUT_MS, 12000),
      vertexProjectId: process.env.VERTEX_PROJECT_ID ?? '',
      vertexLocation: process.env.VERTEX_LOCATION ?? '',
      vertexModel: process.env.VERTEX_MODEL ?? 'gemini-2.5-flash-lite',
    },
    aiUsage: {
      limitBasic: parseNumber(process.env.AI_USAGE_LIMIT_BASIC, 50),
      limitPriority: parseNumber(process.env.AI_USAGE_LIMIT_PRIORITY, 500),
      limitFull: parseNumber(process.env.AI_USAGE_LIMIT_FULL, 2000),
    },
    throttling: {
      ttlMs: parseNumber(process.env.THROTTLE_TTL_MS, 60000),
      limit: parseNumber(process.env.THROTTLE_LIMIT, 100),
      redisUrl: process.env.THROTTLE_REDIS_URL ?? process.env.REDIS_URL,
    },
    entitlements: {
      cacheTtlMs: parseNumber(process.env.ENTITLEMENTS_CACHE_TTL_MS, 30000),
      plan: process.env.ENTITLEMENTS_PLAN,
      billingStatus: process.env.ENTITLEMENTS_BILLING_STATUS,
      trialEndsAt: process.env.ENTITLEMENTS_TRIAL_ENDS_AT,
      gracePeriodDays: parseNumber(process.env.ENTITLEMENTS_GRACE_PERIOD_DAYS, 3),
      maxSources: process.env.ENTITLEMENTS_MAX_SOURCES,
      reportCadence: process.env.ENTITLEMENTS_REPORT_CADENCE,
      aiTier: process.env.ENTITLEMENTS_AI_TIER,
      featureAi: parseBoolean(process.env.ENTITLEMENTS_FEATURE_AI, true),
      featureExports: parseBoolean(process.env.ENTITLEMENTS_FEATURE_EXPORTS, true),
      featureIntegrations: parseBoolean(process.env.ENTITLEMENTS_FEATURE_INTEGRATIONS, true),
      featureReports: parseBoolean(process.env.ENTITLEMENTS_FEATURE_REPORTS, true),
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      customerId: process.env.STRIPE_CUSTOMER_ID,
      customerMap: process.env.STRIPE_CUSTOMER_MAP,
      priceStarter: process.env.STRIPE_PRICE_STARTER,
      priceProfessional: process.env.STRIPE_PRICE_PROFESSIONAL,
      priceEnterprise: process.env.STRIPE_PRICE_ENTERPRISE,
      portalReturnUrl: process.env.STRIPE_PORTAL_RETURN_URL,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
    exportBaseUrl: process.env.EXPORT_BASE_URL,
  };

  cachedConfig = config;
  return config;
};

export const validateApiConfig = (): string[] => {
  const config = getApiConfig();
  const issues: string[] = [];

  if (config.observability.provider !== 'none' && !config.observability.dsn) {
    issues.push('OBSERVABILITY_PROVIDER set but OBSERVABILITY_DSN missing.');
  }

  if (config.ai.rateLimitMax <= 0 || config.ai.rateLimitWindowMs <= 0) {
    issues.push('AI_RATE_LIMIT_* values invalid.');
  }

  if (config.ai.timeoutMs <= 0) {
    issues.push('AI_TIMEOUT_MS must be > 0.');
  }

  if (config.throttling.limit <= 0 || config.throttling.ttlMs <= 0) {
    issues.push('THROTTLE_* values invalid.');
  }

  if (!config.auth.jwtSecret) {
    issues.push('CRITICAL: JWT_SECRET is missing. Authentication will fail.');
  }

  if (config.appMode === 'prod') {
    if (!config.database.url) {
      issues.push('CRITICAL: DATABASE_URL is missing in prod mode.');
    }
    if (!config.stripe.secretKey) {
      issues.push('CRITICAL: STRIPE_SECRET_KEY is missing in prod mode.');
    }
    if (!config.stripe.webhookSecret) {
      issues.push('CRITICAL: STRIPE_WEBHOOK_SECRET is missing in prod mode.');
    }
  }

  return issues;
};
