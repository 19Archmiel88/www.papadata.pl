// AdsViewV2.tsx
// Widok "Analytics / Ads" dla dashboardu PapaData — kanały reklamowe, media mix,
// efektywność i kreacje. Czyta dane (mock/real) z API i podaje kontekst do Papa AI.

import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from './DashboardContext';
import {
  ContextMenu,
  LazySection,
  WidgetErrorState,
  WidgetOfflineState,
  WidgetSkeleton,
} from './DashboardPrimitives';
import { clamp } from './DashboardPrimitives.constants';
import { useAltPressed, useContextMenu } from './DashboardPrimitives.hooks';
import { fetchDashboardAds } from '../../data/api';
import type { DashboardAdsResponse, KPIKey, TableRow } from '@papadata/shared';
import { captureException } from '../../utils/telemetry';
import { formatRatio, getNumberFormatter } from '../../utils/formatters';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

const seeded = (i: number, seed: number) => {
  const x = Math.sin((i + 1) * seed) * 10000;
  return x - Math.floor(x);
};

const getMetricValue = (row: TableRow, key: KPIKey, fallback = 0) => {
  const raw = row.metrics?.[key];
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : fallback;
};

const getDimensionValue = (row: TableRow, key: string, fallback = '') => {
  const raw = row.dimensions?.[key];
  return typeof raw === 'string' && raw.trim() ? raw : fallback;
};

const shortLabelFromName = (label: string) => {
  const parts = label.split(' ').filter(Boolean);
  if (parts.length === 0) return label.slice(0, 4);
  return parts[0].slice(0, 6);
};

const Sparkline: React.FC<{ values: number[]; color?: string }> = ({
  values,
  color = 'bg-brand-start',
}) => (
  <div className="flex items-end gap-1 h-10 w-full" aria-hidden="true">
    {values.map((v, idx) => (
      <div
        key={idx}
        className={`flex-1 rounded-full transition-all duration-500 ${
          idx === values.length - 1 ? color : `${color}/30`
        }`}
        style={{ height: `${v}%` }}
      />
    ))}
  </div>
);

export const AdsViewV2: React.FC = () => {
  const { t, setContextLabel, setAiDraft, timeRange, filters, isDemo } =
    useOutletContext<DashboardOutletContext>();
  const isOnline = useOnlineStatus();

  const navigate = useNavigate();
  const location = useLocation();
  const navigateWithSearch = (path: string) => navigate(`${path}${location.search}`);
  const { menu, openMenu, closeMenu } = useContextMenu();
  const isAltPressed = useAltPressed();

  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<{
    id: string;
    label: string;
    pct: number;
    value: number;
  } | null>(null);
  const [mixMetric, setMixMetric] = useState<'spend' | 'revenue'>('spend');
  const [effMetric, setEffMetric] = useState<'roas' | 'cpa'>('roas');
  const [drilldownLevel, setDrilldownLevel] = useState<'campaign' | 'adset' | 'creative'>('campaign');
  const [adsData, setAdsData] = useState<DashboardAdsResponse | null>(null);
  const [adsError, setAdsError] = useState<string | null>(null);
  const demoTooltip = t.dashboard.demo_tooltip;
  const [retryToken, setRetryToken] = useState(0);
  const handleRetry = () => setRetryToken((prev) => prev + 1);

  const locale = t.langCode ?? 'pl-PL';
  const numberFormatter = useMemo(
    () => getNumberFormatter(locale, { maximumFractionDigits: 0 }),
    [locale],
  );
  const percentFormatter = useMemo(
    () => getNumberFormatter(locale, { maximumFractionDigits: 1 }),
    [locale],
  );

  // WYMÓG: waluta zawsze PLN (niezależnie od tłumaczeń)
  const currency = 'PLN';
  const formatCurrency = (value: number) => `${numberFormatter.format(value)} ${currency}`;
  const formatPercent = (value: number) => `${percentFormatter.format(value)}%`;
  const formatRoas = (value: number) => formatRatio(value, locale, 2, 'x', '0.00x');

  // Time range multipliers for dynamic data scaling
  const timeMultiplier = useMemo(() => {
    if (timeRange === '1d') return 0.034;
    if (timeRange === '7d') return 0.233;
    return 1;
  }, [timeRange]);

  const timeSeed = useMemo(() => {
    if (timeRange === '1d') return 12;
    if (timeRange === '7d') return 42;
    return 84;
  }, [timeRange]);

  const fallbackChannels = t.dashboard.ads_channels;

  useEffect(() => {
    let active = true;

    // przy ponownej próbie czy zmianie zakresu zdejmij poprzedni błąd
    setAdsError(null);

    fetchDashboardAds({ timeRange })
      .then((data) => {
        if (!active) return;
        setAdsData(data);
        setAdsError(null);
      })
      .catch((err: any) => {
        if (!active) return;
        setAdsError(err?.message || t.dashboard.widget.error_desc);
      });

    return () => {
      active = false;
    };
  }, [timeRange, retryToken, t.dashboard.widget.error_desc]);

  useEffect(() => {
    if (adsError) {
      captureException(new Error(adsError), { scope: 'ads' });
    }
  }, [adsError]);

  const overallCpa = useMemo(
    () => adsData?.kpis?.find((kpi) => kpi.key === 'cpa')?.value,
    [adsData],
  );

  const channelMetrics = useMemo(() => {
    if (adsData?.channels?.length) {
      return adsData.channels.map((row, idx) => {
        const baseSeed = timeSeed + idx;
        const spend = getMetricValue(row, 'spend');
        const revenue = getMetricValue(row, 'revenue');
        const roas = getMetricValue(row, 'roas', spend ? revenue / spend : 0);
        const fallbackCpa =
          typeof overallCpa === 'number'
            ? overallCpa
            : 34 + seeded(idx + 5, baseSeed) * 12;
        const cpa = getMetricValue(row, 'cpa', fallbackCpa);
        const label = getDimensionValue(row, 'name', row.id);
        return {
          id: row.id,
          label,
          shortLabel: shortLabelFromName(label),
          spend,
          revenue,
          roas,
          cpa,
          trend: Array.from({ length: 12 }).map((_, i) =>
            clamp(20 + seeded(i + idx, baseSeed) * 70, 10, 100),
          ),
        };
      });
    }

    return fallbackChannels.map((channel, idx) => {
      const baseSeed = timeSeed + idx;
      const spend = (220_000 + seeded(idx, baseSeed) * 240_000) * timeMultiplier;
      const roas = 2.1 + seeded(idx + 3, baseSeed) * 2.2;
      const revenue = spend * roas;
      const cpa = 34 + seeded(idx + 5, baseSeed) * 12;
      return {
        id: channel.id,
        label: channel.label,
        shortLabel: channel.short_label,
        spend,
        revenue,
        roas,
        cpa,
        trend: Array.from({ length: 12 }).map((_, i) =>
          clamp(20 + seeded(i + idx, baseSeed) * 70, 10, 100),
        ),
      };
    });
  }, [adsData, fallbackChannels, overallCpa, timeMultiplier, timeSeed]);

  const filterMap: Record<string, string> = {
    meta: 'meta_ads',
    google: 'google_ads',
    tiktok: 'tiktok_ads',
    affiliate: 'affiliates',
  };
  const activeChannelFilter = filters?.channel ?? 'all';
  const filteredByGlobal = activeChannelFilter !== 'all' ? filterMap[activeChannelFilter] : null;

  useEffect(() => {
    if (filteredByGlobal) setSelectedChannel(filteredByGlobal);
  }, [filteredByGlobal]);

  const effectiveChannelId = selectedChannel ?? filteredByGlobal;
  const filteredChannels = useMemo(
    () => channelMetrics.filter((row) => !effectiveChannelId || row.id === effectiveChannelId),
    [channelMetrics, effectiveChannelId],
  );

  const totalsSource = filteredChannels.length ? filteredChannels : channelMetrics;
  const totals = useMemo(() => {
    const spend = totalsSource.reduce((sum, row) => sum + row.spend, 0);
    const revenue = totalsSource.reduce((sum, row) => sum + row.revenue, 0);
    return { spend, revenue };
  }, [totalsSource]);

  const mixSlots = timeRange === '1d' ? 12 : timeRange === '7d' ? 7 : 10;
  const mixBars = useMemo(
    () =>
      Array.from({ length: mixSlots }).map((_, slot) => {
        const values = channelMetrics.map((row, idx) => {
          const base = mixMetric === 'spend' ? row.spend : row.revenue;
          const variance = 0.8 + seeded(slot + idx + timeSeed, 13) * 0.4;
          return (base / mixSlots) * variance;
        });
        const total = values.reduce((sum, v) => sum + v, 0) || 1;
        return values.map((value, idx) => ({
          id: channelMetrics[idx].id,
          value,
          pct: (value / total) * 100,
        }));
      }),
    [channelMetrics, mixMetric, mixSlots, timeSeed],
  );

  const totalsAllChannels = useMemo(() => {
    const spend = channelMetrics.reduce((s, r) => s + r.spend, 0) || 1;
    const revenue = channelMetrics.reduce((s, r) => s + r.revenue, 0) || 1;
    return { spend, revenue };
  }, [channelMetrics]);

  const shareData = useMemo(
    () =>
      channelMetrics.map((row) => ({
        id: row.id,
        label: row.label,
        spendShare: (row.spend / totalsAllChannels.spend) * 100,
        revenueShare: (row.revenue / totalsAllChannels.revenue) * 100,
      })),
    [channelMetrics, totalsAllChannels],
  );

  const shareGradient = (metric: 'spend' | 'revenue') => {
    // brand start/end: #4E26E2 → #4285F4
    const palette = [
      'rgba(78, 38, 226, 0.90)',
      'rgba(66, 133, 244, 0.75)',
      'rgba(139, 92, 246, 0.60)',
      'rgba(148, 163, 184, 0.30)',
    ];

    const stops = shareData.reduce(
      (acc, row, idx) => {
        const value = metric === 'spend' ? row.spendShare : row.revenueShare;
        const start = acc.offset;
        const end = acc.offset + value;
        acc.offset = end;
        acc.list.push({
          color: palette[idx] ?? palette[palette.length - 1],
          start,
          end,
        });
        return acc;
      },
      { offset: 0, list: [] as { color: string; start: number; end: number }[] },
    );

    return `conic-gradient(${stops.list
      .map((stop) => `${stop.color} ${stop.start.toFixed(1)}% ${stop.end.toFixed(1)}%`)
      .join(', ')})`;
  };

  const creatives = (
    t.dashboard.ads_v2.creatives.items.length > 0
      ? t.dashboard.ads_v2.creatives.items
      : [
          { id: 'c-1', name: 'Summer 2024 Collection', format: 'Video', placement: 'Feed' },
          { id: 'c-2', name: 'Premium Lifestyle Static', format: 'Image', placement: 'Stories' },
          { id: 'c-3', name: 'Influencer Retargeting', format: 'Video', placement: 'Reels' },
          { id: 'c-4', name: 'Bestseller Carousel', format: 'Carousel', placement: 'Explore' },
        ]
  ).map((item, idx) => {
    const baseSeed = timeSeed + idx;
    const ctr = 1.2 + seeded(idx, baseSeed) * 1.8;
    const cvr = 2.4 + seeded(idx + 6, baseSeed) * 1.6;
    const roas = 2.4 + seeded(idx + 2, baseSeed) * 2.4;
    const cpa = 28 + seeded(idx + 4, baseSeed) * 16;
    const spend = (4_200 + seeded(idx + 9, baseSeed) * 12_000) * timeMultiplier;
    const revenue = spend * roas;
    return { ...item, ctr, cvr, roas, cpa, spend, revenue };
  });

  const drilldownRows = useMemo(() => {
    const levelLabels = {
      campaign: t.dashboard.ads_v2.drilldown.level_campaign,
      adset: t.dashboard.ads_v2.drilldown.level_adset,
      creative: t.dashboard.ads_v2.drilldown.level_creative,
    };
    const source = (filteredChannels.length ? filteredChannels : channelMetrics).slice(0, 4);
    const rows = source.flatMap((channel, idx) =>
      Array.from({ length: 2 }).map((_, i) => {
        const baseSeed = timeSeed + idx + i * 7;
        const spend = channel.spend * (0.08 + seeded(i, baseSeed) * 0.18);
        const revenue = spend * (1.6 + seeded(i + 4, baseSeed) * 1.8);
        const roas = revenue / Math.max(spend, 1);
        const cpa = channel.cpa * (0.8 + seeded(i + 9, baseSeed) * 0.4);
        return {
          id: `${channel.id}-${drilldownLevel}-${i}`,
          channel: channel.label,
          name: `${levelLabels[drilldownLevel]} ${i + 1}`,
          spend,
          revenue,
          roas,
          cpa,
        };
      }),
    );
    return rows.slice(0, 8);
  }, [
    channelMetrics,
    drilldownLevel,
    filteredChannels,
    t.dashboard.ads_v2.drilldown.level_adset,
    t.dashboard.ads_v2.drilldown.level_campaign,
    t.dashboard.ads_v2.drilldown.level_creative,
    timeSeed,
  ]);

  const handleExplain = (label: string) => {
    setContextLabel?.(label);
    setAiDraft?.(t.dashboard.ads_v2.ai_prompt.replace('{name}', label));
  };

  const handleSetAlert = (label: string) => {
    const prompt = `${t.dashboard.context_menu.set_alert}: ${t.dashboard.ads_v2.ai_prompt.replace(
      '{name}',
      label,
    )}`;
    setContextLabel?.(label);
    setAiDraft?.(prompt);
  };

  const navigateToReports = () => {
    navigateWithSearch('/dashboard/reports');
  };

  const handleChannelSelect = (id: string, label: string) => {
    const contextValue = t.dashboard.ads_v2.media_mix.context_template.replace('{name}', label);
    const next = selectedChannel === id ? null : id;
    setSelectedChannel(next);
    setContextLabel?.(next ? contextValue : null);
  };

  const clearChannelSelection = () => {
    setSelectedChannel(null);
    setContextLabel?.(null);
  };

  const buildMenuItems = (context: string, route: string) => [
    {
      id: 'drill',
      label: t.dashboard.context_menu.drill,
      onSelect: () => {
        setContextLabel?.(context);
        navigateWithSearch(route);
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
      onSelect: navigateToReports,
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
    {
      id: 'export',
      label: t.dashboard.context_menu.export,
      onSelect: navigateToReports,
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
    {
      id: 'alert',
      label: t.dashboard.context_menu.set_alert,
      onSelect: () => handleSetAlert(context),
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
  ];

  const colorRamp = ['bg-brand-start', 'bg-brand-end', 'bg-violet-500', 'bg-slate-500'];
  const selectedChannelLabel = channelMetrics.find((row) => row.id === effectiveChannelId)?.label;

  const dashboardAny = t.dashboard as any;
  const adsMatrixTitle = dashboardAny.ads_channel_matrix ?? t.dashboard.ads_v2.title;
  const adsMatrixChannelLabel = dashboardAny.ads_col_channel ?? t.dashboard.context_label;
  const adsMatrixSpendLabel = dashboardAny.ads_col_spend ?? t.dashboard.ads_v2.media_mix.metric_spend;
  const adsMatrixRevenueLabel =
    dashboardAny.ads_col_revenue ?? t.dashboard.ads_v2.media_mix.metric_revenue;
  const adsMatrixRoasLabel = dashboardAny.ads_col_roas ?? t.dashboard.ads_v2.summary.roas_label;
  const adsMatrixMerLabel = dashboardAny.ads_spend_vs_revenue ?? t.dashboard.ads_v2.summary.roas_label;
  const adsMatrixCpaLabel = dashboardAny.ads_col_cpa ?? t.dashboard.ads_v2.efficiency.title;
  const drilldownTitle = dashboardAny.ads_open_live ?? t.dashboard.ads_v2.efficiency.title;
  const drilldownDesc = dashboardAny.ads_model_refreshed ?? t.dashboard.ads_v2.desc;
  const creativesActions = dashboardAny.ads_v2?.creatives?.actions;

  const drilldownNameLabel =
    drilldownLevel === 'campaign'
      ? t.dashboard.ads_v2.drilldown.level_campaign
      : drilldownLevel === 'adset'
      ? t.dashboard.ads_v2.drilldown.level_adset
      : t.dashboard.ads_v2.drilldown.level_creative;

  const gridSkeleton = (className: string) => (
    <div className={className}>
      {[0, 1].map((idx) => (
        <div key={idx} className="dashboard-surface dashboard-card dashboard-card--compact">
          <WidgetSkeleton chartHeight="h-32" lines={3} />
        </div>
      ))}
    </div>
  );

  const handleSegmentKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    id: string,
    label: string,
    segmentValue: number,
    segmentPct: number,
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleChannelSelect(id, label);
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setHoveredSegment(null);
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      // proste: pokaż tooltip dla segmentu przy nawigacji klawiaturą
      setHoveredSegment({ id, label, value: segmentValue, pct: segmentPct });
    }
  };

  return (
    <div className="space-y-8 animate-reveal">
      {/* Header Insights */}
      <section className="dashboard-surface dashboard-card">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <button
              type="button"
              onClick={() => navigateWithSearch('/dashboard/ads')}
              aria-pressed={true}
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-white dark:bg-white/10 text-brand-start dark:text-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
            >
              {t.dashboard.menu_ads}
            </button>
            <button
              type="button"
              onClick={() => navigateWithSearch('/dashboard/growth')}
              aria-pressed={false}
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-gray-500 hover:text-gray-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
            >
              {t.dashboard.menu_growth}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-start/5 border border-brand-start/10 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-start animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-start">
                {dashboardAny.ads_perf_active ?? 'PERFORMANCE ACTIVE'}
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {t.dashboard.ads_v2.title}
            </h2>
            <p className="text-base text-gray-500 dark:text-gray-400 font-medium">
              {t.dashboard.ads_v2.desc}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-4 w-full md:w-auto">
            <div className="p-4 rounded-[1.5rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-center min-w-[140px]">
              <div className="text-2xs font-black text-gray-500 uppercase tracking-widest mb-1">
                {t.dashboard.ads_v2.summary.roas_label}
              </div>
              <div className="text-2xl font-black text-brand-start">
                {formatRoas(totals.revenue / (totals.spend || 1))}
              </div>
              <span className="text-2xs font-black text-emerald-500 uppercase">
                {t.dashboard.ads_v2.summary.roas_status}
              </span>
            </div>
            <div className="p-4 rounded-[1.5rem] bg-brand-start text-white shadow-xl shadow-brand-start/20 text-center min-w-[140px]">
              <div className="text-2xs font-black uppercase tracking-widest mb-1 opacity-70">
                {dashboardAny.ads_total_spend ?? 'TOTAL SPEND'}
              </div>
              <div className="text-2xl font-black">{formatCurrency(totals.spend)}</div>
              <span className="text-2xs font-black uppercase opacity-70">
                {t.dashboard.ads_v2.summary.model_label}
              </span>
            </div>
          </div>
        </div>

        {selectedChannelLabel && (
          <div className="mt-8 flex items-center gap-3 animate-reveal">
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-brand-start/10 border border-brand-start/30 text-brand-start font-black text-xs uppercase tracking-widest">
              <span>{t.dashboard.context_label}:</span>
              <span className="text-gray-900 dark:text-white">
                {t.dashboard.ads_v2.media_mix.context_template.replace('{name}', selectedChannelLabel)}
              </span>
              <button
                type="button"
                onClick={clearChannelSelection}
                className="ml-2 hover:scale-110 transition-transform"
                aria-label={t.common.close ?? 'Close'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
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

      {isOnline && adsError && (
        <section className="dashboard-surface dashboard-card--compact border-rose-500/20 bg-rose-500/5">
          <WidgetErrorState
            title={t.dashboard.widget.error_title}
            desc={t.dashboard.widget.error_desc}
            actionLabel={t.dashboard.widget.cta_retry}
            onAction={handleRetry}
          />
        </section>
      )}

      <LazySection fallback={gridSkeleton('grid gap-8 lg:grid-cols-[1.3fr_0.7fr]')}>
        <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Media Mix Visualization */}
          <div className="dashboard-surface dashboard-card relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-10">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {t.dashboard.ads_v2.media_mix.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {t.dashboard.ads_v2.media_mix.desc}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 p-1.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setMixMetric('spend')}
                  aria-pressed={mixMetric === 'spend'}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f] ${
                    mixMetric === 'spend'
                      ? 'bg-white dark:bg-white/10 text-brand-start dark:text-white shadow-lg'
                      : 'text-gray-500'
                  }`}
                >
                  {t.dashboard.ads_v2.media_mix.metric_spend}
                </button>
                <button
                  type="button"
                  onClick={() => setMixMetric('revenue')}
                  aria-pressed={mixMetric === 'revenue'}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f] ${
                    mixMetric === 'revenue'
                      ? 'bg-white dark:bg-white/10 text-brand-start dark:text-white shadow-lg'
                      : 'text-gray-500'
                  }`}
                >
                  {t.dashboard.ads_v2.media_mix.metric_revenue}
                </button>
              </div>
            </div>

            <div
              className="relative h-64 mt-12 mb-8 group/bars"
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div className="absolute inset-0 flex justify-between">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-full w-[1px] bg-black/5 dark:bg-white/5" />
                ))}
              </div>

              <div className="relative h-full flex items-end justify-between gap-4 z-10">
                {mixBars.map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col justify-end gap-3 h-full group/bar">
                    <div className="flex flex-col justify-end h-full rounded-[1rem] overflow-hidden border border-black/5 dark:border-white/5 bg-black/5 shadow-inner">
                      {bar.map((segment, segIdx) => {
                        const channel = channelMetrics[segIdx];
                        const isSelected = effectiveChannelId && channel.id === effectiveChannelId;
                        const isDimmed = effectiveChannelId && channel.id !== effectiveChannelId;

                        return (
                          <div
                            key={segment.id}
                            role="button"
                            tabIndex={0}
                            onFocus={() =>
                              setHoveredSegment({
                                id: channel.id,
                                label: channel.label,
                                pct: segment.pct,
                                value: segment.value,
                              })
                            }
                            onBlur={() => setHoveredSegment(null)}
                            onKeyDown={(e) =>
                              handleSegmentKeyDown(e, channel.id, channel.label, segment.value, segment.pct)
                            }
                            onMouseEnter={() =>
                              setHoveredSegment({
                                id: channel.id,
                                label: channel.label,
                                pct: segment.pct,
                                value: segment.value,
                              })
                            }
                            onClick={() => handleChannelSelect(channel.id, channel.label)}
                            className={`${colorRamp[segIdx % colorRamp.length]} w-full transition-all duration-300 relative group/seg cursor-pointer outline-none ${
                              isSelected
                                ? 'opacity-100 scale-x-105'
                                : isDimmed
                                ? 'opacity-20 grayscale'
                                : 'opacity-85 hover:opacity-100'
                            }`}
                            style={{ height: `${segment.pct}%` }}
                            aria-label={`${channel.label}: ${formatCurrency(segment.value)} (${formatPercent(segment.pct)})`}
                          >
                            {isSelected && (
                              <div className="absolute inset-0 border-x-2 border-white/20 animate-pulse" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-xs text-center font-black text-gray-500 uppercase tracking-widest group-hover/bar:text-brand-start transition-colors">
                      {timeRange === '1d'
                        ? `${idx * 2}:00`
                        : timeRange === '7d'
                        ? `D${idx + 1}`
                        : `P${idx + 1}`}
                    </div>
                  </div>
                ))}
              </div>

              {/* Precision Tooltip */}
              {hoveredSegment && (
                <div className="absolute top-0 right-0 p-4 rounded-3xl border border-brand-start/20 bg-white/95 dark:bg-[#0d0d12]/95 shadow-[0_30px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl animate-reveal min-w-[220px] z-20">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        colorRamp[
                          Math.max(
                            0,
                            channelMetrics.findIndex((c) => c.id === hoveredSegment.id),
                          ) % colorRamp.length
                        ]
                      }`}
                    />
                    <div className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">
                      {hoveredSegment.label}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                      {dashboardAny.value_label ?? 'Wartość'}
                    </div>
                    <div className="text-2xl font-black text-brand-start tracking-tighter">
                      {formatCurrency(hoveredSegment.value)}
                    </div>
                    <div className="text-xs font-black text-emerald-500 uppercase tracking-widest">
                      {formatPercent(hoveredSegment.pct)} {dashboardAny.share_label ?? 'udziału'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-black/5 dark:border-white/5">
              {channelMetrics.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleChannelSelect(c.id, c.label)}
                  className={`flex items-center gap-2.5 group transition-all ${
                    effectiveChannelId === c.id ? 'scale-110 opacity-100' : 'opacity-60 hover:opacity-100'
                  }`}
                  aria-pressed={effectiveChannelId === c.id}
                >
                  <div className={`w-3 h-3 rounded-full ${colorRamp[i % colorRamp.length]} shadow-lg`} />
                  <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">
                    {c.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => handleExplain(t.dashboard.ads_v2.media_mix.title)}
                className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
              >
                {t.dashboard.ads_v2.media_mix.action_explain}
              </button>
              <button
                type="button"
                onClick={() => handleSetAlert(t.dashboard.ads_v2.media_mix.title)}
                disabled={isDemo}
                title={isDemo ? demoTooltip : undefined}
                className={`text-xs font-black uppercase tracking-widest ${
                  isDemo ? 'text-gray-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t.dashboard.context_menu.set_alert}
              </button>
            </div>
          </div>

          {/* Efficiency Performance Cards */}
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight ml-2">
                {t.dashboard.ads_v2.efficiency.title}
              </h3>

              <div className="flex items-center gap-2">
                {/* ROAS/CPA toggle (było w stanie, brakowało UI) */}
                <div className="hidden sm:flex items-center gap-1 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setEffMetric('roas')}
                    aria-pressed={effMetric === 'roas'}
                    className={`px-3 py-1.5 rounded-xl text-2xs font-black uppercase tracking-widest transition-all ${
                      effMetric === 'roas'
                        ? 'bg-white dark:bg-white/10 text-brand-start dark:text-white shadow-lg'
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    ROAS
                  </button>
                  <button
                    type="button"
                    onClick={() => setEffMetric('cpa')}
                    aria-pressed={effMetric === 'cpa'}
                    className={`px-3 py-1.5 rounded-xl text-2xs font-black uppercase tracking-widest transition-all ${
                      effMetric === 'cpa'
                        ? 'bg-white dark:bg-white/10 text-brand-start dark:text-white shadow-lg'
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    CPA
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleExplain(t.dashboard.ads_v2.efficiency.title)}
                  className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
                >
                  {t.dashboard.ads_v2.efficiency.action_explain}
                </button>
                <button
                  type="button"
                  onClick={() => handleSetAlert(t.dashboard.ads_v2.efficiency.title)}
                  disabled={isDemo}
                  title={isDemo ? demoTooltip : undefined}
                  className={`text-xs font-black uppercase tracking-widest ${
                    isDemo ? 'text-gray-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {t.dashboard.context_menu.set_alert}
                </button>
              </div>
            </div>

            {filteredChannels.map((row) => (
              <div
                key={row.id}
                onClick={() => handleChannelSelect(row.id, row.label)}
                onContextMenu={(e) => openMenu(e, buildMenuItems(row.label, '/dashboard/ads'), row.label)}
                className={`group p-6 rounded-[2rem] border transition-all duration-500 cursor-pointer overflow-hidden relative ${
                  effectiveChannelId === row.id
                    ? 'bg-brand-start border-brand-start shadow-2xl shadow-brand-start/20 translate-x-2'
                    : 'bg-white/90 dark:bg-[#0b0b0f] border-black/10 dark:border-white/10 hover:border-brand-start/40'
                }`}
              >
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div>
                    <h4
                      className={`text-base font-black uppercase tracking-tight transition-colors ${
                        effectiveChannelId === row.id
                          ? 'text-white'
                          : 'text-gray-900 dark:text-white group-hover:text-brand-start'
                      }`}
                    >
                      {row.label}
                    </h4>
                    <span
                      className={`text-xs font-bold uppercase tracking-widest ${
                        effectiveChannelId === row.id ? 'text-white/60' : 'text-gray-500'
                      }`}
                    >
                      {dashboardAny.status_label ?? 'Status'}: {dashboardAny.status_optimal ?? 'Optimal'}
                    </span>
                  </div>

                  <div
                    className={`text-right ${
                      effectiveChannelId === row.id ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className="text-2xs font-black uppercase tracking-widest opacity-60">
                      {effMetric === 'roas' ? 'ROAS' : 'CPA'}
                    </div>
                    <div className="text-2xl font-black tracking-tighter">
                      {effMetric === 'roas' ? formatRoas(row.roas) : formatCurrency(row.cpa)}
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-6">
                  <Sparkline values={row.trend} color={effectiveChannelId === row.id ? 'bg-white' : 'bg-brand-start'} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </LazySection>

      <LazySection fallback={gridSkeleton('grid gap-8 lg:grid-cols-[0.9fr_1.1fr]')}>
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Channels Table */}
          <div className="dashboard-surface dashboard-card">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {adsMatrixTitle}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t.dashboard.ads_v2.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => handleExplain(adsMatrixTitle)}
                className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
              >
                {t.dashboard.context_menu.explain_ai}
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-black/5 dark:border-white/5">
              <div className="grid grid-cols-6 gap-2 bg-black/[0.02] dark:bg-white/[0.02] px-4 py-3 text-2xs font-black uppercase tracking-widest text-gray-500">
                <span>{adsMatrixChannelLabel}</span>
                <span className="text-right">{adsMatrixSpendLabel}</span>
                <span className="text-right">{adsMatrixRevenueLabel}</span>
                <span className="text-right">{adsMatrixRoasLabel}</span>
                <span className="text-right">{adsMatrixMerLabel}</span>
                <span className="text-right">{adsMatrixCpaLabel}</span>
              </div>
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {channelMetrics.map((row) => (
                  <div
                    key={row.id}
                    onClick={() => handleChannelSelect(row.id, row.label)}
                    onContextMenu={(e) => openMenu(e, buildMenuItems(row.label, '/dashboard/ads'), row.label)}
                    className={`grid grid-cols-6 gap-2 px-4 py-3 text-xs-plus font-black uppercase tracking-widest cursor-pointer transition-colors ${
                      effectiveChannelId === row.id
                        ? 'bg-brand-start/10 text-brand-start'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{row.shortLabel}</span>
                    <span className="text-right tabular-nums">{formatCurrency(row.spend)}</span>
                    <span className="text-right tabular-nums">{formatCurrency(row.revenue)}</span>
                    <span className="text-right tabular-nums">{formatRoas(row.roas)}</span>
                    <span className="text-right tabular-nums">{formatRoas(row.revenue / Math.max(row.spend, 1))}</span>
                    <span className="text-right tabular-nums">{formatCurrency(row.cpa)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => handleExplain(adsMatrixTitle)}
                className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
              >
                {t.dashboard.context_menu.explain_ai}
              </button>
              <button
                type="button"
                onClick={() => handleSetAlert(adsMatrixTitle)}
                disabled={isDemo}
                title={isDemo ? demoTooltip : undefined}
                className={`text-xs font-black uppercase tracking-widest ${
                  isDemo ? 'text-gray-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t.dashboard.context_menu.set_alert}
              </button>
            </div>
          </div>

          {/* Drilldown Table */}
          <div className="dashboard-surface dashboard-card">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {drilldownTitle}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{drilldownDesc}</p>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setDrilldownLevel('campaign')}
                  aria-pressed={drilldownLevel === 'campaign'}
                  className={`px-3 py-2 rounded-xl text-2xs font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f] ${
                    drilldownLevel === 'campaign'
                      ? 'bg-white dark:bg-white/10 text-brand-start dark:text-white shadow-lg'
                      : 'text-gray-500'
                  }`}
                >
                  {t.dashboard.ads_v2.drilldown.level_campaign}
                </button>
                <button
                  type="button"
                  onClick={() => setDrilldownLevel('adset')}
                  aria-pressed={drilldownLevel === 'adset'}
                  className={`px-3 py-2 rounded-xl text-2xs font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f] ${
                    drilldownLevel === 'adset'
                      ? 'bg-white dark:bg-white/10 text-brand-start dark:text-white shadow-lg'
                      : 'text-gray-500'
                  }`}
                >
                  {t.dashboard.ads_v2.drilldown.level_adset}
                </button>
                <button
                  type="button"
                  onClick={() => setDrilldownLevel('creative')}
                  aria-pressed={drilldownLevel === 'creative'}
                  className={`px-3 py-2 rounded-xl text-2xs font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f] ${
                    drilldownLevel === 'creative'
                      ? 'bg-white dark:bg-white/10 text-brand-start dark:text-white shadow-lg'
                      : 'text-gray-500'
                  }`}
                >
                  {t.dashboard.ads_v2.drilldown.level_creative}
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-black/5 dark:border-white/5">
              <div className="grid grid-cols-7 gap-2 bg-black/[0.02] dark:bg-white/[0.02] px-4 py-3 text-2xs font-black uppercase tracking-widest text-gray-500">
                <span>{adsMatrixChannelLabel}</span>
                <span>{drilldownNameLabel}</span>
                <span className="text-right">{adsMatrixSpendLabel}</span>
                <span className="text-right">{adsMatrixRevenueLabel}</span>
                <span className="text-right">{adsMatrixRoasLabel}</span>
                <span className="text-right">{adsMatrixMerLabel}</span>
                <span className="text-right">{adsMatrixCpaLabel}</span>
              </div>
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {drilldownRows.map((row) => (
                  <div
                    key={row.id}
                    onClick={() => handleExplain(row.name)}
                    onContextMenu={(e) => openMenu(e, buildMenuItems(row.name, '/dashboard/ads'), row.name)}
                    className="grid grid-cols-7 gap-2 px-4 py-3 text-xs-plus font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                  >
                    <span>{shortLabelFromName(row.channel)}</span>
                    <span className="truncate">{row.name}</span>
                    <span className="lorem text-right tabular-nums">{formatCurrency(row.spend)}</span>
                    <span className="text-right tabular-nums">{formatCurrency(row.revenue)}</span>
                    <span className="text-right tabular-nums">{formatRoas(row.roas)}</span>
                    <span className="text-right tabular-nums">{formatRoas(row.revenue / Math.max(row.spend, 1))}</span>
                    <span className="text-right tabular-nums">{formatCurrency(row.cpa)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => handleExplain(drilldownNameLabel)}
                className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
              >
                {t.dashboard.context_menu.explain_ai}
              </button>
              <button
                type="button"
                onClick={() => handleSetAlert(drilldownNameLabel)}
                disabled={isDemo}
                title={isDemo ? demoTooltip : undefined}
                className={`text-xs font-black uppercase tracking-widest ${
                  isDemo ? 'text-gray-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t.dashboard.context_menu.set_alert}
              </button>
            </div>
          </div>
        </section>
      </LazySection>

      <LazySection fallback={gridSkeleton('grid gap-8 lg:grid-cols-[0.7fr_1.3fr]')}>
        <section className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          {/* Market Share Circle */}
          <div className="dashboard-surface dashboard-card">
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8">
              {t.dashboard.ads_v2.share.title}
            </h3>

            <div className="space-y-10">
              {[
                { id: 'spend', label: t.dashboard.ads_v2.share.spend_label },
                { id: 'revenue', label: t.dashboard.ads_v2.share.revenue_label },
              ].map((item) => (
                <div key={item.id} className="relative group/share">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs-plus font-black text-gray-500 uppercase tracking-widest">
                      {item.label}
                    </span>
                    <span className="text-xs font-black text-brand-start uppercase">
                      {t.dashboard.ads_v2.share.attention_badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className="relative w-32 h-32 shrink-0">
                      <div
                        className="absolute inset-0 rounded-full border-4 border-black/5 dark:border-white/5 rotate-[-90deg]"
                        style={{ background: shareGradient(item.id as 'spend' | 'revenue') }}
                      />
                      <div className="absolute inset-3 rounded-full bg-white dark:bg-[#0b0b0f] flex items-center justify-center shadow-inner">
                        <span className="text-lg font-black text-gray-900 dark:text-white tracking-tighter">
                          {Math.round(
                            shareData[0]?.[item.id === 'spend' ? 'spendShare' : 'revenueShare'] || 0,
                          )}
                          %
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      {shareData.slice(0, 3).map((row, idx) => (
                        <div
                          key={row.id}
                          className="flex items-center justify-between group/row cursor-pointer"
                          onClick={() => handleChannelSelect(row.id, row.label)}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${colorRamp[idx % colorRamp.length]}`} />
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest group-hover/row:text-brand-start transition-colors">
                              {row.label}
                            </span>
                          </div>
                          <span className="text-xs-plus font-black text-gray-900 dark:text-white">
                            {formatPercent(item.id === 'spend' ? row.spendShare : row.revenueShare)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleExplain(t.dashboard.ads_v2.share.title)}
                      className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
                    >
                      {t.dashboard.context_menu.explain_ai}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetAlert(t.dashboard.ads_v2.share.title)}
                      disabled={isDemo}
                      title={isDemo ? demoTooltip : undefined}
                      className={`text-xs font-black uppercase tracking-widest ${
                        isDemo ? 'text-gray-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {t.dashboard.context_menu.set_alert}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Creatives Intelligence */}
          <div className="dashboard-surface dashboard-card">
            <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {t.dashboard.ads_v2.creatives.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {t.dashboard.ads_v2.creatives.desc}
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {creatives.map((item) => (
                <div
                  key={item.id}
                  onClick={(e) => {
                    if (isAltPressed) {
                      openMenu(e, buildMenuItems(item.name, '/dashboard/ads'), item.name);
                    } else {
                      handleExplain(item.name);
                    }
                  }}
                  onContextMenu={(e) => openMenu(e, buildMenuItems(item.name, '/dashboard/ads'), item.name)}
                  className="p-6 rounded-[2rem] bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-brand-start/30 transition-all group/creative cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-black/10 dark:bg-white/5 flex items-center justify-center shrink-0 border border-black/5 dark:border-white/10">
                      <svg
                        className="w-7 h-7 text-gray-400 group-hover/creative:text-brand-start transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">
                        {dashboardAny.performance_label ?? 'Performance'}
                      </div>
                      <div className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">
                        {formatRoas(item.roas)}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-black uppercase tracking-tight text-gray-900 dark:text-white mb-1 group-hover:text-brand-start transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      {item.format} • {item.placement}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-black/5 dark:border-white/5">
                    <div>
                      <div className="text-3xs font-black text-gray-400 uppercase tracking-widest">CTR</div>
                      <div className="text-xs font-black text-gray-900 dark:text-white">
                        {formatPercent(item.ctr)}
                      </div>
                    </div>
                    <div>
                      <div className="text-3xs font-black text-gray-400 uppercase tracking-widest">CVR</div>
                      <div className="text-xs font-black text-gray-900 dark:text-white">
                        {formatPercent(item.cvr)}
                      </div>
                    </div>
                    <div>
                      <div className="text-3xs font-black text-gray-400 uppercase tracking-widest">CPA</div>
                      <div className="text-xs font-black text-gray-900 dark:text-white">
                        {formatCurrency(item.cpa)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => handleExplain(t.dashboard.ads_v2.creatives.title)}
                className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
              >
                {creativesActions?.explain ?? t.dashboard.context_menu.explain_ai}
              </button>
              <button
                type="button"
                onClick={() => handleSetAlert(t.dashboard.ads_v2.creatives.title)}
                disabled={isDemo}
                title={isDemo ? demoTooltip : undefined}
                className={`text-xs font-black uppercase tracking-widest ${
                  isDemo ? 'text-gray-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {creativesActions?.alert ?? t.dashboard.context_menu.set_alert}
              </button>
              <button
                type="button"
                onClick={navigateToReports}
                disabled={isDemo}
                title={isDemo ? demoTooltip : undefined}
                className={`text-xs font-black uppercase tracking-widest ${
                  isDemo ? 'text-gray-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {creativesActions?.report ?? t.dashboard.context_menu.add_report}
              </button>
            </div>
          </div>
        </section>
      </LazySection>

      <ContextMenu menu={menu} onClose={closeMenu} />
    </div>
  );
};
