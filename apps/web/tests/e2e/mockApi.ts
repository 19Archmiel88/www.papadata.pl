import type { Page } from '@playwright/test';
import type {
  AuthSession,
  BillingSummary,
  BillingStatusResponse,
  HealthResponse,
} from '@papadata/shared';

const json = (data: unknown) => JSON.stringify(data);

type MockApiOptions = {
  consent?: 'granted' | 'unset';
  auth?: {
    enabled?: boolean;
    token?: string;
    roles?: string[];
    tenantId?: string;
    userId?: string;
  };
  health?: Partial<HealthResponse>;
  billingSummary?: Partial<BillingSummary>;
  billingStatus?: Partial<BillingStatusResponse>;
};

const defaultAuthSession: AuthSession = {
  accessToken: 'e2e-token',
  tokenType: 'Bearer',
  expiresIn: 3600,
  user: {
    id: 'e2e-user',
    email: 'e2e@papadata.local',
    tenantId: 'e2e-tenant',
    roles: ['owner'],
  },
};

const defaultEntitlements = {
  plan: 'professional' as const,
  billingStatus: 'trialing' as const,
  limits: {
    maxSources: 10,
    reportCadence: 'daily' as const,
    aiTier: 'priority' as const,
  },
  features: {
    ai: true,
    exports: true,
    integrations: true,
    reports: true,
  },
};

const defaultBillingSummary: BillingSummary = {
  entitlements: defaultEntitlements,
  plan: 'professional',
  billingStatus: 'trialing',
  trialEndsAt: null,
  trialDaysLeft: 7,
  isTrial: true,
  isTrialExpired: false,
  canManageSubscription: true,
  portalUrl: null,
};

const defaultBillingStatus: BillingStatusResponse = {
  plan: 'professional',
  subscriptionStatus: 'trialing',
  trialEndsAt: null,
};

const defaultHealth: HealthResponse = { status: 'ok', mode: 'demo' };

const mergeBillingSummary = (override?: Partial<BillingSummary>): BillingSummary => {
  if (!override) return defaultBillingSummary;
  const entitlements = {
    ...defaultEntitlements,
    ...(override.entitlements ?? {}),
    limits: {
      ...defaultEntitlements.limits,
      ...(override.entitlements?.limits ?? {}),
    },
    features: {
      ...defaultEntitlements.features,
      ...(override.entitlements?.features ?? {}),
    },
  };

  return {
    ...defaultBillingSummary,
    ...override,
    entitlements,
  };
};

const getEnvValue = (key: string): string | undefined => {
  const value = process.env[key];
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
};

const isStagingOrProduction = (): boolean => {
  const env = (
    getEnvValue('APP_ENV') ??
    getEnvValue('NODE_ENV') ??
    getEnvValue('VITE_APP_ENV') ??
    getEnvValue('ENVIRONMENT') ??
    getEnvValue('STAGE') ??
    ''
  ).toLowerCase();

  if (['production', 'prod', 'staging'].includes(env)) {
    return true;
  }

  const baseUrl =
    getEnvValue('PLAYWRIGHT_BASE_URL') ??
    getEnvValue('BASE_URL') ??
    getEnvValue('WEB_BASE_URL');
  if (!baseUrl) return false;

  try {
    const url = new URL(baseUrl);
    const host = url.hostname.toLowerCase();
    return host.includes('staging') || host.includes('prod');
  } catch {
    const normalized = baseUrl.toLowerCase();
    return normalized.includes('staging') || normalized.includes('prod');
  }
};

const isPlaywrightContext = (): boolean =>
  typeof process.env.PLAYWRIGHT_WORKER_INDEX !== 'undefined' ||
  typeof process.env.PLAYWRIGHT_WORKER_COUNT !== 'undefined' ||
  process.env.NODE_ENV === 'test' ||
  process.env.E2E === '1';

const ensureMockApiAllowed = (): void => {
  if (!isPlaywrightContext()) {
    throw new Error('mockApi can only run in Playwright e2e tests');
  }
  if (isStagingOrProduction()) {
    throw new Error('mockApi is disabled on staging/production environments');
  }
};

export const mockApi = async (page: Page, options: MockApiOptions = {}) => {
  ensureMockApiAllowed();

  const authEnabled = options.auth?.enabled !== false;
  const authToken = options.auth?.token ?? defaultAuthSession.accessToken;
  const authRoles = options.auth?.roles ?? defaultAuthSession.user.roles;
  const authTenantId = options.auth?.tenantId ?? defaultAuthSession.user.tenantId;
  const authUserId = options.auth?.userId ?? defaultAuthSession.user.id;
  const consentMode = options.consent ?? 'granted';

  await page.addInitScript(
    (opts) => {
      if (opts.consentMode !== 'unset') {
        const consent = {
          necessary: true,
          analytical: false,
          marketing: false,
          functional: true,
        };
        window.localStorage.setItem('cookie_consent', JSON.stringify(consent));
      }

      if (opts.authEnabled) {
        window.localStorage.setItem('papadata_auth', '1');
        window.localStorage.setItem('papadata_auth_token', opts.authToken);
        window.localStorage.setItem('papadata_user_id', opts.authUserId);
        window.localStorage.setItem('papadata_user_roles', JSON.stringify(opts.authRoles));
        window.localStorage.setItem('pd_active_tenant_id', opts.authTenantId);
      }
    },
    {
      authEnabled,
      authToken,
      authRoles,
      authTenantId,
      authUserId,
      consentMode,
    },
  );

  await page.route('**/api/**', async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;
    const health = { ...defaultHealth, ...(options.health ?? {}) };
    const billingSummary = mergeBillingSummary(options.billingSummary);
    const billingStatus = { ...defaultBillingStatus, ...(options.billingStatus ?? {}) };
    const authSession: AuthSession = {
      ...defaultAuthSession,
      accessToken: authToken,
      user: {
        ...defaultAuthSession.user,
        id: authUserId,
        tenantId: authTenantId,
        roles: authRoles,
      },
    };

    if (path.endsWith('/health')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: json(health),
      });
    }

    if (/\/tenants\/[^/]+\/status$/.test(path)) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: json({ mode: 'demo', hasIntegrations: false, lastSyncAt: null }),
      });
    }

    if (path.endsWith('/integrations')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: json([]),
      });
    }

    if (path.endsWith('/billing/status')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: json(billingStatus),
      });
    }

    if (path.endsWith('/billing/summary')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: json(billingSummary),
      });
    }

    if (path.endsWith('/billing/portal')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: json({ portalUrl: billingSummary.portalUrl ?? '' }),
      });
    }

    if (path.endsWith('/auth/magic-link')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: json({ ok: true, requestId: 'e2e-magic-link' }),
      });
    }

    if (path.endsWith('/auth/login') || path.endsWith('/auth/register')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: json(authSession),
      });
    }

    if (path.endsWith('/ai/chat')) {
      return route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: 'data: {"text":"OK"}\n\n',
      });
    }

    if (path.includes('/dashboard/')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: json({}),
      });
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: json({}),
    });
  });
};
