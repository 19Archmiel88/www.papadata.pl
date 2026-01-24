// PandLViewV2.tsx
// Widok P&L: syntetyczne i szczegółowe spojrzenie na rentowność (przychody, koszty, marże).
// Łączy dane z API/mocków, buduje waterfall i kartę kosztów oraz wystawia kontekst dla AI/upgrade.

import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from './DashboardContext';
import { InteractiveButton } from '../InteractiveButton';
import { fetchDashboardPandL } from '../../data/api';
import type { DashboardPandLResponse } from '@papadata/shared';
import {
  ContextMenu,
  LazySection,
  WidgetSkeleton,
  WidgetErrorState,
  WidgetOfflineState,
} from './DashboardPrimitives';
import { clamp } from './DashboardPrimitives.constants';
import { useContextMenu } from './DashboardPrimitives.hooks';
import { captureException } from '../../utils/telemetry';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

const seeded = (i: number, timeSeed: number) => {
  const x = Math.sin((i + 1) * timeSeed) * 10000;
  return x - Math.floor(x);
};

type TabId = 'summary' | 'detailed';

type LineId =
  | 'revenue'
  | 'cogs'
  | 'fees'
  | 'refunds'
  | 'shipping'
  | 'adSpend'
  | 'payroll'
  | 'tools'
  | 'grossProfit'
  | 'contribution'
  | 'ebitda'
  | 'tax'
  | 'netProfit';

export const PandLViewV2: React.FC = () => {
  const { t, timeRange, isDemo, onUpgrade, setContextLabel, setAiDraft } =
    useOutletContext<DashboardOutletContext>();
  const isOnline = useOnlineStatus();

  const { menu, openMenu, closeMenu } = useContextMenu();

  const [activeTab, setActiveTab] = useState<TabId>('summary');
  const [pandlData, setPandlData] = useState<DashboardPandLResponse | null>(null);
  const [pandlError, setPandlError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  const demoTooltip = t?.dashboard?.demo_tooltip ?? 'Tryb demo — funkcja zablokowana.';
  const handleRetry = () => setRetryToken((prev) => prev + 1);

  const multi = useMemo(
    () => (timeRange === '1d' ? 0.12 : timeRange === '7d' ? 0.42 : 1),
    [timeRange]
  );
  const timeSeed = useMemo(
    () => (timeRange === '1d' ? 11 : timeRange === '7d' ? 29 : 61),
    [timeRange]
  );

  const locale = t?.langCode ?? 'pl-PL';
  const fmtCurrency = useMemo(() => (n: number) => formatCurrency(n, locale), [locale]);
  const fmtPercent = useMemo(() => (n: number) => formatPercent(n, locale, 1), [locale]);

  useEffect(() => {
    let active = true;
    fetchDashboardPandL({ timeRange })
      .then((data) => {
        if (!active) return;
        setPandlData(data);
        setPandlError(null);
      })
      .catch((err: any) => {
        if (!active) return;
        setPandlError(err?.message || t?.dashboard?.widget?.error_desc || 'Wystąpił błąd.');
      });
    return () => {
      active = false;
    };
  }, [timeRange, retryToken, t]);

  useEffect(() => {
    if (pandlError) {
      captureException(new Error(pandlError), { scope: 'pandl' });
    }
  }, [pandlError]);

  const fallbackPnl = useMemo(() => {
    const revenue = 3_735_000 * multi * (0.92 + seeded(8, timeSeed) * 0.16);

    const cogsRate = clamp(
      0.43 +
        (seeded(9, timeSeed) - 0.5) * 0.05 +
        (timeRange === '1d' ? 0.015 : timeRange === '30d' ? -0.01 : 0),
      0.38,
      0.5
    );
    const feeRate = clamp(0.06 + (seeded(10, timeSeed) - 0.5) * 0.015, 0.045, 0.08);
    const refundRate = clamp(0.018 + (seeded(11, timeSeed) - 0.5) * 0.008, 0.01, 0.035);
    const shippingRate = clamp(0.03 + (seeded(12, timeSeed) - 0.5) * 0.012, 0.02, 0.05);
    const adRate = clamp(
      0.12 +
        (seeded(13, timeSeed) - 0.5) * 0.03 +
        (timeRange === '1d' ? 0.01 : timeRange === '30d' ? -0.01 : 0),
      0.09,
      0.16
    );

    const overheadFactor = timeRange === '1d' ? 0.28 : timeRange === '7d' ? 0.62 : 1;

    const cogs = revenue * cogsRate;
    const fees = revenue * feeRate;
    const refunds = revenue * refundRate;
    const shipping = revenue * shippingRate;
    const adSpend = revenue * adRate;

    const payroll = 420_000 * overheadFactor;
    const tools = 75_000 * overheadFactor;

    const grossProfit = revenue - cogs - fees - refunds - shipping;
    const contribution = grossProfit - adSpend;
    const ebitda = contribution - payroll - tools;
    const tax = ebitda > 0 ? ebitda * 0.19 : 0;
    const netProfit = ebitda - tax;

    const safeRevenue = revenue || 1;

    return {
      revenue,
      cogs,
      fees,
      refunds,
      shipping,
      adSpend,
      payroll,
      tools,
      grossProfit,
      contribution,
      ebitda,
      tax,
      netProfit,
      grossMargin: grossProfit / safeRevenue,
      netMargin: netProfit / safeRevenue,
      contributionMargin: contribution / safeRevenue,
    };
  }, [multi, timeRange, timeSeed]);

  const pnl = useMemo(() => {
    if (!pandlData) return fallbackPnl;

    const revenue = pandlData?.summary?.revenue ?? fallbackPnl.revenue;
    const breakdown = pandlData?.breakdown;

    const cogs = breakdown?.cogs ?? fallbackPnl.cogs;
    const fees = breakdown?.fees ?? fallbackPnl.fees;
    const refunds = breakdown?.refunds ?? fallbackPnl.refunds;
    const shipping = breakdown?.shipping ?? fallbackPnl.shipping;
    const adSpend = breakdown?.adSpend ?? fallbackPnl.adSpend;
    const payroll = breakdown?.payroll ?? fallbackPnl.payroll;
    const tools = breakdown?.tools ?? fallbackPnl.tools;

    const grossProfit = pandlData?.summary?.grossProfit ?? fallbackPnl.grossProfit;
    const netProfit = pandlData?.summary?.netProfit ?? fallbackPnl.netProfit;
    const tax = pandlData?.summary?.tax ?? fallbackPnl.tax;

    const contribution = grossProfit - adSpend;
    const ebitda = contribution - payroll - tools;

    const safeRevenue = revenue || 1;

    return {
      revenue,
      cogs,
      fees,
      refunds,
      shipping,
      adSpend,
      payroll,
      tools,
      grossProfit,
      contribution,
      ebitda,
      tax,
      netProfit,
      grossMargin: grossProfit / safeRevenue,
      netMargin: pandlData?.summary?.netMargin ?? netProfit / safeRevenue,
      contributionMargin: pandlData?.summary?.contributionMargin ?? contribution / safeRevenue,
    };
  }, [pandlData, fallbackPnl]);

  const labels = useMemo(() => {
    const d = t?.dashboard ?? ({} as any);
    return {
      title: d.pnl_title ?? 'P&L',
      model: d.pnl_model ?? 'MODEL',
      tabSummary: d.pnl_tab_summary ?? 'Summary',
      tabDetail: d.pnl_tab_detail ?? 'Detailed',
      netMargin: d.pnl_net_margin_label ?? 'Net margin',
      contributionMargin: d.pnl_contribution_margin_label ?? 'Contribution',
      taxEst: d.pnl_tax_est_label ?? 'Tax est.',
      liveCalc: d.pnl_live_calculation ?? 'Live',
      waterfall: d.pnl_waterfall ?? 'Waterfall',
      costBreakdown: d.pnl_cost_breakdown ?? 'Cost breakdown',
      dimCategory: d.pnl_dim_category ?? 'DIM: category',
      ebitdaLabel: d.pnl_ebitda_label ?? 'EBITDA',
      analyzeProfit: d.pnl_analyze_profitability ?? 'Analyze profitability',
      exportLive: d.pnl_export_live ?? 'Upgrade',
      exportAuditPdf: d.pnl_export_audit_pdf ?? 'Export audit PDF',
      revenue: d.pnl_revenue ?? 'Revenue',
      cogs: d.pnl_cogs ?? 'COGS',
      fees: d.pnl_fees ?? 'Fees',
      refunds: d.pnl_refunds ?? 'Refunds',
      shipping: d.pnl_shipping ?? 'Shipping',
      adSpend: d.pnl_ad_spend ?? 'Ad spend',
      payroll: d.pnl_payroll ?? 'Payroll',
      tools: d.pnl_tools ?? 'Tools',
      grossProfit: d.pnl_gross_profit ?? 'Gross profit',
      netProfit: d.pnl_net_profit ?? 'Net profit',
      statusStable: d.pnl_status_stable ?? 'Stable',
      statusHigh: d.pnl_status_high ?? 'High',
      statusFixed: d.pnl_status_fixed ?? 'Fixed',
      contextMenuExplain: d?.context_menu?.explain_ai ?? 'Explain AI',
      contextMenuDrill: d?.context_menu?.drill ?? 'Drill',
      contextMenuSetAlert: d?.context_menu?.set_alert ?? 'Set alert',
      contextMenuAddReport: d?.context_menu?.add_report ?? 'Add to report',
      widgetErrorTitle: d?.widget?.error_title ?? 'Błąd',
      widgetErrorDesc: d?.widget?.error_desc ?? 'Nie udało się załadować danych.',
      widgetRetry: d?.widget?.cta_retry ?? 'Spróbuj ponownie',
    };
  }, [t]);

  const handleExplain = (label: string, value: string) => {
    const context = (t?.dashboard?.pnl_context_template ?? 'P&L Line: {label} ({value})')
      .replace('{label}', label)
      .replace('{value}', value);

    setContextLabel?.(context);

    const promptTemplate =
      t?.dashboard?.pnl_ai_prompt_template ??
      'Analyze the P&L line {label}. Is the value {value} optimal for revenue {revenue}?';

    setAiDraft?.(
      promptTemplate
        .replace('{label}', label)
        .replace('{value}', value)
        .replace('{revenue}', fmtCurrency(pnl.revenue))
    );
  };

  const buildMenuItems = (label: string, value: string) => [
    {
      id: 'drill',
      label: labels.contextMenuDrill,
      onSelect: () => {},
      disabled: true,
      disabledReason: 'W przygotowaniu',
    },
    {
      id: 'explain',
      label: labels.contextMenuExplain,
      onSelect: () => handleExplain(label, value),
      tone: 'primary' as const,
    },
    {
      id: 'alert',
      label: labels.contextMenuSetAlert,
      onSelect: () => {},
      disabled: true,
      disabledReason: isDemo ? demoTooltip : 'W przygotowaniu',
    },
    {
      id: 'report',
      label: labels.contextMenuAddReport,
      onSelect: () => {},
      disabled: true,
      disabledReason: isDemo ? demoTooltip : 'W przygotowaniu',
    },
  ];

  const waterfall = useMemo(
    () => [
      { id: 'revenue' as const, label: labels.revenue, val: pnl.revenue },
      { id: 'cogs' as const, label: labels.cogs, val: -pnl.cogs },
      { id: 'fees' as const, label: labels.fees, val: -pnl.fees },
      { id: 'refunds' as const, label: labels.refunds, val: -pnl.refunds },
      { id: 'shipping' as const, label: labels.shipping, val: -pnl.shipping },
      { id: 'adSpend' as const, label: labels.adSpend, val: -pnl.adSpend },
      { id: 'payroll' as const, label: labels.payroll, val: -pnl.payroll },
      { id: 'tools' as const, label: labels.tools, val: -pnl.tools },
    ],
    [labels, pnl]
  );

  const safeMaxAbs = useMemo(() => {
    const maxAbs = Math.max(...waterfall.map((w) => Math.abs(w.val)));
    return maxAbs || 1;
  }, [waterfall]);

  const detailLines = useMemo(() => {
    const revenueSafe = pnl.revenue || 1;

    const lines: Array<{
      id: LineId;
      label: string;
      value: number;
      isCost?: boolean;
      pctOfRevenue?: number | null;
      tone?: 'pos' | 'neg' | 'neutral';
    }> = [
      { id: 'revenue', label: labels.revenue, value: pnl.revenue, isCost: false, pctOfRevenue: 1, tone: 'pos' },
      { id: 'cogs', label: labels.cogs, value: pnl.cogs, isCost: true, pctOfRevenue: pnl.cogs / revenueSafe, tone: 'neg' },
      { id: 'fees', label: labels.fees, value: pnl.fees, isCost: true, pctOfRevenue: pnl.fees / revenueSafe, tone: 'neg' },
      { id: 'refunds', label: labels.refunds, value: pnl.refunds, isCost: true, pctOfRevenue: pnl.refunds / revenueSafe, tone: 'neg' },
      { id: 'shipping', label: labels.shipping, value: pnl.shipping, isCost: true, pctOfRevenue: pnl.shipping / revenueSafe, tone: 'neg' },
      { id: 'grossProfit', label: labels.grossProfit, value: pnl.grossProfit, isCost: false, pctOfRevenue: pnl.grossMargin, tone: 'pos' },
      { id: 'adSpend', label: labels.adSpend, value: pnl.adSpend, isCost: true, pctOfRevenue: pnl.adSpend / revenueSafe, tone: 'neg' },
      { id: 'contribution', label: 'Contribution', value: pnl.contribution, isCost: false, pctOfRevenue: pnl.contributionMargin, tone: 'pos' },
      { id: 'payroll', label: labels.payroll, value: pnl.payroll, isCost: true, pctOfRevenue: pnl.payroll / revenueSafe, tone: 'neg' },
      { id: 'tools', label: labels.tools, value: pnl.tools, isCost: true, pctOfRevenue: pnl.tools / revenueSafe, tone: 'neg' },
      { id: 'ebitda', label: labels.ebitdaLabel, value: pnl.ebitda, isCost: false, pctOfRevenue: pnl.ebitda / revenueSafe, tone: pnl.ebitda >= 0 ? 'pos' : 'neg' },
      { id: 'tax', label: 'Tax', value: pnl.tax, isCost: true, pctOfRevenue: pnl.tax / revenueSafe, tone: 'neg' },
      { id: 'netProfit', label: labels.netProfit, value: pnl.netProfit, isCost: false, pctOfRevenue: pnl.netMargin, tone: pnl.netProfit >= 0 ? 'pos' : 'neg' },
    ];

    return lines;
  }, [labels, pnl]);

  const handleRowKey = (event: React.KeyboardEvent, onActivate: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate();
    }
  };

  return (
    <div className="space-y-8 animate-reveal">
      {/* Dynamic Header Summary */}
      <section className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0b0b0f] p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
              {labels.title}
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-black text-gray-500 tracking-[0.3em] uppercase">
                {labels.model}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleExplain(labels.title, fmtCurrency(pnl.netProfit))}
            className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
          >
            {labels.contextMenuExplain}
          </button>

          <div className="flex gap-4">
            <div className="text-right">
              <span className="text-2xs font-black text-gray-400 uppercase tracking-widest block">
                {labels.contributionMargin}
              </span>
              <span className="text-xl font-black text-gray-900 dark:text-white">
                {fmtPercent(pnl.contributionMargin)}
              </span>
            </div>
            <div className="w-[1px] h-10 bg-black/10 dark:bg-white/10" />
            <div className="text-right">
              <span className="text-2xs font-black text-gray-400 uppercase tracking-widest block">
                {labels.taxEst}
              </span>
              <span className="text-xl font-black text-rose-500">-{fmtCurrency(pnl.tax)}</span>
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

      {isOnline && pandlError && (
        <section className="rounded-[2.5rem] border border-rose-500/20 bg-rose-500/5 p-6 shadow-xl">
          <WidgetErrorState
            title={labels.widgetErrorTitle}
            desc={labels.widgetErrorDesc}
            actionLabel={labels.widgetRetry}
            onAction={handleRetry}
          />
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Main P&L Console */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass p-10 rounded-[3rem] border border-black/10 dark:border-white/5 bg-white/50 dark:bg-black/30 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
              <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10" role="tablist" aria-label="P&L tabs">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'summary'}
                  onClick={() => setActiveTab('summary')}
                  className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                    activeTab === 'summary'
                      ? 'bg-white dark:bg-white/10 shadow-xl text-brand-start dark:text-white'
                      : 'text-gray-500'
                  }`}
                >
                  {labels.tabSummary}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'detailed'}
                  onClick={() => setActiveTab('detailed')}
                  className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                    activeTab === 'detailed'
                      ? 'bg-white dark:bg-white/10 shadow-xl text-brand-start dark:text-white'
                      : 'text-gray-500'
                  }`}
                >
                  {labels.tabDetail}
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleExplain(labels.waterfall, fmtCurrency(pnl.netProfit))}
                className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
              >
                {labels.contextMenuExplain}
              </button>

              <div className="text-right">
                <span className="text-xs font-mono font-black text-gray-500 uppercase tracking-widest block mb-1">
                  {labels.netMargin}
                </span>
                <span className="text-5xl font-black tracking-tighter text-brand-start">
                  {fmtPercent(pnl.netMargin)}
                </span>
              </div>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { label: labels.revenue, val: pnl.revenue, color: 'text-gray-900 dark:text-white' },
                { label: labels.grossProfit, val: pnl.grossProfit, color: 'text-gray-900 dark:text-white' },
                { label: labels.netProfit, val: pnl.netProfit, color: 'text-brand-start' },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="p-6 rounded-[2rem] border border-black/5 dark:border-white/5 bg-white/40 dark:bg-white/[0.02] group hover:border-brand-start/30 transition-all cursor-pointer"
                  onClick={() => handleExplain(kpi.label, fmtCurrency(kpi.val))}
                  onKeyDown={(e) => handleRowKey(e, () => handleExplain(kpi.label, fmtCurrency(kpi.val)))}
                  role="button"
                  tabIndex={0}
                >
                  <span className="text-2xs font-black text-gray-500 uppercase tracking-widest block mb-2">
                    {kpi.label}
                  </span>
                  <span className={`text-2xl font-black tracking-tighter ${kpi.color}`}>
                    {fmtCurrency(kpi.val)}
                  </span>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-1 flex-1 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full brand-gradient-bg opacity-40" style={{ width: '70%' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'summary' ? (
              <div className="p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-black/40">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs-plus font-black uppercase tracking-[0.2em] text-gray-400">
                    {labels.waterfall}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-2xs font-mono font-black text-emerald-500 uppercase tracking-widest">
                    {labels.liveCalc}
                  </span>
                </div>

                <div className="space-y-5">
                  {waterfall.map((w, idx) => {
                    const width = (Math.abs(w.val) / safeMaxAbs) * 100;
                    const isNeg = w.val < 0;
                    const valueStr = fmtCurrency(w.val);

                    const onActivate = () => handleExplain(w.label, valueStr);

                    return (
                      <div
                        key={idx}
                        className="group/row relative grid grid-cols-12 items-center gap-4 cursor-pointer"
                        onClick={onActivate}
                        onKeyDown={(e) => handleRowKey(e, onActivate)}
                        onContextMenu={(e) => openMenu(e, buildMenuItems(w.label, valueStr), w.label)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="col-span-3 text-xs font-black uppercase tracking-widest text-gray-500 group-hover/row:text-brand-start transition-colors">
                          {w.label}
                        </div>
                        <div className="col-span-7 flex items-center gap-3">
                          <div className="h-4 flex-1 bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden border border-black/5 dark:border-white/10 relative">
                            <div
                              className={`h-full transition-all duration-1000 ${
                                isNeg ? 'bg-rose-500/40' : 'brand-gradient-bg opacity-60'
                              }`}
                              style={{ width: `${clamp(width, 2, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div
                          className={`col-span-2 text-right font-mono text-xs-plus font-black ${
                            isNeg ? 'text-rose-500' : 'text-emerald-500'
                          }`}
                        >
                          {w.val >= 0 ? '+' : ''}
                          {valueStr}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-black/40">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs-plus font-black uppercase tracking-[0.2em] text-gray-400">
                    Detailed P&L
                  </span>
                  <span className="text-2xs font-mono font-black text-gray-400 uppercase tracking-widest">
                    % of revenue + line value
                  </span>
                </div>

                <div className="overflow-x-auto no-scrollbar scroll-hint">
                  <table className="w-full text-left border-collapse">
                    <thead className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-black/5 dark:border-white/5">
                      <tr>
                        <th className="py-4 px-2">Line</th>
                        <th className="py-4 px-2 text-right">Value</th>
                        <th className="py-4 px-2 text-right">% Revenue</th>
                        <th className="py-4 px-2" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      {detailLines.map((line) => {
                        const valueStr = fmtCurrency(line.value);
                        const pctStr =
                          typeof line.pctOfRevenue === 'number' && Number.isFinite(line.pctOfRevenue)
                            ? fmtPercent(line.pctOfRevenue)
                            : '--';

                        const tone =
                          line.tone === 'pos'
                            ? 'text-emerald-500'
                            : line.tone === 'neg'
                            ? 'text-rose-500'
                            : 'text-gray-400';

                        const onActivate = () => handleExplain(line.label, `${valueStr} (${pctStr})`);

                        return (
                          <tr
                            key={line.id}
                            className="group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors cursor-pointer"
                            onClick={onActivate}
                            onKeyDown={(e) => handleRowKey(e, onActivate)}
                            onContextMenu={(e) =>
                              openMenu(e, buildMenuItems(line.label, `${valueStr} (${pctStr})`), line.label)
                            }
                            role="button"
                            tabIndex={0}
                          >
                            <td className="py-4 px-2">
                              <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-brand-start transition-colors">
                                {line.label}
                              </div>
                              <div className="text-2xs font-mono text-gray-400 mt-1 uppercase tracking-widest">
                                {line.isCost ? 'COST' : 'RESULT'}
                              </div>
                            </td>
                            <td className={`py-4 px-2 text-right font-mono text-sm2 font-black tabular-nums ${tone}`}>
                              {line.isCost ? '-' : ''}
                              {valueStr}
                            </td>
                            <td className="py-4 px-2 text-right text-xs-plus font-black text-gray-500 tabular-nums">
                              {pctStr}
                            </td>
                            <td className="py-4 px-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleExplain(line.label, `${valueStr} (${pctStr})`);
                                }}
                                className="p-2 rounded-xl bg-brand-start/10 text-brand-start hover:bg-brand-start hover:text-white transition-all"
                                aria-label={labels.contextMenuExplain}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 grid sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white/40 dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                    <div className="text-2xs font-black text-gray-400 uppercase tracking-widest mb-1">
                      Gross margin
                    </div>
                    <div className="text-xl font-black text-gray-900 dark:text-white">
                      {fmtPercent(pnl.grossMargin)}
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/40 dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                    <div className="text-2xs font-black text-gray-400 uppercase tracking-widest mb-1">
                      Contribution margin
                    </div>
                    <div className="text-xl font-black text-gray-900 dark:text-white">
                      {fmtPercent(pnl.contributionMargin)}
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/40 dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                    <div className="text-2xs font-black text-gray-400 uppercase tracking-widest mb-1">
                      Net margin
                    </div>
                    <div className="text-xl font-black text-brand-start">{fmtPercent(pnl.netMargin)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Cost Analysis */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass p-10 rounded-[3rem] border border-black/10 dark:border-white/5 bg-white/50 dark:bg-black/30 flex flex-col h-full">
            <div className="mb-8">
              <h3 className="text-base font-black uppercase tracking-tight text-gray-900 dark:text-white mb-1">
                {typeof labels.costBreakdown === 'string' ? labels.costBreakdown : String(labels.costBreakdown)}
              </h3>
              <span className="text-3xs font-mono font-black text-gray-500 tracking-[0.3em] uppercase">
                {labels.dimCategory}
              </span>
            </div>

            <div className="space-y-4 flex-1">
              {[
                {
                  id: 'cogs',
                  label: labels.cogs,
                  v: pnl.cogs,
                  pct: pnl.cogs / (pnl.revenue || 1),
                  status: labels.statusStable,
                },
                {
                  id: 'ads',
                  label: labels.adSpend,
                  v: pnl.adSpend,
                  pct: pnl.adSpend / (pnl.revenue || 1),
                  status: labels.statusHigh,
                },
                {
                  id: 'shipping',
                  label: labels.shipping,
                  v: pnl.shipping,
                  pct: pnl.shipping / (pnl.revenue || 1),
                  status: labels.statusStable,
                },
                {
                  id: 'payroll',
                  label: labels.payroll,
                  v: pnl.payroll,
                  pct: pnl.payroll / (pnl.revenue || 1),
                  status: labels.statusFixed,
                },
              ].map((item) => {
                const onActivate = () => handleExplain(item.label, fmtCurrency(item.v));
                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 group/cost hover:border-brand-start/40 transition-all cursor-pointer"
                    onClick={onActivate}
                    onKeyDown={(e) => handleRowKey(e, onActivate)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover/cost:text-brand-start">
                        {item.label}
                      </span>
                      <span
                        className={`text-3xs font-black px-2 py-0.5 rounded-full border ${
                          item.status === labels.statusHigh
                            ? 'text-amber-500 border-amber-500/20 bg-amber-500/5'
                            : 'text-gray-500 border-white/10'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-lg font-black text-gray-900 dark:text-white tracking-tighter">
                        {fmtCurrency(item.v)}
                      </span>
                      <span className="text-xs font-black text-brand-start">
                        {Math.round(item.pct * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 pt-8 border-t border-black/5 dark:border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                  {labels.ebitdaLabel}
                </span>
                <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                  {fmtCurrency(pnl.ebitda)}
                </span>
              </div>

              <InteractiveButton
                variant="secondary"
                onClick={() => handleExplain(labels.ebitdaLabel, fmtCurrency(pnl.ebitda))}
                className="w-full !py-3 !text-xs font-black tracking-widest uppercase rounded-xl"
              >
                {labels.analyzeProfit}
              </InteractiveButton>

              <button
                type="button"
                onClick={() => handleExplain(labels.ebitdaLabel, fmtCurrency(pnl.ebitda))}
                className="text-xs font-black uppercase tracking-widest text-brand-start hover:underline"
              >
                {labels.contextMenuExplain}
              </button>
            </div>
          </div>
        </div>
      </div>

      <LazySection fallback={<WidgetSkeleton chartHeight="h-20" lines={1} />}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {isDemo && (
            <InteractiveButton
              variant="primary"
              onClick={() => onUpgrade?.()}
              className="!px-12 !py-6 !text-xs font-black tracking-[0.4em] uppercase rounded-3xl shadow-[0_20px_50px_rgba(78,38,226,0.3)] hover:scale-105 transition-transform"
            >
              {labels.exportLive}
            </InteractiveButton>
          )}
          <button
            type="button"
            className={`text-xs font-black text-gray-500 uppercase tracking-[0.3em] transition-colors ${
              isDemo ? 'opacity-40 cursor-not-allowed' : 'hover:text-brand-start'
            }`}
            disabled={isDemo}
            title={isDemo ? demoTooltip : undefined}
          >
            {labels.exportAuditPdf}
          </button>
        </div>
      </LazySection>

      <ContextMenu menu={menu} onClose={closeMenu} />
    </div>
  );
};

export default PandLViewV2;
