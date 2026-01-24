import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { completeOAuth } from '../../data/integrations';
import { useAuth } from '../../context/useAuth';
import { useModal } from '../../context/useModal';
import { useIntegrations } from '../../hooks/useIntegrations';
import { normalizeApiError } from '../../hooks/useApiError';

type CallbackStatus = 'idle' | 'auth' | 'loading' | 'success' | 'error';

const resolveTenantId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('pd_active_tenant_id') || null;
};

export const IntegrationCallback: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { openModal } = useModal();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const provider = useMemo(() => (params.provider ?? '').trim(), [params.provider]);
  const code = useMemo(() => (searchParams.get('code') ?? '').trim(), [searchParams]);
  const state = useMemo(() => (searchParams.get('state') ?? '').trim(), [searchParams]);
  const errorParam = useMemo(() => (searchParams.get('error') ?? '').trim(), [searchParams]);

  const { refresh } = useIntegrations({ enabled: isAuthenticated });

  const [status, setStatus] = useState<CallbackStatus>('idle');
  const [message, setMessage] = useState<string>('');

  const requestRef = useRef(false);

  useEffect(() => {
    let timer: number | undefined;

    if (!provider) {
      setStatus('error');
      setMessage('Brak providera integracji w URL.');
      return undefined;
    }

    if (!isAuthenticated) {
      setStatus('auth');
      setMessage('Zaloguj się, aby dokończyć łączenie integracji.');
      try {
        window.localStorage.setItem('pd_post_login_redirect', `${location.pathname}${location.search}`);
      } catch {
        // ignore
      }
      openModal('auth', { isRegistered: true });
      return undefined;
    }

    if (errorParam) {
      setStatus('error');
      setMessage(`Błąd autoryzacji: ${errorParam}`);
      return undefined;
    }

    if (!code) {
      setStatus('error');
      setMessage('Brak kodu autoryzacji. Spróbuj ponownie.');
      return undefined;
    }

    if (requestRef.current) return undefined;
    requestRef.current = true;

    setStatus('loading');
    setMessage('Finalizujemy połączenie i odświeżamy status integracji…');

    completeOAuth(provider, { code, state: state || null, tenantId: resolveTenantId() })
      .then(() => {
        setStatus('success');
        setMessage('Połączono. Przekierowujemy do integracji…');
        refresh();
        timer = window.setTimeout(() => navigate('/app/integrations'), 2000);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(normalizeApiError(err, 'Nie udało się zakończyć połączenia integracji.'));
      });

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [code, errorParam, isAuthenticated, location.pathname, location.search, navigate, openModal, provider, refresh, state]);

  const badge = useMemo(() => {
    if (status === 'success') return { label: 'CONNECTED', color: 'emerald' } as const;
    if (status === 'error') return { label: 'ERROR', color: 'rose' } as const;
    if (status === 'loading') return { label: 'CONNECTING', color: 'brand' } as const;
    if (status === 'auth') return { label: 'LOGIN', color: 'amber' } as const;
    return { label: 'READY', color: 'gray' } as const;
  }, [status]);

  const badgeClass =
    badge.color === 'emerald'
      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
      : badge.color === 'rose'
        ? 'bg-rose-500/10 border-rose-500/30 text-rose-600'
        : badge.color === 'amber'
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-600'
          : badge.color === 'brand'
            ? 'bg-brand-start/10 border-brand-start/30 text-brand-start'
            : 'bg-gray-500/10 border-gray-500/30 text-gray-600';

  const title =
    status === 'success'
      ? 'Połączono integrację'
      : status === 'error'
        ? 'Nie udało się połączyć'
        : status === 'auth'
          ? 'Wymagane logowanie'
          : 'Łączenie integracji';

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050507] text-gray-900 dark:text-gray-100 px-6">
      <div className="max-w-xl w-full rounded-[2.5rem] border border-white/10 bg-white/90 dark:bg-[#0a0a0c] p-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full border ${badgeClass}`}>
            {badge.label}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-3">{title}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{message}</p>

        {(status === 'error' || status === 'success') && (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate('/app/integrations')}
              className="px-6 py-3 rounded-xl bg-brand-start text-white text-xs font-black uppercase tracking-widest"
            >
              Wróć do integracji
            </button>
          </div>
        )}
      </div>
    </main>
  );
};
