import { describe, expect, it, vi, afterEach } from 'vitest';
import { ApiRequestError, apiGet, fetchDashboardPandL } from '../../data/api';
import { streamChat } from '../../data/ai';

const createJsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

afterEach(() => {
  vi.restoreAllMocks();
});

describe('api client', () => {
  it('builds correct URL for P&L', async () => {
    const fetchSpy = vi.fn().mockResolvedValue(createJsonResponse({ summary: {} }));
    vi.stubGlobal('fetch', fetchSpy);

    await fetchDashboardPandL({ timeRange: '7d' });

    expect(fetchSpy).toHaveBeenCalled();
    const url = String(fetchSpy.mock.calls[0][0]);
    expect(url).toContain('/api/dashboard/pandl');
    expect(url).toContain('timeRange=7d');
  });

  it('sets default headers including auth and tenant', async () => {
    window.localStorage.setItem('papadata_auth_token', 'token-123');
    window.localStorage.setItem('pd_active_tenant_id', 'tenant-abc');

    const fetchSpy = vi.fn().mockResolvedValue(createJsonResponse({ status: 'ok' }));
    vi.stubGlobal('fetch', fetchSpy);

    await apiGet('/health');

    const init = fetchSpy.mock.calls[0][1] as RequestInit;
    const headers = new Headers(init.headers as HeadersInit);

    expect(headers.get('Accept')).toBe('application/json');
    expect(headers.get('Authorization')).toBe('Bearer token-123');
    expect(headers.get('x-tenant-id')).toBe('tenant-abc');
    expect(headers.get('x-request-id')).toBeTruthy();
  });

  it('parses JSON responses', async () => {
    const fetchSpy = vi.fn().mockResolvedValue(createJsonResponse({ value: 42 }));
    vi.stubGlobal('fetch', fetchSpy);

    const result = await apiGet<{ value: number }>('/health');
    expect(result.value).toBe(42);
  });

  it('returns text for non-JSON responses', async () => {
    const response = new Response('stream-text', {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream' },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

    const result = await apiGet<string>('/health');
    expect(result).toBe('stream-text');
  });

  it('throws ApiRequestError on HTTP error', async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(createJsonResponse({ message: 'Server error' }, 500));
    vi.stubGlobal('fetch', fetchSpy);

    await expect(apiGet('/health')).rejects.toBeInstanceOf(ApiRequestError);

    try {
      await apiGet('/health');
    } catch (err) {
      const apiError = err as ApiRequestError;
      expect(apiError.code).toBe('HTTP_ERROR');
      expect(apiError.status).toBe(500);
    }
  });

  it('handles 4xx errors with ApiRequestError', async () => {
    const fetchSpy = vi.fn().mockResolvedValue(createJsonResponse({ message: 'Not found' }, 404));
    vi.stubGlobal('fetch', fetchSpy);

    await expect(apiGet('/missing')).rejects.toBeInstanceOf(ApiRequestError);
  });

  it('handles non-stream response in streamChat', async () => {
    const response = new Response('OK', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

    const tokens: string[] = [];
    let done = false;

    await streamChat(
      {
        prompt: 'Test',
        messages: [],
        context: {
          view: 'overview',
          dateRange: { start: '2026-01-01', end: '2026-01-20', preset: '30d' },
        },
      },
      {
        onToken: (token) => tokens.push(token),
        onDone: () => {
          done = true;
        },
      }
    );

    expect(tokens.join('')).toContain('OK');
    expect(done).toBe(true);
  });
});
