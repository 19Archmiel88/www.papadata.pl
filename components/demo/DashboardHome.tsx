import React, { useMemo } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Activity,
  ShoppingBag,
  PiggyBank,
  Sparkles,
  PlugZap,
} from 'lucide-react';
import {
  DemoTranslation,
  Language,
  IntegrationHealthMap,
  IntegrationHealthInfo,
} from '../../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Props {
  t: DemoTranslation['dashboard'];
  dateRange: 'today' | 'last7' | 'last30';
  lang: Language;
  highlightAI?: boolean;
  integrationHealth: IntegrationHealthMap;
  integrationAlert: string | null;
  needsReauth: boolean;
}

/**
 * Rozszerzony typ lokalny – dodajemy opcjonalne longName,
 * bo w localStorage możemy mieć longName razem ze statusem.
 */
type IntegrationHealthItem = IntegrationHealthInfo & {
  longName?: string;
};

/**
 * Karta KPI z trendem (↑ / ↓) – używana w górnym rzędzie.
 */
const KpiCard: React.FC<{
  label: string;
  value: string;
  deltaLabel: string;
  positive?: boolean;
}> = ({ label, value, deltaLabel, positive = true }) => {
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  const color = positive ? 'text-emerald-400' : 'text-rose-400';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.8)]">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="text-xl md:text-2xl font-semibold text-slate-50">
          {value}
        </span>
        <span className={`inline-flex items-center gap-1 text-[11px] ${color}`}>
          <Icon className="w-3 h-3" />
          {deltaLabel}
        </span>
      </div>
    </div>
  );
};

/**
 * Dane przykładowe pod wykresy – różne „gęstości” pod zakres dat.
 */
const getRevenueSeries = (range: 'today' | 'last7' | 'last30') => {
  if (range === 'today') {
    return [
      { label: '08:00', revenue: 1200, margin: 260, orders: 12, aov: 100 },
      { label: '10:00', revenue: 2100, margin: 430, orders: 21, aov: 100 },
      { label: '12:00', revenue: 3100, margin: 620, orders: 28, aov: 111 },
      { label: '14:00', revenue: 2800, margin: 540, orders: 26, aov: 108 },
      { label: '16:00', revenue: 3600, margin: 710, orders: 31, aov: 116 },
      { label: '18:00', revenue: 3900, margin: 780, orders: 33, aov: 118 },
    ];
  }
  if (range === 'last7') {
    return [
      { label: 'Pn', revenue: 8200, margin: 1700, orders: 88, aov: 93 },
      { label: 'Wt', revenue: 9100, margin: 1900, orders: 96, aov: 95 },
      { label: 'Śr', revenue: 7600, margin: 1500, orders: 81, aov: 94 },
      { label: 'Cz', revenue: 10200, margin: 2200, orders: 104, aov: 98 },
      { label: 'Pt', revenue: 13100, margin: 2800, orders: 132, aov: 99 },
      { label: 'Sb', revenue: 15100, margin: 3200, orders: 146, aov: 103 },
      { label: 'Nd', revenue: 9700, margin: 2100, orders: 101, aov: 96 },
    ];
  }
  return [
    { label: 'Tydz 1', revenue: 51200, margin: 10900, orders: 520, aov: 98 },
    { label: 'Tydz 2', revenue: 54800, margin: 11800, orders: 548, aov: 100 },
    { label: 'Tydz 3', revenue: 60100, margin: 12800, orders: 602, aov: 100 },
    { label: 'Tydz 4', revenue: 58700, margin: 12300, orders: 589, aov: 99 },
  ];
};

const channelData = [
  { name: 'Google Ads', revenue: 42000, roas: 4.1 },
  { name: 'Meta Ads', revenue: 28000, roas: 3.4 },
  { name: 'TikTok Ads', revenue: 14000, roas: 2.9 },
  { name: 'Allegro', revenue: 35000, roas: 5.2 },
];

const channelPieColors = ['#6366f1', '#22c55e', '#38bdf8', '#f97316'];

const DashboardHome: React.FC<Props> = ({
  t,
  dateRange,
  lang,
  highlightAI,
  integrationHealth,
  integrationAlert,
  needsReauth,
}) => {
  const series = useMemo(() => getRevenueSeries(dateRange), [dateRange]);

  // BEZPOŚREDNIE rzutowanie values z mapy na konkretny typ
  const integrationEntries = useMemo(
    () =>
      Object.entries(integrationHealth || {}) as [
        string,
        IntegrationHealthItem,
      ][],
    [integrationHealth],
  );

  const healthyCount = integrationEntries.filter(
    ([, v]) => v.state === 'healthy',
  ).length;
  const errorCount = integrationEntries.filter(
    ([, v]) => v.state === 'error',
  ).length;
  const reauthCount = integrationEntries.filter(
    ([, v]) => v.state === 'needs_reauth',
  ).length;

  const kpiLabels =
    lang === 'PL'
      ? {
        revenue: 'Przychód brutto',
        orders: 'Liczba zamówień',
        margin: 'Marża netto',
        roas: 'Średni ROAS kampanii',
      }
      : {
        revenue: 'Gross revenue',
        orders: 'Number of orders',
        margin: 'Net margin',
        roas: 'Average campaign ROAS',
      };

  const orderMetricsLabel =
    lang === 'PL'
      ? { orders: 'Zamówienia', aov: 'Średnia wartość koszyka' }
      : { orders: 'Orders', aov: 'Average order value' };

  const channelPieData = channelData.map((c) => ({
    name: c.name,
    value: c.revenue,
  }));

  return (
    <div className="space-y-6">
      {/* Górny rząd KPI */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label={kpiLabels.revenue}
          value={lang === 'PL' ? '148 200 zł' : '148,200 PLN'}
          deltaLabel={lang === 'PL' ? '+18% vs poprzedni okres' : '+18% vs prev.'}
          positive
        />
        <KpiCard
          label={kpiLabels.orders}
          value="1 243"
          deltaLabel={lang === 'PL' ? '+9% liczby zamówień' : '+9% orders'}
          positive
        />
        <KpiCard
          label={kpiLabels.margin}
          value={lang === 'PL' ? '32 900 zł' : '32,900 PLN'}
          deltaLabel={lang === 'PL' ? '+3,2 p.p. marży' : '+3.2 p.p. margin'}
          positive
        />
        <KpiCard
          label={kpiLabels.roas}
          value="4.3x"
          deltaLabel={lang === 'PL' ? '-0,4 p.p. vs cel' : '-0.4 vs target'}
          positive={false}
        />
      </section>

      {/* Środkowy rząd: trend + kanały */}
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-4">
        {/* Wykres przychodu/marży + słupki zamówienia/AOV */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.8)] space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {lang === 'PL' ? 'Trend sprzedaży' : 'Sales trend'}
              </p>
              <h2 className="text-sm font-semibold text-slate-100">
                {lang === 'PL'
                  ? 'Przychód, marża i wolumen w wybranym okresie'
                  : 'Revenue, margin and volume in the selected range'}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-sky-400" />
                {lang === 'PL' ? 'Przychód' : 'Revenue'}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                {lang === 'PL' ? 'Marża' : 'Margin'}
              </span>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="marginGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderRadius: 12,
                    border: '1px solid #1e293b',
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fill="url(#revGradient)"
                  name={lang === 'PL' ? 'Przychód' : 'Revenue'}
                />
                <Area
                  type="monotone"
                  dataKey="margin"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#marginGradient)"
                  name={lang === 'PL' ? 'Marża' : 'Margin'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Dodatkowy mini-wykres słupkowy: zamówienia + AOV */}
          <div className="h-32 border-t border-slate-800 pt-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-slate-400">
                {lang === 'PL'
                  ? 'Wolumen zamówień i średnia wartość koszyka'
                  : 'Order volume and average order value'}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-slate-400" />
                  {orderMetricsLabel.orders}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-400" />
                  {orderMetricsLabel.aov}
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  hide
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderRadius: 12,
                    border: '1px solid #1e293b',
                    fontSize: 11,
                  }}
                  formatter={(value, name) => {
                    if (name === 'orders') {
                      return [String(value), orderMetricsLabel.orders];
                    }
                    return [
                      `${(value as number).toLocaleString('pl-PL')} zł`,
                      orderMetricsLabel.aov,
                    ];
                  }}
                />
                <Bar
                  dataKey="orders"
                  radius={[4, 4, 0, 0]}
                  fill="#94a3b8"
                  name={orderMetricsLabel.orders}
                />
                <Bar
                  dataKey="aov"
                  radius={[4, 4, 0, 0]}
                  fill="#818cf8"
                  name={orderMetricsLabel.aov}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kanały performance + wykres kołowy udziałów */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.8)] flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {lang === 'PL' ? 'Kanały' : 'Channels'}
              </p>
              <h2 className="text-sm font-semibold text-slate-100">
                {lang === 'PL'
                  ? 'Przychód i udział kanałów'
                  : 'Revenue and channel share'}
              </h2>
            </div>
          </div>

          {/* Słupki – przychód per kanał */}
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} layout="vertical" barSize={14}>
                <CartesianGrid
                  stroke="#1e293b"
                  horizontal={false}
                  strokeDasharray="3 3"
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  hide
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#cbd5f5' }}
                  axisLine={false}
                  tickLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderRadius: 12,
                    border: '1px solid #1e293b',
                    fontSize: 12,
                  }}
                  formatter={(value, name) => {
                    if (name === 'revenue') {
                      return [
                        `${(value as number).toLocaleString('pl-PL')} zł`,
                        lang === 'PL' ? 'Przychód' : 'Revenue',
                      ];
                    }
                    return [`${value}x`, 'ROAS'];
                  }}
                />
                <Bar
                  dataKey="revenue"
                  radius={[8, 8, 8, 8]}
                  fill="#6366f1"
                  name={lang === 'PL' ? 'Przychód' : 'Revenue'}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Wykres kołowy – udział kanałów w przychodzie */}
          <div className="flex items-center gap-3">
            <div className="h-28 w-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelPieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={26}
                    outerRadius={40}
                    paddingAngle={2}
                  >
                    {channelPieData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={channelPieColors[index % channelPieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#020617',
                      borderRadius: 12,
                      border: '1px solid #1e293b',
                      fontSize: 11,
                    }}
                    formatter={(value) => [
                      `${(value as number).toLocaleString('pl-PL')} zł`,
                      lang === 'PL' ? 'Przychód' : 'Revenue',
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1 text-[11px] text-slate-400">
              {channelPieData.map((c, index) => (
                <div key={c.name} className="flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: channelPieColors[index] }}
                  />
                  <span className="truncate">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          <ul className="mt-1 space-y-1 text-[11px] text-slate-400">
            <li className="flex items-center gap-2">
              <ShoppingBag className="w-3 h-3 text-slate-500" />
              {lang === 'PL'
                ? 'Kanały liczone po atrybucji opartej o dane sklepu, nie tylko kliknięcia.'
                : 'Channels counted with store-based attribution, not just ad clicks.'}
            </li>
            <li className="flex items-center gap-2">
              <PiggyBank className="w-3 h-3 text-slate-500" />
              {lang === 'PL'
                ? 'ROAS liczony po marży netto, jeśli dostępne są koszty produktu.'
                : 'ROAS based on net margin when product costs are available.'}
            </li>
          </ul>
        </div>
      </section>

      {/* Dolny rząd: AI + stan integracji / alerty */}
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4">
        {/* Asystent AI */}
        <div
          className={[
            'rounded-2xl border bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-4',
            'shadow-[0_18px_60px_rgba(15,23,42,0.9)] relative overflow-hidden',
            highlightAI
              ? 'border-primary-500/80 ring-1 ring-primary-500/50'
              : 'border-slate-800',
          ].join(' ')}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),_transparent_60%)] pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 border border-slate-700 text-primary-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary-300">
                    AI
                  </p>
                  <h2 className="text-sm font-semibold text-slate-50">
                    {lang === 'PL'
                      ? 'Zadaj pytanie o swoje dane'
                      : 'Ask a question about your data'}
                  </h2>
                </div>
              </div>
              {highlightAI && (
                <span className="text-[10px] px-2 py-1 rounded-full bg-primary-500/15 text-primary-200 border border-primary-500/40">
                  {lang === 'PL' ? 'Nowość' : 'New'}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mb-3">
              {lang === 'PL'
                ? 'To jest demo. W realnej wersji asystent pracuje na Twojej hurtowni BigQuery i zna sprzedaż, kampanie, marżę oraz klientów.'
                : 'This is a demo. In the real workspace, the assistant works on your BigQuery warehouse and knows your sales, campaigns, margin and customers.'}
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 mb-3 flex items-center gap-2 text-xs text-slate-400">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>
                {lang === 'PL'
                  ? 'Demo odpowiada na przykładowe pytania – bez wysyłania Twoich danych do zewnętrznych systemów.'
                  : 'Demo responds to sample questions – without sending your data to external systems.'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {(lang === 'PL'
                ? [
                  'Które kampanie przynoszą najwyższą marżę?',
                  'Jak zmienił się ROAS tydzień do tygodnia?',
                  'Które produkty mają najwięcej zwrotów?',
                ]
                : [
                  'Which campaigns bring the highest margin?',
                  'How did ROAS change week over week?',
                  'Which products have the most returns?',
                ]
              ).map((q) => (
                <button
                  key={q}
                  type="button"
                  className="text-[11px] px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-200 hover:border-primary-500/70 hover:text-primary-100 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                disabled
                className="flex-1 rounded-full border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-400 placeholder:text-slate-500 outline-none cursor-not-allowed"
                placeholder={
                  lang === 'PL'
                    ? 'W wersji produkcyjnej wpiszesz tu pytanie, np. „Jaki był zysk netto z kampanii brandowych w ostatnich 30 dniach?”'
                    : 'In production you will ask here, e.g. “What was net profit from brand campaigns in the last 30 days?”'
                }
              />
              <button
                type="button"
                className="px-3 py-2 rounded-full bg-slate-900 border border-slate-700 text-[11px] text-slate-300 cursor-not-allowed"
              >
                {lang === 'PL' ? 'Tryb demo' : 'Demo mode'}
              </button>
            </div>
          </div>
        </div>

        {/* Stan integracji / ostrzeżenia */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.8)]">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {lang === 'PL' ? 'Stan integracji' : 'Integration status'}
              </p>
              <h2 className="text-sm font-semibold text-slate-100">
                {lang === 'PL'
                  ? 'Źródła danych podłączone do PapaData'
                  : 'Data sources connected to PapaData'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[11px] mb-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-2 py-2">
              <p className="text-slate-400">
                {lang === 'PL' ? 'Zdrowe' : 'Healthy'}
              </p>
              <p className="mt-1 text-lg font-semibold text-emerald-400">
                {healthyCount}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-2 py-2">
              <p className="text-slate-400">
                {lang === 'PL' ? 'Do ponownego logowania' : 'Needs reauth'}
              </p>
              <p className="mt-1 text-lg font-semibold text-amber-300">
                {reauthCount}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-2 py-2">
              <p className="text-slate-400">
                {lang === 'PL' ? 'Błędy' : 'Errors'}
              </p>
              <p className="mt-1 text-lg font-semibold text-rose-400">
                {errorCount}
              </p>
            </div>
          </div>

          <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
            {integrationEntries.length === 0 && (
              <p className="text-xs text-slate-500">
                {lang === 'PL'
                  ? 'Po przejściu onboardingu zobaczysz tu listę realnych integracji sklepu, reklam i marketplace’ów.'
                  : 'After onboarding you will see a list of real store, ads and marketplace integrations here.'}
              </p>
            )}

            {integrationEntries.map(([integrationId, info]) => {
              const colorClasses =
                info.state === 'healthy'
                  ? 'text-emerald-300 border-emerald-700/60 bg-emerald-900/10'
                  : info.state === 'needs_reauth'
                    ? 'text-amber-200 border-amber-700/60 bg-amber-900/10'
                    : 'text-rose-200 border-rose-700/60 bg-rose-900/10';

              const label =
                info.state === 'healthy'
                  ? lang === 'PL'
                    ? 'Połączono'
                    : 'Connected'
                  : info.state === 'needs_reauth'
                    ? lang === 'PL'
                      ? 'Wymaga odświeżenia'
                      : 'Needs refresh'
                    : lang === 'PL'
                      ? 'Błąd połączenia'
                      : 'Connection error';

              return (
                <div
                  key={integrationId}
                  className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs flex items-center justify-between gap-3"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-slate-100 truncate">
                      {info.longName ?? integrationId}
                    </span>
                    {info.message && (
                      <span className="text-[11px] text-slate-500 truncate">
                        {info.message}
                      </span>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] ${colorClasses}`}
                  >
                    {info.state !== 'healthy' && (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {integrationAlert && (
            <p className="mt-3 text-[11px] text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-3 h-3 mt-[2px]" />
              <span>{integrationAlert}</span>
            </p>
          )}

          {!integrationAlert && needsReauth && (
            <p className="mt-3 text-[11px] text-amber-300 flex items-start gap-2">
              <PlugZap className="w-3 h-3 mt-[2px]" />
              <span>
                {lang === 'PL'
                  ? 'Część integracji wymaga ponownego logowania. Wejdź w zakładkę „Integracje”, aby odświeżyć tokeny.'
                  : 'Some integrations require re-authentication. Go to the “Integrations” tab to refresh tokens.'}
              </span>
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
