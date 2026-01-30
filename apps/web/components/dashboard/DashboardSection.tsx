import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, Outlet, Link } from 'react-router-dom';
import type { BillingSummary } from '@papadata/shared';
import { useUI } from '../../context/useUI';
import { useAuth } from '../../context/useAuth';
import { useModal } from '../../context/useModal';
import { useApi } from '../../hooks/useApi';
import { normalizeApiError } from '../../hooks/useApiError';
import { Logo } from '../Logo';
import { CookieBanner } from '../CookieBanner';
import { OfflineBanner } from '../OfflineBanner';
import { integrations, integrationsByProvider, IntegrationItem } from '../../data/integrations';
import { DataReadinessBanner } from './DataReadinessBanner';
import {
  DashboardOutletContext,
  GcpRegion,
  IntegrationConnectionState,
  TimeRange,
} from './DashboardContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTenantStatus } from '../../hooks/useTenantStatus';
import { useIntegrations } from '../../hooks/useIntegrations';

const PapaAI = React.lazy(() =>
  import('../PapaAI').then((m) => ({
    default: m.PapaAI,
  }))
);

const PapaAiFallback: React.FC = () => (
  <div
    aria-hidden="true"
    className="fixed z-[2000] w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-2xl animate-pulse"
    style={{
      bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
      right: 'calc(1.5rem + env(safe-area-inset-right, 0px))',
    }}
  />
);

const SessionTimer: React.FC<{ sessionStartTime: Date }> = React.memo(({ sessionStartTime }) => {
  const { t } = useUI();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  const minutesInSession = useMemo(() => {
    const ms = now.getTime() - sessionStartTime.getTime();
    return Math.max(0, Math.floor(ms / 60000));
  }, [now, sessionStartTime]);

  return (
    <span className="text-2xs font-mono font-bold tracking-widest text-gray-500 dark:text-gray-400">
      {t.dashboard.footer_session_time}: {minutesInSession}m
    </span>
  );
});

function useMediaQuery(query: string) {
  const getMatch = () => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return false;
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean>(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const mql = window.matchMedia(query);
    const legacyMql = mql as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };

    const onChange = () => setMatches(mql.matches);
    onChange();

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }

    if (typeof legacyMql.addListener === 'function') {
      legacyMql.addListener(onChange);
      return () => legacyMql.removeListener?.(onChange);
    }
  }, [query]);

  return matches;
}

export const DashboardSection: React.FC = () => {
  const { t, toggleTheme, theme } = useUI();
  const { setIsAuthenticated, isAuthenticated } = useAuth();
  const { openModal } = useModal();
  const api = useApi();

  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarPinned, setIsSidebarPinned] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [attributionModel] = useState<'data_driven' | 'last_click'>('data_driven');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const [sessionStartTime] = useState(new Date());
  const [lastUpdate] = useState(() => new Date(Date.now() - 45 * 60 * 1000));
  const [now, setNow] = useState(() => new Date());
  const [appMode, setAppMode] = useState<DashboardOutletContext['appMode']>('prod');
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);
  const tenantId = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    return window.localStorage.getItem('pd_active_tenant_id') || undefined;
  }, []);
  const tenantStatus = useTenantStatus(tenantId, 45_000);

  // Dashboard context: AI + filtry
  const [contextLabel, setContextLabel] = useState<string | null>(null);
  const [aiDraft, setAiDraft] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState<boolean>(true);
  const [filters, setFilters] = useState<Partial<Record<string, string>>>({
    country: 'all',
    store: 'all',
    device: 'all',
    channel: 'all',
  });

  // Demo-only: identyfikator sesji (footer)
  const [peerId] = useState(() => {
    const stored = sessionStorage.getItem('sysLogId');
    if (stored) return stored;
    const newId = Math.random().toString(36).substring(7).toUpperCase();
    sessionStorage.setItem('sysLogId', newId);
    return newId;
  });

  // Backend/integrations state
  const [integrationStatus, setIntegrationStatus] = useState<
    Record<string, IntegrationConnectionState>
  >(() =>
    (integrations || []).filter(Boolean).reduce(
      (acc, item) => ({
        ...acc,
        [item.id]: 'idle' as IntegrationConnectionState,
      }),
      {}
    )
  );

  // Local demo connectors & privacy settings – real state, żeby kliknięcia w settings/integrations coś robiły
  const [connectors, setConnectors] = useState<Record<string, boolean>>(() =>
    (integrations || [])
      .filter(Boolean)
      .reduce((acc, item) => ({ ...acc, [item.id]: false }), {} as Record<string, boolean>)
  );
  const [retentionDays, setRetentionDays] = useState<number>(30);
  const [maskingEnabled, setMaskingEnabled] = useState<boolean>(true);
  const [region, setRegion] = useState<GcpRegion>('europe-central2');

  const {
    data: integrationsRemote,
    loading: integrationsLoading,
    error: integrationsRemoteError,
    lastSync: integrationsLastSync,
    refresh: refreshIntegrations,
  } = useIntegrations({ enabled: isAuthenticated });

  useEffect(() => {
    if (!integrationsRemote || integrationsRemote.length === 0) return;

    setIntegrationStatus((prev) => {
      const next = { ...prev };
      for (const remote of integrationsRemote) {
        if (remote.status !== 'connected') continue;
        const mapped = integrationsByProvider[remote.provider];
        if (mapped) next[mapped.id] = 'connected';
      }
      return next;
    });
  }, [integrationsRemote]);

  // Sidebar: desktop breakpoint (Tailwind lg = 1024px)
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Refs for focus management
  const mobileCloseBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadBilling = async () => {
      try {
        const health = await api.health();
        if (!isActive) return;
        const resolvedMode = health.mode === 'demo' ? 'demo' : 'prod';
        setAppMode(resolvedMode);

        if (health.mode === 'demo') {
          setBillingSummary(null);
          setBillingError(null);
          return;
        }

        const summary = await api.billingSummary();
        if (!isActive) return;
        setBillingSummary(summary);
        setBillingError(null);
      } catch (error) {
        if (!isActive) return;
        setBillingError(normalizeApiError(error, t.common.error_desc));
      }
    };

    void loadBilling();

    return () => {
      isActive = false;
    };
  }, [api, t.common.error_desc]);

  const queryParams = new URLSearchParams(location.search);
  const statusParam = queryParams.get('status');
  const isDemo = appMode === 'demo';
  const billingStatus = billingSummary?.billingStatus;
  const isTrial = billingSummary?.isTrial ?? false;
  const trialDays = billingSummary?.trialDaysLeft ?? null;
  const trialExpired = billingSummary?.isTrialExpired ?? false;
  const planId = billingSummary?.plan ?? 'professional';
  const canManageBilling = billingSummary?.canManageSubscription ?? false;
  const isAccountActive = billingSummary
    ? billingSummary.billingStatus === 'active' ||
      (billingSummary.billingStatus === 'trialing' && !trialExpired)
    : true;
  const isReadOnly = !isDemo && !isAccountActive;
  const isDataStale = now.getTime() - lastUpdate.getTime() > 4 * 60 * 60 * 1000;

  useEffect(() => {
    if (isDemo) {
      setAiMode(true);
      return;
    }
    if (!billingSummary) return;
    const isActive =
      billingSummary.billingStatus === 'active' ||
      (billingSummary.billingStatus === 'trialing' && !billingSummary.isTrialExpired);
    setAiMode(billingSummary.entitlements.features.ai && isActive);
  }, [billingSummary, isDemo]);

  // User menu: klik poza + Escape
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (!userMenuRef.current) return;
      if (userMenuRef.current.contains(event.target as Node)) return;
      setUserMenuOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [userMenuOpen]);

  // Mobile sidebar: ESC + scroll lock + focus
  useEffect(() => {
    if (!isMobileSidebarOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileSidebarOpen(false);
    };
    window.addEventListener('keydown', onKey);

    // focus close button
    window.setTimeout(() => {
      mobileCloseBtnRef.current?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isMobileSidebarOpen]);

  // Desktop: jeśli wejdziemy w desktop, zamknij mobile drawer
  useEffect(() => {
    if (!isDesktop) return;
    setIsMobileSidebarOpen(false);
  }, [isDesktop]);

  const sessionStatus = useMemo(() => {
    if (statusParam === 'error') return 'error';
    if (statusParam === 'processing') return 'processing';
    const connecting = Object.values(integrationStatus).includes('connecting');
    return connecting ? 'processing' : 'ready';
  }, [integrationStatus, statusParam]);

  const sessionMeta = useMemo(() => {
    if (sessionStatus === 'processing') {
      return {
        label: t.dashboard.session_processing,
        dot: 'bg-amber-500',
        text: 'text-amber-500',
      };
    }
    if (sessionStatus === 'error') {
      return {
        label: t.dashboard.session_error,
        dot: 'bg-rose-500',
        text: 'text-rose-500',
      };
    }
    return {
      label: t.dashboard.status_ready,
      dot: 'bg-emerald-500',
      text: 'text-emerald-500',
    };
  }, [
    sessionStatus,
    t.dashboard.session_error,
    t.dashboard.session_processing,
    t.dashboard.status_ready,
  ]);

  const handleCookieResolution = () => {};

  const formattedLastUpdate = useMemo(() => {
    return new Intl.DateTimeFormat(t.langCode ?? 'pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(lastUpdate);
  }, [lastUpdate, t.langCode]);

  const planLabels = useMemo(
    () => ({
      starter: t.pricing.starter.name,
      professional: t.pricing.professional.name,
      enterprise: t.pricing.enterprise.name,
    }),
    [t.pricing.enterprise.name, t.pricing.professional.name, t.pricing.starter.name]
  );
  const planLabel = planLabels[planId as keyof typeof planLabels] ?? planLabels.professional;

  const modeLabel = isDemo
    ? t.dashboard.demo_pill
    : isTrial
      ? t.dashboard.mode_trial
      : t.dashboard.prod_pill;

  const trialLabel =
    trialDays !== null ? t.dashboard.trial_days_left.replace('{days}', String(trialDays)) : '';

  const trialDaysValue = typeof trialDays === 'number' ? trialDays : 0;
  const trialBannerOwner = t.dashboard.billing.trial_banner_owner.replace(
    '{days}',
    String(trialDaysValue)
  );
  const trialBannerMember = t.dashboard.billing.trial_banner_member.replace(
    '{days}',
    String(trialDaysValue)
  );
  const primaryBillingCta =
    billingStatus === 'past_due'
      ? t.dashboard.billing.cta_add_payment
      : t.dashboard.billing.cta_activate;

  const appModeResolved = isDemo ? 'demo' : isTrial ? 'trial' : 'prod';
  const planTier =
    planId === 'starter' ? 'Starter' : planId === 'enterprise' ? 'Enterprise' : 'Professional';

  const filterLabelMap = useMemo(
    () => ({
      country: t.dashboard.filter_country,
      store: t.dashboard.filter_store,
      device: t.dashboard.filter_device,
      channel: t.dashboard.filter_channel,
    }),
    [
      t.dashboard.filter_channel,
      t.dashboard.filter_country,
      t.dashboard.filter_device,
      t.dashboard.filter_store,
    ]
  );

  const resolveFilterValue = useCallback(
    (key: string, value: string) => {
      if (value === 'all') return t.dashboard.filter_option_all;
      const lookup = {
        country: {
          pl: t.dashboard.filter_option_pl,
          de: t.dashboard.filter_option_de,
          cz: t.dashboard.filter_option_cz,
          uk: t.dashboard.filter_option_uk,
        },
        channel: {
          meta: t.dashboard.filter_option_meta,
          google: t.dashboard.filter_option_google,
          tiktok: t.dashboard.filter_option_tiktok,
          affiliate: t.dashboard.filter_option_affiliate,
        },
        device: {
          mobile: t.dashboard.filter_option_mobile,
          desktop: t.dashboard.filter_option_desktop,
          tablet: t.dashboard.filter_option_tablet,
        },
        store: {
          shopify: t.dashboard.filter_option_shopify,
          allegro: t.dashboard.filter_option_allegro,
          pos: t.dashboard.filter_option_pos,
        },
      } as Record<string, Record<string, string>>;
      return lookup[key]?.[value] ?? value.toUpperCase();
    },
    [
      t.dashboard.filter_option_affiliate,
      t.dashboard.filter_option_allegro,
      t.dashboard.filter_option_all,
      t.dashboard.filter_option_cz,
      t.dashboard.filter_option_de,
      t.dashboard.filter_option_desktop,
      t.dashboard.filter_option_google,
      t.dashboard.filter_option_meta,
      t.dashboard.filter_option_mobile,
      t.dashboard.filter_option_pl,
      t.dashboard.filter_option_pos,
      t.dashboard.filter_option_shopify,
      t.dashboard.filter_option_tablet,
      t.dashboard.filter_option_tiktok,
      t.dashboard.filter_option_uk,
    ]
  );

  const activeFilters = useMemo(
    () =>
      Object.entries(filters)
        .filter((entry): entry is [string, string] => {
          const value = entry[1];
          return typeof value === 'string' && value !== 'all';
        })
        .map(([key, value]) => ({
          key,
          label: filterLabelMap[key as keyof typeof filterLabelMap] ?? key,
          value,
          valueLabel: resolveFilterValue(key, value),
        })),
    [filters, filterLabelMap, resolveFilterValue]
  );

  const clearFilters = useCallback(() => {
    setFilters({
      country: 'all',
      store: 'all',
      device: 'all',
      channel: 'all',
    });
  }, []);

  const handleManageSubscription = useCallback(async () => {
    try {
      const portal = await api.billingPortal();
      if (portal?.portalUrl) {
        window.location.assign(portal.portalUrl);
        return;
      }
    } catch (error) {
      setBillingError(normalizeApiError(error, t.common.error_desc));
    }

    openModal('pricing');
  }, [api, openModal, t.common.error_desc]);

  const handleUpgrade = useCallback(() => {
    if (canManageBilling) {
      void handleManageSubscription();
      return;
    }
    openModal('pricing');
  }, [canManageBilling, handleManageSubscription, openModal]);

  useEffect(() => {
    if (!isTrial || typeof trialDays !== 'number') return;
    if (![7, 3, 1].includes(trialDays)) return;
    if (typeof window === 'undefined') return;

    const userKey =
      localStorage.getItem('papadata_user_id') ??
      localStorage.getItem('papadata_auth_token')?.slice(0, 12) ??
      'anon';
    const dayKey = new Date().toISOString().slice(0, 10);
    const storageKey = `trial_notice_${userKey}_${trialDays}_${dayKey}`;

    if (localStorage.getItem(storageKey)) return;
    localStorage.setItem(storageKey, '1');

    openModal('trial_notice', {
      daysLeft: trialDays,
      canManageSubscription: canManageBilling,
      onPrimary: handleUpgrade,
    });
  }, [canManageBilling, handleUpgrade, isTrial, openModal, trialDays]);

  const rangeOptions = useMemo(() => ['1d', '7d', '30d'] as TimeRange[], []);

  // Responsive sidebar logic
  const isSidebarExpanded = isSidebarPinned || isSidebarHovered;

  const handleIntegrationConnect = useCallback((item: IntegrationItem) => {
    setIntegrationStatus((prev) => ({
      ...prev,
      [item.id]: 'connected',
    }));
  }, []);

  const openDemoNotice = useCallback(
    (context?: string) => {
      openModal('demo_notice', {
        context,
        onPrimary: handleUpgrade,
      });
    },
    [handleUpgrade, openModal]
  );

  const openIntegrationModal = useCallback(
    (item: IntegrationItem, onConnect?: (integration: IntegrationItem) => void) => {
      const integrationName = t.integrations.items[item.id]?.name ?? item.id;

      if (isDemo) {
        openDemoNotice(integrationName);
        return;
      }
      if (isReadOnly) {
        handleUpgrade();
        return;
      }

      openModal('integration_connect', {
        integration: item,
        onConnect: (integration: IntegrationItem) => {
          handleIntegrationConnect(integration);
          onConnect?.(integration);
        },
        onUpgrade: handleUpgrade,
      });
    },
    [
      handleIntegrationConnect,
      handleUpgrade,
      isDemo,
      isReadOnly,
      openDemoNotice,
      openModal,
      t.integrations.items,
    ]
  );

  const menuItems = useMemo(
    () => [
      {
        id: 'overview',
        label: t.dashboard.menu_overview,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        ),
      },
      {
        id: 'ads',
        label: t.dashboard.menu_analytics,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
        ),
      },
      {
        id: 'reports',
        label: t.dashboard.menu_reports,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2a4 4 0 014-4h6M9 7h6m-6 4h6M5 7h.01M5 11h.01M5 15h.01"
            />
          </svg>
        ),
      },
      {
        id: 'customers',
        label: t.dashboard.menu_customers,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        ),
      },
      {
        id: 'products',
        label: t.dashboard.menu_products,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        ),
      },
      {
        id: 'integrations',
        label: t.dashboard.menu_integrations,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-1.415 1.414a4 4 0 105.657 5.657l1.414-1.415M10.172 13.828a4 4 0 005.656 0l1.415-1.414a4 4 0 10-5.657-5.657l-1.414-1.414"
            />
          </svg>
        ),
      },
      {
        id: 'knowledge',
        label: t.dashboard.menu_support,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        ),
      },
      {
        id: 'settings',
        label: t.dashboard.menu_settings,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
      },
    ],
    [t]
  );

  const trustItems = useMemo(
    () => [
      {
        id: 'guardian',
        label: t.dashboard.menu_guardian,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3l7 4v5c0 4.418-3.134 8.418-7 9-3.866-.582-7-4.582-7-9V7l7-4z"
            />
          </svg>
        ),
      },
      {
        id: 'alerts',
        label: t.dashboard.menu_alerts,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>
        ),
      },
      {
        id: 'pipeline',
        label: t.dashboard.menu_pipeline,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 7h6m-6 5h12m-6 5h6"
            />
          </svg>
        ),
      },
    ],
    [t]
  );

  // Kolejność (zaakceptowana): Overview → Trust → reszta
  const overviewItem = useMemo(() => menuItems.find((i) => i.id === 'overview'), [menuItems]);
  const restMenuItems = useMemo(() => menuItems.filter((i) => i.id !== 'overview'), [menuItems]);

  const orderedMenu = useMemo(() => {
    const list = [];
    if (overviewItem) list.push(overviewItem);
    list.push(...trustItems);
    list.push(...restMenuItems);
    return list;
  }, [overviewItem, restMenuItems, trustItems]);

  const viewFromPath = location.pathname.split('/')[2] as string | undefined;
  const activeViewId = orderedMenu.find((it) => it.id === viewFromPath)?.id || 'overview';

  const handleNavigate = (view: string) => {
    setIsMobileSidebarOpen(false);
    navigate(`/dashboard/${view}${location.search}`);
  };

  const outletContext: DashboardOutletContext = {
    t,
    timeRange,
    isDemo,
    onUpgrade: handleUpgrade,
    billingStatus,
    isReadOnly,
    canManageSubscription: canManageBilling,
    onManageSubscription: handleManageSubscription,
    integrationStatus,
    onIntegrationConnect: handleIntegrationConnect,
    openIntegrationModal,
    integrationsRemote,
    integrationsLoading,
    apiError: integrationsRemoteError,
    lastApiSync: integrationsLastSync,
    refreshIntegrations,
    connectors,
    setConnectors,
    retentionDays,
    setRetentionDays,
    maskingEnabled,
    setMaskingEnabled,
    region,
    setRegion,
    contextLabel,
    setContextLabel,
    aiDraft,
    setAiDraft,
    filters,
    setFilters,
    aiMode,
    setAiMode,
    attributionModel,
    appMode: appModeResolved,
    planTier,
    trialDaysLeft: trialDays,
    trialExpired: trialExpired,
    sessionStatus,
    lastUpdateLabel: formattedLastUpdate,
    isDataStale,
    tenantStatus: tenantStatus.status,
    tenantStatusLoading: tenantStatus.loading,
    tenantStatusError: tenantStatus.error,
  };

  const commonLabels = t.common as unknown as Record<string, string | undefined>;
  const dashboardLabels = t.dashboard as Record<string, string | undefined>;
  const pinLabel = commonLabels.pin ?? dashboardLabels.sidebar_pin ?? 'Pin';
  const unpinLabel = commonLabels.unpin ?? dashboardLabels.sidebar_unpin ?? 'Unpin';

  const SidebarContent = (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between lg:justify-start p-6 mb-4 md:mb-8 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-4 group"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <Logo className="w-8 h-8 md:w-10 md:h-10 shrink-0 transition-transform group-hover:scale-105" />
          <div
            className={`flex flex-col transition-all duration-500 ${
              isSidebarExpanded
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-10 pointer-events-none lg:hidden'
            }`}
          >
            <span className="font-black text-lg tracking-tighter leading-none">PapaData</span>
            <span className="text-4xs font-bold text-brand-start tracking-widest uppercase mt-1">
              Intelligence
            </span>
          </div>
        </Link>

        <button
          ref={mobileCloseBtnRef}
          type="button"
          onClick={() => setIsMobileSidebarOpen(false)}
          className="lg:hidden p-2 text-gray-500 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/10"
          aria-label={t.common.close ?? 'Close'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <nav className="flex-1 min-h-0 px-3 overflow-y-auto no-scrollbar">
        {/* Header: Actions (tylko gdy rozwinięty) */}
        <div
          className={`px-3 text-2xs font-black uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400 transition-all ${
            isSidebarExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {t.dashboard.nav_group_actions}
        </div>

        <div className="mt-2 space-y-1">
          {overviewItem && (
            <button
              key={overviewItem.id}
              type="button"
              onClick={() => handleNavigate(overviewItem.id)}
              title={!isSidebarExpanded ? overviewItem.label : undefined}
              className={`relative w-full flex items-center gap-4 rounded-xl transition-all duration-300 group ${
                isSidebarExpanded ? 'p-3 md:p-4' : 'p-3 justify-center'
              } ${
                activeViewId === overviewItem.id
                  ? 'bg-brand-start/5 text-brand-start'
                  : 'text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {activeViewId === overviewItem.id && (
                <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-brand-start rounded-r-full" />
              )}
              <div
                className={`shrink-0 transition-transform group-hover:scale-110 ${
                  activeViewId === overviewItem.id ? 'text-brand-start' : ''
                }`}
              >
                {overviewItem.icon}
              </div>
              <span
                className={`text-sm2 md:text-sm-plus font-bold transition-all duration-500 whitespace-nowrap uppercase tracking-widest ${
                  isSidebarExpanded
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-10 pointer-events-none lg:hidden'
                }`}
              >
                {overviewItem.label}
              </span>
            </button>
          )}
        </div>

        {/* Trust header */}
        <div
          className={`px-3 pt-5 text-2xs font-black uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400 transition-all ${
            isSidebarExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {t.dashboard.nav_group_trust}
        </div>

        <div className="mt-2 space-y-1">
          {trustItems.map((item) => {
            const isActive = activeViewId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                title={!isSidebarExpanded ? item.label : undefined}
                className={`relative w-full flex items-center gap-4 rounded-xl transition-all duration-300 group ${
                  isSidebarExpanded ? 'p-3 md:p-4' : 'p-3 justify-center'
                } ${
                  isActive
                    ? 'bg-brand-start/5 text-brand-start'
                    : 'text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-brand-start rounded-r-full" />
                )}
                <div
                  className={`shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-brand-start' : ''
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-sm2 md:text-sm-plus font-bold transition-all duration-500 whitespace-nowrap uppercase tracking-widest ${
                    isSidebarExpanded
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-10 pointer-events-none lg:hidden'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <div className="my-4 h-px bg-black/5 dark:bg-white/5" />

        {/* SR-only header, żeby nie dublować wizualnie "Actions" */}
        <div className="sr-only">{t.dashboard.nav_group_actions}</div>

        <div className="space-y-1 pb-2">
          {restMenuItems.map((item) => {
            const isActive = activeViewId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                title={!isSidebarExpanded ? item.label : undefined}
                className={`relative w-full flex items-center gap-4 rounded-xl transition-all duration-300 group ${
                  isSidebarExpanded ? 'p-3 md:p-4' : 'p-3 justify-center'
                } ${
                  isActive
                    ? 'bg-brand-start/5 text-brand-start'
                    : 'text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-brand-start rounded-r-full" />
                )}
                <div
                  className={`shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-brand-start' : ''
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-sm2 md:text-sm-plus font-bold transition-all duration-500 whitespace-nowrap uppercase tracking-widest ${
                    isSidebarExpanded
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-10 pointer-events-none lg:hidden'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-3 border-t border-black/10 dark:border-white/5 shrink-0 space-y-1">
        <button
          type="button"
          onClick={() => setIsSidebarPinned(!isSidebarPinned)}
          className="hidden lg:flex w-full items-center gap-4 p-4 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all group"
          title={isSidebarPinned ? unpinLabel : pinLabel}
        >
          <svg
            className={`w-5 h-5 shrink-0 transition-transform ${
              isSidebarPinned ? 'rotate-45' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <span
            className={`text-xs font-black uppercase tracking-widest ${
              isSidebarExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {isSidebarPinned ? unpinLabel : pinLabel}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setIsAuthenticated(false);
            navigate('/');
          }}
          className={`w-full flex items-center gap-4 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all group ${
            isSidebarExpanded ? 'p-4' : 'p-3 justify-center'
          }`}
          title={!isSidebarExpanded ? t.dashboard.menu_end_session : undefined}
        >
          <svg
            className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4-4H7m6 4v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span
            className={`text-xs font-black uppercase tracking-widest ${
              isSidebarExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none lg:hidden'
            }`}
          >
            {t.dashboard.menu_end_session}
          </span>
        </button>
      </div>
    </div>
  );

  // Otwarcie mobile: reset hover (żeby nie "zawiesić" expanded)
  const openMobileSidebar = useCallback(() => {
    setIsSidebarHovered(false);
    setIsMobileSidebarOpen(true);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[3000] bg-gray-100 dark:bg-[#030305] flex overflow-hidden text-gray-900 dark:text-white font-sans selection:bg-brand-start selection:text-white"
      data-testid="dashboard-shell"
    >
      <OfflineBanner />
      {/* Mobile Backdrop (renderowane PRZED sidebar, żeby nie przykrywało go stackingiem) */}
      {isMobileSidebarOpen && !isDesktop && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[3040] lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      {isDesktop ? (
        <aside
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
          className={`relative h-full bg-gray-200/40 dark:bg-[#070709] border-r border-black/10 dark:border-white/5 transition-all duration-500 ease-in-out flex flex-col z-[3050] ${
            isSidebarExpanded ? 'w-72' : 'w-20'
          }`}
        >
          {SidebarContent}
        </aside>
      ) : (
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'tween', duration: 0.25 }}
              onMouseEnter={() => setIsSidebarHovered(true)}
              onMouseLeave={() => setIsSidebarHovered(false)}
              className="fixed left-0 top-0 h-dvh bg-gray-200/40 dark:bg-[#070709] border-r border-black/10 dark:border-white/5 flex flex-col z-[3050] w-72 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label={t.dashboard.nav_group_actions}
            >
              {SidebarContent}
            </motion.aside>
          )}
        </AnimatePresence>
      )}

      <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-gray-100 dark:bg-[#030305]">
        {/* Topbar */}
        <header className="border-b border-black/10 dark:border-white/5 flex items-center justify-between px-4 md:px-6 py-3 relative z-20 bg-white/80 dark:bg-[#030305]/80 backdrop-blur-xl shrink-0 gap-3 md:gap-6">
          <div className="flex items-center gap-3 md:gap-5 shrink-0">
            <button
              type="button"
              onClick={openMobileSidebar}
              className="lg:hidden p-2 rounded-xl bg-black/5 dark:bg-white/5 text-gray-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
              aria-label={t.dashboard.nav_group_actions}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="hidden sm:flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${sessionMeta.dot} animate-pulse`} />
                <span
                  className={`text-2xs md:text-xs font-black uppercase tracking-widest whitespace-nowrap ${sessionMeta.text}`}
                >
                  {t.dashboard.status_label}: {sessionMeta.label}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleNavigate('guardian')}
                className="flex items-center gap-2 text-3xs md:text-2xs font-bold uppercase tracking-tighter text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <span>
                  {t.dashboard.freshness_label}: {formattedLastUpdate}
                </span>
                {isDataStale && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-3xs font-black uppercase tracking-widest border border-amber-500/20">
                    {t.dashboard.data_stale_badge}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Center: Global Filters */}
          <div className="flex-1 flex items-center justify-center gap-2 md:gap-3 overflow-x-auto no-scrollbar scroll-hint">
            <div className="flex items-center gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 shrink-0">
              {rangeOptions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTimeRange(r)}
                  aria-pressed={timeRange === r}
                  className={`px-3 md:px-4 py-1.5 rounded-xl text-2xs md:text-xs font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f] ${
                    timeRange === r
                      ? 'bg-white dark:bg-white/10 shadow-lg text-brand-start dark:text-white'
                      : 'text-gray-500'
                  }`}
                >
                  {t.dashboard[`range_${r}` as keyof typeof t.dashboard] as string}
                </button>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-2" />
          </div>

          {/* Right: User, AI & Theme */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <div className="hidden md:flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-2xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">
                {modeLabel}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-brand-start/10 border border-brand-start/20 text-2xs font-black uppercase tracking-widest text-brand-start">
                {planLabel}
              </span>
              {isTrial && trialLabel && (
                <span className="text-3xs font-black text-gray-500 uppercase tracking-widest">
                  {trialLabel}
                </span>
              )}
              {isReadOnly && (
                <span className="px-2.5 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20 text-2xs font-black uppercase tracking-widest text-rose-500">
                  {t.dashboard.billing.read_only_badge}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="hidden md:flex p-2.5 md:p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
              aria-label={
                theme === 'light' ? t.common.toggle_theme_dark : t.common.toggle_theme_light
              }
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343L5.636 5.636M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                  />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsAiOpen(!isAiOpen)}
              className={`p-2.5 md:p-3 rounded-2xl transition-all shadow-xl ${
                isAiOpen
                  ? 'brand-gradient-bg text-white'
                  : 'bg-black/5 dark:bg-white/5 text-gray-500 border border-black/5 dark:border-white/10'
              }`}
              aria-pressed={isAiOpen}
              aria-label="Papa AI"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </button>

            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center cursor-pointer hover:border-brand-start/40 transition-all"
                aria-label={t.dashboard.account_title}
              >
                <span className="text-xs font-black uppercase">AD</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-52 rounded-2xl bg-white dark:bg-[#0a0a0c] border border-black/10 dark:border-white/10 shadow-2xl p-2 z-[3100] animate-reveal">
                  <div className="px-3 py-2 text-2xs font-black uppercase tracking-widest text-gray-400">
                    {t.dashboard.account_title}
                  </div>
                  {(() => {
                    try {
                      const raw = localStorage.getItem('papadata_user_roles');
                      const roles = raw ? (JSON.parse(raw) as string[]) : [];
                      if (!roles.includes('owner') && !roles.includes('admin')) return null;
                      return (
                        <button
                          type="button"
                          onClick={() => handleNavigate('settings/org#admin')}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          Admin Panel
                        </button>
                      );
                    } catch {
                      return null;
                    }
                  })()}
                  <button
                    type="button"
                    onClick={() => handleNavigate('settings/workspace')}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    {t.dashboard.account_access}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate('settings/org')}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    {t.dashboard.account_billing}
                  </button>
                  <div className="h-px bg-black/5 dark:bg-white/5 my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthenticated(false);
                      navigate('/');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10"
                  >
                    {t.dashboard.account_logout}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {(contextLabel || activeFilters.length > 0) && (
          <div className="border-b border-black/5 dark:border-white/5 px-4 md:px-6 py-2 flex flex-wrap items-center gap-2 bg-white/70 dark:bg-[#030305]/70 backdrop-blur-xl">
            {contextLabel && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-start/10 border border-brand-start/20 text-brand-start text-2xs font-black uppercase tracking-widest">
                <span>
                  {t.dashboard.context_label}: {contextLabel}
                </span>
                <button
                  type="button"
                  onClick={() => setContextLabel(null)}
                  className="hover:scale-110 transition-transform"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            {activeFilters.map((filter) => (
              <div
                key={filter.key}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-2xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300"
              >
                <span>
                  {filter.label}: {filter.valueLabel}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      [filter.key]: 'all',
                    }))
                  }
                  className="hover:scale-110 transition-transform"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}

            {activeFilters.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-2xs font-black uppercase tracking-widest text-gray-400 hover:text-brand-start transition-colors"
              >
                {t.dashboard.filters_clear}
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth p-4 md:p-8 lg:p-10 landscape:p-4">
          <div className="max-w-[1600px] mx-auto pb-20 lg:pb-0">
            {billingError && (
              <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-500">
                {billingError}
              </div>
            )}

            {isReadOnly && (
              <section className="mb-6 rounded-3xl border border-amber-500/30 bg-amber-500/10 px-6 py-6 md:px-8 md:py-7 space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-amber-600">
                      {t.dashboard.billing.read_only_badge}
                    </div>
                    <h3 className="text-xl font-black text-amber-800/90 dark:text-amber-200/90 uppercase tracking-tight">
                      {t.dashboard.billing.paywall_title}
                    </h3>
                    <p className="text-sm text-amber-800/80 dark:text-amber-200/80 font-medium">
                      {t.dashboard.billing.paywall_desc}
                    </p>
                  </div>
                  {canManageBilling ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={handleUpgrade}
                        className="px-5 py-3 rounded-xl bg-amber-500 text-white text-xs font-black uppercase tracking-widest shadow-lg hover:bg-amber-400 transition-colors"
                      >
                        {primaryBillingCta}
                      </button>
                      <button
                        type="button"
                        onClick={handleManageSubscription}
                        className="px-5 py-3 rounded-xl border border-amber-500/40 text-amber-700 text-xs font-black uppercase tracking-widest hover:bg-amber-500/10 transition-colors"
                      >
                        {t.dashboard.billing.manage_link}
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs font-black uppercase tracking-widest text-amber-700">
                      {t.dashboard.billing.paywall_member_cta}
                    </div>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-amber-500/20 bg-white/60 dark:bg-white/5 p-4">
                    <div className="text-xs font-black uppercase tracking-widest text-amber-600 mb-3">
                      {t.dashboard.billing.paywall_allowed_title}
                    </div>
                    <ul className="space-y-2 text-xs-plus text-amber-800/80 dark:text-amber-200/80">
                      {t.dashboard.billing.paywall_allowed_items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-amber-500/20 bg-white/60 dark:bg-white/5 p-4">
                    <div className="text-xs font-black uppercase tracking-widest text-amber-600 mb-3">
                      {t.dashboard.billing.paywall_blocked_title}
                    </div>
                    <ul className="space-y-2 text-xs-plus text-amber-800/80 dark:text-amber-200/80">
                      {t.dashboard.billing.paywall_blocked_items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {!tenantId && (
              <section className="mb-6 rounded-3xl border border-brand-start/20 bg-brand-start/5 px-6 py-6 md:px-8 md:py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <div className="text-xs font-black uppercase tracking-widest text-brand-start">
                    {t.dashboard.workspace_missing_title}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {t.dashboard.workspace_missing_desc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/app/settings/workspace')}
                  className="px-4 py-2 rounded-xl bg-brand-start text-white text-xs font-black uppercase tracking-widest shadow-lg"
                >
                  {t.dashboard.workspace_missing_cta}
                </button>
              </section>
            )}

            <DataReadinessBanner
              status={tenantStatus.status}
              loading={tenantStatus.loading}
              error={tenantStatus.error}
            />

            {isTrial && trialDaysValue > 0 && !isReadOnly && (
              <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-black uppercase tracking-widest text-emerald-600">
                    {t.dashboard.billing.trial_banner_tag}
                  </div>
                  <p className="text-sm text-emerald-700/90 dark:text-emerald-200/90 font-medium">
                    {canManageBilling ? trialBannerOwner : trialBannerMember}
                  </p>
                </div>
                {canManageBilling && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleUpgrade}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-black uppercase tracking-widest shadow-lg hover:bg-emerald-400 transition-colors"
                    >
                      {primaryBillingCta}
                    </button>
                    <button
                      type="button"
                      onClick={handleManageSubscription}
                      className="px-4 py-2 rounded-xl border border-emerald-500/40 text-emerald-700 text-xs font-black uppercase tracking-widest hover:bg-emerald-500/10 transition-colors"
                    >
                      {t.dashboard.billing.manage_link}
                    </button>
                  </div>
                )}
              </div>
            )}

            <Outlet context={outletContext} />
          </div>
        </div>

        <footer className="hidden md:flex h-10 border-t border-black/10 dark:border-white/5 items-center justify-between px-6 bg-gray-100/50 dark:bg-[#050507]/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-6 opacity-40">
            <span className="text-3xs font-mono font-bold tracking-[0.2em] uppercase">
              NODE: {peerId}
            </span>
            <div className="h-3 w-[1px] bg-black/10 dark:bg-white/10 hidden md:block" />
            <SessionTimer sessionStartTime={sessionStartTime} />
          </div>
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-3xs font-mono font-bold tracking-[0.2em] uppercase text-emerald-500/80">
              E2E_ENCRYPTED
            </span>
          </div>
        </footer>
      </main>

      <Suspense fallback={<PapaAiFallback />}>
        <PapaAI
          t={t}
          isOpen={isAiOpen}
          onOpenChange={setIsAiOpen}
          aiMode={aiMode}
          draftMessage={aiDraft}
          onDraftClear={() => setAiDraft(null)}
          contextData={{ filters: { ...filters, timeRange }, selection: [] }}
        />
      </Suspense>

      <CookieBanner onResolution={handleCookieResolution} t={t} />
    </div>
  );
};

export default DashboardSection;
