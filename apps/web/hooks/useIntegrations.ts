import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { IntegrationSummary } from '@papadata/shared';
import { useApi } from './useApi';
import { normalizeApiError } from './useApiError';

type CacheEntry<T> = {
  data: T | null;
  timestamp: number; // ms epoch
};

const DEFAULT_TTL_MS = 60_000;

/**
 * Cache keyed per-api context to avoid mixing tenants/environments/users.
 * Key is intentionally conservative: if your useApi exposes a stable baseUrl or tenantId, prefer that.
 */
const cacheByKey = new Map<string, CacheEntry<IntegrationSummary[]>>();

function getCacheKey(api: unknown): string {
  // Best-effort keying without assuming internal shape of useApi().
  // If api has baseUrl / apiBaseUrl / origin fields, use them. Otherwise fallback to a single bucket.
  const a = api as Record<string, unknown> | null;
  const baseUrl =
    (typeof a?.baseUrl === 'string' && a.baseUrl) ||
    (typeof a?.apiBaseUrl === 'string' && a.apiBaseUrl) ||
    (typeof a?.origin === 'string' && a.origin) ||
    'default';

  return `integrations:${baseUrl}`;
}

function isRetryableError(err: unknown): boolean {
  const e = err as any;

  // Abort should not be retried.
  if (e?.name === 'AbortError') return false;

  // If api layer throws a structured error with status codes, respect it.
  const status: number | undefined =
    (typeof e?.status === 'number' && e.status) ||
    (typeof e?.response?.status === 'number' && e.response.status);

  if (typeof status === 'number') {
    // Retry only for transient server errors and too-many-requests.
    if (status >= 500) return true;
    if (status === 429) return true;
    // Do not retry auth/permission/not-found/bad-request etc.
    return false;
  }

  // Network-ish errors: retry.
  const msg = String(e?.message ?? e ?? '').toLowerCase();
  if (
    msg.includes('network') ||
    msg.includes('failed to fetch') ||
    msg.includes('timeout') ||
    msg.includes('timed out') ||
    msg.includes('econnreset') ||
    msg.includes('enotfound')
  ) {
    return true;
  }

  // Default: don't retry unknowns aggressively.
  return false;
}

export const useIntegrations = (options?: {
  ttlMs?: number;
  maxRetries?: number;
  swr?: boolean;
  enabled?: boolean;
}) => {
  const api = useApi();
  const ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS;
  const maxRetries = options?.maxRetries ?? 2;
  const swr = options?.swr ?? false;
  const enabled = options?.enabled ?? true;

  const cacheKey = useMemo(() => getCacheKey(api), [api]);
  const cacheEntry = useMemo<CacheEntry<IntegrationSummary[]>>(() => {
    const existing = cacheByKey.get(cacheKey);
    if (existing) return existing;
    const init: CacheEntry<IntegrationSummary[]> = { data: null, timestamp: 0 };
    cacheByKey.set(cacheKey, init);
    return init;
  }, [cacheKey]);

  const [data, setData] = useState<IntegrationSummary[]>(() => cacheEntry.data ?? []);
  const [loading, setLoading] = useState(cacheEntry.data === null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<number | null>(cacheEntry.timestamp || null);

  const mountedRef = useRef(true);
  const attemptRef = useRef(0);
  const retryTimerRef = useRef<number | null>(null);

  // Prevent out-of-order responses overwriting fresh state.
  const requestSeqRef = useRef(0);

  // Optional cancellation if api.integrations supports AbortSignal.
  const abortRef = useRef<AbortController | null>(null);

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const abortInFlight = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  const load = useCallback(
    async (force: boolean, background: boolean) => {
      const now = Date.now();
      const isFresh = !!cacheEntry.data && now - cacheEntry.timestamp < ttlMs;

      // Cache hit: serve immediately
      if (!force && isFresh) {
        setData(cacheEntry.data ?? []);
        setError(null);
        setLastSync(cacheEntry.timestamp || null);

        // SWR: optionally revalidate in background
        if (!swr) {
          setLoading(false);
          setRefreshing(false);
          return;
        }
        // else fallthrough to background revalidate
      }

      // Ensure we don't have stale timers firing later.
      clearRetryTimer();

      // For explicit refresh or non-fresh cache: fetch.
      const isInitial = cacheEntry.data === null || (cacheEntry.data?.length ?? 0) === 0;
      if (!background) {
        if (isInitial && !force) setLoading(true);
        if (!isInitial || force) setRefreshing(true);
      }

      const seq = ++requestSeqRef.current;

      // Cancel previous request to avoid wasted work.
      abortInFlight();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        // Support both signatures:
        // - api.integrations()
        // - api.integrations({ signal })
        let result: IntegrationSummary[];
        const fn = (api as any).integrations;

        if (typeof fn !== 'function') {
          throw new Error('API client is missing integrations()');
        }

        try {
          result = await fn({ signal: controller.signal });
        } catch (e) {
          // If the client doesn't accept an options object, try no-args.
          if (
            String((e as any)?.message ?? '').toLowerCase().includes('signal') ||
            String((e as any)?.message ?? '').toLowerCase().includes('argument') ||
            String((e as any)?.message ?? '').toLowerCase().includes('options')
          ) {
            result = await fn();
          } else {
            throw e;
          }
        }

        if (!mountedRef.current) return;
        if (seq !== requestSeqRef.current) return; // out-of-order

        cacheEntry.data = result;
        cacheEntry.timestamp = Date.now();
        attemptRef.current = 0;

        setData(result);
        setError(null);
        setLastSync(cacheEntry.timestamp);
      } catch (err) {
        if (!mountedRef.current) return;
        if (seq !== requestSeqRef.current) return; // out-of-order

        // If aborted, don't surface as error.
        if ((err as any)?.name === 'AbortError') return;

        const message = normalizeApiError(err, 'Failed to fetch integrations');
        setError(message);

        const retryable = isRetryableError(err);
        if (retryable && attemptRef.current < maxRetries) {
          attemptRef.current += 1;
          const delay = 1000 * 2 ** (attemptRef.current - 1); // 1s, 2s, 4s...
          retryTimerRef.current = window.setTimeout(() => {
            // Retry should force network, not SWR cache hit.
            void load(true, false);
          }, delay);
        }
      } finally {
        if (!mountedRef.current) return;
        if (seq !== requestSeqRef.current) return; // out-of-order

        setLoading(false);
        setRefreshing(false);
      }
    },
    [abortInFlight, api, cacheEntry, clearRetryTimer, maxRetries, swr, ttlMs],
  );

  useEffect(() => {
    mountedRef.current = true;

    // Initial: serve cache quickly; optionally SWR background revalidate.
    if (!enabled) return;
    void load(false, false);

    return () => {
      mountedRef.current = false;
      clearRetryTimer();
      abortInFlight();
    };
  }, [abortInFlight, clearRetryTimer, enabled, load]);

  const refresh = useCallback(() => {
    if (!enabled) return;
    attemptRef.current = 0;
    clearRetryTimer();
    void load(true, false);
  }, [clearRetryTimer, enabled, load]);

  return {
    data,
    loading,
    refreshing,
    error,
    lastSync: lastSync ? new Date(lastSync).toISOString() : null,
    refresh,
  };
};
