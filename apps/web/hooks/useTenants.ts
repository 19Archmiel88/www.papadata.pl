import { useCallback, useEffect, useRef, useState } from 'react';
import type { TenantSummary } from '@papadata/shared';
import { useApi } from './useApi';
import { normalizeApiError } from './useApiError';

type CacheEntry<T> = {
  data: T | null;
  timestamp: number;
};

const DEFAULT_TTL_MS = 60_000;
const cache: CacheEntry<TenantSummary[]> = { data: null, timestamp: 0 };

export const useTenants = (options?: {
  ttlMs?: number;
  maxRetries?: number;
  enabled?: boolean;
}) => {
  const api = useApi();
  const ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS;
  const maxRetries = options?.maxRetries ?? 2;
  const enabled = options?.enabled ?? true;

  const [data, setData] = useState<TenantSummary[]>(() => (enabled ? (cache.data ?? []) : []));
  const [loading, setLoading] = useState(enabled && cache.data === null);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(
    cache.timestamp ? new Date(cache.timestamp).toISOString() : null
  );

  const activeRef = useRef(true);
  const attemptRef = useRef(0);
  const retryTimerRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const load = useCallback(
    async (force: boolean) => {
      const now = Date.now();

      // Cache hit (no spinner, no retry state)
      if (!force && cache.data && now - cache.timestamp < ttlMs) {
        setData(cache.data);
        setLoading(false);
        setRetrying(false);
        setError(null);
        setLastSync(new Date(cache.timestamp).toISOString());
        return;
      }

      // New request supersedes any pending retry
      clearRetryTimer();

      // Track "latest request" to prevent races (e.g., rapid refresh)
      const requestId = ++requestIdRef.current;

      // UX: keep existing data, but show loading/refreshing
      setError(null);
      setLoading(true);
      setRetrying(false);

      try {
        const result = await api.tenants();

        // Ignore if unmounted or stale request
        if (!activeRef.current || requestId !== requestIdRef.current) return;

        cache.data = result;
        cache.timestamp = Date.now();

        attemptRef.current = 0;
        setData(result);
        setError(null);
        setLastSync(new Date(cache.timestamp).toISOString());
      } catch (err) {
        // Ignore if unmounted or stale request
        if (!activeRef.current || requestId !== requestIdRef.current) return;

        const message = normalizeApiError(err, 'Nie udało się pobrać listy tenantów.');
        setError(message);

        if (attemptRef.current < maxRetries) {
          attemptRef.current += 1;

          const delay = 1000 * 2 ** (attemptRef.current - 1);
          setRetrying(true);

          clearRetryTimer();
          retryTimerRef.current = window.setTimeout(() => {
            // Only retry if still mounted and still the latest request chain
            if (!activeRef.current || requestId !== requestIdRef.current) return;
            void load(true);
          }, delay);
        } else {
          setRetrying(false);
        }
      } finally {
        // Only the latest request is allowed to toggle loading/retrying
        if (activeRef.current && requestId === requestIdRef.current) {
          // If retry is scheduled, keep loading=false but retrying=true (separate flag)
          setLoading(false);
        }
      }
    },
    [api, clearRetryTimer, maxRetries, ttlMs]
  );

  useEffect(() => {
    activeRef.current = true;
    if (!enabled) {
      setLoading(false);
      setRetrying(false);
      setError(null);
      return () => {
        activeRef.current = false;
        clearRetryTimer();
      };
    }
    void load(false);

    return () => {
      activeRef.current = false;
      clearRetryTimer();
    };
  }, [clearRetryTimer, enabled, load]);

  const refresh = useCallback(() => {
    if (!enabled) return;
    attemptRef.current = 0;
    void load(true);
  }, [enabled, load]);

  return { data, loading, retrying, error, lastSync, refresh };
};
