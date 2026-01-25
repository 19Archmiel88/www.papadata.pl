import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from './DashboardContext';
import {
  ContextMenu,
  LazySection,
  WidgetSkeleton,
  WidgetErrorState,
  WidgetOfflineState,
} from './DashboardPrimitives';
import { useContextMenu } from './DashboardPrimitives.hooks';
import { fetchDashboardAlerts } from '../../data/api';
import type { DashboardAlertsResponse } from '@papadata/shared';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { formatSignedPercentValue } from '../../utils/formatters';

type SeverityFilter = 'all' | 'critical' | 'warning' | 'info';

const captureException = (error: Error, context?: Record<string, unknown>) => {
  if (context) {
    console.error(error, context);
  } else {
    console.error(error);
  }
};
type AlertSeverity = Exclude<SeverityFilter, 'all'>;

type AlertItem = {
  id: string;
  title: string;
  impact: string;
  time: string;
  context: string;
  prompt: string;
  target: string;
  severity: AlertSeverity;
};

type RawAlert = {
  title: string;
  context: string;
  target: string;
  severity: AlertSeverity;
  baseProb: number;
};

const seeded = (i: number, seed: number) => {
  const x = Math.sin((i + 1) * seed) * 10000;
  return x - Math.floor(x);
};

export const AlertsViewV2: React.FC = () => {
  const { t, setAiDraft, setContextLabel, timeRange, isDemo } =
    useOutletContext<DashboardOutletContext>();
  const isOnline = useOnlineStatus();

  const navigate = useNavigate();
  const location = useLocation();
  const navigateWithSearch = (path: string) => navigate(`${path}${location.search}`);

  const { menu, openMenu, closeMenu } = useContextMenu();

  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [ackedAlerts, setAckedAlerts] = useState<Set<string>>(new Set());
  const [mutedContexts, setMutedContexts] = useState<Set<string>>(new Set());
  const [alertsData, setAlertsData] = useState<DashboardAlertsResponse | null>(null);
  const [alertsError, setAlertsError] = useState<string | null>(null);

  const locale = t.langCode ?? 'pl-PL';

  const demoTooltip = t.dashboard.demo_tooltip;
  const headerBadgeLabel = t.dashboard.alerts_stream;
  const ackedBadgeLabel = t.dashboard.alerts_acked;
  const ackLabel = t.dashboard.alerts_ack;
  const unackLabel = t.dashboard.alerts_ack_required;
  const statusNewLabel = t.dashboard.alerts_ack_required;
  const statusConfirmedLabel = t.dashboard.alerts_acked;

  const [retryToken, setRetryToken] = useState(0);
  const handleRetry = () => setRetryToken((prev) => prev + 1);

  // Time-based seeding and scaling
  const timeSeed = useMemo(
    () => (timeRange === '1d' ? 12 : timeRange === '7d' ? 42 : 92),
    [timeRange],
  );
  const alertCount = useMemo(
    () => (timeRange === '1d' ? 6 : timeRange === '7d' ? 12 : 20),
    [timeRange],
  );

  useEffect(() => {
    let active = true;

    // przy ponownej próbie / zmianie zakresu czyścimy błąd przed kolejnym fetchem
    setAlertsError(null);

    fetchDashboardAlerts({ timeRange })
      .then((data) => {
        if (!active) return;
        setAlertsData(data);
        setAlertsError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : t.dashboard.widget.error_desc;
        setAlertsError(message);
      });

    return () => {
      active = false;
    };
  }, [timeRange, retryToken, t.dashboard.widget.error_desc]);

  useEffect(() => {
    if (alertsError) {
      captureException(new Error(alertsError), { scope: 'alerts' });
    }
  }, [alertsError]);

  const mockAlerts = useMemo<AlertItem[]>(() => {
    const rawAlertsCandidate = (t.dashboard.alerts_v2.mock_alerts ?? []) as RawAlert[];

    // Bezpieczny fallback (żeby nie było modulo przez 0 i żeby UI zawsze miało co renderować)
    const rawAlerts =
      rawAlertsCandidate.length > 0
        ? rawAlertsCandidate
        : ([
            {
              title: 'Spadek ROAS w kanale',
              context: t.dashboard.alerts_v2.context_fallback,
              target: 'ads',
              severity: 'warning',
              baseProb: 0.6,
            },
            {
              title: 'Anomalia kosztu CPA',
              context: t.dashboard.alerts_v2.context_fallback,
              target: 'ads',
              severity: 'critical',
              baseProb: 0.5,
            },
            {
              title: 'Wzrost przychodu z kampanii',
              context: t.dashboard.alerts_v2.context_fallback,
              target: 'growth',
              severity: 'info',
              baseProb: 0.4,
            },
          ] as RawAlert[]);

    return Array.from({ length: alertCount }).map((_, i) => {
      const idx = i % rawAlerts.length;
      const base = rawAlerts[idx];
      const context = base.context ?? t.dashboard.alerts_v2.context_fallback;
      const s = seeded(i, timeSeed);
      const minutesAgo = Math.round(i * 1.5 + s * 10);
      const timeAgo =
        i === 0 ? t.common.time_now : t.common.time_minutes_ago.replace('{minutes}', String(minutesAgo));
      const impactValue =
        s > 0.5
          ? formatSignedPercentValue(-(s * 20), locale, 1)
          : formatSignedPercentValue(s * 15, locale, 1);

      return {
        id: `alert-${i}-${timeSeed}`,
        title: base.title,
        impact: t.dashboard.alerts_v2.impact_template.replace('{value}', impactValue),
        time: timeAgo,
        context,
        prompt: t.dashboard.alerts_v2.prompt_template
          .replace('{title}', base.title)
          .replace('{context}', context),
        target: base.target,
        severity: base.severity,
      };
    });
  }, [alertCount, locale, timeSeed, t]);

  const alertItems = useMemo<AlertItem[]>(() => {
    if (!alertsData?.alerts?.length) return mockAlerts;
    return alertsData.alerts.map((alert) => {
      const context = alert.context ?? t.dashboard.alerts_v2.context_fallback;
      return {
        id: alert.id,
        title: alert.title,
        impact: alert.impact,
        time: alert.time,
        context,
        prompt: t.dashboard.alerts_v2.prompt_template.replace('{title}', alert.title).replace('{context}', context),
        target: alert.target ?? 'overview',
        severity: alert.severity as AlertSeverity,
      };
    });
  }, [alertsData, mockAlerts, t]);

  const filtered = useMemo(
    () =>
      alertItems.filter(
        (alert) =>
          (severityFilter === 'all' || alert.severity === severityFilter) && !mutedContexts.has(alert.context),
      ),
    [alertItems, severityFilter, mutedContexts],
  );

  const toggleAck = (id: string) => {
    setAckedAlerts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleMuteContext = (context: string) => {
    setMutedContexts((prev) => {
      const next = new Set(prev);
      if (next.has(context)) next.delete(context);
      else next.add(context);
      return next;
    });
  };

  const severityStyles = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
      case 'warning':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const handleDrill = (target: string, context: string) => {
    setContextLabel?.(context);
    // zachowujemy query string (spójne z resztą dashboardu)
    navigateWithSearch(`/dashboard/${target}`);
  };

  const handleExplain = (alert: AlertItem) => {
    setContextLabel?.(alert.context);
    setAiDraft?.(alert.prompt);
  };

  const handleMute = (context: string) => {
    if (isDemo) return;
    toggleMuteContext(context);
  };

  const buildMenuItems = (alert: AlertItem) => [
    {
      id: 'drill',
      label: t.dashboard.context_menu.drill,
      onSelect: () => handleDrill(alert.target, alert.context),
    },
    {
      id: 'explain',
      label: t.dashboard.context_menu.explain_ai,
      onSelect: () => handleExplain(alert),
      tone: 'primary' as const,
    },
    {
      id: 'ack',
      label: ackedAlerts.has(alert.id) ? unackLabel : ackLabel,
      onSelect: () => toggleAck(alert.id),
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
    {
      id: 'mute',
      label: t.dashboard.alerts_v2.actions.mute,
      onSelect: () => handleMute(alert.context),
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
  ];

  return (
    <div className="space-y-8 animate-reveal">
      {/* Filters Header */}
      <section className="dashboard-surface dashboard-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/5 border border-rose-500/10 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">
                {headerBadgeLabel}
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {t.dashboard.alerts_v2.title}
            </h2>
            <p className="text-base text-gray-500 dark:text-gray-400 font-medium">{t.dashboard.alerts_v2.desc}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
            {(['all', 'critical', 'warning', 'info'] as SeverityFilter[]).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSeverityFilter(filter)}
                aria-pressed={severityFilter === filter}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f] ${
                  severityFilter === filter
                    ? 'bg-white dark:bg-white/10 text-brand-start dark:text-white shadow-lg'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t.dashboard.alerts_v2.filters[filter]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-6 pt-8 border-t border-black/5 dark:border-white/5 opacity-60">
          <div className="flex items-center gap-3">
            <span className="text-2xs font-black uppercase tracking-widest text-gray-400">
              {t.dashboard.alerts_v2.domain_label}:
            </span>
            <div className="flex gap-2">
              {t.dashboard.alerts_v2.domains.map((domain) => (
                <span
                  key={domain}
                  className="px-2.5 py-1 rounded-lg border border-black/5 dark:border-white/10 text-2xs font-bold text-gray-500 uppercase tracking-tighter cursor-default hover:border-brand-start transition-colors"
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>
          <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-3">
            <span className="text-2xs font-black uppercase tracking-widest text-gray-400">
              {t.dashboard.alerts_v2.state_label}:
            </span>
            <div className="flex gap-2">
              {t.dashboard.alerts_v2.states.map((state) => (
                <span
                  key={state}
                  className="px-2.5 py-1 rounded-lg border border-black/5 dark:border-white/10 text-2xs font-bold text-gray-500 uppercase tracking-tighter cursor-default"
                >
                  {state}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {!isOnline && (
        <section className="dashboard-surface dashboard-card--compact border-amber-500/30 bg-amber-500/10">
          <WidgetOfflineState
            title={t.dashboard.widget.offline_title}
            desc={t.dashboard.widget.offline_desc}
            actionLabel={t.dashboard.widget.cta_retry}
            onAction={handleRetry}
          />
        </section>
      )}

      {isOnline && alertsError && (
        <section className="dashboard-surface dashboard-card--compact border-rose-500/20 bg-rose-500/5">
          <WidgetErrorState
            title={t.dashboard.widget.error_title}
            desc={t.dashboard.widget.error_desc}
            actionLabel={t.dashboard.widget.cta_retry}
            onAction={handleRetry}
          />
        </section>
      )}

      {/* Alert Stream */}
      <LazySection
        fallback={
          <div className="space-y-4">
            <WidgetSkeleton chartHeight="h-24" lines={2} />
            <WidgetSkeleton chartHeight="h-24" lines={2} />
          </div>
        }
      >
        <section className="grid gap-4">
          {filtered.length === 0 ? (
            <div className="py-20 text-center rounded-[2.5rem] border border-dashed border-black/10 dark:border-white/10">
              <div className="w-16 h-16 rounded-full bg-emerald-500/5 flex items-center justify-center mx-auto text-emerald-500 mb-4 opacity-40">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
                {t.dashboard.alerts_v2.empty_state}
              </p>
            </div>
          ) : (
            filtered.map((alert) => (
              <div
                key={alert.id}
                onContextMenu={(event) => openMenu(event, buildMenuItems(alert), alert.title)}
                className={`group relative rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                  ackedAlerts.has(alert.id)
                    ? 'bg-black/[0.01] dark:bg-white/[0.01] border-black/5 dark:border-white/5 opacity-60'
                    : 'bg-white/90 dark:bg-[#0b0b0f] border-black/10 dark:border-white/10 hover:border-brand-start/40 shadow-lg'
                }`}
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-start gap-6 flex-1">
                    {/* Severity Indicator Dot */}
                    <div
                      className={`mt-2 w-2 h-2 rounded-full shrink-0 ${
                        alert.severity === 'critical'
                          ? 'bg-rose-500 animate-pulse'
                          : alert.severity === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
                          {alert.time} • {alert.context}
                        </span>

                        {ackedAlerts.has(alert.id) && (
                          <span className="text-2xs font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                            {ackedBadgeLabel}
                          </span>
                        )}

                        <span
                          className={`text-2xs font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${
                            ackedAlerts.has(alert.id)
                              ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'
                              : 'text-amber-500 border-amber-500/20 bg-amber-500/5'
                          }`}
                        >
                          {ackedAlerts.has(alert.id) ? statusConfirmedLabel : statusNewLabel}
                        </span>
                      </div>

                      <h3
                        className={`text-lg font-black uppercase tracking-tight transition-colors ${
                          ackedAlerts.has(alert.id)
                            ? 'text-gray-400'
                            : 'text-gray-900 dark:text-white group-hover:text-brand-start'
                        }`}
                      >
                        {alert.title}
                      </h3>

                      <p
                        className={`text-sm font-medium ${
                          alert.severity === 'critical' ? 'text-rose-500' : 'text-gray-500'
                        }`}
                      >
                        {alert.impact}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div
                      className={`px-4 py-1.5 rounded-xl border text-xs font-black uppercase tracking-widest ${severityStyles(
                        alert.severity,
                      )}`}
                    >
                      {alert.severity}
                    </div>

                    <div className="flex items-center gap-2 ml-auto md:ml-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (isDemo) return;
                          toggleAck(alert.id);
                        }}
                        disabled={isDemo}
                        title={isDemo ? demoTooltip : ackLabel}
                        className={`p-3 rounded-2xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f] ${
                          ackedAlerts.has(alert.id)
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-gray-500 hover:text-brand-start hover:border-brand-start/40'
                        } ${isDemo ? 'opacity-40 cursor-not-allowed' : ''}`}
                        aria-label={ackedAlerts.has(alert.id) ? unackLabel : ackLabel}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={(event) => openMenu(event, buildMenuItems(alert), alert.title)}
                        className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
                        aria-label={t.dashboard.context_menu.label}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6h.01M12 12h.01M12 18h.01" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Action Ribbon */}
                <div className="px-6 md:px-8 py-4 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/5 dark:border-white/5 flex flex-wrap gap-6 items-center">
                  <button
                    type="button"
                    onClick={() => handleExplain(alert)}
                    className="text-xs font-black uppercase tracking-widest text-brand-start flex items-center gap-2 hover:underline"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {t.dashboard.alerts_v2.actions.explain_ai}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDrill(alert.target, alert.context)}
                    className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {t.dashboard.alerts_v2.actions.open_view}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMute(alert.context)}
                    className={`text-xs font-black uppercase tracking-widest text-gray-400 transition-colors ml-auto ${
                      isDemo ? 'opacity-40 cursor-not-allowed' : 'hover:text-rose-500'
                    }`}
                    disabled={isDemo}
                    title={isDemo ? demoTooltip : undefined}
                  >
                    {t.dashboard.alerts_v2.actions.mute}
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </LazySection>

      <ContextMenu menu={menu} onClose={closeMenu} />
    </div>
  );
};

export default AlertsViewV2;
