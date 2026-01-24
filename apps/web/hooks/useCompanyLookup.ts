import { useEffect, useMemo, useRef, useState } from 'react';
import { lookupCompanyByNip, type CompanyLookupResponse, type CompanyLookupError } from '../data/company';
import { ApiRequestError } from '../data/api';
import { normalizeApiError } from './useApiError';

type CacheEntry = {
  data: CompanyLookupResponse | null;
  ts: number;
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const cache = new Map<string, CacheEntry>();

const isValidNip = (nip: string) => /^\d{10}$/.test(nip.trim());

export const useCompanyLookup = (nip: string) => {
  const normalizedNip = useMemo(() => nip.replace(/\D/g, '').trim(), [nip]);
  const [data, setData] = useState<CompanyLookupResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CompanyLookupError | null>(null);
  const [notFound, setNotFound] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const latestNipRef = useRef<string>('');

  useEffect(() => {
    const valid = isValidNip(normalizedNip);

    if (!valid) {
      setLoading(false);
      setError(null);
      setNotFound(false);
      setData(null);
      return undefined;
    }

    const cached = cache.get(normalizedNip);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      setData(cached.data);
      setNotFound(cached.data === null);
      setError(null);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(null);
    setNotFound(false);

    const controller = new AbortController();
    abortRef.current = controller;
    latestNipRef.current = normalizedNip;

    const timer = window.setTimeout(() => {
      const run = async (attempt: number) => {
        try {
          const res = await lookupCompanyByNip(normalizedNip, { signal: controller.signal });
          if (latestNipRef.current !== normalizedNip) return;
          cache.set(normalizedNip, { data: res, ts: Date.now() });
          setData(res);
          setNotFound(false);
          return;
        } catch (err: unknown) {
          if ((err as { name?: string } | null)?.name === 'AbortError') return;
          if (latestNipRef.current !== normalizedNip) return;

          if (err instanceof ApiRequestError && err.status === 404) {
            cache.set(normalizedNip, { data: null, ts: Date.now() });
            setNotFound(true);
            setData(null);
            return;
          }

          const isRetryable =
            err instanceof ApiRequestError &&
            (err.code === 'NETWORK_ERROR' || err.code === 'TIMEOUT');

          if (isRetryable && attempt === 0) {
            await new Promise((resolve) => window.setTimeout(resolve, 400));
            return run(1);
          }

          const message = normalizeApiError(err, 'Nie udało się pobrać danych firmy.');
          const requestId = err instanceof ApiRequestError ? err.requestId : undefined;
          setError({ message, requestId });
        } finally {
          if (latestNipRef.current !== normalizedNip) return;
          setLoading(false);
        }
      };

      void run(0);
    }, 600);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [normalizedNip]);

  return { data, loading, error, notFound };
};
