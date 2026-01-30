import { useEffect, useMemo, useState } from 'react';
import { getTenantStatus, type TenantStatusPayload } from '../data/tenantStatus';

export type UseTenantStatusResult = {
  status: TenantStatusPayload | null;
  loading: boolean;
  error: string | null;
};

export const useTenantStatus = (
  tenantId?: string | null,
  refreshMs = 45_000
): UseTenantStatusResult => {
  const [status, setStatus] = useState<TenantStatusPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(tenantId));
  const [error, setError] = useState<string | null>(null);

  const normalizedTenantId = useMemo(() => tenantId ?? undefined, [tenantId]);

  useEffect(() => {
    if (!normalizedTenantId) {
      setStatus(null);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTenantStatus(normalizedTenantId);
        if (!active) return;
        setStatus(data);
        setLoading(false);
      } catch (err) {
        if (!active) return;
        const statusCode = (err as { status?: number } | null)?.status;
        const rawMessage = err instanceof Error ? err.message : '';
        const friendlyMessage = `Nie udało się pobrać statusu danych${
          statusCode ? ` (kod ${statusCode})` : ''
        }. Sprawdź połączenie lub spróbuj ponownie.`;
        const sanitized =
          rawMessage && !/^request failed/i.test(rawMessage) ? rawMessage : friendlyMessage;
        setError(sanitized);
        setLoading(false);
      }
    };

    void load();

    const interval = window.setInterval(load, refreshMs);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [normalizedTenantId, refreshMs]);

  return { status, loading, error };
};
