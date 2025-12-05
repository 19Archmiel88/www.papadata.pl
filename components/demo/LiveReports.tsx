import React, { useEffect, useMemo, useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { DemoTranslation, Language } from '../../types';
import { motion } from 'framer-motion';

type ReportView = 'sales' | 'campaigns' | 'customers' | 'technical';

interface Props {
  t: DemoTranslation['reports'];
  initialTab?: ReportView;
  onTabChange?: (tab: ReportView) => void;
  lang: Language;
  dateRange: 'today' | 'last7' | 'last30';
  integrationAlert?: string | null;
}

const LiveReports: React.FC<Props> = ({ t, initialTab = 'sales', onTabChange, lang, dateRange, integrationAlert }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<ReportView>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const changeTab = (tab: ReportView) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const isEnglish = lang === 'EN';
  const multiplier = dateRange === 'today' ? 0.2 : dateRange === 'last7' ? 0.6 : 1;
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(isEnglish ? 'en-US' : 'pl-PL'),
    [isEnglish],
  );

  const stats = useMemo(() => {
    const base = [
      { key: 'revenue', label: isEnglish ? 'Revenue' : 'Przychód', value: 124592, currency: true, trend: 12.5 },
      { key: 'spend', label: isEnglish ? 'Marketing spend' : 'Wydatki marketingowe', value: 24320, currency: true, trend: -3.4 },
      { key: 'orders', label: isEnglish ? 'Orders' : 'Zamówienia', value: 510, currency: false, trend: 8.2 },
      { key: 'cr', label: isEnglish ? 'Conversion rate' : 'Współczynnik konwersji', value: 2.4, currency: false, suffix: '%', trend: 0.6 },
    ];
    return base.map((item) => {
      const factor = item.key === 'cr' ? multiplier * 1.15 : multiplier;
      const adjusted = item.value * factor;
      const displayValue = item.currency
        ? `PLN ${numberFormatter.format(Math.max(1, Math.round(adjusted)))}`
        : item.suffix
          ? `${adjusted.toFixed(2)}${item.suffix}`
          : numberFormatter.format(Math.max(1, Math.round(adjusted)));
      const trendVal = Number((item.trend * (0.7 + multiplier / 1.5)).toFixed(1));
      return { ...item, displayValue, trendVal, positive: item.trend >= 0 };
    });
  }, [isEnglish, multiplier, numberFormatter]);

  const columns = useMemo(() => {
    const presets: Record<'today' | 'last7' | 'last30', number[]> = {
      today: [30, 24, 28, 22, 34, 32, 30, 36, 28, 34, 32, 38],
      last7: [44, 46, 48, 52, 50, 56, 60, 58, 62, 64, 66, 68],
      last30: [58, 64, 62, 70, 72, 74, 78, 80, 76, 82, 84, 86],
    };
    return presets[dateRange];
  }, [dateRange]);

  if (!unlocked) {
    return (
      <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden">
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 p-6 blur-md opacity-50 pointer-events-none select-none">
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-300 dark:bg-slate-800 rounded-xl" />
            ))}
          </div>
          <div className="h-96 bg-slate-300 dark:bg-slate-800 rounded-xl mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-slate-300 dark:bg-slate-800 rounded-xl" />
            <div className="h-64 bg-slate-300 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-8 rounded-2xl max-w-lg text-center shadow-2xl">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t.gated.title}</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">{t.gated.text}</p>

            <div className="flex flex-col gap-3">
              <a
                href="/wizard"
                className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary-500/25"
              >
                {t.gated.btnUnlock}
              </a>
              <button
                onClick={() => setUnlocked(true)}
                className="w-full py-3 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors"
              >
                {t.gated.btnDemo}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-amber-100 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800/50 px-6 py-2 flex items-center justify-between">
        <span className="text-sm font-medium text-amber-800 dark:text-amber-400 flex items-center gap-2">
          <Unlock className="w-4 h-4" /> {t.sandbox.info}
        </span>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-xs text-amber-700 dark:text-amber-300">{t.sandbox.highlight}</span>
          <a
            href="/wizard"
            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded transition-colors"
          >
            {t.sandbox.btnCreate}
          </a>
        </div>
      </div>

        <div className="p-6 space-y-6">
        {integrationAlert && (
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 dark:border-rose-700 dark:bg-rose-900/30 text-rose-700 dark:text-rose-100 px-4 py-3 text-sm">
            {integrationAlert}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm"
            >
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {stat.label}
              </p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-xl font-semibold text-slate-900 dark:text-white">{stat.displayValue}</span>
                <span
                  className={`text-xs font-semibold flex items-center gap-1 ${
                    stat.trendVal >= 0 ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  <span>
                    {stat.trendVal >= 0 ? '+' : ''}
                    {stat.trendVal}%
                  </span>
                </span>
              </div>
              <div className="mt-3 h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                <div
                  className={`${stat.trendVal >= 0 ? 'bg-emerald-400' : 'bg-rose-400'} h-full rounded-full`}
                  style={{ width: `${Math.min(100, 45 + Math.abs(stat.trendVal) * 2)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          {([
            ['sales', t.sandbox.tabs.sales],
            ['campaigns', t.sandbox.tabs.campaigns],
            ['customers', t.sandbox.tabs.customers],
            ['technical', t.sandbox.tabs.technical],
          ] as [ReportView, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => changeTab(key)}
              className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 h-96 p-4">
            <div className="flex justify-between mb-4 items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {activeTab === 'sales'
                    ? isEnglish
                      ? 'Sales & spend trend'
                      : 'Trend sprzedaży i wydatków'
                    : isEnglish
                      ? 'Engagement trend'
                      : 'Trend zaangażowania'}
                </p>
                <p className="text-[11px] text-slate-500">{t.gated.title}</p>
              </div>
              <span className="px-2 py-1 text-[11px] rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500">
                {dateRange === 'today'
                  ? isEnglish ? 'Today' : 'Dziś'
                  : dateRange === 'last7'
                    ? isEnglish ? 'Last 7 days' : 'Ostatnie 7 dni'
                    : isEnglish ? 'Last 30 days' : 'Ostatnie 30 dni'}
              </span>
            </div>
            <div className="h-full flex items-end justify-between px-2 pb-8 gap-2">
              {columns.map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.6, delay: i * 0.02 }}
                  className="w-full rounded-t bg-gradient-to-t from-primary-500/40 via-primary-400/60 to-primary-300/80"
                />
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 h-44 p-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                {isEnglish ? 'Filters (demo)' : 'Filtry (demo)'}
              </p>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>{isEnglish ? 'Channel' : 'Kanał'}</span>
                  <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-900">
                    {isEnglish ? 'Google Ads' : 'Google Ads'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{isEnglish ? 'Campaign type' : 'Typ kampanii'}</span>
                  <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-900">
                    {isEnglish ? 'Brand / Prospecting' : 'Brand / Prospecting'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{isEnglish ? 'Country' : 'Kraj'}</span>
                  <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-900">PL / DE</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 h-44 p-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                {isEnglish ? 'Performance pulse' : 'Puls wyników'}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-[6px] border-emerald-400 relative flex items-center justify-center">
                  <span className="text-sm font-bold text-emerald-600">92</span>
                </div>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <p>{isEnglish ? 'Demo quality score for this view.' : 'Demo wynik jakości dla tego widoku.'}</p>
                  <p className="text-emerald-500 font-semibold">
                    {isEnglish ? 'Stable +1.2% vs previous period' : 'Stabilny +1,2% vs poprzedni okres'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveReports;
