import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart2,
  Target,
  Users,
  ServerCog,
  AlertTriangle,
  Activity,
  Rocket,
  X,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DemoTranslation, Language } from '../../types';

type ReportView = 'sales' | 'campaigns' | 'customers' | 'technical';

interface Props {
  t: DemoTranslation['reports'];
  initialTab?: ReportView;
  onTabChange?: (tab: ReportView) => void;
  lang: Language;
  dateRange: 'today' | 'last7' | 'last30';
  integrationAlert?: string | null;
}

const LiveReports: React.FC<Props> = ({
  t,
  initialTab = 'sales',
  onTabChange,
  lang,
  dateRange,
  integrationAlert,
}) => {
  const [activeTab, setActiveTab] = useState<ReportView>(initialTab);
  const [showGateModal, setShowGateModal] = useState(false);

  useEffect(() => {
    try {
      const ack = window.localStorage.getItem('papadata_reports_gate_ack');
      if (!ack) {
        setShowGateModal(true);
      }
    } catch {
      setShowGateModal(true);
    }
  }, []);

  const handleCloseModal = () => {
    setShowGateModal(false);
    try {
      window.localStorage.setItem('papadata_reports_gate_ack', '1');
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const changeTab = (tab: ReportView) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const salesSeries = useMemo(() => {
    if (dateRange === 'today') {
      return [
        { label: '08:00', revenue: 1200, margin: 260, orders: 12 },
        { label: '10:00', revenue: 2100, margin: 430, orders: 21 },
        { label: '12:00', revenue: 3100, margin: 620, orders: 28 },
        { label: '14:00', revenue: 2800, margin: 540, orders: 26 },
        { label: '16:00', revenue: 3600, margin: 710, orders: 31 },
        { label: '18:00', revenue: 3900, margin: 780, orders: 33 },
      ];
    }
    if (dateRange === 'last7') {
      return [
        { label: 'Pn', revenue: 8200, margin: 1700, orders: 88 },
        { label: 'Wt', revenue: 9100, margin: 1900, orders: 96 },
        { label: 'Śr', revenue: 7600, margin: 1500, orders: 81 },
        { label: 'Cz', revenue: 10200, margin: 2200, orders: 104 },
        { label: 'Pt', revenue: 13100, margin: 2800, orders: 132 },
        { label: 'Sb', revenue: 15100, margin: 3200, orders: 146 },
        { label: 'Nd', revenue: 9700, margin: 2100, orders: 101 },
      ];
    }
    return [
      { label: 'Tydz 1', revenue: 51200, margin: 10900, orders: 520 },
      { label: 'Tydz 2', revenue: 54800, margin: 11800, orders: 548 },
      { label: 'Tydz 3', revenue: 60100, margin: 12800, orders: 602 },
      { label: 'Tydz 4', revenue: 58700, margin: 12300, orders: 589 },
    ];
  }, [dateRange]);

  const campaignsData = [
    {
      name: 'Brand Search',
      channel: 'Google Ads',
      spend: 4200,
      revenue: 27200,
      roas: 6.5,
    },
    {
      name: 'Prospecting',
      channel: 'Meta Ads',
      spend: 6100,
      revenue: 21400,
      roas: 3.5,
    },
    {
      name: 'Remarketing',
      channel: 'Meta Ads',
      spend: 3300,
      revenue: 19800,
      roas: 6.0,
    },
    {
      name: 'Performance Max',
      channel: 'Google Ads',
      spend: 7800,
      revenue: 30400,
      roas: 3.9,
    },
  ];

  const customersData = [
    {
      segment: lang === 'PL' ? 'Nowi klienci 30 dni' : 'New 30 days',
      orders: 420,
      revenue: 58000,
      ltv: 320,
      trend: '+18%',
    },
    {
      segment: lang === 'PL' ? 'Stali klienci' : 'Returning',
      orders: 610,
      revenue: 78200,
      ltv: 540,
      trend: '+9%',
    },
    {
      segment: lang === 'PL' ? 'Do odzyskania' : 'Win-back',
      orders: 96,
      revenue: 8200,
      ltv: 220,
      trend: '-4%',
    },
  ];

  const technicalChecks = [
    {
      key: 'ga4',
      label:
        lang === 'PL'
          ? 'Spójność transakcji GA4 vs sklep'
          : 'GA4 vs store transactions consistency',
      status: 'ok' as const,
      detail:
        lang === 'PL'
          ? 'Odchylenie 3,2% – w granicach akceptowalnych różnic atrybucji.'
          : '3.2% deviation – within acceptable attribution differences.',
    },
    {
      key: 'costs',
      label:
        lang === 'PL'
          ? 'Koszty kampanii vs panel reklamowy'
          : 'Ad costs vs ad platform',
      status: 'ok' as const,
      detail:
        lang === 'PL'
          ? 'Różnice < 1% – dane kosztowe kompletne za okres bieżący.'
          : 'Diff < 1% – cost data complete for current period.',
    },
    {
      key: 'catalog',
      label:
        lang === 'PL'
          ? 'Spójność katalogu produktów'
          : 'Product catalog consistency',
      status: 'warn' as const,
      detail:
        lang === 'PL'
          ? '12 SKU bez przypisanej kategorii marży.'
          : '12 SKUs without margin category assigned.',
    },
    {
      key: 'feed',
      label:
        lang === 'PL'
          ? 'Aktualność feedu produktowego'
          : 'Product feed freshness',
      status: 'ok' as const,
      detail:
        lang === 'PL'
          ? 'Ostatnia pełna aktualizacja 2 godz. temu.'
          : 'Last full refresh 2 hours ago.',
    },
  ];

  const tabDefinitions: {
    id: ReportView;
    label: string;
    icon: React.ReactNode;
  }[] = useMemo(
    () => [
      {
        id: 'sales',
        icon: <BarChart2 className="w-4 h-4" />,
        label:
          (t as any)?.tabs?.sales?.label ??
          (lang === 'PL' ? 'Sprzedaż' : 'Sales'),
      },
      {
        id: 'campaigns',
        icon: <Target className="w-4 h-4" />,
        label:
          (t as any)?.tabs?.campaigns?.label ??
          (lang === 'PL' ? 'Kampanie' : 'Campaigns'),
      },
      {
        id: 'customers',
        icon: <Users className="w-4 h-4" />,
        label:
          (t as any)?.tabs?.customers?.label ??
          (lang === 'PL' ? 'Klienci' : 'Customers'),
      },
      {
        id: 'technical',
        icon: <ServerCog className="w-4 h-4" />,
        label:
          (t as any)?.tabs?.technical?.label ??
          (lang === 'PL' ? 'Techniczne' : 'Technical'),
      },
    ],
    [t, lang],
  );

  const channelPieColors = ['#6366f1', '#22c55e', '#38bdf8', '#f97316'];

  const campaignsByChannel = (() => {
    const map: Record<
      string,
      { channel: string; spend: number; revenue: number }
    > = {};
    campaignsData.forEach((c) => {
      if (!map[c.channel]) {
        map[c.channel] = { channel: c.channel, spend: 0, revenue: 0 };
      }
      map[c.channel].spend += c.spend;
      map[c.channel].revenue += c.revenue;
    });
    return Object.values(map);
  })();

  const campaignsPieData = campaignsByChannel.map((c) => ({
    name: c.channel,
    value: c.spend,
  }));

  const customersPieData = customersData.map((c) => ({
    name: c.segment,
    value: c.revenue,
  }));
  const customersPieColors = ['#22c55e', '#38bdf8', '#f97316'];

  const renderSalesView = () => (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.9)] space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {lang === 'PL' ? 'Raport sprzedaży' : 'Sales report'}
            </p>
            <h2 className="text-sm font-semibold text-slate-100">
              {lang === 'PL'
                ? 'Przychód, marża i wolumen w czasie'
                : 'Revenue, margin and volume over time'}
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

        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesSeries}>
              <defs>
                <linearGradient id="revGradientR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="marginGradientR" x1="0" y1="0" x2="0" y2="1">
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
                formatter={(value, name) => {
                  if (name === 'revenue') {
                    return [
                      `${(value as number).toLocaleString('pl-PL')} zł`,
                      lang === 'PL' ? 'Przychód' : 'Revenue',
                    ];
                  }
                  if (name === 'margin') {
                    return [
                      `${(value as number).toLocaleString('pl-PL')} zł`,
                      lang === 'PL' ? 'Marża' : 'Margin',
                    ];
                  }
                  return [String(value), lang === 'PL' ? 'Zamówienia' : 'Orders'];
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#38bdf8"
                strokeWidth={2}
                fill="url(#revGradientR)"
              />
              <Area
                type="monotone"
                dataKey="margin"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#marginGradientR)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Dodatkowy wykres słupkowy dla zamówień */}
        <div className="h-32 border-t border-slate-800 pt-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] text-slate-400">
              {lang === 'PL' ? 'Wolumen zamówień' : 'Order volume'}
            </p>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesSeries}>
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
              />
              <Bar
                dataKey="orders"
                radius={[4, 4, 0, 0]}
                fill="#818cf8"
                name={lang === 'PL' ? 'Zamówienia' : 'Orders'}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.9)] flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {lang === 'PL' ? 'Szybkie wnioski' : 'Quick insights'}
            </p>
            <h2 className="text-sm font-semibold text-slate-100">
              {lang === 'PL'
                ? 'Co dzieje się ze sprzedażą?'
                : 'What is happening with sales?'}
            </h2>
          </div>
        </div>

        <ul className="space-y-2 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <Activity className="w-3 h-3 text-emerald-400 mt-[2px]" />
            <span>
              {lang === 'PL'
                ? 'Wzrost przychodu +18% przy wyższej marży sugeruje lepszy miks produktowy, nie tylko większy ruch.'
                : 'Revenue +18% with higher margin suggests better product mix, not only more traffic.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Activity className="w-3 h-3 text-sky-400 mt-[2px]" />
            <span>
              {lang === 'PL'
                ? 'Piki sprzedaży w godzinach 12–18 wskazują najlepsze okno na kampanie z ograniczonym budżetem.'
                : 'Sales peaks between 12–18 suggest best window for budget-limited campaigns.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle className="w-3 h-3 text-amber-300 mt-[2px]" />
            <span>
              {lang === 'PL'
                ? 'Lekki spadek marży przy rosnącym wolumenie warto zestawić z kampaniami z rabatami.'
                : 'Slight margin drop with rising volume should be checked vs discount campaigns.'}
            </span>
          </li>
        </ul>

        {/* Mini wykres kołowy – udział kanałów w sprzedaży (zagregowany z kampanii) */}
        <div className="mt-3 pt-3 border-t border-slate-800">
          <p className="text-[11px] text-slate-400 mb-2">
            {lang === 'PL'
              ? 'Udział kanałów w przychodzie kampanii'
              : 'Channel share in campaign revenue'}
          </p>
          <div className="flex items-center gap-3">
            <div className="h-28 w-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={campaignsPieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={26}
                    outerRadius={40}
                    paddingAngle={2}
                  >
                    {campaignsPieData.map((_, index) => (
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
                      lang === 'PL' ? 'Koszt' : 'Cost',
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1 text-[11px] text-slate-400">
              {campaignsPieData.map((c, index) => (
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
        </div>
      </div>
    </div>
  );

  const renderCampaignsView = () => (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {lang === 'PL' ? 'Raport kampanii' : 'Campaign report'}
            </p>
            <h2 className="text-sm font-semibold text-slate-100">
              {lang === 'PL'
                ? 'Przychód i ROAS według kampanii'
                : 'Revenue & ROAS by campaign'}
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-separate border-spacing-y-1">
            <thead>
              <tr className="text-slate-400">
                <th className="text-left font-medium py-1.5 px-2">
                  {lang === 'PL' ? 'Kampania' : 'Campaign'}
                </th>
                <th className="text-left font-medium py-1.5 px-2">
                  {lang === 'PL' ? 'Kanał' : 'Channel'}
                </th>
                <th className="text-right font-medium py-1.5 px-2">
                  {lang === 'PL' ? 'Koszt' : 'Cost'}
                </th>
                <th className="text-right font-medium py-1.5 px-2">
                  {lang === 'PL' ? 'Przychód' : 'Revenue'}
                </th>
                <th className="text-right font-medium py-1.5 px-2">ROAS</th>
                <th className="text-right font-medium py-1.5 px-2">
                  {lang === 'PL' ? 'Sugestia' : 'Suggestion'}
                </th>
              </tr>
            </thead>
            <tbody>
              {campaignsData.map((row) => {
                const roasColor =
                  row.roas >= 5
                    ? 'text-emerald-300'
                    : row.roas >= 3.5
                    ? 'text-sky-300'
                    : 'text-amber-300';
                const suggestion =
                  lang === 'PL'
                    ? row.roas >= 5
                      ? 'Można rozważyć zwiększenie budżetu.'
                      : row.roas >= 3.5
                      ? 'Obserwuj – potencjał po dopracowaniu kreacji.'
                      : 'Weryfikacja kreacji i grup docelowych.'
                    : row.roas >= 5
                    ? 'Consider increasing budget.'
                    : row.roas >= 3.5
                    ? 'Monitor – potential after creative optimisation.'
                    : 'Review creatives and audiences.';

                return (
                  <tr
                    key={row.name}
                    className="bg-slate-900/80 hover:bg-slate-900 text-slate-100"
                  >
                    <td className="py-1.5 px-2">{row.name}</td>
                    <td className="py-1.5 px-2 text-slate-400">
                      {row.channel}
                    </td>
                    <td className="py-1.5 px-2 text-right">
                      {row.spend.toLocaleString('pl-PL')} zł
                    </td>
                    <td className="py-1.5 px-2 text-right">
                      {row.revenue.toLocaleString('pl-PL')} zł
                    </td>
                    <td className={`py-1.5 px-2 text-right ${roasColor}`}>
                      {row.roas.toFixed(1)}x
                    </td>
                    <td className="py-1.5 px-2 text-right text-slate-300">
                      {suggestion}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dodatkowe wykresy: słupkowy + kołowy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
            {lang === 'PL' ? 'Wydatki i przychód' : 'Spend & revenue'}
          </p>
          <h3 className="text-sm font-semibold text-slate-100 mb-2">
            {lang === 'PL'
              ? 'Porównanie wydatku i przychodu kampanii'
              : 'Campaign spend vs revenue'}
          </h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignsData}>
                <CartesianGrid
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
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
                    return [
                      `${(value as number).toLocaleString('pl-PL')} zł`,
                      name === 'spend'
                        ? lang === 'PL'
                          ? 'Koszt'
                          : 'Cost'
                        : lang === 'PL'
                        ? 'Przychód'
                        : 'Revenue',
                    ];
                  }}
                />
                <Bar
                  dataKey="spend"
                  radius={[4, 4, 0, 0]}
                  fill="#94a3b8"
                  name={lang === 'PL' ? 'Koszt' : 'Cost'}
                />
                <Bar
                  dataKey="revenue"
                  radius={[4, 4, 0, 0]}
                  fill="#6366f1"
                  name={lang === 'PL' ? 'Przychód' : 'Revenue'}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
            {lang === 'PL' ? 'Kanały kampanii' : 'Campaign channels'}
          </p>
          <h3 className="text-sm font-semibold text-slate-100 mb-2">
            {lang === 'PL'
              ? 'Udział kanałów w wydatku'
              : 'Channel share in spend'}
          </h3>

          <div className="flex items-center gap-3">
            <div className="h-32 w-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={campaignsPieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={28}
                    outerRadius={45}
                    paddingAngle={2}
                  >
                    {campaignsPieData.map((_, index) => (
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
                      lang === 'PL' ? 'Koszt' : 'Cost',
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1 text-[11px] text-slate-400">
              {campaignsPieData.map((c, index) => (
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
        </div>
      </div>
    </div>
  );

  const renderCustomersView = () => (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            {lang === 'PL' ? 'Raport klientów' : 'Customer report'}
          </p>
          <h2 className="text-sm font-semibold text-slate-100">
            {lang === 'PL'
              ? 'Segmenty i LTV klienta'
              : 'Segments and customer LTV'}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-separate border-spacing-y-1">
            <thead>
              <tr className="text-slate-400">
                <th className="text-left font-medium py-1.5 px-2">
                  {lang === 'PL' ? 'Segment' : 'Segment'}
                </th>
                <th className="text-right font-medium py-1.5 px-2">
                  {lang === 'PL' ? 'Zamówienia' : 'Orders'}
                </th>
                <th className="text-right font-medium py-1.5 px-2">
                  {lang === 'PL' ? 'Przychód' : 'Revenue'}
                </th>
                <th className="text-right font-medium py-1.5 px-2">LTV</th>
                <th className="text-right font-medium py-1.5 px-2">
                  {lang === 'PL' ? 'Trend' : 'Trend'}
                </th>
              </tr>
            </thead>
            <tbody>
              {customersData.map((row) => {
                const negative = row.trend.startsWith('-');
                const trendColor = negative
                  ? 'text-rose-300'
                  : 'text-emerald-300';
                return (
                  <tr
                    key={row.segment}
                    className="bg-slate-900/80 hover:bg-slate-900 text-slate-100"
                  >
                    <td className="py-1.5 px-2">{row.segment}</td>
                    <td className="py-1.5 px-2 text-right">{row.orders}</td>
                    <td className="py-1.5 px-2 text-right">
                      {row.revenue.toLocaleString('pl-PL')} zł
                    </td>
                    <td className="py-1.5 px-2 text-right">
                      {row.ltv.toLocaleString('pl-PL')} zł
                    </td>
                    <td className={`py-1.5 px-2 text-right ${trendColor}`}>
                      {row.trend}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Wykres kołowy dla segmentów */}
        <div className="flex flex-col gap-2">
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customersPieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={28}
                  outerRadius={45}
                  paddingAngle={2}
                >
                  {customersPieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        customersPieColors[index % customersPieColors.length]
                      }
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
          <div className="space-y-1 text-[11px] text-slate-400">
            {customersPieData.map((c, index) => (
              <div key={c.name} className="flex items-center gap-2">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: customersPieColors[index] }}
                />
                <span className="truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-300 space-y-2">
        <p className="text-slate-200">
          {lang === 'PL'
            ? 'Co możesz zrobić z tym raportem?'
            : 'What can you do with this report?'}
        </p>
        <ul className="space-y-1.5">
          <li>
            •{' '}
            {lang === 'PL'
              ? 'Zdefiniować progi LTV, przy których opłaca się inwestować w retencję.'
              : 'Define LTV thresholds at which retention is profitable.'}
          </li>
          <li>
            •{' '}
            {lang === 'PL'
              ? 'Wyłapać segment „do odzyskania” przed jego całkowitym wypaleniem.'
              : 'Catch win-back segments before they fully churn.'}
          </li>
          <li>
            •{' '}
            {lang === 'PL'
              ? 'Porównać jakość klientów między kanałami pozyskania.'
              : 'Compare customer quality between acquisition channels.'}
          </li>
        </ul>
      </div>
    </div>
  );

  const renderTechnicalView = () => (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            {lang === 'PL' ? 'Raport techniczny' : 'Technical report'}
          </p>
          <h2 className="text-sm font-semibold text-slate-100">
            {lang === 'PL'
              ? 'Zdrowie danych i integracji'
              : 'Data & integration health'}
          </h2>
        </div>
      </div>

      <ul className="space-y-2 text-xs">
        {technicalChecks.map((check) => {
          const colorClasses =
            check.status === 'ok'
              ? 'border-emerald-700/60 bg-emerald-900/10 text-emerald-200'
              : 'border-amber-700/60 bg-amber-900/10 text-amber-200';
          const label =
            check.status === 'ok'
              ? lang === 'PL'
                ? 'OK'
                : 'OK'
              : lang === 'PL'
              ? 'Do przeglądu'
              : 'Review';

          return (
            <li
              key={check.key}
              className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 flex items-start justify-between gap-3"
            >
              <div className="flex-1">
                <p className="text-slate-100 mb-0.5">{check.label}</p>
                <p className="text-[11px] text-slate-400">{check.detail}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] ${colorClasses}`}
              >
                {check.status !== 'ok' && (
                  <AlertTriangle className="w-3 h-3" />
                )}
                {label}
              </span>
            </li>
          );
        })}
      </ul>

      {integrationAlert && (
        <p className="mt-3 text-[11px] text-amber-300 flex items-start gap-2">
          <AlertTriangle className="w-3 h-3 mt-[2px]" />
          <span>{integrationAlert}</span>
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Pasek nagłówka sekcji */}
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-400">
            {lang === 'PL' ? 'Raporty live' : 'Live reports'}
          </p>
          <h1 className="mt-1 text-lg md:text-xl font-semibold text-slate-50">
            {(t as any)?.title ??
              (lang === 'PL'
                ? 'Raporty sprzedaży, kampanii i klientów w jednym miejscu'
                : 'Sales, campaign and customer reports in one place')}
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-xl">
            {(t as any)?.subtitle ??
              (lang === 'PL'
                ? 'Widoki, które w wersji produkcyjnej aktualizują się automatycznie z Twojej hurtowni danych po 14 dniach współpracy.'
                : 'Views that, in production, update automatically from your warehouse after the first 14 days of cooperation.')}
          </p>
        </div>
      </section>

      {/* Alert z integracji (jeśli jest) */}
      {integrationAlert && (
        <div className="rounded-xl border border-amber-700/60 bg-amber-950/40 px-3 py-2 text-xs text-amber-100 flex items-start gap-2">
          <AlertTriangle className="w-3 h-3 mt-[2px]" />
          <span>{integrationAlert}</span>
        </div>
      )}

      {/* Zakładki */}
      <section className="border-b border-slate-800">
        <div className="max-w-full overflow-x-auto">
          <div className="inline-flex min-w-full flex-wrap gap-2 text-xs">
            {tabDefinitions.map((tab) => {
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => changeTab(tab.id)}
                  className={[
                    'inline-flex items-center gap-2 px-3 py-2 rounded-t-lg border-b-2 transition-colors',
                    active
                      ? 'border-primary-500 text-slate-50 bg-slate-900'
                      : 'border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-900/60',
                  ].join(' ')}
                >
                  <span className="text-primary-300">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Widok aktywnej zakładki */}
      <section>
        {activeTab === 'sales' && renderSalesView()}
        {activeTab === 'campaigns' && renderCampaignsView()}
        {activeTab === 'customers' && renderCustomersView()}
        {activeTab === 'technical' && renderTechnicalView()}
      </section>

      {/* Modal: informacja o 14 dniach i przedłużeniu współpracy */}
      {showGateModal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={handleCloseModal}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-slate-950 border border-slate-800 shadow-xl shadow-black/60 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-200"
              onClick={handleCloseModal}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-700 text-primary-300">
                <Rocket className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary-300">
                  {lang === 'PL' ? 'Pełne raporty' : 'Full reports'}
                </p>
                <h2 className="text-sm font-semibold text-slate-50">
                  {lang === 'PL'
                    ? 'Ten ekran pokazuje widok po 14 dniach współpracy'
                    : 'This screen shows the view after the first 14 days'}
                </h2>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              {lang === 'PL'
                ? 'W wersji produkcyjnej raporty live wypełniają się Twoimi realnymi danymi po podłączeniu sklepu, kampanii i hurtowni BigQuery. Po przedłużeniu współpracy widoki stają się stałym „centrum dowodzenia” e-commerce.'
                : 'In production, live reports are populated with your real data after connecting the store, campaigns and BigQuery warehouse. After extending cooperation, these views become the stable “command center” of your e-commerce.'}
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-[11px] text-slate-400 flex items-start gap-2 mb-4">
              <Activity className="w-3 h-3 text-emerald-300 mt-[2px]" />
              <span>
                {lang === 'PL'
                  ? 'To demo działa na danych przykładowych – traktuj je jako podgląd układu i poziomu szczegółowości, a nie prognozę wyników.'
                  : 'This demo uses sample data – treat it as a preview of layout and detail level, not a forecast of your results.'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold shadow-lg shadow-primary-500/30"
              >
                {lang === 'PL'
                  ? 'Rozumiem – pokaż demo raportów'
                  : 'Got it – show demo reports'}
              </button>
              <button
                type="button"
                className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-100 text-sm font-semibold hover:bg-slate-900"
              >
                {lang === 'PL'
                  ? 'Porozmawiajmy o pełnej wersji'
                  : "Let's talk about full version"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveReports;
