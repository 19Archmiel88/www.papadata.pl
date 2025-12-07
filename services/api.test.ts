
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('api service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('checkHealth throws error when BACKEND_URL is missing', async () => {
    delete process.env.BACKEND_URL;

    // We need to import the module after modifying process.env
    const { checkHealth } = await import('./api');

    await expect(checkHealth()).rejects.toThrow("⚠️ Brak BACKEND_URL. Sprawdź plik .env.local");
  });

  it('checkHealth returns data when BACKEND_URL is present', async () => {
    process.env.BACKEND_URL = 'http://test-backend.com';

    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok' }),
    });

    const { checkHealth } = await import('./api');

    const result = await checkHealth();
    expect(result).toEqual({ status: 'ok' });
    expect(global.fetch).toHaveBeenCalledWith('http://test-backend.com/health', expect.any(Object));
  });
});
