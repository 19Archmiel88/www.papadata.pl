import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from './DashboardContext';
import { InteractiveButton } from '../InteractiveButton';
import { fetchDashboardCustomers } from '../../data/api';
import type { DashboardCustomersResponse, KPIKey, TableRow } from '@papadata/shared';
import {
  ContextMenu,
  LazySection,
  WidgetErrorState,
  WidgetOfflineState,
  WidgetSkeleton,
} from './DashboardPrimitives';
import { clamp } from './DashboardPrimitives.constants';
import { useAltPressed, useContextMenu, useWidgetLoading } from './DashboardPrimitives.hooks';
import { captureException } from '../../utils/telemetry';
import {
  formatCurrency,
  formatPercentValue,
  formatSignedPercentValue,
} from '../../utils/formatters';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

const seeded = (i: number, seed: number) => {
  const x = Math.sin((i + 1) * seed) * 10000;
  return x - Math.floor(x);
};

const getMetricValue = (row: TableRow | undefined, key: KPIKey, fallback = 0) => {
  if (!row) return fallback;
  const raw = row.metrics?.[key];
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : fallback;
};

const getDimensionValue = (row: TableRow | undefined, key: string, fallback = '') => {
  if (!row) return fallback;
  const raw = row.dimensions?.[key];
  return typeof raw === 'string' && raw.trim() ? raw : fallback;
};

type CohortMode = 'month' | 'week';

type CohortSelection = {
  row: number;
  col: number;
  value: number;
  size: number;
};

export const CustomersViewV2: React.FC = () => {
  const { t, setContextLabel, setAiDraft, timeRange, isDemo } =
    useOutletContext<DashboardOutletContext>();
  const isOnline = useOnlineStatus();

  const { menu, openMenu, closeMenu } = useContextMenu();
  const isAltPressed = useAltPressed();

  const navigate = useNavigate();
  const location = useLocation();
  const navigateWithSearch = (path: string) => navigate(`${path}${location.search}`);

  const [mode, setMode] = useState<CohortMode>('month');
  const [selectedCell, setSelectedCell] = useState<CohortSelection | null>(null);
  const [customersData, setCustomersData] = useState<DashboardCustomersResponse | null>(null);
  const [customersError, setCustomersError] = useState<string | null>(null);

  const demoTooltip = t.dashboard.demo_tooltip;
  const [retryToken, setRetryToken] = useState(0);
  const handleRetry = () => setRetryToken((prev) => prev + 1);

  const cohortRowPrefix = t.dashboard.customers_v2.cohorts.row_prefix || 'M';
  const cohortColPrefix = t.dashboard.customers_v2.cohorts.col_prefix || 'M';

  // miękki local-loading dla heatmapy przy zmianie zakresu / trybu
  const cohortLoading = useWidgetLoading([mode, timeRange, retryToken], 420);

  const locale = t.langCode ?? 'pl-PL';
  const formatCurrencyValue = useMemo(
    () => (value: number) => formatCurrency(value, locale),
    [locale]
  );

  // Time range logic for responsive mocking
  const timeMultiplier = useMemo(() => {
    if (timeRange === '1d') return 0.035;
    if (timeRange === '7d') return 0.23;
    return 1;
  }, [timeRange]);

  const timeSeed = useMemo(() => {
    const base = timeRange === '1d' ? 17 : timeRange === '7d' ? 53 : 97;
    return base + (mode === 'week' ? 9 : 0);
  }, [timeRange, mode]);

  useEffect(() => {
    let active = true;

    // reset błędu przy zmianie zakresu / retrialu
    setCustomersError(null);

    fetchDashboardCustomers({ timeRange })
      .then((data) => {
        if (!active) return;
        setCustomersData(data);
        setCustomersError(null);
      })
      .catch((err: any) => {
        if (!active) return;
        setCustomersError(err?.message || t.dashboard.widget.error_desc);
      });

    return () => {
      active = false;
    };
  }, [timeRange, retryToken, t.dashboard.widget.error_desc]);

  useEffect(() => {
    if (customersError) {
      captureException(new Error(customersError), { scope: 'customers' });
    }
  }, [customersError]);

  const cohortLabel = (rowIdx: number, colIdx: number) =>
    `${cohortRowPrefix}${rowIdx + 1} / ${cohortColPrefix}${colIdx + 1}`;

  const cohorts = useMemo(() => {
    const rows = mode === 'week' ? 8 : 6;
    const cols = mode === 'week' ? 8 : 6;

    return Array.from({ length: rows }).map((_, row) =>
      Array.from({ length: cols }).map((__, col) => {
        // Future cohorts (uogólnione)
        if (col > cols - 1 - row) return null;

        const baseRow = customersData?.cohorts?.[row];
        const rowBase = baseRow
          ? getMetricValue(baseRow, 'conversion_rate', 72 - row * 3)
          : 72 - row * 3;

        const variance = seeded(row * 10 + col, timeSeed) * 8;
        const value = clamp(rowBase - col * 6 + variance, 5, 92);

        const baseSize = baseRow
          ? getMetricValue(baseRow, 'orders', 1200)
          : (1200 + seeded(row + col, timeSeed) * 3000) * timeMultiplier;

        const size = Math.round(baseSize * (1 - col * 0.08));
        return { value, size };
      })
    );
  }, [customersData, timeSeed, timeMultiplier, mode]);

  const ltvData = useMemo(() => {
    const ltvBase = customersData?.kpis?.find((kpi) => kpi.key === 'ltv')?.value;
    const base = typeof ltvBase === 'number' ? ltvBase : 250;
    const growth = typeof ltvBase === 'number' ? base * 0.8 : 95 * 11;
    const scale = typeof ltvBase === 'number' ? 1 : 0.9 + timeMultiplier * 0.1;

    return Array.from({ length: 12 }).map((_, i) => ({
      m: i,
      val: (base + (growth * i) / 11 + seeded(i, timeSeed) * (base * 0.15)) * scale,
    }));
  }, [customersData, timeSeed, timeMultiplier]);

  const maxLtv = Math.max(...ltvData.map((d) => d.val));

  const summary = useMemo(() => {
    const avgRetention =
      cohorts.reduce((acc, row) => {
        const activeCells = row.filter(Boolean);
        if (activeCells.length === 0) return acc;
        return acc + activeCells.reduce((s, c) => s + (c?.value || 0), 0) / activeCells.length;
      }, 0) / (cohorts.length || 1);

    const vipSegment = customersData?.segments?.find(
      (segment) =>
        getDimensionValue(segment, 'name', segment.id).toLowerCase() === 'vip' ||
        segment.id.toLowerCase() === 'vip'
    );

    const vipOrders = getMetricValue(vipSegment, 'orders', NaN);
    const totalVips = Number.isFinite(vipOrders)
      ? Math.round(vipOrders)
      : Math.round(1242 * timeMultiplier * (0.85 + seeded(1, timeSeed) * 0.3));

    return {
      retention: avgRetention,
      vips: totalVips,
    };
  }, [cohorts, customersData, timeMultiplier, timeSeed]);

  const segments = useMemo(() => {
    const churnLabels = t.dashboard.customers_v2.churn.labels;

    const churn = [
      {
        id: 'c1',
        label: churnLabels?.one_time_buyers ?? '',
        count: Math.round(450 * timeMultiplier),
        impact: formatCurrencyValue(12000 * timeMultiplier),
      },
      {
        id: 'c2',
        label: churnLabels?.recent_dropoffs ?? '',
        count: Math.round(120 * timeMultiplier),
        impact: formatCurrencyValue(8500 * timeMultiplier),
      },
      {
        id: 'c3',
        label: churnLabels?.inactive_vips ?? '',
        count: Math.round(42 * timeMultiplier),
        impact: formatCurrencyValue(24000 * timeMultiplier),
      },
    ];

    const apiSegments = customersData?.segments ?? [];
    const totalOrders =
      apiSegments.reduce((acc, row) => acc + getMetricValue(row, 'orders', 0), 0) || 1;

    const vip = apiSegments.length
      ? apiSegments.map((row, idx) => {
          const label = getDimensionValue(row, 'name', row.id);
          const orders = getMetricValue(row, 'orders', 0);
          const share = formatPercentValue((orders / totalOrders) * 100, locale, 1);
          const trend = seeded(idx + 3, timeSeed) * 6 - 3;
          return {
            id: row.id,
            label,
            share,
            trend: formatSignedPercentValue(trend, locale, 1),
          };
        })
      : [
          {
            id: 'v1',
            label: t.dashboard.customers_v2.vip.labels?.top_spenders ?? '',
            share: '18.4%',
            trend: '+4.2%',
          },
          {
            id: 'v2',
            label: t.dashboard.customers_v2.vip.labels?.brand_advocates ?? '',
            share: '12.1%',
            trend: '+2.8%',
          },
          {
            id: 'v3',
            label: t.dashboard.customers_v2.vip.labels?.bulk_buyers ?? '',
            share: '24.2%',
            trend: '-1.5%',
          },
        ];

    return { churn, vip };
  }, [customersData, locale, timeMultiplier, timeSeed, formatCurrencyValue, t]);

  const handleCohortSelect = (rowIdx: number, colIdx: number, value: number, size: number) => {
    const label = cohortLabel(rowIdx, colIdx);
    const context = `${t.dashboard.customers_v2.cohorts.context_label}: ${label}`;

    const isSame = selectedCell?.row === rowIdx && selectedCell?.col === colIdx;
    const next = isSame ? null : { row: rowIdx, col: colIdx, value, size };
    setSelectedCell(next);
    setContextLabel?.(next ? context : null);
    if (next) {
      setAiDraft?.(t.dashboard.customers_v2.ai_prompt.replace('{name}', label));
    }
  };

  const handleExplain = (label: string) => {
    setContextLabel?.(label);
    setAiDraft?.(t.dashboard.customers_v2.ai_prompt.replace('{name}', label));
  };

  const handleDrill = (label: string) => {
    setContextLabel?.(label);
    navigateWithSearch('/dashboard/customers');
  };

  const handleAddReport = (label: string) => {
    if (isDemo) return;
    setContextLabel?.(label);
    navigateWithSearch('/dashboard/reports');
  };

  const handleSetAlert = (label: string) => {
    if (isDemo) return;
    setContextLabel?.(label);
    setAiDraft?.(
      `${t.dashboard.context_menu.set_alert}: ${t.dashboard.customers_v2.ai_prompt.replace('{name}', label)}`
    );
  };

  const buildMenuItems = (label: string) => [
    {
      id: 'drill',
      label: t.dashboard.context_menu.drill,
      onSelect: () => handleDrill(label),
    },
    {
      id: 'explain',
      label: t.dashboard.context_menu.explain_ai,
      onSelect: () => handleExplain(label),
      tone: 'primary' as const,
    },
    {
      id: 'report',
      label: t.dashboard.context_menu.add_report,
      onSelect: () => handleAddReport(label),
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
    {
      id: 'alert',
      label: t.dashboard.context_menu.set_alert,
      onSelect: () => handleSetAlert(label),
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
  ];

  const colsCount = mode === 'week' ? 8 : 6;

  return (
    <div className="space-y-8 animate-reveal">
      {/* Summary Header */}
      <section className="dashboard-surface dashboard-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-start/5 border border-brand-start/10 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-start animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-start">
                Customer Lifecycle Active
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {t.dashboard.customers_v2.title}
            </h2>
            <p className="text-base text-gray-500 dark:text-gray-400 font-medium">
              {t.dashboard.customers_v2.desc}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex gap-4">
            <div className="p-4 px-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 text-center min-w-[150px]">
              <div className="text-2xs font-black text-gray-500 uppercase tracking-widest mb-1">
                {t.dashboard.customers_v2.summary?.retention_label}
              </div>
              <div className="text-2xl font-black text-brand-start">
                {formatPercentValue(summary.retention, locale, 1)}
              </div>
            </div>
            <div className="p-4 px-6 rounded-2xl bg-brand-start text-white shadow-xl shadow-brand-start/20 text-center min-w-[150px]">
              <div className="text-2xs font-black uppercase tracking-widest mb-1 opacity-70">
                {t.dashboard.customers_v2.summary?.vip_label}
              </div>
              <div className="text-2xl font-black">{summary.vips}</div>
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

      {isOnline && customersError && (
        <section className="rounded-[2.5rem] border border-rose-500/20 bg-rose-500/5 p-6 shadow-xl">
          <WidgetErrorState
            title={t.dashboard.widget.error_title}
            desc={t.dashboard.widget.error_desc}
            actionLabel={t.dashboard.widget.cta_retry}
            onAction={handleRetry}
          />
        </section>
      )}

      <LazySection
        fallback={
          <div className="dashboard-surface dashboard-card">
            <WidgetSkeleton chartHeight="h-72" lines={3} />
          </div>
        }
      >
        <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Cohort Heatmap */}
          <div className="dashboard-surface dashboard-card relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-10">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {t.dashboard.customers_v2.cohorts.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {t.dashboard.customers_v2.cohorts.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleExplain(t.dashboard.customers_v2.cohorts.title)}
                className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
              >
                {t.dashboard.context_menu.explain_ai}
              </button>

              <div className="flex items-center gap-2 p-1.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5">
                <button
                  type="button"
                  onClick={() => setMode('month')}
                  aria-pressed={mode === 'month'}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f] ${
                    mode === 'month'
                      ? 'bg-white dark:bg-white/10 text-brand-start dark:text-white shadow-lg'
                      : 'text-gray-500'
                  }`}
                >
                  {t.dashboard.customers_v2.cohorts.mode_month}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('week')}
                  aria-pressed={mode === 'week'}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f] ${
                    mode === 'week'
                      ? 'bg-white dark:bg-white/10 text-brand-start dark:text-white shadow-lg'
                      : 'text-gray-500'
                  }`}
                >
                  {t.dashboard.customers_v2.cohorts.mode_week}
                </button>
              </div>
            </div>

            {cohortLoading ? (
              <div className="mt-4">
                <WidgetSkeleton chartHeight="h-64" lines={4} />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto no-scrollbar scroll-hint">
                  <div className="min-w-[600px]">
                    <div
                      className="grid gap-2 mb-4"
                      style={{ gridTemplateColumns: `120px repeat(${colsCount}, minmax(0, 1fr))` }}
                    >
                      <div className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-end pb-2">
                        {t.dashboard.customers_v2.cohorts.row_label}
                      </div>
                      {Array.from({ length: colsCount }).map((_, i) => (
                        <div
                          key={i}
                          className="text-center text-xs font-black text-gray-400 uppercase tracking-widest border-b border-black/5 dark:border-white/5 pb-2"
                        >
                          {cohortColPrefix}
                          {i + 1}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      {cohorts.map((row, rIdx) => (
                        <div
                          key={rIdx}
                          className="grid gap-2"
                          style={{
                            gridTemplateColumns: `120px repeat(${colsCount}, minmax(0, 1fr))`,
                          }}
                        >
                          <div className="flex items-center text-xs-plus font-bold text-gray-500 uppercase tracking-tight">
                            {cohortRowPrefix}
                            {rIdx + 1}
                          </div>

                          {row.map((cell, cIdx) => {
                            if (!cell) return <div key={cIdx} className="h-14" />;

                            const isSelected =
                              selectedCell?.row === rIdx && selectedCell?.col === cIdx;
                            const opacity = 0.1 + (cell.value / 100) * 0.9;

                            return (
                              <button
                                key={cIdx}
                                type="button"
                                onClick={() =>
                                  handleCohortSelect(rIdx, cIdx, cell.value, cell.size)
                                }
                                onContextMenu={(e) =>
                                  openMenu(
                                    e,
                                    buildMenuItems(cohortLabel(rIdx, cIdx)),
                                    `Cohort ${rIdx + 1}`
                                  )
                                }
                                className={`h-14 rounded-xl border transition-all flex flex-col items-center justify-center relative group/cell focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f] ${
                                  isSelected
                                    ? 'bg-brand-start border-brand-start text-white shadow-lg shadow-brand-start/30 z-10 scale-105'
                                    : 'border-transparent text-gray-900 dark:text-white hover:border-brand-start/40'
                                }`}
                                style={
                                  !isSelected
                                    ? { backgroundColor: `rgba(78, 38, 226, ${opacity * 0.85})` }
                                    : {}
                                }
                                aria-pressed={isSelected}
                              >
                                <span className="text-sm font-black">
                                  {Math.round(cell.value)}%
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-start" />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">
                      Stable Retention
                    </span>
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    <span className="text-2xs font-mono font-bold tracking-[0.2em] uppercase">
                      COHORT_VAL_SYNC_READY
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* LTV & Detail Panel */}
          <div className="space-y-8">
            <div className="dashboard-surface dashboard-card">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {t.dashboard.customers_v2.ltv.title}
                </h3>
                <button
                  type="button"
                  onClick={() => handleExplain(t.dashboard.customers_v2.ltv.title)}
                  className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
                >
                  {t.dashboard.context_menu.explain_ai}
                </button>
              </div>

              <div className="h-48 flex items-end justify-between gap-1.5 group/ltv pt-4">
                {ltvData.map((d, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-brand-start/10 rounded-t-lg relative group/bar cursor-pointer"
                    style={{ height: `${(d.val / maxLtv) * 100}%` }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 brand-gradient-bg rounded-t-lg transition-all duration-700 h-[60%]"
                      style={{ height: `${(d.val / maxLtv) * 85}%` }}
                    />
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-gray-900 text-white text-2xs font-black opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl">
                      {formatCurrencyValue(d.val)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                <span>M0</span>
                <span>M6</span>
                <span>M12</span>
              </div>

              <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic opacity-80">
                {t.dashboard.customers_v2.ltv.def}
              </p>
            </div>

            {selectedCell && (
              <div className="rounded-[2.5rem] brand-gradient-bg p-8 text-white shadow-2xl animate-reveal relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-[0.2em] opacity-70">
                      Cohort Detail
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCell(null)}
                      className="p-1 hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                      aria-label={t.common.close ?? 'Close'}
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
                          strokeWidth={3}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div>
                    <h4 className="text-3xl font-black tracking-tighter uppercase leading-none mb-1">
                      {cohortLabel(selectedCell.row, selectedCell.col)}
                    </h4>
                    <span className="text-xs-plus font-bold opacity-70 uppercase tracking-widest">
                      {selectedCell.size} Customers analyzed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/20">
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest opacity-60">
                        Retention
                      </div>
                      <div className="text-2xl font-black">{Math.round(selectedCell.value)}%</div>
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest opacity-60">
                        Avg. Spend
                      </div>
                      <div className="text-2xl font-black">
                        {formatCurrencyValue(ltvData[selectedCell.col]?.val ?? 0)}
                      </div>
                    </div>
                  </div>

                  <InteractiveButton
                    variant="secondary"
                    onClick={() => handleExplain(cohortLabel(selectedCell.row, selectedCell.col))}
                    className="w-full !bg-white/10 !border-white/20 !text-white !text-xs font-black uppercase tracking-widest !py-3"
                  >
                    Run Neural Analysis
                  </InteractiveButton>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
              </div>
            )}
          </div>
        </section>
      </LazySection>

      {/* Churn & VIP Segments */}
      <LazySection
        fallback={
          <div className="dashboard-surface dashboard-card">
            <WidgetSkeleton chartHeight="h-56" lines={3} />
          </div>
        }
      >
        <section className="grid gap-8 md:grid-cols-2">
          {/* Churn Risk */}
          <div className="dashboard-surface dashboard-card">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {t.dashboard.customers_v2.churn.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {t.dashboard.customers_v2.churn.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleExplain(t.dashboard.customers_v2.churn.title)}
                className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
              >
                {t.dashboard.context_menu.explain_ai}
              </button>

              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m-8-4h8m-8-4h8m-8-4h8M2 6l10 10V6L2 16V6z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              {segments.churn.map((s) => (
                <div
                  key={s.id}
                  onClick={(e) => {
                    if (isAltPressed) openMenu(e as any, buildMenuItems(s.label), s.label);
                    else handleExplain(s.label);
                  }}
                  onContextMenu={(e) => openMenu(e, buildMenuItems(s.label), s.label)}
                  className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-rose-500/30 transition-all group/segment cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-black uppercase tracking-tight text-gray-900 dark:text-white group-hover/segment:text-rose-500 transition-colors">
                      {s.label}
                    </span>
                    <span className="text-xs font-black text-rose-500 uppercase tracking-widest">
                      {s.impact} at Risk
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">{s.count} Customers</span>
                    <button
                      type="button"
                      onClick={() => handleExplain(s.label)}
                      className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
                    >
                      Predictive Analysis
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VIP Segments */}
          <div className="dashboard-surface dashboard-card">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {t.dashboard.customers_v2.vip.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {t.dashboard.customers_v2.vip.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleExplain(t.dashboard.customers_v2.vip.title)}
                className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
              >
                {t.dashboard.context_menu.explain_ai}
              </button>

              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              {segments.vip.map((s) => (
                <div
                  key={s.id}
                  onClick={(e) => {
                    if (isAltPressed) openMenu(e as any, buildMenuItems(s.label), s.label);
                    else handleExplain(s.label);
                  }}
                  onContextMenu={(e) => openMenu(e, buildMenuItems(s.label), s.label)}
                  className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-emerald-500/30 transition-all group/segment cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-black uppercase tracking-tight text-gray-900 dark:text-white group-hover/segment:text-emerald-500 transition-colors">
                      {s.label}
                    </span>
                    <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">
                      {s.trend} YoY
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">{s.share} Revenue Share</span>
                    <button
                      type="button"
                      onClick={() => handleExplain(s.label)}
                      className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
                    >
                      Segmentation Tips
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      <ContextMenu menu={menu} onClose={closeMenu} />
    </div>
  );
};

export default CustomersViewV2;
