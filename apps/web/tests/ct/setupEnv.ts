// Playwright CT global env mock for import.meta.env
if (typeof import.meta !== 'undefined') {
  // @ts-expect-error - Playwright CT injects import.meta.env in tests
  import.meta.env = {
    VITE_APP_ENV: 'test',
    MODE: 'test',
    VITE_API_BASE_URL: '/api',
    VITE_API_TIMEOUT_MS: '25000',
    ...import.meta.env,
  };
}
