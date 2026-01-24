import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startIntegrationOAuth, type IntegrationItem } from '../data/integrations';
import type { Translation } from '../types';
import { InteractiveButton } from './InteractiveButton';
import { normalizeApiError } from '../hooks/useApiError';
import { useTenants } from '../hooks/useTenants';
import { useAuth } from '../context/useAuth';

/**
 * IntegrationConnectModal.tsx
 * Content-only: overlay/ESC/scroll/focus obsługuje ModalContainer.
 */

interface IntegrationConnectModalProps {
  t: Translation;
  isOpen?: boolean;
  onClose: () => void;

  integration: IntegrationItem | null;
  onConnect?: (item: IntegrationItem) => void;
}

export const IntegrationConnectModal: React.FC<IntegrationConnectModalProps> = ({
  integration,
  t,
  onConnect,
  onClose,
  isOpen = true,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [connectState, setConnectState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [connectError, setConnectError] = useState<string | null>(null);
  const { data: tenants, loading: tenantsLoading, error: tenantsError, refresh: refreshTenants } = useTenants({
    enabled: isAuthenticated,
  });
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem('pd_active_tenant_id');
  });
  const rid = useId();
  const titleId = `integration-connect-title-${rid}`;
  const descId = `integration-connect-desc-${rid}`;

  const meta = useMemo(() => {
    if (!integration) return null;
    return t.integrations.items[integration.id];
  }, [integration, t]);

  const name = useMemo(() => {
    if (!integration) return '';
    return meta?.name ?? integration.id;
  }, [integration, meta?.name]);

  const detail = meta?.detail;

  const title = useMemo(() => {
    if (!integration) return '';
    return t.integrations.connect.title.replace('{name}', name);
  }, [integration, name, t]);

  const authLabel = useMemo(() => {
    if (!integration) return '';
    return t.integrations.auth[integration.auth] ?? integration.auth;
  }, [integration, t]);

  const handleClose = useCallback(() => {
    setConnectState('idle');
    setConnectError(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!selectedTenantId || typeof window === 'undefined') return;
    window.localStorage.setItem('pd_active_tenant_id', selectedTenantId);
    if (connectError) {
      setConnectError(null);
      setConnectState('idle');
    }
  }, [connectError, selectedTenantId]);

  const handleConnect = useCallback(() => {
    if (!integration) return;
    if (integration.auth === 'oauth2') {
      if (connectState === 'loading') return;
      setConnectState('loading');
      setConnectError(null);

      const tenantId = selectedTenantId;
      if (!tenantId) {
        setConnectState('error');
        setConnectError(t.integrations.connect.workspace_required);
        return;
      }

      const redirectUri =
        typeof window !== 'undefined'
          ? `${window.location.origin}/app/integrations/callback/${integration.provider}`
          : null;

      void startIntegrationOAuth(integration.provider, { tenantId, redirectUri })
        .then((res) => {
          if (res?.authUrl) {
            window.location.assign(res.authUrl);
            return;
          }
          throw new Error(t.common.error_desc);
        })
        .catch((err) => {
          setConnectState('error');
          setConnectError(normalizeApiError(err, t.common.error_desc));
        });
      return;
    }

    onConnect?.(integration);
    onClose();
  }, [
    connectState,
    integration,
    onClose,
    onConnect,
    selectedTenantId,
    t.common.error_desc,
    t.integrations.connect.workspace_required,
  ]);

  if (!isOpen || !integration) return null;

  return (
    <div
      role="document"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="relative w-full max-w-3xl glass-modal bg-white dark:bg-[#0a0a0c] rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-[0_50px_140px_rgba(0,0,0,0.6)] overflow-hidden"
    >
      <div className="p-6 sm:p-8 md:p-10 border-b border-gray-200 dark:border-white/10 flex items-start justify-between gap-6 bg-black/5 dark:bg-black/30">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 dark:bg-black/60 border border-brand-start/40">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-start animate-pulse" />
            <span className="text-xs font-extrabold tracking-[0.2em] uppercase text-white/80">
              {t.integrations.pill}
            </span>
          </div>

          <h3 id={titleId} className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {title}
          </h3>

          <p id={descId} className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium max-w-xl">
            {t.integrations.connect.desc}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xs font-mono font-bold tracking-[0.25em] uppercase text-gray-500">
              {t.integrations.status_live}
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-brand-start">{authLabel}</span>
            {detail && (
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">{detail}</span>
            )}
          </div>
        </div>

        <button
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
          aria-label={t.common.close}
          type="button"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-6 sm:p-8 md:p-10 space-y-6">
        <div className="space-y-3">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">
            {t.integrations.connect.steps_title}
          </span>
          <div className="space-y-3">
            {t.integrations.connect.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-brand-start" />
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4 space-y-3">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">
            {t.integrations.connect.workspace_label}
          </div>

          {tenantsLoading && (
            <div className="text-xs text-gray-500">{t.integrations.connect.workspace_loading}</div>
          )}

          {!tenantsLoading && tenantsError && (
            <div className="space-y-2 text-xs text-rose-500">
              <div>{tenantsError}</div>
              <button
                type="button"
                onClick={refreshTenants}
                className="px-3 py-2 rounded-xl border border-rose-500/30 text-rose-500 font-black uppercase tracking-widest"
              >
                {t.integrations.connect.workspace_retry}
              </button>
            </div>
          )}

          {!tenantsLoading && !tenantsError && tenants.length === 0 && (
            <div className="space-y-2 text-xs text-gray-500">
              <div>
                {isAuthenticated
                  ? t.integrations.connect.workspace_empty
                  : t.integrations.connect.workspace_login_required}
              </div>
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => navigate('/app/settings/workspace')}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 font-black uppercase tracking-widest"
                >
                  {t.integrations.connect.workspace_cta}
                </button>
              )}
            </div>
          )}

          {!tenantsLoading && !tenantsError && tenants.length > 0 && (
            <select
              value={selectedTenantId ?? ''}
              onChange={(event) => setSelectedTenantId(event.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-200 outline-none focus:border-brand-start/50"
            >
              <option value="" disabled>
                {t.integrations.connect.workspace_placeholder}
              </option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-2">
            {t.integrations.connect.security_title}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t.integrations.connect.security_desc}</p>
        </div>
      </div>

      <div className="p-6 sm:p-8 md:p-10 border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        {connectError && (
          <div className="w-full text-xs font-semibold text-rose-600 dark:text-rose-400">
            {connectError}
          </div>
        )}
        <InteractiveButton
          variant="primary"
          onClick={handleConnect}
          disabled={connectState === 'loading'}
          className="!h-12 !px-8 !text-xs font-black uppercase tracking-[0.2em] rounded-2xl"
        >
          {connectState === 'loading' ? t.dashboard.integrations_v2?.status_connecting ?? '' : t.integrations.connect.cta_connect}
        </InteractiveButton>

        <InteractiveButton
          variant="secondary"
          onClick={handleClose}
          className="!h-12 !px-8 !text-xs font-black uppercase tracking-[0.3em] rounded-2xl"
        >
          {t.common.close}
        </InteractiveButton>
      </div>
    </div>
  );
};
