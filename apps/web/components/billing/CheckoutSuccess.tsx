import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBillingStatus } from '../../data/billing';
import { useAuth } from '../../context/useAuth';
import { useModal } from '../../context/useModal';

const resolveTenantId = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  return window.localStorage.getItem('pd_active_tenant_id') || undefined;
};

export const CheckoutSuccess: React.FC = () => {
  const { isAuthenticated, setBillingState } = useAuth();
  const { openModal } = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const redirectPath = useMemo(() => '/app', []);

  useEffect(() => {
    let timer: number | undefined;
    if (!isAuthenticated) {
      try {
        window.localStorage.setItem('pd_post_login_redirect', `${location.pathname}${location.search}`);
      } catch {
        // ignore
      }
      openModal('auth', { isRegistered: true });
      return;
    }

    const tenantId = resolveTenantId();
    setStatus('loading');
    setMessage('Potwierdzamy płatność i odświeżamy subskrypcję…');

    getBillingStatus(tenantId)
      .then((data) => {
        setBillingState({
          plan: data.plan,
          subscriptionStatus: data.subscriptionStatus,
          trialEndsAt: data.trialEndsAt ?? null,
        });
        setStatus('done');
        setMessage('Płatność potwierdzona. Przekierowujemy do aplikacji…');
        timer = window.setTimeout(() => navigate(redirectPath), 2500);
      })
      .catch((error: unknown) => {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Nie udało się odświeżyć statusu subskrypcji.');
      });
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [isAuthenticated, location.pathname, location.search, navigate, openModal, redirectPath, setBillingState]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050507] text-gray-900 dark:text-gray-100 px-6">
      <div className="max-w-xl w-full rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 p-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">SUCCESS</p>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-3">Płatność potwierdzona</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{message}</p>

        {status === 'error' && (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate('/app')}
              className="px-6 py-3 rounded-xl bg-brand-start text-white text-xs font-black uppercase tracking-widest"
            >
              Przejdź do aplikacji
            </button>
          </div>
        )}
      </div>
    </main>
  );
};
