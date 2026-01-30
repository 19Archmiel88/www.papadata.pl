import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from './DashboardContext';
import { InteractiveButton } from '../InteractiveButton';
import {
  ContextMenu,
  LazySection,
  WidgetSkeleton,
  WidgetErrorState,
  WidgetOfflineState,
} from './DashboardPrimitives';
import { useContextMenu } from './DashboardPrimitives.hooks';
import { fetchDashboardGuardian } from '../../data/api';
import type { DashboardGuardianResponse } from '@papadata/shared';
import type { DashboardGuardianV2 } from '../../types';
import { getNumberFormatter } from '../../utils/formatters';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

const seeded = (i: number, seed: number) => {
  const x = Math.sin((i + 1) * seed) * 10000;
  return x - Math.floor(x);
};

type GuardianApiSource = {
  source: string;
  status: 'ok' | 'delayed' | 'warning' | 'error' | string;
  delayMinutes?: number;
  lastSync?: string;
  records?: number;
};

type GuardianApiIssue = {
  id: string;
  title: string;
  impact: string;
  severity: 'critical' | 'warning' | 'info' | string;
};

type GuardianSourceTranslation = {
  id: string;
  name: string;
};

type GuardianSyncItem = {
  id: string;
  name: string;
  status: string;
  last_sync: string;
  delay: string;
  records: string;
};

type GuardianQualityIssue = {
  id: string;
  title: string;
  impact: string;
  severity: string;
};

const emptyGuardian: DashboardGuardianV2 = {
  title: '',
  desc: '',
  ai_prompt: '',
  badge_label: '',
  health_label: '',
  health_status: '',
  uptime_label: '',
  uptime_value: '',
  range_label: '',
  range_options: [],
  only_issues_label: '',
  status_healthy: '',
  status_delayed: '',
  delay_under_2_min: '',
  delay_na: '',
  severity_critical: '',
  severity_warning: '',
  severity_info: '',
  sources: [],
  actions: {
    run_validations: '',
    rebuild_index: '',
  },
  freshness: {
    title: '',
    desc: '',
    menu_label: '',
    columns: {
      source: '',
      status: '',
      last_sync: '',
      delay: '',
      records: '',
      action: '',
    },
    items: [],
    actions: {
      explain: '',
    },
  },
  quality: {
    title: '',
    desc: '',
    empty_state: '',
    items: [],
    actions: {
      view: '',
      fix: '',
    },
  },
  rag: {
    title: '',
    desc: '',
    status_heading: '',
    index_title: '',
    index_subtitle: '',
    explain_context: '',
    cta: '',
    status_label: '',
    status_value: '',
    last_update_label: '',
    last_update_value: '',
    coverage_label: '',
    coverage_value: '',
  },
};

export const GuardianViewV2: React.FC = () => {
  const { t, setAiDraft, setContextLabel, timeRange, isDemo } =
    useOutletContext<DashboardOutletContext>();
  const isOnline = useOnlineStatus();
  const { menu, openMenu, closeMenu } = useContextMenu();
  const [guardianData, setGuardianData] = useState<DashboardGuardianResponse | null>(null);
  const [guardianError, setGuardianError] = useState<string | null>(null);
  const demoTooltip = t.dashboard.demo_tooltip;
  const guardian = t.dashboard.guardian_v2 ?? emptyGuardian;
  const [retryToken, setRetryToken] = useState(0);
  const handleRetry = () => setRetryToken((prev) => prev + 1);

  const locale = t.langCode ?? 'pl-PL';
  const numberFormatter = useMemo(() => getNumberFormatter(locale), [locale]);

  const location = useLocation();
  const navigate = useNavigate();
  const navigateWithSearch = (path: string) => navigate(`${path}${location.search}`);

  // Logic for dynamic data scaling based on timeRange
  const timeMultiplier = useMemo(() => {
    if (timeRange === '1d') return 0.033;
    if (timeRange === '7d') return 0.23;
    return 1;
  }, [timeRange]);

  const timeSeed = useMemo(() => {
    if (timeRange === '1d') return 14;
    if (timeRange === '7d') return 44;
    return 84;
  }, [timeRange]);

  useEffect(() => {
    let active = true;

    // reset błędu przy zmianie zakresu / retrialu (spójnie z innymi widokami)
    setGuardianError(null);

    fetchDashboardGuardian({ timeRange })
      .then((data) => {
        if (!active) return;
        setGuardianData(data);
        setGuardianError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : t.dashboard.widget.error_desc;
        setGuardianError(message);
      });

    return () => {
      active = false;
    };
  }, [timeRange, retryToken, t.dashboard.widget.error_desc]);

  useEffect(() => {
    if (guardianError) {
      console.error(new Error(guardianError));
    }
  }, [guardianError]);

  const formatRelativeTime = useCallback(
    (iso?: string) => {
      if (!iso) return t.common.time_now;
      const ts = Date.parse(iso);
      if (Number.isNaN(ts)) return t.common.time_now;

      // jeśli timestamp jest z przyszłości, traktujemy jako "now"
      const diffMs = Math.max(0, Date.now() - ts);
      const diffMin = Math.max(0, Math.round(diffMs / 60000));

      if (diffMin < 1) return t.common.time_now;
      if (diffMin < 60) {
        return t.common.time_minutes_ago.replace('{minutes}', String(diffMin));
      }
      const diffH = Math.round(diffMin / 60);
      return t.common.time_hours_ago.replace('{hours}', String(diffH));
    },
    [t]
  );

  // Sync Monitor Data (API first, fallback to mock)
  const syncItems = useMemo<GuardianSyncItem[]>(() => {
    const apiSources = (guardianData?.sources ?? []) as GuardianApiSource[];
    if (apiSources.length) {
      return apiSources.map((source) => {
        const status = source.status === 'ok' ? guardian.status_healthy : guardian.status_delayed;

        const delay =
          typeof source.delayMinutes === 'number'
            ? `${source.delayMinutes} min`
            : status === guardian.status_healthy
              ? guardian.delay_under_2_min
              : guardian.delay_na;

        return {
          id: source.source,
          name: source.source,
          status,
          last_sync: formatRelativeTime(source.lastSync),
          delay,
          records:
            typeof source.records === 'number' ? numberFormatter.format(source.records) : '0',
        };
      });
    }

    const sources = (guardian.sources ?? []) as GuardianSourceTranslation[];
    return sources.map((s, i) => {
      const baseSeed = timeSeed + i;
      const statusSeed = seeded(i, baseSeed);
      const isDelayed = statusSeed > 0.85;
      const records = Math.round((25000 + seeded(i, 11) * 75000) * timeMultiplier);
      const delay = isDelayed
        ? `${Math.round(15 + seeded(i, 22) * 45)} min`
        : guardian.delay_under_2_min;

      return {
        ...s,
        status: isDelayed ? guardian.status_delayed : guardian.status_healthy,
        last_sync: isDelayed
          ? t.common.time_minutes_ago.replace('{minutes}', '14')
          : t.common.time_now,
        delay,
        records: numberFormatter.format(records),
      };
    });
  }, [formatRelativeTime, guardian, guardianData, numberFormatter, t, timeMultiplier, timeSeed]);

  // Data Quality Issues (API first, fallback to mock)
  const qualityIssues = useMemo<GuardianQualityIssue[]>(() => {
    const apiIssues = (guardianData?.issues ?? []) as GuardianApiIssue[];
    if (apiIssues.length) {
      return apiIssues.map((issue) => ({
        id: issue.id,
        title: issue.title,
        impact: issue.impact,
        severity:
          issue.severity === 'critical'
            ? guardian.severity_critical
            : issue.severity === 'warning'
              ? guardian.severity_warning
              : guardian.severity_info,
      }));
    }

    return (guardian.quality.items ?? []) as GuardianQualityIssue[];
  }, [guardian, guardianData]);

  const handleExplain = (label: string) => {
    setContextLabel?.(label);
    setAiDraft?.(guardian.ai_prompt.replace('{name}', label));
  };

  const buildMenuItems = (context: string) => [
    {
      id: 'drill',
      label: t.dashboard.context_menu.drill,
      onSelect: () => {
        setContextLabel?.(context);
        // sensowny drill z Guardiana: przechodzimy do strumienia alertów / issues
        navigateWithSearch('/dashboard/alerts');
      },
    },
    {
      id: 'explain',
      label: t.dashboard.context_menu.explain_ai,
      onSelect: () => handleExplain(context),
      tone: 'primary' as const,
    },
    {
      id: 'report',
      label: t.dashboard.context_menu.add_report,
      onSelect: () => {
        if (isDemo) return;
        setContextLabel?.(context);
        navigateWithSearch('/dashboard/reports');
      },
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
    {
      id: 'export',
      label: t.dashboard.context_menu.export,
      onSelect: () => {
        if (isDemo) return;
        setContextLabel?.(context);
        setAiDraft?.(`${t.dashboard.context_menu.export}: ${context}`);
      },
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
    {
      id: 'alert',
      label: t.dashboard.context_menu.set_alert,
      onSelect: () => {
        if (isDemo) return;
        setContextLabel?.(context);
        navigateWithSearch('/dashboard/alerts');
      },
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
  ];

  const cardSkeleton = (
    <div className="rounded-[2.5rem] border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0b0b0f] p-8 shadow-xl">
      <WidgetSkeleton chartHeight="h-48" lines={4} />
    </div>
  );

  return (
    <div className="space-y-8 animate-reveal">
      {/* Guardian Header / Control Center */}
      <section className="rounded-[2rem] md:rounded-[2.5rem] border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0b0b0f] px-6 xs:px-7 md:px-8 py-6 md:py-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-2xs xs:text-xs font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                {guardian.badge_label}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">
              {guardian.title}
            </h2>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">
              {guardian.desc}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-4 w-full md:w-auto">
            <div className="p-4 px-5 md:px-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 text-center min-w-[130px]">
              <div className="text-2xs font-black text-gray-400 uppercase tracking-widest mb-1">
                {guardian.health_label}
              </div>
              <div className="text-xl md:text-2xl font-black text-emerald-500">
                {guardian.health_status}
              </div>
            </div>
            <div className="p-4 px-5 md:px-6 rounded-2xl bg-brand-start text-white shadow-xl shadow-brand-start/20 text-center min-w-[130px]">
              <div className="text-2xs font-black uppercase tracking-widest mb-1 opacity-70">
                {guardian.uptime_label}
              </div>
              <div className="text-xl md:text-2xl font-black">{guardian.uptime_value}</div>
            </div>
          </div>
        </div>
      </section>

      {!isOnline && (
        <section className="rounded-[2.5rem] border border-amber-500/30 bg-amber-500/10 p-6 shadow-xl">
          <WidgetOfflineState
            title={t.dashboard.widget.offline_title}
            desc={t.dashboard.widget.offline_desc}
            actionLabel={t.dashboard.widget.cta_retry}
            onAction={handleRetry}
          />
        </section>
      )}

      {isOnline && guardianError && (
        <section className="rounded-[2.5rem] border border-rose-500/20 bg-rose-500/5 p-6 shadow-xl">
          <WidgetErrorState
            title={t.dashboard.widget.error_title}
            desc={t.dashboard.widget.error_desc}
            actionLabel={t.dashboard.widget.cta_retry}
            onAction={handleRetry}
          />
        </section>
      )}

      <LazySection fallback={cardSkeleton}>
        <section className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          {/* Freshness Monitor */}
          <div className="rounded-[2rem] md:rounded-[2.5rem] border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0b0b0f] px-5 xs:px-6 md:px-8 py-6 md:py-8 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8 md:mb-10">
              <div className="space-y-1">
                <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {guardian.freshness.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-xl">
                  {guardian.freshness.desc}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleExplain(guardian.freshness.title)}
                  className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
                >
                  {t.dashboard.context_menu.explain_ai}
                </button>

                <button
                  type="button"
                  onClick={handleRetry}
                  className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 text-gray-500 hover:text-brand-start transition-all"
                  title={t.dashboard.widget.cta_retry}
                  aria-label={t.dashboard.widget.cta_retry}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={(event) =>
                    openMenu(
                      event,
                      buildMenuItems(guardian.freshness.title),
                      guardian.freshness.menu_label
                    )
                  }
                  className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  aria-label={t.dashboard.context_menu.label}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6h.01M12 12h.01M12 18h.01"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar scroll-hint">
              <table className="w-full min-w-[640px] text-left border-collapse">
                <caption className="sr-only">{guardian.freshness.title}</caption>
                <thead className="text-2xs xs:text-xs font-black text-gray-400 uppercase tracking-widest border-b border-black/5 dark:border-white/5">
                  <tr>
                    <th className="py-3.5 md:py-4 px-2">{guardian.freshness.columns.source}</th>
                    <th className="py-3.5 md:py-4 px-2 text-center whitespace-nowrap">
                      {guardian.freshness.columns.status}
                    </th>
                    <th className="py-3.5 md:py-4 px-2 text-right whitespace-nowrap">
                      {guardian.freshness.columns.last_sync}
                    </th>
                    <th className="py-3.5 md:py-4 px-2 text-right whitespace-nowrap">
                      {guardian.freshness.columns.delay}
                    </th>
                    <th className="py-3.5 md:py-4 px-2 text-right whitespace-nowrap">
                      {guardian.freshness.columns.records}
                    </th>
                    <th className="py-4 px-2" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {syncItems.map((item) => (
                    <tr
                      key={item.id}
                      onContextMenu={(event) =>
                        openMenu(event, buildMenuItems(item.name), item.name)
                      }
                      className="group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="py-4 md:py-5 px-2">
                        <div className="text-sm font-black text-gray-900 dark:text-white group-hover:text-brand-start transition-colors uppercase tracking-tight">
                          {item.name}
                        </div>
                        <div className="text-3xs xs:text-2xs font-mono text-gray-400 mt-1 break-all">
                          {item.id}
                        </div>
                      </td>

                      <td className="py-4 md:py-5 px-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-2xs font-black uppercase border ${
                            item.status === guardian.status_delayed
                              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          }`}
                          aria-label={`${guardian.freshness.columns.status}: ${item.status}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-4 md:py-5 px-2 text-right text-xs-plus font-bold text-gray-500 whitespace-nowrap">
                        {item.last_sync}
                      </td>

                      <td
                        className={`py-5 px-2 text-right text-xs-plus font-black ${
                          item.status === guardian.status_delayed
                            ? 'text-rose-500'
                            : 'text-gray-400'
                        }`}
                      >
                        {item.delay}
                      </td>

                      <td className="py-5 px-2 text-right font-mono text-xs font-black text-gray-900 dark:text-white tabular-nums">
                        {item.records}
                      </td>

                      <td className="py-5 px-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleExplain(item.name)}
                          className="p-2 rounded-xl bg-brand-start/10 text-brand-start hover:bg-brand-start hover:text-white transition-all"
                          aria-label={`${t.dashboard.context_menu.explain_ai}: ${item.name}`}
                          title={t.dashboard.context_menu.explain_ai}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quality Issues & Anomalies */}
          <div className="space-y-8">
            <div className="rounded-[2rem] md:rounded-[2.5rem] border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0b0b0f] px-5 xs:px-6 md:px-8 py-6 md:py-8 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 md:mb-8">
                <div>
                  <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                    {guardian.quality.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-xl">
                    {guardian.quality.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleExplain(guardian.quality.title)}
                  className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
                >
                  {t.dashboard.context_menu.explain_ai}
                </button>
              </div>

              <div className="space-y-4">
                {qualityIssues.length === 0 ? (
                  <div className="py-10 md:py-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500 mb-4">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                      {guardian.quality.empty_state}
                    </span>
                  </div>
                ) : (
                  qualityIssues.map((issue) => (
                    <div
                      key={issue.id}
                      onContextMenu={(event) =>
                        openMenu(event, buildMenuItems(issue.title), issue.title)
                      }
                      className="rounded-[1.5rem] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] p-5 xs:p-6 group/issue hover:border-brand-start/30 transition-all cursor-pointer"
                      onClick={() => handleExplain(issue.title)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleExplain(issue.title);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover/issue:text-brand-start transition-colors">
                          {issue.title}
                        </div>

                        <span
                          className={`text-3xs font-black px-2 py-0.5 rounded-full border ${
                            issue.severity === guardian.severity_critical
                              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                              : issue.severity === guardian.severity_warning
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          }`}
                        >
                          {issue.severity}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                        {issue.impact}
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExplain(issue.title);
                          }}
                          className="text-2xs font-black text-brand-start uppercase tracking-widest hover:underline"
                        >
                          {guardian.quality.actions.view}
                        </button>

                        <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700 my-auto" />

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isDemo) return;
                            setContextLabel?.(issue.title);
                            setAiDraft?.(`${guardian.quality.actions.fix}: ${issue.title}`);
                          }}
                          className={`text-2xs font-black text-gray-400 uppercase tracking-widest ${
                            isDemo ? 'opacity-40 cursor-not-allowed' : 'hover:text-emerald-500'
                          }`}
                          disabled={isDemo}
                          title={isDemo ? demoTooltip : undefined}
                        >
                          {guardian.quality.actions.fix}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* RAG Status Detail */}
            <div className="rounded-[2rem] md:rounded-[2.5rem] brand-gradient-bg px-6 xs:px-7 md:px-8 py-6 md:py-8 text-white shadow-2xl animate-reveal relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-2xs xs:text-xs font-black uppercase tracking-[0.2em] opacity-70">
                    {guardian.rag.status_heading}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_white]" />
                </div>

                <div>
                  <h4 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none mb-1">
                    {guardian.rag.index_title}
                  </h4>
                  <span className="text-xs font-bold opacity-70 uppercase tracking-widest">
                    {guardian.rag.index_subtitle}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-6 pt-4 border-t border-white/20">
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest opacity-60">
                      {guardian.rag.coverage_label}
                    </div>
                    <div className="text-xl md:text-2xl font-black">
                      {guardian.rag.coverage_value}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest opacity-60">
                      {guardian.rag.status_label}
                    </div>
                    <div className="text-xl md:text-2xl font-black">
                      {guardian.rag.status_value}
                    </div>
                  </div>
                </div>

                <InteractiveButton
                  variant="secondary"
                  onClick={() => handleExplain(guardian.rag.explain_context)}
                  className="w-full !bg-white/10 !border-white/20 !text-white !text-xs font-black uppercase tracking-widest !py-3"
                  disabled={isDemo}
                  title={isDemo ? demoTooltip : undefined}
                >
                  {guardian.rag.cta}
                </InteractiveButton>

                <button
                  type="button"
                  onClick={() => handleExplain(guardian.rag.title)}
                  className="text-xs font-black uppercase tracking-widest text-white/80 hover:text-white hover:underline"
                >
                  {t.dashboard.context_menu.explain_ai}
                </button>
              </div>

              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
            </div>
          </div>
        </section>
      </LazySection>

      <ContextMenu menu={menu} onClose={closeMenu} />
    </div>
  );
};

export default GuardianViewV2;
