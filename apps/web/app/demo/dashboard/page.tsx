'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  GraduationCap,
  Headphones,
  Puzzle,
  Settings,
  LogOut,
  RefreshCcw,
  Calendar,
  ArrowRight,
  HelpCircle,
  Play,
  BookOpen,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types -------------------------------------------------------------------

type View = 'dashboard' | 'reports' | 'academy' | 'support' | 'integrations' | 'settings';

type Range = 'today' | 'last7' | 'last30';

interface Kpi {
  id: string;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
}

type IntegrationStatus = 'available' | 'coming_soon' | 'voting';

interface Integration {
  id: string;
  name: string;
  category: 'Store' | 'Analytics' | 'Marketing' | 'Marketplace' | 'Tools' | 'Payment';
  status: IntegrationStatus;
  votes?: number;
}

// --- Mock data ---------------------------------------------------------------

const KPIS: Kpi[] = [
  {
    id: 'revenue',
    label: 'Przychód',
    value: '124 592 PLN',
    trend: '+12.5%',
    trendUp: true,
  },
  {
    id: 'spend',
    label: 'Wydatki marketingowe',
    value: '18 240 PLN',
    trend: '-2.1%',
    trendUp: false,
  },
  { id: 'roas', label: 'ROAS', value: '683%', trend: '+5.4%', trendUp: true },
  {
    id: 'aov',
    label: 'Średnia wartość koszyka',
    value: '342 PLN',
    trend: '+1.2%',
    trendUp: true,
  },
];

const INTEGRATIONS: Integration[] = [
  { id: 'woo', name: 'WooCommerce', category: 'Store', status: 'available' },
  { id: 'shopify', name: 'Shopify', category: 'Store', status: 'available' },
  { id: 'ga4', name: 'Google Analytics 4', category: 'Analytics', status: 'available' },
  { id: 'gads', name: 'Google Ads', category: 'Marketing', status: 'available' },
  { id: 'meta', name: 'Meta Ads', category: 'Marketing', status: 'available' },
  { id: 'base', name: 'BaseLinker', category: 'Tools', status: 'available' },
  { id: 'allegro', name: 'Allegro', category: 'Marketplace', status: 'coming_soon' },
  { id: 'tiktok', name: 'TikTok Ads', category: 'Marketing', status: 'voting', votes: 23 },
  { id: 'klaviyo', name: 'Klaviyo', category: 'Marketing', status: 'available' },
  { id: 'stripe', name: 'Stripe', category: 'Payment', status: 'available' },
];

// --- Helpers -----------------------------------------------------------------

function generateChartData(range: Range): Array<{ name: string; revenue: number; spend: number }> {
  const points = range === 'today' ? 24 : range === 'last7' ? 7 : 30;

  const data: Array<{ name: string; revenue: number; spend: number }> = [];

  for (let i = 0; i < points; i += 1) {
    let name: string;
    if (range === 'today') {
      const hour = i.toString().padStart(2, '0');
      name = `${hour}:00`;
    } else {
      name = `D${i + 1}`;
    }

    const revenueBase = range === 'today' ? 1000 : 5000;
    const spendBase = range === 'today' ? 200 : 1000;

    data.push({
      name,
      revenue:
        revenueBase +
        Math.floor(Math.sin(i / 2) * 800) +
        Math.floor(Math.random() * 400),
      spend:
        spendBase +
        Math.floor(Math.cos(i / 3) * 300) +
        Math.floor(Math.random() * 200),
    });
  }

  return data;
}

// --- Layout components -------------------------------------------------------

interface SidebarProps {
  view: View;
  setView: (view: View) => void;
  fixed: boolean;
  setFixed: (fixed: boolean) => void;
}

function Sidebar({ view, setView, fixed, setFixed }: SidebarProps) {
  const [hovered, setHovered] = useState(false);

  const expanded = fixed || hovered;

  const items: Array<{ id: View; label: string; icon: React.ComponentType<{ className?: string }> }> =
    [
      { id: 'dashboard', label: 'Pulpit', icon: LayoutDashboard },
      { id: 'reports', label: 'Raporty Live', icon: BarChart3 },
      { id: 'academy', label: 'Akademia', icon: GraduationCap },
      { id: 'support', label: 'Wsparcie', icon: Headphones },
      { id: 'integrations', label: 'Integracje', icon: Puzzle },
      { id: 'settings', label: 'Ustawienia', icon: Settings },
    ];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`fixed left-0 top-0 z-40 flex h-full flex-col border-r border-white/5 bg-[#020617] transition-all duration-300 ${
        expanded ? 'w-60' : 'w-[72px]'
      }`}
    >
      {/* Brand */}
      <div className="flex h-16 items-center border-b border-white/5 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-900/40">
          PD
        </div>
        <div
          className={`ml-3 overflow-hidden text-sm font-semibold text-slate-50 transition-opacity duration-200 ${
            expanded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          PapaData
          <p className="text-[10px] font-normal text-slate-500">
            Konto demo
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`relative flex h-11 items-center rounded-lg px-2 text-sm transition-colors ${
                active
                  ? 'bg-white/10 text-cyan-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
              }`}
            >
              <div className="flex w-10 justify-center">
                <Icon
                  className={`h-5 w-5 ${
                    active ? 'text-cyan-400' : 'text-slate-400'
                  }`}
                />
              </div>
              <span
                className={`flex-1 overflow-hidden text-left text-xs font-medium transition-opacity duration-200 ${
                  expanded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {item.label}
              </span>
              {active && (
                <div className="absolute right-0 h-6 w-1 rounded-l-full bg-cyan-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Fixed toggle + logout */}
      <div className="border-t border-white/5 px-3 py-3 text-xs text-slate-400">
        <button
          type="button"
          onClick={() => setFixed(!fixed)}
          className="mb-3 flex items-center justify-between rounded-lg bg-slate-900 px-2 py-1 text-[11px] hover:bg-slate-800"
        >
          <span className={expanded ? 'block' : 'hidden'}>
            Zablokuj panel
          </span>
          <div
            className={`flex h-4 w-8 items-center rounded-full bg-slate-700 p-0.5 ${
              fixed ? 'justify-end bg-cyan-600' : 'justify-start'
            }`}
          >
            <div className="h-3 w-3 rounded-full bg-white" />
          </div>
        </button>
        <button
          type="button"
          onClick={() => window.location.assign('/')}
          className="flex h-10 items-center rounded-lg px-2 text-[11px] text-slate-500 hover:bg-red-500/10 hover:text-red-400"
        >
          <div className="flex w-10 justify-center">
            <LogOut className="h-4 w-4" />
          </div>
          <span className={expanded ? 'block' : 'hidden'}>
            Wyloguj z demo
          </span>
        </button>
      </div>
    </div>
  );
}

interface TopbarProps {
  view: View;
  range: Range;
  setRange: (range: Range) => void;
  lastSync: string;
}

function Topbar({ view, range, setRange, lastSync }: TopbarProps) {
  const titleMap: Record<View, string> = {
    dashboard: 'Pulpit – demo danych e-commerce',
    reports: 'Raporty Live – tryb demonstracyjny',
    academy: 'Akademia – wiedza i materiały',
    support: 'Wsparcie i konsultacje',
    integrations: 'Integracje – wersja demo',
    settings: 'Ustawienia konta demo',
  };

  const title = titleMap[view];

  return (
    <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-3 backdrop-blur">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Demo PapaData
        </p>
        <h1 className="text-sm font-semibold text-slate-50">{title}</h1>
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-400">
        {view === 'dashboard' || view === 'reports' ? (
          <>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-slate-500" />
              <select
                value={range}
                onChange={(e) => setRange(e.target.value as Range)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 outline-none"
              >
                <option value="today">Dziś</option>
                <option value="last7">Ostatnie 7 dni</option>
                <option value="last30">Ostatnie 30 dni</option>
              </select>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <RefreshCcw className="h-4 w-4 text-slate-500" />
              <span>Ostatnia synchronizacja: {lastSync}</span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-slate-500">
            <HelpCircle className="h-4 w-4" />
            <span>Konto demo: JD Store</span>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Dashboard view ----------------------------------------------------------

function DashboardView({ range }: { range: Range }) {
  const [aiReady, setAiReady] = useState(false);

  useEffect(() => {
    setAiReady(false);
    const id = window.setTimeout(() => setAiReady(true), 1200);
    return () => window.clearTimeout(id);
  }, [range]);

  const data = useMemo(() => generateChartData(range), [range]);

  return (
    <div className="space-y-6 p-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((kpi) => (
          <div
            key={kpi.id}
            className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-4 shadow-md shadow-slate-950/50"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">{kpi.label}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  kpi.trendUp
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-amber-500/10 text-amber-300'
                }`}
              >
                {kpi.trend}
              </span>
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-50">
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
            <span>Przychód vs wydatki</span>
            <span>Wszystkie dane są przykładowe (tryb demo).</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderRadius: 8,
                    borderColor: '#1f2937',
                    padding: 8,
                  }}
                  labelStyle={{ color: '#e5e7eb' }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Przychód"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="url(#gradRev)"
                />
                <Area
                  type="monotone"
                  dataKey="spend"
                  name="Wydatki"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#gradSpend)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI assistant */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Asystent AI
              </p>
              <p className="text-sm text-slate-100">
                Podsumowanie Twoich danych (demo)
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
              {aiReady ? 'Gotowe' : 'Analizuję...'}
            </span>
          </div>
          <div className="flex-1 rounded-xl bg-slate-950/90 p-3 text-xs text-slate-300">
            <AnimatePresence mode="wait">
              {!aiReady ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-slate-400"
                >
                  <RefreshCcw className="h-3 w-3 animate-spin" />
                  Analizuję przychód, wydatki i dane GA4 z ostatniego okresu...
                </motion.div>
              ) : (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <p>
                    Przychód z kampanii „Brand Search – Google Ads” wzrósł o 28% vs
                    poprzedni okres, przy jednoczesnym spadku kosztu pozyskania
                    nowych klientów w Meta Ads o 18%.
                  </p>
                  <p>
                    Produkty z kategorii „Akcesoria zimowe” generują 35% przychodu,
                    ale nie mają osobnej kampanii remarketingowej. Sugeruję stworzyć
                    kampanię dynamiczną na ten segment.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={() => window.location.assign('/wizard')}
            className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-cyan-500/40 hover:bg-cyan-400"
          >
            Odbierz pełny dostęp (14 dni za darmo)
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Reports view ------------------------------------------------------------

function ReportsView() {
  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
        <h2 className="mb-2 text-sm font-semibold text-slate-50">
          To serce systemu PapaData
        </h2>
        <p className="text-xs text-slate-300">
          W pełnym koncie zobaczysz tutaj raporty Live – sprzedaż, kampanie,
          customer journey, techniczne i wiele więcej. W wersji demo pokazujemy
          tylko przykładowe dane. Pełny dostęp odblokujesz po założeniu konta.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <button
            type="button"
            onClick={() => window.location.assign('/wizard')}
            className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-3 py-2 font-semibold text-slate-950 shadow shadow-cyan-500/40 hover:bg-cyan-400"
          >
            Odblokuj w pełnej wersji
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-5 text-xs text-slate-400">
        <p className="mb-2 font-semibold text-slate-200">
          Tryb demonstracyjny
        </p>
        <p>
          Aby zobaczyć realne raporty Live bazujące na Twoich danych
          e-commerce, zakończ onboarding i połącz integracje w panelu PapaData.
        </p>
      </div>
    </div>
  );
}

// --- Integrations view -------------------------------------------------------

function IntegrationsView() {
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [votedIds, setVotedIds] = useState<string[]>([]);

  const handleConnect = (id: string) => {
    if (!connectedIds.includes(id)) {
      setConnectedIds((prev) => [...prev, id]);
      // demo: nic więcej
    }
  };

  const handleVote = (id: string) => {
    if (!votedIds.includes(id)) {
      setVotedIds((prev) => [...prev, id]);
      // demo: nic więcej
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
        <h2 className="mb-2 text-sm font-semibold text-slate-50">
          Integracje PapaData – wersja demo
        </h2>
        <p className="text-xs text-slate-300">
          Kliknięcie „Połącz (demo)” tylko symuluje działanie – w prawdziwym
          koncie dodasz klucze API i skonfigurujesz połączenia w kilku krokach.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {INTEGRATIONS.map((i) => {
          const connected = connectedIds.includes(i.id);
          const voted = votedIds.includes(i.id);
          const statusLabel: Record<IntegrationStatus, string> = {
            available: 'Dostępna',
            coming_soon: 'Wkrótce',
            voting: 'Głosowanie',
          };

          return (
            <div
              key={i.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-200"
            >
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-bold text-slate-100">
                    {i.name
                      .split(' ')
                      .map((p) => p[0])
                      .join('')
                      .slice(0, 3)
                      .toUpperCase()}
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      i.status === 'available'
                        ? 'bg-emerald-500/10 text-emerald-300'
                        : i.status === 'coming_soon'
                        ? 'bg-amber-500/10 text-amber-300'
                        : 'bg-sky-500/10 text-sky-300'
                    }`}
                  >
                    {statusLabel[i.status]}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-50">
                  {i.name}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Kategoria: {i.category}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                {i.status === 'available' && (
                  <button
                    type="button"
                    onClick={() => handleConnect(i.id)}
                    className={`flex-1 rounded-lg px-3 py-2 text-[11px] font-semibold ${
                      connected
                        ? 'bg-emerald-500/20 text-emerald-200'
                        : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                    }`}
                  >
                    {connected ? 'Połączono (demo)' : 'Połącz (demo)'}
                  </button>
                )}
                {i.status === 'coming_soon' && (
                  <button
                    type="button"
                    disabled
                    className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-[11px] font-semibold text-slate-400"
                  >
                    Wkrótce
                  </button>
                )}
                {i.status === 'voting' && (
                  <button
                    type="button"
                    onClick={() => handleVote(i.id)}
                    className="flex-1 rounded-lg border border-sky-500/40 px-3 py-2 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/10"
                  >
                    {voted ? 'Dziękujemy za głos' : 'Zagłosuj'}
                    {typeof i.votes === 'number' && (
                      <span className="ml-1 rounded bg-sky-500/20 px-1 text-[10px]">
                        {(i.votes || 0) + (voted ? 1 : 0)}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Academy view ------------------------------------------------------------

function AcademyView() {
  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
        <h2 className="mb-2 text-sm font-semibold text-slate-50">
          PapaData Academy – wiedza o analityce i e-commerce
        </h2>
        <p className="text-xs text-slate-300">
          W pełnej wersji znajdziesz tu nagrania, artykuły i case studies z
          prawdziwych wdrożeń. W demo pokazujemy część materiałów, żebyś
          zobaczył, czego możesz się spodziewać.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
          <div className="mb-3 flex items-center gap-2 text-slate-300">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
              <Play className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-50">
                Jak w 5 minut przejść przez rejestrację
              </p>
              <p className="text-[11px] text-slate-400">
                Krok po kroku: od formularza do pierwszych raportów.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="mt-auto inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-[11px] font-semibold text-slate-100 hover:bg-slate-800"
          >
            Obejrzyj nagranie (demo)
          </button>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
          <div className="mb-3 flex items-center gap-2 text-slate-300">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-50">
                3 najczęstsze błędy w raportowaniu sprzedaży
              </p>
              <p className="text-[11px] text-slate-400">
                Jak uniknąć pułapki raportów z Excela i różnych źródeł danych.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="mt-auto inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-[11px] font-semibold text-slate-100 hover:bg-slate-800"
          >
            Przeczytaj artykuł (demo)
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-amber-100">
        <p className="mb-1 font-semibold">
          Materiały premium odblokujesz w pełnej wersji
        </p>
        <p>
          Pełny dostęp do webinarów, case studies i checklist otrzymasz po
          założeniu konta i uruchomieniu 14-dniowego triala.
        </p>
      </div>
    </div>
  );
}

// --- Support view ------------------------------------------------------------

function SupportView() {
  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
        <h2 className="mb-2 text-sm font-semibold text-slate-50">
          Wsparcie i konsultacje
        </h2>
        <p className="text-xs text-slate-300">
          Możesz zamówić analizę specjalisty lub zadać pytanie zespołowi
          PapaData. W demo ten formularz nie wysyła danych – pokazuje tylko,
          jakie informacje zbieramy.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <form
          className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-xs text-slate-200"
          onSubmit={(e) => {
            e.preventDefault();
            // demo
            // eslint-disable-next-line no-alert
            alert('Demo: formularz wsparcia nie wysyła prawdziwych zgłoszeń.');
          }}
        >
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Temat konsultacji
            </label>
            <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none">
              <option>Kampanie marketingowe</option>
              <option>Budżet i ROAS</option>
              <option>Analityka (GA4, BigQuery)</option>
              <option>Wdrożenie PapaData</option>
              <option>Inne</option>
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                Zakres budżetu miesięcznego
              </label>
              <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none">
                <option>do 10 000 PLN</option>
                <option>10 000 – 50 000 PLN</option>
                <option>50 000 – 200 000 PLN</option>
                <option>powyżej 200 000 PLN</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                E-mail do kontaktu
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none"
                placeholder="marketing@sklep.pl"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Opis sytuacji
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none"
              placeholder="Opisz, co dokładnie chcesz przeanalizować. Podaj dane, okres, kanały i główny cel."
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-3 py-2 text-[11px] font-semibold text-slate-950 shadow-md shadow-cyan-500/40 hover:bg-cyan-400"
          >
            Wyślij zgłoszenie (demo)
          </button>
        </form>

        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-xs text-slate-200">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
            Pakiet konsultacyjny
          </p>
          <p>
            Standardowa konsultacja trwa 60 minut. Przed spotkaniem przeanalizujemy Twoje
            raporty i przygotujemy listę rekomendacji.
          </p>
          <p className="text-slate-400">
            W pełnej wersji możesz umówić konsultację bezpośrednio z panelu PapaData – z
            kalendarzem i integracją z Twoim narzędziem do spotkań.
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Settings view -----------------------------------------------------------

function SettingsView() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [sidebarFixed, setSidebarFixed] = useState(true);

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
        <h2 className="mb-2 text-sm font-semibold text-slate-50">
          Ustawienia konta demo
        </h2>
        <p className="text-xs text-slate-300">
          Te ustawienia działają tylko w tej sesji demo i nie zapisują się
          nigdzie w bazie danych.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-xs text-slate-200">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
            Motyw
          </p>
          <p className="text-slate-400">
            Domyślnie demo działa w trybie ciemnym. W pełnym panelu możesz
            przełączać motyw per użytkownik.
          </p>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
            className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none"
          >
            <option value="dark">Ciemny (zalecany)</option>
            <option value="light" disabled>
              Jasny (wkrótce)
            </option>
          </select>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-xs text-slate-200">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
            Sidebar
          </p>
          <p className="text-slate-400">
            Możesz przypiąć panel boczny na stałe lub zostawić go w trybie
            „hover”.
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span>Sidebar przypięty</span>
            <button
              type="button"
              onClick={() => setSidebarFixed(!sidebarFixed)}
              className={`flex h-5 w-10 items-center rounded-full p-0.5 ${
                sidebarFixed ? 'justify-end bg-cyan-600' : 'justify-start bg-slate-700'
              }`}
            >
              <div className="h-4 w-4 rounded-full bg-white" />
            </button>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Ustawienie to jest tylko przykładem – realnie konfigurujemy je per
            użytkownik po zalogowaniu.
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Page --------------------------------------------------------------------

export default function DemoDashboardPage() {
  const [view, setView] = useState<View>('dashboard');
  const [range, setRange] = useState<Range>('last30');
  const [sidebarFixed, setSidebarFixed] = useState(true);
  const [lastSync, setLastSync] = useState<string>('przed chwilą');

  useEffect(() => {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    setLastSync(`${hh}:${mm}`);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Sidebar
        view={view}
        setView={setView}
        fixed={sidebarFixed}
        setFixed={setSidebarFixed}
      />
      <div className="ml-[72px] transition-all duration-300 md:ml-60">
        <Topbar view={view} range={range} setRange={setRange} lastSync={lastSync} />
        <main className="min-h-[calc(100vh-3.5rem)] bg-slate-950/95">
          {view === 'dashboard' && <DashboardView range={range} />}
          {view === 'reports' && <ReportsView />}
          {view === 'integrations' && <IntegrationsView />}
          {view === 'academy' && <AcademyView />}
          {view === 'support' && <SupportView />}
          {view === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
