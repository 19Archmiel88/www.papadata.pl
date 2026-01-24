import type { Page } from '@playwright/test';

const json = (data: unknown) => JSON.stringify(data);

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

export const mockApi = async (page: Page) => {
  ensureMockApiAllowed();

  await page.addInitScript(() => {
    const consent = {
      necessary: true,
      analytical: false,
      marketing: false,
      functional: true,
    };
    window.localStorage.setItem('cookie_consent', JSON.stringify(consent));
    window.localStorage.setItem('papadata_auth', '1');
    window.localStorage.setItem('papadata_auth_token', 'e2e-token');
  });

  await page.route('**/api/**', async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;

    if (path.endsWith('/health')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: json({ status: 'ok', mode: 'demo' }),
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

    if (path.endsWith('/billing/status') || path.endsWith('/billing/summary')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: json({ plan: 'demo', subscriptionStatus: 'trial', trialEndsAt: null }),
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
