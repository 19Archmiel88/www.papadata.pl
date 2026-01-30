import React, { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from './DashboardContext';
import { InteractiveButton } from '../InteractiveButton';
import { ContextMenu, LazySection, TrendChartCard, WidgetEmptyState } from './DashboardPrimitives';
import { clamp } from './DashboardPrimitives.constants';
import { useContextMenu } from './DashboardPrimitives.hooks';
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercentValue,
  formatRatio,
} from '../../utils/formatters';
import type { DashboardOverviewV2, DashboardOverviewV2Alert } from '../../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

type SortDir = 'asc' | 'desc';
type CampaignSortKey = 'name' | 'spend' | 'revenue' | 'roas' | 'cpa' | 'ctr' | 'cvr' | 'delta';
type SkuSortKey = 'name' | 'revenue' | 'profit' | 'margin' | 'returns' | 'trend';

type OverviewInsightItem = {
  id: string;
  title: string;
  impact: string;
  context?: string;
};

type CampaignSample = DashboardOverviewV2['tables']['sample']['campaigns'][number];
type SkuSample = DashboardOverviewV2['tables']['sample']['skus'][number];

type CampaignRow = CampaignSample & {
  spend: number;
  revenue: number;
  roas: number;
  cpa: number;
  ctr: number;
  cvr: number;
  delta: number;
};

type SkuRow = SkuSample & {
  revenue: number;
  profit: number;
  margin: number;
  returns: number;
  trend: number;
  stock: 'low' | 'medium' | 'high';
};

const seeded = (i: number, seed: number) => {
  const x = Math.sin((i + 1) * seed) * 10000;
  return x - Math.floor(x);
};

const KpiCard: React.FC<{
  label: string;
  value: string;
  delta: string;
  isPos: boolean;
  def: string;
  onExplain: () => void;
  explainLabel: string;
  isStale?: boolean;
  staleLabel?: string;
}> = ({ label, value, delta, isPos, def, onExplain, explainLabel, isStale, staleLabel }) => (
  <div className="dashboard-surface dashboard-card dashboard-card--compact space-y-3 group transition-all hover:border-brand-start/40 overflow-hidden">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{label}</span>

        {/* Info hint (tooltip via title). Using span to avoid "button with no action". */}
        <span
          title={def}
          aria-label={def}
          className="w-4 h-4 inline-flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-2xs font-black text-gray-400 hover:text-brand-start transition-colors cursor-help select-none"
        >
          i
        </span>

        {isStale && staleLabel && (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-3xs font-black uppercase tracking-widest">
            {staleLabel}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onExplain}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-2xs font-black text-brand-start uppercase hover:underline"
      >
        {explainLabel}
      </button>
    </div>

    <div className="text-[clamp(1.25rem,2.6vw,2.05rem)] leading-none font-black text-gray-900 dark:text-white tracking-tighter tabular-nums whitespace-nowrap">
      {value}
    </div>

    <div className="flex items-center gap-2">
      <span
        className={`text-xs font-black flex items-center gap-1 ${
          isPos ? 'text-emerald-500' : 'text-rose-500'
        }`}
      >
        {isPos ? '▲' : '▼'} {delta}
      </span>
      <div className="h-1 flex-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${isPos ? 'bg-emerald-500' : 'bg-rose-500'} opacity-40`}
          style={{ width: isPos ? '75%' : '40%' }}
        />
      </div>
    </div>
  </div>
);

export const OverviewViewV2: React.FC = () => {
  const { t, timeRange, setContextLabel, setAiDraft, isDemo, tenantStatus } =
    useOutletContext<DashboardOutletContext>();

  const location = useLocation();
  const navigate = useNavigate();
  const navigateWithSearch = (path: string) => navigate(`${path}${location.search}`);

  const aiInputRef = useRef<HTMLInputElement | null>(null);
  const [aiQuery, setAiQuery] = useState('');

  const { menu, openMenu, closeMenu } = useContextMenu();

  const [campSort, setCampSort] = useState<{ key: CampaignSortKey; dir: SortDir }>({
    key: 'revenue',
    dir: 'desc',
  });
  const [skuSort, setSkuSort] = useState<{ key: SkuSortKey; dir: SortDir }>({
    key: 'profit',
    dir: 'desc',
  });

  const demoTooltip = t.dashboard.demo_tooltip;

  const locale = t.langCode ?? 'pl-PL';

  const timeMultiplier = useMemo(
    () => (timeRange === '1d' ? 0.032 : timeRange === '7d' ? 0.22 : 1),
    [timeRange]
  );
  const baseSeed = useMemo(
    () => (timeRange === '1d' ? 19 : timeRange === '7d' ? 31 : 57),
    [timeRange]
  );
  const pointsCount = useMemo(
    () => (timeRange === '1d' ? 12 : timeRange === '7d' ? 14 : 24),
    [timeRange]
  );

  const isStale = useMemo(() => ['90d', 'ytd', 'qtd', 'custom'].includes(timeRange), [timeRange]);

  const formatCurrencyValue = useMemo(
    () => (value: number) => formatCurrency(value, locale),
    [locale]
  );
  const formatCurrencyCompactValue = useMemo(
    () => (value: number) => formatCompactCurrency(value, locale),
    [locale]
  );
  const formatPercentValueLocal = useMemo(
    () => (value: number) => formatPercentValue(value, locale, 1),
    [locale]
  );
  const formatRatioLocal = useMemo(
    () => (value: number) => formatRatio(value, locale, 2, 'x', '0.00x'),
    [locale]
  );

  // --- SAFE ACCESS HELPERS (prevents "undefined.items" crashes) ---

  const safeAlerts = useMemo<DashboardOverviewV2Alert[]>(() => {
    const items = t.dashboard?.overview_v2?.alerts?.items;
    return Array.isArray(items) ? (items as DashboardOverviewV2Alert[]) : [];
  }, [t]);

  const safeInsights = useMemo<OverviewInsightItem[]>(() => {
    const items = t.dashboard?.overview_v2?.insights?.items;
    return Array.isArray(items) ? (items as OverviewInsightItem[]) : [];
  }, [t]);

  const safeCampaignSamples = useMemo<CampaignSample[]>(() => {
    const items = t.dashboard?.overview_v2?.tables?.sample?.campaigns;
    return Array.isArray(items) ? (items as CampaignSample[]) : [];
  }, [t]);

  const safeSkuSamples = useMemo<SkuSample[]>(() => {
    const items = t.dashboard?.overview_v2?.tables?.sample?.skus;
    return Array.isArray(items) ? (items as SkuSample[]) : [];
  }, [t]);

  // --- MOCK DATA GENERATION ---

  const revenueSeries = useMemo(
    () =>
      Array.from({ length: pointsCount }).map((_, idx) =>
        clamp(
          140_000 * timeMultiplier + seeded(idx, baseSeed) * (40_000 * timeMultiplier),
          1000,
          5_000_000
        )
      ),
    [pointsCount, baseSeed, timeMultiplier]
  );

  const spendSeries = useMemo(
    () =>
      Array.from({ length: pointsCount }).map((_, idx) =>
        clamp(
          35_000 * timeMultiplier + seeded(idx + 5, baseSeed) * (15_000 * timeMultiplier),
          500,
          1_000_000
        )
      ),
    [pointsCount, baseSeed, timeMultiplier]
  );

  const roasSeries = useMemo(
    () =>
      Array.from({ length: pointsCount }).map((_, idx) =>
        clamp(3.2 + seeded(idx + 11, baseSeed) * 2.1, 1.5, 8.5)
      ),
    [pointsCount, baseSeed]
  );

  const cpaSeries = useMemo(
    () =>
      Array.from({ length: pointsCount }).map((_, idx) =>
        clamp(32 + seeded(idx + 17, baseSeed) * 24, 15, 95)
      ),
    [pointsCount, baseSeed]
  );

  const trendData = useMemo(
    () =>
      revenueSeries.map((value, index) => ({
        label: `T${index + 1}`,
        revenue: Math.round(value),
        spend: Math.round(spendSeries[index] ?? 0),
        roas: Number((roasSeries[index] ?? 0).toFixed(2)),
      })),
    [revenueSeries, spendSeries, roasSeries]
  );

  const totals = useMemo(() => {
    const revenue = revenueSeries.reduce((a, b) => a + b, 0);
    const spend = spendSeries.reduce((a, b) => a + b, 0);
    return { revenue, spend, roas: revenue / Math.max(1, spend) };
  }, [revenueSeries, spendSeries]);

  const campaigns = useMemo<CampaignRow[]>(() => {
    const rows = safeCampaignSamples.map((c, i): CampaignRow => {
      const spend = (12_000 + seeded(i, baseSeed) * 45_000) * timeMultiplier;
      const roas = 2.4 + seeded(i + 3, baseSeed) * 3.8;
      const revenue = spend * roas;
      const cpa = 24 + seeded(i + 7, baseSeed) * 48;
      const ctr = 0.8 + seeded(i + 11, baseSeed) * 2.2;
      const cvr = 1.4 + seeded(i + 13, baseSeed) * 4.6;
      return {
        ...c,
        spend,
        revenue,
        roas,
        cpa,
        ctr,
        cvr,
        delta: 4 + seeded(i, baseSeed) * 12,
      };
    });

    const getVal = (row: CampaignRow, key: CampaignSortKey): string | number => {
      switch (key) {
        case 'name':
          return row.name;
        case 'spend':
          return row.spend;
        case 'revenue':
          return row.revenue;
        case 'roas':
          return row.roas;
        case 'cpa':
          return row.cpa;
        case 'ctr':
          return row.ctr;
        case 'cvr':
          return row.cvr;
        case 'delta':
          return row.delta;
        default:
          return 0;
      }
    };

    return rows.sort((a, b) => {
      const vA = getVal(a, campSort.key);
      const vB = getVal(b, campSort.key);

      if (vA === vB) return 0;

      if (typeof vA === 'string' && typeof vB === 'string') {
        return campSort.dir === 'desc' ? vB.localeCompare(vA) : vA.localeCompare(vB);
      }

      const nA = typeof vA === 'number' ? vA : Number(vA);
      const nB = typeof vB === 'number' ? vB : Number(vB);

      return campSort.dir === 'desc' ? (nB > nA ? 1 : -1) : nA > nB ? 1 : -1;
    });
  }, [safeCampaignSamples, baseSeed, timeMultiplier, campSort]);

  const skus = useMemo<SkuRow[]>(() => {
    const rows = safeSkuSamples.map((s, i): SkuRow => {
      const revenue = (25_000 + seeded(i, baseSeed) * 85_000) * timeMultiplier;
      const margin = 12 + seeded(i + 5, baseSeed) * 38;
      const profit = revenue * (margin / 100);
      const returns = 2 + seeded(i + 9, baseSeed) * 14;
      const trend = -15 + seeded(i + 13, baseSeed) * 45;
      const stockSeed = seeded(i, baseSeed);
      const stock = stockSeed > 0.8 ? 'low' : stockSeed > 0.4 ? 'medium' : 'high';
      return {
        ...s,
        revenue,
        profit,
        margin,
        returns,
        trend,
        stock,
      };
    });

    const getVal = (row: SkuRow, key: SkuSortKey): string | number => {
      switch (key) {
        case 'name':
          return row.name;
        case 'revenue':
          return row.revenue;
        case 'profit':
          return row.profit;
        case 'margin':
          return row.margin;
        case 'returns':
          return row.returns;
        case 'trend':
          return row.trend;
        default:
          return 0;
      }
    };

    return rows.sort((a, b) => {
      const vA = getVal(a, skuSort.key);
      const vB = getVal(b, skuSort.key);

      if (vA === vB) return 0;

      if (typeof vA === 'string' && typeof vB === 'string') {
        return skuSort.dir === 'desc' ? vB.localeCompare(vA) : vA.localeCompare(vB);
      }

      const nA = typeof vA === 'number' ? vA : Number(vA);
      const nB = typeof vB === 'number' ? vB : Number(vB);

      return skuSort.dir === 'desc' ? (nB > nA ? 1 : -1) : nA > nB ? 1 : -1;
    });
  }, [safeSkuSamples, baseSeed, timeMultiplier, skuSort]);

  const handleAiSubmit = (query?: string) => {
    const finalQuery = query || aiQuery;
    if (!finalQuery.trim()) return;
    setAiDraft?.(finalQuery);
    setAiQuery('');
  };

  const handleExplain = (context: string) => {
    const template = t.dashboard?.overview_v2?.ai?.prompt_template ?? '{context}';
    const prompt = template.replace('{context}', context);
    setContextLabel?.(context);
    setAiDraft?.(prompt);
  };

  const buildMenuItems = (context: string, route: string) => [
    {
      id: 'drill',
      label: t.dashboard.context_menu.drill,
      onSelect: () => navigateWithSearch(route),
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
        setContextLabel?.(context);
        navigateWithSearch('/dashboard/reports');
      },
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
    {
      id: 'alert',
      label: t.dashboard.context_menu.set_alert,
      onSelect: () => {
        setContextLabel?.(context);
        navigateWithSearch('/dashboard/alerts');
      },
      disabled: isDemo,
      disabledReason: demoTooltip,
    },
  ];

  const toggleCampSort = (key: CampaignSortKey) => {
    setCampSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === 'desc' ? 'asc' : 'desc',
    }));
  };

  const toggleSkuSort = (key: SkuSortKey) => {
    setSkuSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === 'desc' ? 'asc' : 'desc',
    }));
  };

  const staleLabel = t.dashboard?.overview_v2?.kpis?.badge_stale || 'STALE';

  if (tenantStatus?.mode === 'empty') {
    return (
      <section className="space-y-6">
        <div className="rounded-[2.5rem] border border-brand-start/20 bg-brand-start/5 p-8 shadow-xl">
          <WidgetEmptyState
            title="Brak danych"
            desc="Podłącz integracje, aby zobaczyć metryki i analizy w dashboardzie."
            actionLabel="Przejdź do integracji"
            onAction={() => navigateWithSearch('/app/integrations')}
          />
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-8 animate-reveal">
      {/* Active Alerts Strip */}
      <section className="dashboard-surface dashboard-card relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/5 border border-rose-500/20 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-rose-500">
                {t.dashboard.overview_v2?.alerts?.live_label ?? 'Live'}
              </span>
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {t.dashboard.overview_v2?.alerts?.title ?? 'Alerts'}
            </h2>
          </div>
          <InteractiveButton
            variant="secondary"
            onClick={() => navigateWithSearch('/dashboard/alerts')}
            className="!px-6 !py-3 !text-xs font-black uppercase tracking-widest rounded-2xl border-black/5"
          >
            {t.dashboard.overview_v2?.alerts?.view_all ?? 'View all'}
          </InteractiveButton>
        </div>

        {safeAlerts.length === 0 ? (
          <div className="p-6 rounded-[1.5rem] bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 text-center">
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
              {t.dashboard.widget?.empty_title ?? 'Brak danych'}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {t.dashboard.widget?.empty_desc ?? 'Brak alertów do pokazania.'}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {safeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-5 rounded-[1.5rem] bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex flex-col justify-between group hover:border-brand-start/40 hover:bg-white dark:hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xs font-black text-gray-400 uppercase tracking-[0.2em]">
                    {alert.time}
                  </span>
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      alert.severity === 'critical'
                        ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse'
                        : alert.severity === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                    }`}
                  />
                </div>
                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">
                  {alert.title}
                </h4>
                <p className="text-xs-plus text-rose-500 font-black mt-2 tracking-wide">
                  {alert.impact}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleExplain(alert.title)}
                    className="text-2xs font-black uppercase tracking-widest text-brand-start hover:underline"
                  >
                    {t.dashboard.overview_v2?.alerts?.action_ai ??
                      t.dashboard.context_menu.explain_ai}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateWithSearch(`/dashboard/${alert.target}`)}
                    className="text-2xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {t.dashboard.overview_v2?.alerts?.action_open ?? 'Open'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* KPI Pulse Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-7 gap-5">
        <KpiCard
          label={t.dashboard.overview_v2?.kpis?.labels?.revenue ?? 'Revenue'}
          value={formatCurrencyCompactValue(totals.revenue)}
          delta="6.4%"
          isPos={true}
          def={t.dashboard.overview_v2?.kpis?.defs?.revenue ?? ''}
          onExplain={() => handleExplain('Revenue Performance')}
          explainLabel={
            t.dashboard.overview_v2?.kpis?.explain_action ?? t.dashboard.context_menu.explain_ai
          }
          isStale={isStale}
          staleLabel={staleLabel}
        />
        <KpiCard
          label={t.dashboard.overview_v2?.kpis?.labels?.spend ?? 'Spend'}
          value={formatCurrencyCompactValue(totals.spend)}
          delta="4.2%"
          isPos={false}
          def={t.dashboard.overview_v2?.kpis?.defs?.spend ?? ''}
          onExplain={() => handleExplain('Spend Performance')}
          explainLabel={
            t.dashboard.overview_v2?.kpis?.explain_action ?? t.dashboard.context_menu.explain_ai
          }
          isStale={isStale}
          staleLabel={staleLabel}
        />
        <KpiCard
          label={t.dashboard.overview_v2?.kpis?.labels?.profit ?? 'Profit'}
          value={formatCurrencyCompactValue(totals.revenue * 0.34)}
          delta="12.1%"
          isPos={true}
          def={t.dashboard.overview_v2?.kpis?.defs?.profit ?? ''}
          onExplain={() => handleExplain('Net Profit Trends')}
          explainLabel={
            t.dashboard.overview_v2?.kpis?.explain_action ?? t.dashboard.context_menu.explain_ai
          }
          isStale={isStale}
          staleLabel={staleLabel}
        />
        <KpiCard
          label={t.dashboard.overview_v2?.kpis?.labels?.roas ?? 'ROAS'}
          value={formatRatioLocal(totals.roas)}
          delta="3.8%"
          isPos={true}
          def={t.dashboard.overview_v2?.kpis?.defs?.roas ?? ''}
          onExplain={() => handleExplain('ROAS Efficiency')}
          explainLabel={
            t.dashboard.overview_v2?.kpis?.explain_action ?? t.dashboard.context_menu.explain_ai
          }
          isStale={isStale}
          staleLabel={staleLabel}
        />
        <KpiCard
          label={t.dashboard.overview_v2?.kpis?.labels?.aov ?? 'AOV'}
          value={formatCurrencyValue(242)}
          delta="0.8%"
          isPos={true}
          def={t.dashboard.overview_v2?.kpis?.defs?.aov ?? ''}
          onExplain={() => handleExplain('AOV Factors')}
          explainLabel={
            t.dashboard.overview_v2?.kpis?.explain_action ?? t.dashboard.context_menu.explain_ai
          }
          isStale={isStale}
          staleLabel={staleLabel}
        />
        <KpiCard
          label={t.dashboard.overview_v2?.kpis?.labels?.new_returning ?? 'New/Returning'}
          value="68/32"
          delta="2.4%"
          isPos={true}
          def={t.dashboard.overview_v2?.kpis?.defs?.new_returning ?? ''}
          onExplain={() => handleExplain('Customer Retention')}
          explainLabel={
            t.dashboard.overview_v2?.kpis?.explain_action ?? t.dashboard.context_menu.explain_ai
          }
          isStale={isStale}
          staleLabel={staleLabel}
        />
        <KpiCard
          label={t.dashboard.overview_v2?.kpis?.labels?.ltv_30d ?? 'LTV 30d'}
          value={formatCurrencyValue(412)}
          delta="5.7%"
          isPos={true}
          def={t.dashboard.overview_v2?.kpis?.defs?.ltv_30d ?? ''}
          onExplain={() => handleExplain('LTV Projections')}
          explainLabel={
            t.dashboard.overview_v2?.kpis?.explain_action ?? t.dashboard.context_menu.explain_ai
          }
          isStale={isStale}
          staleLabel={staleLabel}
        />
      </section>

      {/* Revenue trend (Recharts) */}
      <section className="dashboard-surface dashboard-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-gray-900 dark:text-white">
              {t.dashboard.overview_v2?.charts?.revenue_title ?? 'Revenue vs Spend'}
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              {t.dashboard.overview_v2?.charts?.revenue_desc ??
                'Syntetyczny trend z podziałem na przychód, spend i ROAS.'}
            </p>
          </div>
          <span className="text-2xs font-black uppercase tracking-[0.2em] text-gray-400">
            sample • demo
          </span>
        </div>
        <div className="h-[320px]" data-testid="recharts-trend">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 16, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="label" stroke="currentColor" tick={{ fontSize: 11 }} />
              <YAxis stroke="currentColor" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#5ce1e6"
                strokeWidth={3}
                dot={false}
                name={t.dashboard.overview_v2?.charts?.revenue_label ?? 'Revenue'}
              />
              <Line
                type="monotone"
                dataKey="spend"
                stroke="#7c3aed"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
                name={t.dashboard.overview_v2?.charts?.spend_label ?? 'Spend'}
              />
              <Line
                type="natural"
                dataKey="roas"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                name={t.dashboard.overview_v2?.charts?.roas_label ?? 'ROAS'}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Executive Insights */}
      <section className="dashboard-surface dashboard-card">
        <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {t.dashboard.overview_v2?.insights?.title ?? 'Executive Insights'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {t.dashboard.overview_v2?.insights?.desc ??
                'Najważniejsze sygnały z Twoich kampanii, produktów i klientów.'}
            </p>
          </div>
        </div>

        {safeInsights.length === 0 ? (
          <div className="p-6 rounded-[1.5rem] bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 text-center">
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
              {t.dashboard.widget?.empty_title ?? 'Brak danych'}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {t.dashboard.widget?.empty_desc ?? 'Brak insightów do pokazania.'}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {safeInsights.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleExplain(item.context || item.title)}
                className="text-left p-5 rounded-[1.5rem] bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-brand-start/40 transition-all group"
              >
                <div className="text-2xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  {item.impact}
                </div>
                <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-brand-start transition-colors">
                  {item.title}
                </div>
                <div className="mt-3 text-2xs font-black uppercase tracking-widest text-brand-start">
                  {t.dashboard.overview_v2?.insights?.cta ?? 'Wyjaśnij z AI'}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Primary Charts */}
      <LazySection
        fallback={
          <div className="grid lg:grid-cols-2 gap-8 h-80 animate-pulse bg-black/5 rounded-[2.5rem]" />
        }
      >
        <section className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <TrendChartCard
              title={t.dashboard.overview_v2?.charts?.revenue_spend?.title ?? 'Revenue vs Spend'}
              desc={t.dashboard.overview_v2?.charts?.revenue_spend?.desc ?? ''}
              menuAriaLabel={`${t.dashboard.context_menu.label}: ${
                t.dashboard.overview_v2?.charts?.revenue_spend?.title ?? 'Revenue vs Spend'
              }`}
              series={[
                {
                  id: 'revenue',
                  values: revenueSeries,
                  colorClass: 'text-brand-start',
                },
                {
                  id: 'spend',
                  values: spendSeries,
                  colorClass: 'text-emerald-500',
                },
              ]}
              dates={revenueSeries.map((_, i) => i.toString())}
              onOpenMenu={(event: React.MouseEvent<HTMLButtonElement>) =>
                openMenu(
                  event,
                  buildMenuItems('Revenue vs Spend', '/dashboard/ads'),
                  'Revenue Analytics'
                )
              }
            />
            <button
              type="button"
              onClick={() => handleExplain('Revenue vs Spend')}
              className="text-2xs font-black uppercase tracking-widest text-brand-start hover:underline"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>
          </div>

          <div className="space-y-3">
            <TrendChartCard
              title={t.dashboard.overview_v2?.charts?.roas_cpa?.title ?? 'ROAS vs CPA'}
              desc={t.dashboard.overview_v2?.charts?.roas_cpa?.desc ?? ''}
              menuAriaLabel={`${t.dashboard.context_menu.label}: ${
                t.dashboard.overview_v2?.charts?.roas_cpa?.title ?? 'ROAS vs CPA'
              }`}
              series={[
                {
                  id: 'roas',
                  values: roasSeries,
                  colorClass: 'text-brand-start',
                },
                {
                  id: 'cpa',
                  values: cpaSeries,
                  colorClass: 'text-amber-500',
                },
              ]}
              dates={roasSeries.map((_, i) => i.toString())}
              onOpenMenu={(event: React.MouseEvent<HTMLButtonElement>) =>
                openMenu(
                  event,
                  buildMenuItems('Efficiency Analysis', '/dashboard/ads'),
                  'Efficiency Analytics'
                )
              }
            />
            <button
              type="button"
              onClick={() => handleExplain('Efficiency Analysis')}
              className="text-2xs font-black uppercase tracking-widest text-brand-start hover:underline"
            >
              {t.dashboard.context_menu.explain_ai}
            </button>
          </div>
        </section>
      </LazySection>

      {/* AI Intelligence Hub */}
      <section className="rounded-[2.5rem] border border-brand-start/20 bg-white/90 dark:bg-[#08080A] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <svg className="w-56 h-56 text-brand-start" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
          </svg>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-6 relative z-10 mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {t.dashboard.overview_v2?.ai?.title ?? 'AI Intelligence Hub'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {t.dashboard.overview_v2?.ai?.desc ?? ''}
            </p>
          </div>
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 text-xs font-black uppercase text-gray-400">
            {t.dashboard.overview_v2?.ai?.toggle_hint ?? 'CMD + K to toggle'}
          </div>
        </div>

        <div className="relative z-10">
          <form
            className="flex flex-col md:flex-row gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleAiSubmit();
            }}
          >
            <input
              ref={aiInputRef}
              type="search"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder={t.dashboard.overview_v2?.ai?.placeholder ?? 'Zapytaj AI...'}
              className="flex-1 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/40 px-6 py-5 text-sm text-gray-900 dark:text-white outline-none focus:border-brand-start/50 shadow-inner font-medium"
            />
            <InteractiveButton
              variant="primary"
              type="submit"
              className="!px-10 !py-5 !text-xs-plus font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl"
              disabled={!aiQuery.trim()}
            >
              {t.dashboard.overview_v2?.ai?.submit ?? 'Wyślij'}
            </InteractiveButton>
          </form>
        </div>
      </section>

      {/* Tables Section */}
      <section className="grid lg:grid-cols-2 gap-8">
        {/* Campaigns Table */}
        <div className="dashboard-surface dashboard-card">
          <div className="flex items-start justify-between gap-6 mb-8">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                {t.dashboard.overview_v2?.tables?.campaigns?.title ?? 'Campaigns'}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {t.dashboard.overview_v2?.tables?.campaigns?.desc ?? ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  handleExplain(t.dashboard.overview_v2?.tables?.campaigns?.title ?? 'Campaigns')
                }
                className="text-2xs font-black uppercase text-brand-start hover:underline"
              >
                {t.dashboard.context_menu.explain_ai}
              </button>
              <button
                type="button"
                onClick={() => navigateWithSearch('/dashboard/ads')}
                className="text-2xs font-black uppercase text-brand-start hover:underline"
              >
                {t.dashboard.overview_v2?.tables?.campaigns?.actions?.view_all ?? 'View All Ads'}
              </button>
            </div>
          </div>

          {campaigns.length === 0 ? (
            <div className="p-6 rounded-[1.5rem] bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 text-center">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {t.dashboard.widget?.empty_title ?? 'Brak danych'}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {t.dashboard.widget?.empty_desc ?? 'Brak kampanii do pokazania.'}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar scroll-hint">
              <table className="dashboard-table">
                <thead className="text-2xs font-black text-gray-400 uppercase tracking-widest border-b border-black/5 dark:border-white/5">
                  <tr>
                    <th
                      className="py-4 px-2"
                      aria-sort={
                        campSort.key === 'name'
                          ? campSort.dir === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <button
                        type="button"
                        onClick={() => toggleCampSort('name')}
                        className="inline-flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
                      >
                        <span>Campaign</span>
                        {campSort.key === 'name' && (
                          <span>{campSort.dir === 'desc' ? '▼' : '▲'}</span>
                        )}
                      </button>
                    </th>
                    <th
                      className="py-4 px-2 text-right"
                      aria-sort={
                        campSort.key === 'revenue'
                          ? campSort.dir === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <button
                        type="button"
                        onClick={() => toggleCampSort('revenue')}
                        className="inline-flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
                      >
                        <span>Revenue</span>
                        {campSort.key === 'revenue' && (
                          <span>{campSort.dir === 'desc' ? '▼' : '▲'}</span>
                        )}
                      </button>
                    </th>
                    <th
                      className="py-4 px-2 text-right"
                      aria-sort={
                        campSort.key === 'roas'
                          ? campSort.dir === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <button
                        type="button"
                        onClick={() => toggleCampSort('roas')}
                        className="inline-flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
                      >
                        <span>ROAS</span>
                        {campSort.key === 'roas' && (
                          <span>{campSort.dir === 'desc' ? '▼' : '▲'}</span>
                        )}
                      </button>
                    </th>
                    <th
                      className="py-4 px-2 text-right"
                      aria-sort={
                        campSort.key === 'cvr'
                          ? campSort.dir === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <button
                        type="button"
                        onClick={() => toggleCampSort('cvr')}
                        className="inline-flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
                      >
                        <span>CVR</span>
                        {campSort.key === 'cvr' && (
                          <span>{campSort.dir === 'desc' ? '▼' : '▲'}</span>
                        )}
                      </button>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {campaigns.slice(0, 5).map((c) => (
                    <tr
                      key={c.id}
                      className="group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all cursor-pointer"
                      onClick={() => handleExplain(`Campaign ${c.name}`)}
                    >
                      <td className="py-4 px-2">
                        <div className="text-sm font-black text-gray-900 dark:text-white group-hover:text-brand-start transition-colors uppercase tracking-tight">
                          {c.name}
                        </div>
                        <div className="text-2xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
                          Active • Search
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right font-black text-gray-700 dark:text-gray-300 tabular-nums">
                        {formatCurrencyValue(c.revenue)}
                      </td>
                      <td className="py-4 px-2 text-right font-black text-brand-start tabular-nums">
                        {formatRatioLocal(c.roas)}
                      </td>
                      <td className="py-4 px-2 text-right font-black text-emerald-500 tabular-nums">
                        {formatPercentValueLocal(c.cvr)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SKUs Table */}
        <div className="dashboard-surface dashboard-card">
          <div className="flex items-start justify-between gap-6 mb-8">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                {t.dashboard.overview_v2?.tables?.skus?.title ?? 'SKUs'}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {t.dashboard.overview_v2?.tables?.skus?.desc ?? ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  handleExplain(t.dashboard.overview_v2?.tables?.skus?.title ?? 'SKUs')
                }
                className="text-2xs font-black uppercase text-brand-start hover:underline"
              >
                {t.dashboard.context_menu.explain_ai}
              </button>
              <button
                type="button"
                onClick={() => navigateWithSearch('/dashboard/products')}
                className="text-2xs font-black uppercase text-brand-start hover:underline"
              >
                {t.dashboard.overview_v2?.tables?.skus?.actions?.inventory_hub ?? 'Inventory Hub'}
              </button>
            </div>
          </div>

          {skus.length === 0 ? (
            <div className="p-6 rounded-[1.5rem] bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 text-center">
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {t.dashboard.widget?.empty_title ?? 'Brak danych'}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {t.dashboard.widget?.empty_desc ?? 'Brak SKU do pokazania.'}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar scroll-hint">
              <table className="dashboard-table">
                <thead className="text-2xs font-black text-gray-400 uppercase tracking-widest border-b border-black/5 dark:border-white/5">
                  <tr>
                    <th
                      className="py-4 px-2"
                      aria-sort={
                        skuSort.key === 'name'
                          ? skuSort.dir === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <button
                        type="button"
                        onClick={() => toggleSkuSort('name')}
                        className="inline-flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
                      >
                        <span>Product SKU</span>
                        {skuSort.key === 'name' && (
                          <span>{skuSort.dir === 'desc' ? '▼' : '▲'}</span>
                        )}
                      </button>
                    </th>
                    <th
                      className="py-4 px-2 text-right"
                      aria-sort={
                        skuSort.key === 'profit'
                          ? skuSort.dir === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <button
                        type="button"
                        onClick={() => toggleSkuSort('profit')}
                        className="inline-flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
                      >
                        <span>Profit</span>
                        {skuSort.key === 'profit' && (
                          <span>{skuSort.dir === 'desc' ? '▼' : '▲'}</span>
                        )}
                      </button>
                    </th>
                    <th
                      className="py-4 px-2 text-right"
                      aria-sort={
                        skuSort.key === 'margin'
                          ? skuSort.dir === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <button
                        type="button"
                        onClick={() => toggleSkuSort('margin')}
                        className="inline-flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
                      >
                        <span>Margin</span>
                        {skuSort.key === 'margin' && (
                          <span>{skuSort.dir === 'desc' ? '▼' : '▲'}</span>
                        )}
                      </button>
                    </th>
                    <th className="py-4 px-2 text-right">Stock</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {skus.slice(0, 5).map((s) => (
                    <tr
                      key={s.id}
                      role="button"
                      tabIndex={0}
                      className="group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all cursor-pointer focus-visible:outline-none focus-visible:bg-black/[0.03] dark:focus-visible:bg-white/[0.03]"
                      onClick={() => handleExplain(`SKU ${s.name}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleExplain(`SKU ${s.name}`);
                        }
                      }}
                    >
                      <td className="py-4 px-2">
                        <div className="text-sm font-black text-gray-900 dark:text-white group-hover:text-brand-start transition-colors uppercase tracking-tight">
                          {s.name}
                        </div>
                        <div className="text-2xs font-mono text-gray-400 mt-1 uppercase tracking-widest">
                          {s.id}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right font-black text-brand-start tabular-nums">
                        {formatCurrencyValue(s.profit)}
                      </td>
                      <td className="py-4 px-2 text-right font-black text-gray-700 dark:text-gray-300 tabular-nums">
                        {formatPercentValueLocal(s.margin)}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-2xs font-black uppercase border ${
                            s.stock === 'low'
                              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          }`}
                        >
                          {s.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <ContextMenu menu={menu} onClose={closeMenu} />
    </div>
  );
};

export default OverviewViewV2;
