import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from './DashboardContext';
import { integrations } from '../../data/integrations';
import { ApiRequestError, apiGet, fetchIntegrations } from '../../data/api';
import { InteractiveButton } from '../InteractiveButton';
import { ContextMenu, WidgetEmptyState } from './DashboardPrimitives';
import { clamp } from './DashboardPrimitives.constants';
import { useContextMenu } from './DashboardPrimitives.hooks';
import { formatNumber, getNumberFormatter } from '../../utils/formatters';
import type { DashboardIntegrationsV2 } from '../../types';

type FilterId = 'all' | 'active' | 'disabled' | 'attention';
type SortId = 'issues' | 'recent' | 'name';

// API shape: backend powinien zwracać status per integrationId (active/attention/disabled)
type RealtimeStatusMap = Partial<Record<string, Exclude<FilterId, 'all'>>>;

const seeded = (i: number, seed: number) => {
  const x = Math.sin((i + 1) * seed) * 10000;
  return x - Math.floor(x);
};

const emptyIntegrations: DashboardIntegrationsV2 = {
  title: '',
  desc: '',
  header_badge: '',
  search_placeholder: '',
  filters: {
    all: '',
    active: '',
    disabled: '',
    attention: '',
  },
  sorts: {
    issues: '',
    recent: '',
    name: '',
  },
  status_active: '',
  status_disabled: '',
  status_attention: '',
  status_connecting: '',
  status_connected: '',
  active_connectors_label: '',
  records_synced_label: '',
  uptime_label: '',
  auth_prefix: '',
  sync_prefix: '',
  latency_prefix: '',
  health_label: '',
  scope_label: '',
  scope_default: '',
  auth_label: '',
  last_sync_label: '',
  last_sync_recent: '',
  last_sync_delay: '',
  last_sync_disabled: '',
  freshness_label: '',
  freshness_status: '',
  security_badge_label: '',
  security_title: '',
  security_desc: '',
  security_cta_keys: '',
  security_cta_sla: '',
  actions: {
    test: '',
    details: '',
    refresh: '',
  },
};

export const IntegrationsViewV2: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    t,
    openIntegrationModal,
    integrationStatus,
    setContextLabel,
    setAiDraft,
    timeRange,
    isDemo,
    isReadOnly,
  } = useOutletContext<DashboardOutletContext>();
  const { menu, openMenu, closeMenu } = useContextMenu();

  const demoTooltip = t.dashboard.demo_tooltip;
  const isLocked = Boolean(isDemo || isReadOnly);
  const lockTooltip = isDemo ? demoTooltip : t.dashboard.billing.read_only_tooltip;
  const integrationsCopy = t.dashboard.integrations_v2 ?? emptyIntegrations;

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterId>('all');
  const [sortId, setSortId] = useState<SortId>('issues');
  const [integrationsError, setIntegrationsError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  // Real-time status state fetched from backend
  const [realtimeStatuses, setRealtimeStatuses] = useState<RealtimeStatusMap>({});
  const [isFetchingStatuses, setIsFetchingStatuses] = useState(false);
  const [, setRemoteIntegrations] = useState<string[]>([]); // reserved for future UX

  const abortRef = useRef<AbortController | null>(null);
  const handleRetry = () => setRetryToken((prev) => prev + 1);

  const locale = t.langCode ?? 'pl-PL';
  const numberFormatter = useMemo(() => getNumberFormatter(locale), [locale]);

  const navigateWithSearch = (path: string) => navigate(`${path}${location.search}`);

  // Time-based scaling logic for dynamic metric mocks
  const timeMultiplier = useMemo(() => {
    if (timeRange === '1d') return 0.033;
    if (timeRange === '7d') return 0.23;
    return 1;
  }, [timeRange]);

  const timeSeed = useMemo(() => {
    if (timeRange === '1d') return 15;
    if (timeRange === '7d') return 45;
    return 95;
  }, [timeRange]);

  const fetchStatuses = useCallback(async () => {
    // cancel previous
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsFetchingStatuses(true);
    setIntegrationsError(null);

    try {
      const list = await fetchIntegrations();
      setRemoteIntegrations(list.map((item) => item.provider));

      // IMPORTANT: używamy tego samego originu co app, ale endpoint musi być względny do BASE_URL backendu.
      // Jeśli masz VITE_API_BASE_URL, to powinno iść przez fetchIntegrations lub wspólny klient.
      // Tutaj zostawiamy względny URL, ale dodajemy timeout + abort.
      const timeout = window.setTimeout(() => controller.abort(), 6500);

      const data = await apiGet<RealtimeStatusMap>('/integrations/status', {
        signal: controller.signal,
        timeoutMs: 6500,
      });

      window.clearTimeout(timeout);
      setRealtimeStatuses(data ?? {});
    } catch (err: unknown) {
      // jeżeli to abort (timeout/cleanup), nie pokazujemy błędu
      const isAbort = err instanceof DOMException && err.name === 'AbortError';

      if (err instanceof ApiRequestError && err.status === 404) {
        // brak endpointu / 404 -> fallback na logikę lokalną
        // nie ustawiamy błędu UX, żeby nie straszyć usera gdy backend nie wspiera statusów
        console.debug('Integrations status API not found, falling back to local derivation');
        setRealtimeStatuses({});
        return;
      }

      if (!isAbort) {
        console.debug('Failed to connect to integrations status API');
        const message = err instanceof Error ? err.message : t.dashboard.widget.error_desc;
        setIntegrationsError(message);
        console.error('Integrations status API error', err);
      }
    } finally {
      setIsFetchingStatuses(false);
    }
  }, [t.dashboard.widget.error_desc]);

  // polling
  useEffect(() => {
    fetchStatuses();
    const interval = window.setInterval(fetchStatuses, 20000);
    return () => {
      window.clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [fetchStatuses, retryToken]);

  type StatusTag = Exclude<FilterId, 'all'>;

  type IntegrationListItem = (typeof integrations)[number] & {
    name: string;
    detail: string;
    statusTag: StatusTag;
    recordsSynced: string;
    uptime: string;
    latency: string;
    health: number;
    originalIndex: number;
  };

  const list = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    let items: IntegrationListItem[] = (integrations || []).filter(Boolean).map((item, idx) => {
      const meta = t.integrations.items[item.id];
      const name = meta?.name ?? item.id;
      const detail = meta?.detail ?? '';

      const baseSeed = timeSeed + idx;
      const s = seeded(idx, baseSeed);

      const realtime = realtimeStatuses[item.id];
      let statusTag: StatusTag =
        (realtime as StatusTag) ||
        (item.status === 'live' ? 'active' : item.status === 'beta' ? 'attention' : 'disabled');

      // Fallback issue mocking if no API response
      if (!realtime && item.status === 'live' && s > 0.88) {
        statusTag = 'attention';
      }

      const rawRecords = (12000 + seeded(idx, 11) * 88000) * timeMultiplier;
      const recordsSynced = numberFormatter.format(Math.round(rawRecords));

      let uptime: string;
      if (statusTag === 'active') {
        const uptimeVal = clamp(99.8 + seeded(idx, 22) * 0.2, 97.5, 100);
        uptime = formatNumber(uptimeVal, locale, { maximumFractionDigits: 2 });
      } else if (statusTag === 'attention') {
        const uptimeVal = clamp(94.2 + seeded(idx, 22) * 3, 80, 99.9);
        uptime = formatNumber(uptimeVal, locale, { maximumFractionDigits: 1 });
      } else {
        uptime = formatNumber(0, locale, { maximumFractionDigits: 1 });
      }

      const latency =
        statusTag === 'active'
          ? `${numberFormatter.format(Math.round(45 + seeded(idx, 33) * 120))}ms`
          : statusTag === 'attention'
            ? `${numberFormatter.format(Math.round(450 + seeded(idx, 33) * 800))}ms`
            : '--';

      const health =
        statusTag === 'active'
          ? 100
          : statusTag === 'attention'
            ? clamp(55 + seeded(idx, 44) * 20, 40, 90)
            : 0;

      return {
        ...item,
        name,
        detail,
        statusTag,
        recordsSynced,
        uptime,
        latency,
        health,
        originalIndex: idx,
      };
    });

    if (normalized) {
      items = items.filter((item) =>
        `${item.name} ${item.detail} ${item.id}`.toLowerCase().includes(normalized)
      );
    }

    if (statusFilter !== 'all') {
      items = items.filter((item) => item.statusTag === statusFilter);
    }

    // Sorting
    if (sortId === 'name') {
      items = [...items].sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
    } else if (sortId === 'issues') {
      items = [...items].sort((a, b) => {
        const order: Record<StatusTag, number> = { attention: 0, active: 1, disabled: 2 };
        return order[a.statusTag] - order[b.statusTag];
      });
    } else if (sortId === 'recent') {
      items = [...items].sort(
        (a, b) => seeded(b.originalIndex, timeSeed) - seeded(a.originalIndex, timeSeed)
      );
    }

    return items;
  }, [
    locale,
    numberFormatter,
    query,
    realtimeStatuses,
    sortId,
    statusFilter,
    t,
    timeMultiplier,
    timeSeed,
  ]);

  const clearFilters = () => {
    setQuery('');
    setStatusFilter('all');
    setSortId('issues');
  };

  const handleExplain = (context: string) => {
    setContextLabel?.(context);
    setAiDraft?.(
      `${t.dashboard.context_menu.explain_ai}: ${context}. Przeanalizuj status połączenia i wydajność synchronizacji danych.`
    );
  };

  const handleSlaDownload = () => {
    if (isLocked) return;
    setContextLabel?.(integrationsCopy.title);
    setAiDraft?.(
      `${integrationsCopy.security_cta_sla}: ${integrationsCopy.title}. Przygotuj raport SLA i historię dostępności integracji.`
    );
  };

  const buildMenuItems = (item: IntegrationListItem) => [
    {
      id: 'drill',
      label: t.dashboard.context_menu.drill,
      onSelect: () => {
        setContextLabel?.(item.name);
        // drill = otwarcie konfiguracji (najbardziej naturalne w Integrations)
        openIntegrationModal?.(item);
      },
    },
    {
      id: 'explain',
      label: t.dashboard.context_menu.explain_ai,
      onSelect: () => handleExplain(item.name),
      tone: 'primary' as const,
    },
    {
      id: 'report',
      label: t.dashboard.context_menu.add_report,
      onSelect: () => {
        if (isLocked) return;
        setContextLabel?.(item.name);
        navigateWithSearch('/dashboard/reports');
      },
      disabled: isLocked,
      disabledReason: lockTooltip,
    },
    {
      id: 'export',
      label: t.dashboard.context_menu.export,
      onSelect: () => {
        if (isLocked) return;
        setContextLabel?.(item.name);
        setAiDraft?.(
          `${t.dashboard.context_menu.export}: ${item.name}. Przygotuj raport stanu integracji i historię synchronizacji.`
        );
      },
      disabled: isLocked,
      disabledReason: lockTooltip,
    },
    {
      id: 'alert',
      label: t.dashboard.context_menu.set_alert,
      onSelect: () => {
        if (isLocked) return;
        setContextLabel?.(item.name);
        navigateWithSearch('/dashboard/alerts');
      },
      disabled: isLocked,
      disabledReason: lockTooltip,
    },
  ];

  const statusMeta = (status: 'active' | 'disabled' | 'attention') => {
    if (status === 'attention') {
      return {
        label: integrationsCopy.status_attention,
        tone: 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]',
      };
    }
    if (status === 'disabled') {
      return {
        label: integrationsCopy.status_disabled,
        tone: 'border-gray-200 dark:border-white/10 text-gray-500 bg-white/60 dark:bg-white/5',
      };
    }
    return {
      label: integrationsCopy.status_active,
      tone: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    };
  };

  const authLabel = (auth: string) =>
    t.integrations.auth[auth as keyof typeof t.integrations.auth] ?? auth;

  return (
    <div className="space-y-8 animate-reveal">
      {/* Search and Filters Header */}
      <section className="rounded-[2.5rem] border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0b0b0f] p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-start/5 border border-brand-start/10 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-start animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-start">
                {integrationsCopy.header_badge}
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {integrationsCopy.title}
            </h2>
            <p className="text-base text-gray-500 dark:text-gray-400 font-medium">
              {integrationsCopy.desc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative group w-full sm:w-64">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-start transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={integrationsCopy.search_placeholder}
                className="pl-11 pr-4 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/40 text-sm focus:border-brand-start/50 outline-none transition-all w-full font-bold"
              />
            </div>

            <select
              value={sortId}
              onChange={(event) => setSortId(event.target.value as SortId)}
              className="px-4 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/40 text-xs font-black uppercase tracking-widest outline-none focus:border-brand-start/50 cursor-pointer"
            >
              <option value="issues">{integrationsCopy.sorts.issues}</option>
              <option value="recent">{integrationsCopy.sorts.recent}</option>
              <option value="name">{integrationsCopy.sorts.name}</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10">
            {(['all', 'active', 'attention', 'disabled'] as FilterId[]).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  statusFilter === filter
                    ? 'bg-white dark:bg-white/10 text-brand-start dark:text-white shadow-lg'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-pressed={statusFilter === filter}
              >
                {integrationsCopy.filters[filter]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              {isFetchingStatuses && (
                <div
                  className="flex items-center gap-2 mr-2"
                  aria-label={integrationsCopy.status_connecting}
                >
                  <div className="w-1 h-1 rounded-full bg-brand-start animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1 h-1 rounded-full bg-brand-start animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1 h-1 rounded-full bg-brand-start animate-bounce" />
                </div>
              )}
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {integrationsCopy.freshness_label}:
              </span>
              <span className="text-xs-plus font-black text-emerald-500 uppercase">
                {integrationsCopy.freshness_status}
              </span>
            </div>

            <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10" />

            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {integrationsCopy.active_connectors_label}:
              </span>
              <span className="text-xs-plus font-black text-gray-900 dark:text-white uppercase">
                {integrations.filter((i) => i.status === 'live').length}
              </span>
            </div>
          </div>
        </div>
      </section>

      {integrationsError && (
        <section className="rounded-[2.5rem] border border-rose-500/20 bg-rose-500/5 p-6 shadow-xl">
          <WidgetEmptyState
            title={t.dashboard.widget.error_title}
            desc={integrationsError || t.dashboard.widget.error_desc}
            actionLabel={t.dashboard.widget.cta_retry}
            onAction={handleRetry}
            tone="error"
          />
        </section>
      )}

      {/* Grid of Connectors */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {list.length === 0 ? (
          <div className="md:col-span-2 xl:col-span-3">
            <WidgetEmptyState
              title={t.dashboard.widget.empty_title}
              desc={t.dashboard.widget.empty_desc_filters}
              actionLabel={t.dashboard.widget.cta_clear_filters}
              onAction={clearFilters}
            />
          </div>
        ) : (
          list.map((item) => {
            const statusLabel = statusMeta(item.statusTag as 'active' | 'disabled' | 'attention');
            const connectionState = integrationStatus[item.id];
            const isLive = item.status === 'live';

            const connectDisabled = !isLive || isLocked || connectionState === 'connecting';
            const connectTitle = isLocked
              ? lockTooltip
              : !isLive
                ? t.integrations.status_soon
                : connectionState === 'connecting'
                  ? integrationsCopy.status_connecting
                  : undefined;

            const lastSyncLabel =
              item.statusTag === 'attention'
                ? integrationsCopy.last_sync_delay
                : item.statusTag === 'disabled'
                  ? integrationsCopy.last_sync_disabled
                  : integrationsCopy.last_sync_recent;

            return (
              <div
                key={item.id}
                onContextMenu={(event) => openMenu(event, buildMenuItems(item), item.name)}
                className={`group relative rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                  item.statusTag === 'active'
                    ? 'bg-white/90 dark:bg-[#0b0b0f] border-black/10 dark:border-white/10 hover:border-brand-start/40 shadow-lg'
                    : item.statusTag === 'attention'
                      ? 'bg-amber-500/[0.02] border-amber-500/20 shadow-xl'
                      : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5 opacity-70 grayscale'
                }`}
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/10 group-hover:border-brand-start/30 transition-all">
                      <svg
                        className={`w-8 h-8 ${item.statusTag === 'active' ? 'text-brand-start' : 'text-gray-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-1.415 1.414a4 4 0 105.657 5.657l1.414-1.415M10.172 13.828a4 4 0 005.656 0l1.415-1.414a4 4 0 10-5.657-5.657l-1.414 1.415"
                        />
                      </svg>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-2xs font-black uppercase tracking-widest border ${statusLabel.tone}`}
                      >
                        {statusLabel.label}
                      </span>

                      <div className="flex gap-1" aria-label={integrationsCopy.health_label}>
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`w-1 h-1 rounded-full ${
                              item.statusTag === 'active' && i <= 2
                                ? 'bg-emerald-500'
                                : 'bg-gray-300 dark:bg-gray-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-brand-start transition-colors leading-none mb-1">
                      {item.name}
                    </h4>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      {item.detail || t.integrations.categories[item.category]}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 py-6 border-y border-black/5 dark:border-white/5">
                    <div className="space-y-1">
                      <div className="text-3xs font-black text-gray-400 uppercase tracking-widest">
                        {integrationsCopy.records_synced_label}
                      </div>
                      <div className="text-sm font-black text-gray-900 dark:text-white tabular-nums">
                        {item.recordsSynced}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-3xs font-black text-gray-400 uppercase tracking-widest">
                        {integrationsCopy.uptime_label}
                      </div>
                      <div
                        className={`text-sm font-black tabular-nums ${
                          item.statusTag === 'active'
                            ? 'text-emerald-500'
                            : item.statusTag === 'attention'
                              ? 'text-amber-500'
                              : 'text-gray-400'
                        }`}
                      >
                        {item.uptime}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">{integrationsCopy.auth_prefix}:</span>
                      <span className="text-gray-900 dark:text-gray-300">
                        {authLabel(item.auth)}
                      </span>
                    </div>

                    <div className="h-3 w-[1px] bg-black/10 dark:bg-white/10" />

                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">{integrationsCopy.sync_prefix}:</span>
                      <span
                        className={`${
                          item.statusTag === 'attention'
                            ? 'text-amber-500'
                            : 'text-gray-900 dark:text-gray-300'
                        }`}
                      >
                        {lastSyncLabel}
                      </span>
                    </div>

                    <div className="h-3 w-[1px] bg-black/10 dark:bg-white/10" />

                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">{integrationsCopy.latency_prefix}:</span>
                      <span className="text-gray-900 dark:text-gray-300 tabular-nums">
                        {item.latency}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <InteractiveButton
                      variant={connectionState === 'connected' ? 'secondary' : 'primary'}
                      className="flex-1 !py-3 !text-xs font-black uppercase tracking-widest rounded-xl shadow-lg"
                      disabled={connectDisabled}
                      title={connectTitle}
                      onClick={() => {
                        if (connectDisabled) return;
                        openIntegrationModal?.(item);
                      }}
                    >
                      {connectionState === 'connected'
                        ? integrationsCopy.status_connected
                        : connectionState === 'connecting'
                          ? integrationsCopy.status_connecting
                          : integrationsCopy.actions.test}
                    </InteractiveButton>

                    <button
                      type="button"
                      onClick={(event) => {
                        if (isLocked) return;
                        openMenu(event, buildMenuItems(item), item.name);
                      }}
                      disabled={isLocked}
                      title={isLocked ? lockTooltip : t.dashboard.context_menu.label}
                      aria-label={t.dashboard.context_menu.label}
                      className={`p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 transition-all ${
                        isLocked
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-500 hover:text-gray-900 dark:text-white'
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6h.01M12 12h.01M12 18h.01"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleExplain(item.name)}
                      className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
                    >
                      {t.dashboard.context_menu.explain_ai}
                    </button>
                  </div>
                </div>

                {/* Health Indicator Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      item.statusTag === 'active'
                        ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                        : item.statusTag === 'attention'
                          ? 'bg-amber-500'
                          : 'bg-transparent'
                    }`}
                    style={{ width: `${item.health}%` }}
                    aria-label={`${integrationsCopy.health_label}: ${Math.round(item.health)}%`}
                  />
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Connection Info Detail Card */}
      <section className="rounded-[2.5rem] brand-gradient-bg p-10 text-white shadow-2xl animate-reveal relative overflow-hidden group">
        <div className="relative z-10 grid lg:grid-cols-[1.5fr_1fr] gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80">
                {integrationsCopy.security_badge_label}
              </span>
            </div>

            <h3 className="text-4xl font-black tracking-tighter uppercase leading-none">
              {integrationsCopy.security_title}
            </h3>

            <p className="text-lg font-medium opacity-80 leading-relaxed italic max-w-xl">
              {integrationsCopy.security_desc}
            </p>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigateWithSearch('/dashboard/settings/workspace')}
                disabled={isDemo}
                title={isDemo ? demoTooltip : undefined}
                className={`px-6 py-3 rounded-xl bg-white text-brand-start text-xs font-black uppercase tracking-widest shadow-xl transition-transform ${
                  isDemo ? 'opacity-40 cursor-not-allowed hover:scale-100' : 'hover:scale-105'
                }`}
              >
                {integrationsCopy.security_cta_keys}
              </button>

              <button
                type="button"
                onClick={() => handleExplain(integrationsCopy.title)}
                className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest transition-all hover:bg-white/20"
              >
                {t.dashboard.context_menu.explain_ai}
              </button>

              <button
                type="button"
                onClick={handleSlaDownload}
                disabled={isLocked}
                title={isLocked ? lockTooltip : undefined}
                className={`px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest transition-all ${
                  isLocked ? 'opacity-40 cursor-not-allowed hover:bg-white/10' : 'hover:bg-white/20'
                }`}
              >
                {integrationsCopy.security_cta_sla}
              </button>
            </div>
          </div>

          <div className="hidden lg:flex justify-end gap-4 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000">
            <div className="w-32 h-32 rounded-3xl border border-white/20 flex items-center justify-center p-6">
              <svg
                className="w-full h-full"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
              </svg>
            </div>
            <div className="w-32 h-32 rounded-3xl border border-white/20 flex items-center justify-center p-6">
              <svg
                className="w-full h-full"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 blur-[100px] rounded-full" />
      </section>

      <ContextMenu menu={menu} onClose={closeMenu} />
    </div>
  );
};

export default IntegrationsViewV2;
