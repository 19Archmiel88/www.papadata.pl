// ProductsViewV2.tsx
// Widok "Products": analiza SKU – macierz marża vs zysk, panel detali,
// top movers i tabela SKU, z kontekstem dla Papa AI i akcjami alertów.

import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from './DashboardContext';
import { InteractiveButton } from '../InteractiveButton';
import {
  ContextMenu,
  LazySection,
  WidgetErrorState,
  WidgetOfflineState,
  WidgetSkeleton,
} from './DashboardPrimitives';
import { useAltPressed, useContextMenu, useWidgetLoading } from './DashboardPrimitives.hooks';
import { fetchDashboardProducts } from '../../data/api';
import type { DashboardProductsResponse, KPIKey, TableRow } from '@papadata/shared';
import { captureException } from '../../utils/telemetry';
import {
  formatCurrency,
  formatPercentValue,
  formatSignedPercentValue,
} from '../../utils/formatters';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

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

type StockRisk = 'low' | 'medium' | 'high';

type ProductFallbackItem = {
  id?: string;
  name?: string;
  [key: string]: unknown;
};

const InfoButton: React.FC<{ label: string }> = ({ label }) => (
  <button
    type="button"
    className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-black/10 dark:border-white/10 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
    aria-label={label}
    title={label}
  >
    i
  </button>
);

export const ProductsViewV2: React.FC = () => {
  const { t, setContextLabel, setAiDraft, timeRange, isDemo } =
    useOutletContext<DashboardOutletContext>();
  const isOnline = useOnlineStatus();
  const { menu, openMenu, closeMenu } = useContextMenu();
  const isAltPressed = useAltPressed();
  const chartLoading = useWidgetLoading([timeRange], 420);
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [hoveredSkuId, setHoveredSkuId] = useState<string | null>(null);
  const [productsData, setProductsData] = useState<DashboardProductsResponse | null>(null);
  const [productsError, setProductsError] = useState<string | null>(null);
  const demoTooltip = t.dashboard.demo_tooltip;
  const [retryToken, setRetryToken] = useState(0);
  const handleRetry = () => setRetryToken((prev) => prev + 1);

  const locale = t.langCode ?? 'pl-PL';
  const formatCurrencyValue = useMemo(() => (value: number) => formatCurrency(value, locale), [locale]);
  const formatPercentValueLocal = useMemo(
    () => (value: number) => formatPercentValue(value, locale, 1),
    [locale]
  );

  // Time range multipliers to make data responsive
  const timeMultiplier = useMemo(() => {
    if (timeRange === '1d') return 0.035;
    if (timeRange === '7d') return 0.22;
    return 1;
  }, [timeRange]);

  useEffect(() => {
    let active = true;
    fetchDashboardProducts({ timeRange })
      .then((data) => {
        if (!active) return;
        setProductsData(data);
        setProductsError(null);
      })
      .catch((err: any) => {
        if (!active) return;
        setProductsError(err?.message || t.dashboard.widget.error_desc);
      });
    return () => {
      active = false;
    };
  }, [timeRange, retryToken, t.dashboard.widget.error_desc]);

  useEffect(() => {
    if (productsError) {
      captureException(new Error(productsError), { scope: 'products' });
    }
  }, [productsError]);

  // List of mock products if translation items are missing or limited
  const productBase = useMemo<ProductFallbackItem[]>(
    () => t.dashboard.products_v2.items ?? [],
    [t]
  );

  const fallbackNodes = useMemo(() => {
    return productBase.map((item: ProductFallbackItem, idx) => {
      // Revenue and profit scale with timeMultiplier
      const revenueBase = (50000 + seeded(idx, 11) * 150000) * timeMultiplier;
      const margin = clamp(15 + seeded(idx + 3, 22) * 45, 10, 60);
      const profit = revenueBase * (margin / 100);
      const units = Math.max(1, Math.round((100 + seeded(idx + 7, 33) * 900) * timeMultiplier));
      const returns = clamp(2 + seeded(idx + 13, 44) * 18, 1, 25);

      const fallbackId = item.id ?? `sku-${idx + 1}`;
      const fallbackName = item.name?.trim() || fallbackId;

      // Scatter coordinates
      const x = clamp(margin * 1.5, 5, 95); // X based on margin
      const y = clamp((profit / Math.max(1, 200000 * timeMultiplier)) * 100, 5, 95); // Y based on relative profit
      const size = clamp(16 + (units / Math.max(1, 1000 * timeMultiplier)) * 40, 14, 48);

      const stockRisk: StockRisk = returns > 15 ? 'high' : returns > 8 ? 'medium' : 'low';
      const trend = clamp(-20 + seeded(idx + 19, 55) * 40, -25, 35);

      return {
        ...item,
        id: fallbackId,
        name: fallbackName,
        revenue: revenueBase,
        volume: units,
        profit,
        returns,
        size,
        x,
        y,
        stockRisk,
        margin,
        trend,
      };
    });
  }, [productBase, timeMultiplier]);

  const nodes = useMemo(() => {
    const apiSkus = productsData?.skus ?? [];
    if (apiSkus.length === 0) return fallbackNodes;

    const rawNodes = apiSkus.map((row) => {
      const revenue = getMetricValue(row, 'revenue', 0);
      const margin = getMetricValue(row, 'margin', 0);
      const profit = getMetricValue(row, 'profit', revenue * (margin / 100));
      const returns = getMetricValue(row, 'returns', 0);
      const trend = getMetricValue(row, 'trend', 0);
      const volume = Math.max(1, Math.round(revenue / 240));

      const stockValue = getDimensionValue(row, 'stock', 'medium');
      const stockRisk: StockRisk =
        stockValue === 'low' || stockValue === 'high' || stockValue === 'medium'
          ? (stockValue as StockRisk)
          : 'medium';

      const name = getDimensionValue(row, 'name', row.id);

      return {
        id: row.id,
        name,
        revenue,
        volume,
        profit,
        returns,
        stockRisk,
        margin,
        trend,
      };
    });

    const maxProfit = Math.max(...rawNodes.map((node) => node.profit), 1);
    const maxVolume = Math.max(...rawNodes.map((node) => node.volume), 1);

    return rawNodes.map((node) => {
      const x = clamp(node.margin * 1.5, 5, 95);
      const y = clamp((node.profit / maxProfit) * 100, 5, 95);
      const size = clamp(16 + (node.volume / maxVolume) * 40, 14, 48);
      return { ...node, x, y, size };
    });
  }, [fallbackNodes, productsData]);

  // Derived Top Movers
  const movers = useMemo(() => {
    const sortedByTrend = [...nodes].sort((a, b) => b.trend - a.trend);
    return {
      rising: sortedByTrend.slice(0, 3).map((n) => ({
        id: n.id,
        label: n.name,
        impact: formatSignedPercentValue(n.trend, locale, 1),
        driver:
          n.trend > 15
            ? t.dashboard.products_v2.movers.driver_viral
            : t.dashboard.products_v2.movers.driver_search,
      })),
      falling: sortedByTrend
        .slice(-3)
        .reverse()
        .map((n) => ({
          id: n.id,
          label: n.name,
          impact: formatSignedPercentValue(n.trend, locale, 1),
          driver:
            n.trend < -15
              ? t.dashboard.products_v2.movers.driver_stock
              : t.dashboard.products_v2.movers.driver_competition,
        })),
    };
  }, [nodes, locale, t]);

  const selectedDetails = nodes.filter((node) => selectedSkus.includes(node.id));
  const hoveredSku = nodes.find((node) => node.id === hoveredSkuId) ?? null;
  const hasMultiSelect = selectedDetails.length > 1;

  const handleSelect = (id: string, name: string, shiftKey: boolean) => {
    const multi = shiftKey || isAltPressed;
    const contextValue = t.dashboard.products_v2.scatter.context_template.replace('{name}', name);
    const next = multi
      ? selectedSkus.includes(id)
        ? selectedSkus.filter((item) => item !== id)
        : [...selectedSkus, id]
      : selectedSkus.length === 1 && selectedSkus[0] === id
      ? []
      : [id];

    setSelectedSkus(next);
    setContextLabel?.(next.length ? contextValue : null);
    if (next.length) {
      setAiDraft?.(t.dashboard.products_v2.ai_prompt.replace('{name}', name));
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedSkus([]);
        setContextLabel?.(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setContextLabel]);

  const explainSku = (label: string) => {
    setContextLabel?.(t.dashboard.products_v2.scatter.context_template.replace('{name}', label));
    setAiDraft?.(t.dashboard.products_v2.ai_prompt.replace('{name}', label));
  };

  const scrollToDetails = () => {
    const el = document.getElementById('products-details');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const buildMenuItems = (name: string, skuId?: string) => {
    const contextValue = t.dashboard.products_v2.scatter.context_template.replace('{name}', name);
    return [
      {
        id: 'drill',
        label: t.dashboard.context_menu.drill,
        onSelect: () => {
          if (skuId) {
            setSelectedSkus((prev) => (prev.includes(skuId) ? prev : [skuId]));
          }
          setContextLabel?.(contextValue);
          scrollToDetails();
        },
      },
      {
        id: 'explain',
        label: t.dashboard.context_menu.explain_ai,
        onSelect: () => explainSku(name),
        tone: 'primary' as const,
      },
      {
        id: 'report',
        label: t.dashboard.context_menu.add_report,
        onSelect: () => {},
        disabled: isDemo,
        disabledReason: demoTooltip,
      },
      {
        id: 'export',
        label: t.dashboard.context_menu.export,
        onSelect: () => {},
        disabled: isDemo,
        disabledReason: demoTooltip,
      },
      {
        id: 'alert',
        label: t.dashboard.context_menu.set_alert,
        onSelect: () => {},
        disabled: isDemo,
        disabledReason: demoTooltip,
      },
    ];
  };

  const cardSkeleton = (chartHeight = 'h-36', lines = 4) => (
    <div className="dashboard-surface dashboard-card">
      <WidgetSkeleton chartHeight={chartHeight} lines={lines} />
    </div>
  );

  const safeNodesCount = nodes.length;
  const avgReturnRate =
    safeNodesCount > 0
      ? nodes.reduce((s: number, n: { returns: number }) => s + n.returns, 0) / safeNodesCount
      : null;

  const inventoryValue =
    safeNodesCount > 0
      ? nodes.reduce((s: number, n: { revenue: number }) => s + n.revenue, 0) * 0.4
      : null;

  return (
    <div className="space-y-8 animate-reveal">
      {/* Dynamic Header Summary */}
      <section className="dashboard-surface dashboard-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-start/5 border border-brand-start/10 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-start animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-start">
                SKU Intelligence Active
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {t.dashboard.products_v2.title}
            </h2>
            <p className="text-base text-gray-500 dark:text-gray-400 font-medium">
              {t.dashboard.products_v2.desc}
            </p>
          </div>

          <button
            type="button"
            onClick={() => explainSku(t.dashboard.products_v2.title)}
            className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
          >
            {t.dashboard.context_menu.explain_ai}
          </button>

          <div className="grid grid-cols-2 sm:flex items-center gap-4 w-full md:w-auto">
            <div className="p-4 rounded-[1.5rem] bg-black/5 dark:bg-white/5 border border-black/5 text-center min-w-[140px]">
              <div className="text-2xs font-black text-gray-400 uppercase tracking-widest mb-1">
                Avg. Return Rate
              </div>
              <div className="text-2xl font-black text-rose-500">
                {avgReturnRate === null ? '--' : formatPercentValue(avgReturnRate, locale, 1)}
              </div>
            </div>
            <div className="p-4 rounded-[1.5rem] bg-brand-start text-white shadow-xl shadow-brand-start/20 text-center min-w-[140px]">
              <div className="text-2xs font-black uppercase tracking-widest mb-1 opacity-70">
                Inventory Value
              </div>
              <div className="text-2xl font-black">
                {inventoryValue === null ? '--' : formatCurrencyValue(inventoryValue)}
              </div>
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

      {isOnline && productsError && (
        <section className="rounded-[2.5rem] border border-rose-500/20 bg-rose-500/5 p-6 shadow-xl">
          <WidgetErrorState
            title={t.dashboard.widget.error_title}
            desc={t.dashboard.widget.error_desc}
            actionLabel={t.dashboard.widget.cta_retry}
            onAction={handleRetry}
          />
        </section>
      )}

      <LazySection fallback={cardSkeleton('h-96', 4)}>
        {chartLoading ? (
          cardSkeleton('h-96', 4)
        ) : (
          <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            {/* Matrix Visualization */}
            <div className="dashboard-surface dashboard-card relative overflow-hidden">
              <div className="flex items-start justify-between mb-10">
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                    {t.dashboard.products_v2.scatter.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {t.dashboard.products_v2.scatter.desc}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => explainSku(t.dashboard.products_v2.scatter.title)}
                    className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
                  >
                    {t.dashboard.context_menu.explain_ai}
                  </button>
                  <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                    <span>{t.dashboard.products_v2.scatter.size_label}</span>
                    <InfoButton label="Bubble size indicates sales volume" />
                  </div>
                </div>
              </div>

              {hasMultiSelect && (
                <div className="mb-6 flex flex-wrap items-center gap-3 animate-reveal">
                  <div className="px-4 py-2 rounded-2xl bg-brand-start/10 border border-brand-start/30 text-brand-start font-black text-xs uppercase tracking-widest flex items-center gap-3">
                    <span>
                      {t.dashboard.products_v2.scatter.multi_select_label}:{' '}
                      {selectedDetails.length} items
                    </span>
                    <div className="h-3 w-[1px] bg-brand-start/30" />
                    <button
                      type="button"
                      onClick={() => setSelectedSkus([])}
                      className="hover:scale-110 transition-transform"
                      aria-label="Clear selection"
                      title="Clear selection"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <InteractiveButton
                    variant="primary"
                    onClick={() =>
                      setAiDraft?.(
                        `Analyze comparison of ${selectedDetails.map((d) => d.name).join(', ')}`
                      )
                    }
                    className="!py-2 !px-4 !text-2xs font-black uppercase tracking-widest"
                  >
                    Compare with AI
                  </InteractiveButton>
                </div>
              )}

              <div className="relative">
                {/* 2D Matrix Grid */}
                <div className="relative h-[480px] rounded-[2rem] border border-black/5 dark:border-white/5 bg-gradient-to-br from-black/[0.01] to-black/[0.03] dark:from-white/[0.01] dark:to-white/[0.03] shadow-inner overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                    {Array.from({ length: 16 }).map((_, idx) => (
                      <div key={idx} className="border border-black/[0.03] dark:border-white/[0.03]" />
                    ))}
                  </div>

                  {/* Quadrant Labels */}
                  <div className="absolute top-6 right-6 text-xs font-black text-emerald-500/40 uppercase tracking-[0.2em]">
                    {t.dashboard.products_v2.scatter.hint_top_right}
                  </div>
                  <div className="absolute bottom-6 right-6 text-xs font-black text-brand-start/40 uppercase tracking-[0.2em]">
                    {t.dashboard.products_v2.scatter.hint_bottom_right}
                  </div>
                  <div className="absolute top-6 left-6 text-xs font-black text-amber-500/40 uppercase tracking-[0.2em]">
                    {t.dashboard.products_v2.scatter.hint_top_left}
                  </div>
                  <div className="absolute bottom-6 left-6 text-xs font-black text-rose-500/40 uppercase tracking-[0.2em]">
                    {t.dashboard.products_v2.scatter.hint_bottom_left}
                  </div>

                  {/* Nodes */}
                  {nodes.map((node) => (
                    <button
                      key={node.id}
                      type="button"
                      onClick={(event) => handleSelect(node.id, node.name, event.shiftKey)}
                      onMouseEnter={() => setHoveredSkuId(node.id)}
                      onMouseLeave={() => setHoveredSkuId(null)}
                      onContextMenu={(event) =>
                        openMenu(event, buildMenuItems(node.name, node.id), node.name)
                      }
                      className={`absolute rounded-full border-2 transition-all duration-500 shadow-xl group/node ${
                        selectedSkus.includes(node.id)
                          ? 'border-brand-start bg-brand-start text-white scale-125 z-30'
                          : 'border-brand-start/20 bg-brand-start/5 text-brand-start hover:border-brand-start hover:scale-110 z-20'
                      }`}
                      style={{
                        width: node.size,
                        height: node.size,
                        left: `${node.x}%`,
                        top: `${100 - node.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      aria-label={node.name}
                      title={node.name}
                    >
                      <div className="absolute inset-0 rounded-full bg-brand-start opacity-0 group-hover/node:opacity-10 transition-opacity" />
                    </button>
                  ))}

                  {/* Matrix Tooltip */}
                  {hoveredSku && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-2xl border border-brand-start/20 bg-white/95 dark:bg-[#0d0d12]/95 px-6 py-4 text-xs shadow-2xl backdrop-blur-xl animate-reveal min-w-[280px] z-50">
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight">
                          {hoveredSku.name}
                        </div>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            hoveredSku.trend > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                          } animate-pulse`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-2xs font-black text-gray-400 uppercase tracking-widest mb-0.5">
                            Net Profit
                          </div>
                          <div className="text-base font-black text-brand-start tracking-tighter">
                            {formatCurrencyValue(hoveredSku.profit)}
                          </div>
                        </div>
                        <div>
                          <div className="text-2xs font-black text-gray-400 uppercase tracking-widest mb-0.5">
                            Margin
                          </div>
                          <div className="text-base font-black text-gray-900 dark:text-white tracking-tighter">
                            {formatPercentValueLocal(hoveredSku.margin)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-black uppercase tracking-widest">
                        <span className="text-gray-500">Return Risk:</span>
                        <span className={hoveredSku.returns > 12 ? 'text-rose-500' : 'text-emerald-500'}>
                          {formatPercentValueLocal(hoveredSku.returns)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Axis Legends */}
                  <div className="absolute left-1/2 bottom-2 -translate-x-1/2 text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
                    {t.dashboard.products_v2.scatter.x_label}
                  </div>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
                    {t.dashboard.products_v2.scatter.y_label}
                  </div>
                </div>
              </div>
            </div>

            {/* Details Console */}
            <div className="space-y-6" id="products-details">
              <div className="flex items-center justify-between ml-2">
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {t.dashboard.products_v2.details.title}
                </h3>
                <button
                  type="button"
                  onClick={() => explainSku(t.dashboard.products_v2.details.title)}
                  className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
                >
                  {t.dashboard.context_menu.explain_ai}
                </button>
              </div>

              {selectedDetails.length === 0 ? (
                <div className="p-10 rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-white/40 dark:bg-[#0b0b0f] flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                    {t.dashboard.products_v2.details.empty}
                  </p>
                  <InteractiveButton
                    variant="secondary"
                    className="!text-xs font-black uppercase tracking-widest"
                    onClick={() => {
                      if (nodes[0]?.id) setSelectedSkus([nodes[0].id]);
                    }}
                    disabled={!nodes[0]?.id}
                    title={!nodes[0]?.id ? 'Brak danych SKU' : undefined}
                  >
                    Select Top Seller
                  </InteractiveButton>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDetails.map((item) => (
                    <div
                      key={item.id}
                      className="p-8 rounded-[2rem] bg-white/90 dark:bg-[#0b0b0f] border border-black/10 dark:border-white/10 shadow-xl animate-reveal relative overflow-hidden group"
                    >
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-8">
                          <div>
                            <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-2">
                              {item.name}
                            </h4>
                            <span className="text-xs font-mono font-black text-gray-500 uppercase tracking-widest">
                              {item.id}
                            </span>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-2xs font-black uppercase tracking-widest border ${
                              item.trend > 0
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                            }`}
                          >
                            Trend: {item.trend > 0 ? '+' : ''}
                            {item.trend}%
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-10">
                          <div className="space-y-1">
                            <div className="text-2xs font-black text-gray-400 uppercase tracking-widest">
                              {t.dashboard.products_v2.details.labels.profit}
                            </div>
                            <div className="text-2xl font-black text-brand-start tracking-tighter">
                              {formatCurrencyValue(item.profit)}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xs font-black text-gray-400 uppercase tracking-widest">
                              {t.dashboard.products_v2.details.labels.volume}
                            </div>
                            <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                              {item.volume} units
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-10 pt-8 border-t border-black/5 dark:border-white/5">
                          <div className="space-y-1">
                            <div className="text-2xs font-black text-gray-400 uppercase tracking-widest">
                              {t.dashboard.products_v2.details.labels.returns}
                            </div>
                            <div className="text-xl font-black text-gray-700 dark:text-gray-200">
                              {formatPercentValueLocal(item.returns)}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xs font-black text-gray-400 uppercase tracking-widest">
                              {t.dashboard.products_v2.details.labels.stock}
                            </div>
                            <div
                              className={`text-xl font-black ${
                                item.stockRisk === 'high' ? 'text-rose-500' : 'text-emerald-500'
                              }`}
                            >
                              {t.dashboard.products_v2.details.stock[item.stockRisk]}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <InteractiveButton
                            variant="primary"
                            onClick={() => explainSku(item.name)}
                            className="flex-1 !py-3 !text-xs font-black uppercase tracking-widest"
                          >
                            AI Audit
                          </InteractiveButton>
                          <InteractiveButton
                            variant="secondary"
                            className="!py-3 !text-xs font-black uppercase tracking-widest"
                            disabled={isDemo}
                            title={isDemo ? demoTooltip : undefined}
                          >
                            Set Alert
                          </InteractiveButton>
                        </div>

                        {isDemo && (
                          <div className="mt-4 text-xs font-black uppercase tracking-widest text-gray-400">
                            {demoTooltip}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </LazySection>

      {/* Movers and Table Row */}
      <LazySection fallback={cardSkeleton('h-40', 4)}>
        <section className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          {/* Movers Card */}
          <div className="dashboard-surface dashboard-card">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {t.dashboard.products_v2.movers.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {t.dashboard.products_v2.movers.desc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => explainSku(t.dashboard.products_v2.movers.title)}
                className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
              >
                {t.dashboard.context_menu.explain_ai}
              </button>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <div className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  {t.dashboard.products_v2.movers.rising_label}
                </div>
                {movers.rising.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex items-center justify-between group hover:border-emerald-500/30 transition-all cursor-pointer"
                    onClick={() => explainSku(m.label)}
                    onContextMenu={(event) => openMenu(event, buildMenuItems(m.label, m.id), m.label)}
                  >
                    <div>
                      <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-brand-start transition-colors">
                        {m.label}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">{m.driver}</div>
                    </div>
                    <div className="text-sm font-black text-emerald-500">{m.impact}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7-7v18" />
                  </svg>
                  {t.dashboard.products_v2.movers.falling_label}
                </div>
                {movers.falling.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex items-center justify-between group hover:border-rose-500/30 transition-all cursor-pointer"
                    onClick={() => explainSku(m.label)}
                    onContextMenu={(event) => openMenu(event, buildMenuItems(m.label, m.id), m.label)}
                  >
                    <div>
                      <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-brand-start transition-colors">
                        {m.label}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">{m.driver}</div>
                    </div>
                    <div className="text-sm font-black text-rose-500">{m.impact}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="dashboard-surface dashboard-card">
            <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {t.dashboard.products_v2.table.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {t.dashboard.products_v2.table.desc}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => explainSku(t.dashboard.products_v2.table.title)}
                  className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
                >
                  {t.dashboard.context_menu.explain_ai}
                </button>
                {t.dashboard.products_v2.table.filters.map((f: string) => (
                  <button
                    key={f}
                    type="button"
                    className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar scroll-hint">
              <table className="dashboard-table">
                <thead className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-black/5 dark:border-white/5">
                  <tr>
                    <th className="py-4 px-2">{t.dashboard.products_v2.table.columns.sku}</th>
                    <th className="py-4 px-2 text-right">{t.dashboard.products_v2.table.columns.revenue}</th>
                    <th className="py-4 px-2 text-right">{t.dashboard.products_v2.table.columns.margin}</th>
                    <th className="py-4 px-2 text-right">{t.dashboard.products_v2.table.columns.returns}</th>
                    <th className="py-4 px-2 text-right">{t.dashboard.products_v2.table.columns.stock}</th>
                    <th className="py-4 px-2 text-right">{t.dashboard.products_v2.table.columns.trend}</th>
                    <th className="py-4 px-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {nodes.slice(0, 8).map((row) => (
                    <tr
                      key={row.id}
                      className="group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors cursor-pointer"
                      onClick={() => handleSelect(row.id, row.name, false)}
                      onContextMenu={(event) => openMenu(event, buildMenuItems(row.name, row.id), row.name)}
                    >
                      <td className="py-5 px-2">
                        <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-brand-start transition-colors">
                          {row.name}
                        </div>
                        <div className="text-2xs font-mono text-gray-400 mt-1">{row.id}</div>
                      </td>
                      <td className="py-5 px-2 text-right font-black text-gray-700 dark:text-gray-300 tabular-nums">
                        {formatCurrencyValue(row.revenue)}
                      </td>
                      <td className="py-5 px-2 text-right font-black text-gray-700 dark:text-gray-300 tabular-nums">
                        {formatPercentValueLocal(row.margin)}
                      </td>
                      <td className="py-5 px-2 text-right font-black text-gray-700 dark:text-gray-300 tabular-nums">
                        {formatPercentValueLocal(row.returns)}
                      </td>
                      <td className="py-5 px-2 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-2xs font-black uppercase border ${
                            row.stockRisk === 'high'
                              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          }`}
                        >
                          {t.dashboard.products_v2.details.stock[row.stockRisk]}
                        </span>
                      </td>
                      <td
                        className={`py-5 px-2 text-right font-black tabular-nums ${
                          row.trend > 0 ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {row.trend > 0 ? '+' : ''}
                        {row.trend}%
                      </td>
                      <td className="py-5 px-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            explainSku(row.name);
                          }}
                          className="p-2 rounded-xl bg-brand-start/10 text-brand-start hover:bg-brand-start hover:text-white transition-all"
                          aria-label="Explain with AI"
                          title="Explain with AI"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </LazySection>

      <ContextMenu menu={menu} onClose={closeMenu} />
    </div>
  );
};

export default ProductsViewV2;
