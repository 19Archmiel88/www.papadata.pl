import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles, ArrowRight, TrendingUp, TrendingDown, Send, Loader2 } from 'lucide-react';
import {
  DemoTranslation,
  Language,
  IntegrationHealthMap,
} from '../../types';
import { motion } from 'framer-motion';
import RevenueChart from '../RevenueChart';
import CategoryChart from '../CategoryChart';
import CustomerChart from '../CustomerChart';
import SalesTable from '../SalesTable';
import KPICard from '../KPICard';
import {
  getRevenueTrend,
  getCategoryBreakdown,
  getCustomerAcquisition,
  getTopProducts,
  getKpiSummary,
} from './mockDashboardData';

interface Props {
  t: DemoTranslation['dashboard'];
  dateRange: 'today' | 'last7' | 'last30';
  lang?: Language;
  highlightAI?: boolean;
  integrationHealth?: IntegrationHealthMap;
  integrationAlert?: string | null;
  needsReauth?: boolean;
}

const DashboardHome: React.FC<Props> = ({
  t,
  dateRange,
  highlightAI,
  lang = 'PL',
  integrationAlert,
  needsReauth,
}) => {
  const [aiState, setAiState] = useState<'loading' | 'ready'>(highlightAI ? 'ready' : 'loading');
  const [multiplier, setMultiplier] = useState(1);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [askOpen, setAskOpen] = useState(false);
  const isEnglish = lang === 'EN';
  const revenueData = getRevenueTrend(dateRange);
  const categoryData = getCategoryBreakdown(dateRange);
  const customerData = getCustomerAcquisition(dateRange);
  const products = getTopProducts(dateRange);
  const kpiSummary = getKpiSummary(dateRange, isEnglish);

  useEffect(() => {
    setAiState(highlightAI ? 'ready' : 'loading');
    if (!highlightAI) {
      const timer = setTimeout(() => setAiState('ready'), 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightAI]);

  useEffect(() => {
    if (!highlightAI) {
      setAiState('loading');
      const timer = setTimeout(() => setAiState('ready'), 1200);
      return () => clearTimeout(timer);
    }
  }, [dateRange, highlightAI]);

  useEffect(() => {
    // Adjust numbers based on date range
    if (dateRange === 'today') setMultiplier(0.05);
    else if (dateRange === 'last7') setMultiplier(0.25);
    else setMultiplier(1);
  }, [dateRange]);

  const locale = lang === 'EN' ? 'en-US' : 'pl-PL';
  const rangeLabel =
    lang === 'EN'
      ? dateRange === 'today'
        ? 'the last 24 hours'
        : dateRange === 'last7'
          ? 'the last 7 days'
          : 'the last 30 days'
      : dateRange === 'today'
        ? 'ostatnich 24 godzin'
        : dateRange === 'last7'
          ? 'ostatnich 7 dni'
          : 'ostatnich 30 dni';
  const aiStatusText = lang === 'EN' ? `Analyzing data from ${rangeLabel}...` : `Analizuję dane z ${rangeLabel}...`;

  const kpis = [
    { label: t.kpi.revenue, value: 124592.0, format: 'PLN', trend: 12.5, isGood: true },
    { label: t.kpi.spend, value: 24320.0, format: 'PLN', trend: -4.2, isGood: true },
    { label: t.kpi.roas, value: 5.12, format: '', trend: 8.4, isGood: true },
    { label: t.kpi.aov, value: 245.5, format: 'PLN', trend: -1.2, isGood: false },
    { label: t.kpi.margin, value: 42.0, format: '%', trend: 0.5, isGood: true },
  ];

  const insights = useMemo(() => [t.ai.insight1, t.ai.insight2], [t.ai.insight1, t.ai.insight2]);
  const [activeInsight, setActiveInsight] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveInsight((prev) => (prev + 1) % insights.length), 7000);
    return () => clearInterval(timer);
  }, [insights.length]);

  const formatVal = (val: number, format: string) => {
    const adjusted = val * multiplier;
    if (format === 'PLN') {
      return `${adjusted.toLocaleString(locale, { maximumFractionDigits: 0 })} PLN`;
    }
    if (format === '%') return `${adjusted.toFixed(1)}%`;
    return adjusted.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  const handleAsk = () => {
    if (!question.trim()) return;
    const prepared = highlightAI ? t.ai.insight2 : `${t.ai.answerHint} ${insights[(activeInsight + 1) % insights.length]}`;
    setAnswer(prepared);
    setQuestion('');
  };

  const settingsLabel = lang === 'PL' ? 'Przejdź do ustawień' : 'Go to settings';

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {needsReauth && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/80 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-sm">
          <span>{t.alerts.reauthBanner}</span>
          <a
            href="/settings"
            className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
          >
            {settingsLabel}
          </a>
        </div>
      )}

      {/* AI Assistant */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 p-1 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)] overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="bg-slate-900/90 rounded-xl p-6 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-white font-bold">{t.ai.title}</h2>
              <p className="text-slate-400 text-xs">{t.ai.subtitle}</p>
            </div>
          </div>
          {integrationAlert && (
            <div className="mb-4 rounded-lg border border-rose-600 bg-rose-900/70 px-4 py-2 text-xs text-rose-100">
              {integrationAlert}
            </div>
          )}

          <div className="min-h-[100px] flex items-center">
            {aiState === 'loading' ? (
               <div className="flex items-center gap-3 text-indigo-300">
                 <Loader2 className="w-5 h-5 animate-spin" />
                 <div>
                   <div className="text-sm font-mono">{aiStatusText}</div>
                   <div className="mt-2 w-36 h-1.5 bg-indigo-500/20 rounded-full overflow-hidden">
                     <div className="h-full w-1/2 bg-indigo-400 animate-[pulse_1.2s_ease-in-out_infinite]" />
                   </div>
                 </div>
               </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-indigo-500 mb-3 min-h-[96px]">
                  <p className="text-slate-200 text-sm leading-relaxed">{insights[activeInsight]}</p>
                </div>
                <div className="flex flex-wrap gap-3 mt-4 items-center">
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2">
                    {t.ai.btnDetails} <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAskOpen((prev) => !prev)}
                    className="px-4 py-2 border border-indigo-500/40 text-indigo-100 text-xs font-bold rounded-lg transition-colors hover:bg-indigo-500/10"
                  >
                    {t.ai.btnAsk}
                  </button>
                </div>
                {askOpen && (
                  <div className="flex flex-wrap items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2 mt-3 w-full">
                    <input
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder={t.ai.promptPlaceholder}
                      className="flex-1 bg-transparent outline-none text-xs text-slate-100 placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={handleAsk}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-md text-white text-xs flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" /> OK
                    </button>
                  </div>
                )}
                {answer && (
                  <div className="mt-3 text-xs text-indigo-100 bg-white/5 border border-white/10 rounded-lg p-3">
                    {answer}
                  </div>
                )}
                <p className="text-[11px] text-slate-500 mt-2">{t.ai.answerHint}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{kpi.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatVal(kpi.value, kpi.format)}
              </span>
            </div>
            {(() => {
              const trendValue = Number((kpi.trend * (0.7 + multiplier)).toFixed(1));
              const positive = trendValue >= 0;
              return (
                <div className={`mt-2 flex items-center text-xs font-medium ${positive ? 'text-green-500' : 'text-red-500'}`}>
                  {positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  <span>{positive ? '+' : ''}{trendValue}%</span>
                  <span className="ml-1 text-slate-400 font-normal">{t.kpi.trend}</span>
                </div>
              );
            })()}
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm min-h-[400px]">
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.chart.title}</h3>
            <p className="text-sm text-slate-500">{t.chart.subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <select className="bg-slate-100 dark:bg-slate-900 border-none rounded-lg text-sm px-3 py-2 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary-500 outline-none">
              <option>{t.chart.metrics.revenue}</option>
              <option>{t.chart.metrics.orders}</option>
            </select>
            <span className="text-slate-400">vs</span>
            <select className="bg-slate-100 dark:bg-slate-900 border-none rounded-lg text-sm px-3 py-2 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary-500 outline-none">
              <option>{t.chart.metrics.spend}</option>
              <option>{t.chart.metrics.sessions}</option>
            </select>
          </div>
        </div>
        
        {/* Mock SVG Chart */}
        <div className="w-full h-[300px] relative">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
             {/* Grid lines */}
             <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" strokeOpacity="0.1" className="text-slate-500" strokeWidth="0.1" />
             <line x1="0" y1="12.5" x2="100" y2="12.5" stroke="currentColor" strokeOpacity="0.1" className="text-slate-500" strokeWidth="0.1" />
             <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeOpacity="0.1" className="text-slate-500" strokeWidth="0.1" />
             <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="currentColor" strokeOpacity="0.1" className="text-slate-500" strokeWidth="0.1" />
             <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.1" className="text-slate-500" strokeWidth="0.1" />

             <g style={{ transform: `scaleY(${dateRange === 'today' ? 0.65 : dateRange === 'last7' ? 0.85 : 1})`, transformOrigin: 'bottom left' }}>
               {/* Line 1 (Revenue) - Purple */}
               <path 
                  d="M0,45 C10,40 20,48 30,35 C40,25 50,30 60,20 C70,15 80,25 90,10 L100,5" 
                  fill="none" 
                  stroke="#8b5cf6" 
                  strokeWidth="0.5" 
                  strokeLinecap="round"
               />
               <path 
                  d="M0,45 C10,40 20,48 30,35 C40,25 50,30 60,20 C70,15 80,25 90,10 L100,5 L100,50 L0,50 Z" 
                  fill="url(#grad1)" 
                  opacity="0.2"
               />

               {/* Line 2 (Spend) - Blue/Cyan */}
               <path 
                  d="M0,48 C15,46 30,45 45,40 C60,38 75,35 90,30 L100,28" 
                  fill="none" 
                  stroke="#06b6d4" 
                  strokeWidth="0.5" 
                  strokeLinecap="round"
                  strokeDasharray="1 0.5"
               />
             </g>

             <defs>
               <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                 <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                 <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
               </linearGradient>
             </defs>
          </svg>
        </div>
      </div>

      {/* Extended Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <CategoryChart
          data={categoryData}
          title={isEnglish ? 'Sales by Category' : 'Sprzedaż według kategorii'}
          subtitle={isEnglish ? 'Revenue share per channel' : 'Udział przychodów według kanałów'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerChart data={customerData} title={isEnglish ? 'Customer Acquisition' : 'Pozyskiwanie klientów'} />
        <SalesTable
          products={products}
          title={isEnglish ? 'Top Products' : 'Najlepsze produkty'}
          subtitle={isEnglish ? 'Best performing items by revenue' : 'Najlepsze produkty według przychodów'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {kpiSummary.map((item) => (
          <KPICard key={item.label} data={item} />
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
