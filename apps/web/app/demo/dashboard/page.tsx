'use client';

import React, { useEffect, useMemo, useState, FormEvent } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  BarChart3,
  GraduationCap,
  Headset,
  Plug,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Loader2,
  PlayCircle,
  Video,
  FileText,
  Lock,
  AlertTriangle,
  Filter,
  Info,
  Calendar,
  Mail,
  SunMedium,
  MoonStar,
  Globe2,
  Languages,
} from 'lucide-react';

type DemoSection =
  | 'dashboard'
  | 'liveReports'
  | 'academy'
  | 'support'
  | 'integrations'
  | 'settings';

type TimeRange = 'today' | '7d' | '30d';

type DemoLanguage = 'system' | 'pl' | 'en';
type DemoTheme = 'dark' | 'light';

type Toast = {
  id: number;
  message: string;
  variant: 'success' | 'info';
};

export default function DemoDashboardPage() {
  const [demoLanguage, setDemoLanguage] = useState<DemoLanguage>('system');
  const [systemIsPl, setSystemIsPl] = useState<boolean>(true);
  const [theme, setTheme] = useState<DemoTheme>('dark');
  const [activeSection, setActiveSection] = useState<DemoSection>('dashboard');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [sidebarPinned, setSidebarPinned] = useState<boolean>(false);
  const [sidebarHover, setSidebarHover] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // "System" = język z przeglądarki (PL/EN)
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const lang = navigator.language.toLowerCase();
      setSystemIsPl(!lang.startsWith('en'));
    }
  }, []);

  const isPl =
    demoLanguage === 'pl' ||
    (demoLanguage === 'system' && systemIsPl === true);

  const themeClasses =
    theme === 'dark'
      ? 'bg-slate-950 text-slate-50'
      : 'bg-slate-50 text-slate-900';

  const sidebarExpanded = sidebarPinned || sidebarHover;

  const pushToast = (message: string, variant: 'success' | 'info' = 'info') => {
    setToasts((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), message, variant },
    ]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const sectionTitle = useMemo(() => {
    if (activeSection === 'dashboard') {
      return isPl
        ? 'Pulpit – demo danych e-commerce'
        : 'Dashboard – e-commerce demo data';
    }
    if (activeSection === 'liveReports') {
      return isPl
        ? 'Raporty Live – tryb demonstracyjny'
        : 'Live Reports – demo mode';
    }
    if (activeSection === 'academy') {
      return isPl
        ? 'PapaData Academy – materiały edukacyjne'
        : 'PapaData Academy – educational materials';
    }
    if (activeSection === 'support') {
      return isPl ? 'Wsparcie i konsultacje' : 'Support and consultations';
    }
    if (activeSection === 'integrations') {
      return isPl
        ? 'Integracje PapaData – wersja demo'
        : 'PapaData integrations – demo mode';
    }
    if (activeSection === 'settings') {
      return isPl ? 'Ustawienia konta demo' : 'Demo account settings';
    }
    return '';
  }, [activeSection, isPl]);

  const sectionSubtitle = useMemo(() => {
    switch (activeSection) {
      case 'dashboard':
        return isPl
          ? 'Przegląd kluczowych wskaźników i wniosków AI na danych demonstracyjnych.'
          : 'Overview of key metrics and AI insights on demo data.';
      case 'liveReports':
        return isPl
          ? 'Serce systemu – pełne raporty Live zobaczysz po założeniu konta.'
          : 'The heart of the system – full Live Reports are available in real accounts.';
      case 'academy':
        return isPl
          ? 'Wybrane materiały o analityce e-commerce i pracy z PapaData.'
          : 'Selected materials on e-commerce analytics and working with PapaData.';
      case 'support':
        return isPl
          ? 'Zobacz, jak wygląda zamówienie konsultacji w PapaData.'
          : 'See how requesting a consultation works in PapaData.';
      case 'integrations':
        return isPl
          ? 'Podgląd katalogu integracji – w demie symulujemy podłączenie źródeł.'
          : 'Preview of the integrations catalog – demo simulates connecting sources.';
      case 'settings':
        return isPl
          ? 'Zobacz przykładowe opcje konfiguracji Twojego konta.'
          : 'Preview of typical configuration options for your account.';
      default:
        return '';
    }
  }, [activeSection, isPl]);

  return (
    <main className={`min-h-screen ${themeClasses}`}>
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside
          className={`relative flex flex-col border-r border-slate-800/70 bg-slate-950/80 px-2 py-3 transition-[width] duration-200 ${
            sidebarExpanded ? 'w-60' : 'w-16'
          }`}
          onMouseEnter={() => {
            if (!sidebarPinned) setSidebarHover(true);
          }}
          onMouseLeave={() => {
            if (!sidebarPinned) setSidebarHover(false);
          }}
        >
          {/* Logo / sygnet */}
          <div className="mb-6 flex items-center gap-2 px-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-xs font-semibold tracking-[0.18em] text-emerald-300">
              PD
            </div>
            {sidebarExpanded && (
              <span className="text-sm font-semibold tracking-tight text-slate-50">
                PapaData
              </span>
            )}
          </div>

          {/* Menu sekcji */}
          <nav className="flex flex-1 flex-col gap-1">
            <SidebarItem
              isPl={isPl}
              expanded={sidebarExpanded}
              icon={<LayoutDashboard className="h-4 w-4" />}
              labelPl="Pulpit"
              labelEn="Dashboard"
              active={activeSection === 'dashboard'}
              onClick={() => setActiveSection('dashboard')}
            />

            <SidebarItem
              isPl={isPl}
              expanded={sidebarExpanded}
              icon={<BarChart3 className="h-4 w-4" />}
              labelPl="Raporty Live"
              labelEn="Live Reports"
              active={activeSection === 'liveReports'}
              onClick={() => setActiveSection('liveReports')}
            />

            <SidebarItem
              isPl={isPl}
              expanded={sidebarExpanded}
              icon={<GraduationCap className="h-4 w-4" />}
              labelPl="Akademia"
              labelEn="Academy"
              active={activeSection === 'academy'}
              onClick={() => setActiveSection('academy')}
            />

            <SidebarItem
              isPl={isPl}
              expanded={sidebarExpanded}
              icon={<Headset className="h-4 w-4" />}
              labelPl="Wsparcie"
              labelEn="Support"
              tooltip={
                isPl ? 'Konsultacje i kontakt' : 'Consultations and contact'
              }
              active={activeSection === 'support'}
              onClick={() => setActiveSection('support')}
            />

            <SidebarItem
              isPl={isPl}
              expanded={sidebarExpanded}
              icon={<Plug className="h-4 w-4" />}
              labelPl="Integracje"
              labelEn="Integrations"
              active={activeSection === 'integrations'}
              onClick={() => setActiveSection('integrations')}
            />

            <SidebarItem
              isPl={isPl}
              expanded={sidebarExpanded}
              icon={<Settings className="h-4 w-4" />}
              labelPl="Ustawienia"
              labelEn="Settings"
              active={activeSection === 'settings'}
              onClick={() => setActiveSection('settings')}
            />

            {/* Separator */}
            <div className="mt-4 border-t border-slate-800/60" />

            {/* Wylogowanie */}
            <Link
              href="/?from=demo"
              className="mt-auto flex items-center gap-3 rounded-xl px-2 py-2 text-xs text-slate-400 transition hover:bg-slate-900 hover:text-rose-300"
              title={isPl ? 'Wyloguj z demo' : 'Log out of demo'}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-rose-300">
                <LogOut className="h-4 w-4" />
              </span>
              {sidebarExpanded && (
                <span className="text-[13px] font-medium">
                  {isPl ? 'Wyloguj z demo' : 'Log out of demo'}
                </span>
              )}
            </Link>
          </nav>

          {/* Kontrolka zwijania (mała strzałka) */}
          <button
            type="button"
            onClick={() => setSidebarPinned((v) => !v)}
            className="mt-4 flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 px-2 py-1 text-slate-400 transition hover:border-emerald-500 hover:text-emerald-300"
            title={
              sidebarPinned
                ? isPl
                  ? 'Odblokuj automatyczne zwijanie'
                  : 'Allow auto-collapse'
                : isPl
                ? 'Zawsze pokazuj rozwinięty panel'
                : 'Always keep sidebar expanded'
            }
          >
            {sidebarExpanded ? (
              <ChevronLeft className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        </aside>

        {/* PRAWA STRONA */}
        <div className="flex min-h-screen flex-1 flex-col bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950/90">
          {/* TOP BAR */}
          <DemoTopBar
            isPl={isPl}
            sectionTitle={sectionTitle}
            sectionSubtitle={sectionSubtitle}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-4 pb-8 pt-4 md:px-6 md:pt-6">
            {activeSection === 'dashboard' && (
              <DashboardSection
                isPl={isPl}
                timeRange={timeRange}
                theme={theme}
              />
            )}

            {activeSection === 'liveReports' && (
              <LiveReportsSection isPl={isPl} />
            )}

            {activeSection === 'academy' && (
              <AcademySection isPl={isPl} pushToast={pushToast} />
            )}

            {activeSection === 'support' && (
              <SupportSection isPl={isPl} pushToast={pushToast} />
            )}

            {activeSection === 'integrations' && (
              <IntegrationsSection isPl={isPl} pushToast={pushToast} />
            )}

            {activeSection === 'settings' && (
              <SettingsSection
                isPl={isPl}
                demoLanguage={demoLanguage}
                onDemoLanguageChange={setDemoLanguage}
                theme={theme}
                onThemeChange={setTheme}
                sidebarPinned={sidebarPinned}
                onSidebarPinnedChange={setSidebarPinned}
                pushToast={pushToast}
              />
            )}
          </div>
        </div>
      </div>

      {/* TOASTY */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex max-w-sm items-start gap-3 rounded-xl border px-3 py-2 text-xs shadow-lg ${
              toast.variant === 'success'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
                : 'border-slate-700 bg-slate-900/90 text-slate-100'
            }`}
          >
            <div className="mt-0.5">
              {toast.variant === 'success' ? (
                <Sparkles className="h-4 w-4 text-emerald-300" />
              ) : (
                <Info className="h-4 w-4 text-slate-300" />
              )}
            </div>
            <div className="flex-1">{toast.message}</div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="ml-1 text-slate-400 hover:text-slate-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  SIDEBAR                                   */
/* -------------------------------------------------------------------------- */

type SidebarItemProps = {
  isPl: boolean;
  expanded: boolean;
  icon: React.ReactNode;
  labelPl: string;
  labelEn: string;
  active?: boolean;
  onClick?: () => void;
  tooltip?: string;
};

function SidebarItem({
  isPl,
  expanded,
  icon,
  labelPl,
  labelEn,
  active,
  onClick,
  tooltip,
}: SidebarItemProps) {
  const label = isPl ? labelPl : labelEn;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-2 py-2 text-xs transition ${
        active
          ? 'bg-emerald-500/15 text-emerald-200'
          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
      }`}
      title={tooltip || label}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-lg ${
          active
            ? 'bg-emerald-500/15 text-emerald-300'
            : 'bg-slate-900 text-slate-300'
        }`}
      >
        {icon}
      </span>
      {expanded && (
        <span className="text-[13px] font-medium tracking-tight">{label}</span>
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   TOPBAR                                   */
/* -------------------------------------------------------------------------- */

type DemoTopBarProps = {
  isPl: boolean;
  sectionTitle: string;
  sectionSubtitle: string;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
};

function DemoTopBar({
  isPl,
  sectionTitle,
  sectionSubtitle,
  timeRange,
  onTimeRangeChange,
}: DemoTopBarProps) {
  return (
    <header className="border-b border-slate-800/70 bg-slate-950/90 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center justify-between gap-4">
        {/* Tytuł + opis sekcji */}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
            {isPl ? 'Tryb demonstracyjny' : 'Demo mode'}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="truncate text-sm md:text-base font-semibold tracking-tight">
              {sectionTitle}
            </h1>
          </div>
          <p className="mt-1 hidden max-w-2xl text-[11px] text-slate-400 md:block">
            {sectionSubtitle}
          </p>
        </div>

        {/* Range + sync + avatar */}
        <div className="flex flex-1 items-center justify-end gap-3">
          {/* Zakres czasu */}
          <div className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/70 px-1 py-0.5">
            <RangeChip
              isPl={isPl}
              labelPl="Dziś"
              labelEn="Today"
              active={timeRange === 'today'}
              onClick={() => onTimeRangeChange('today')}
            />
            <RangeChip
              isPl={isPl}
              labelPl="Ostatnie 7 dni"
              labelEn="Last 7 days"
              active={timeRange === '7d'}
              onClick={() => onTimeRangeChange('7d')}
            />
            <RangeChip
              isPl={isPl}
              labelPl="Ostatnie 30 dni"
              labelEn="Last 30 days"
              active={timeRange === '30d'}
              onClick={() => onTimeRangeChange('30d')}
            />
          </div>

          {/* Ostatnia synchronizacja */}
          <div className="hidden items-center gap-1 rounded-full border border-slate-800 bg-slate-950/70 px-3 py-1 text-[11px] text-slate-300 md:flex">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span
              className="cursor-help"
              title={
                isPl
                  ? 'Dane demo są odświeżane automatycznie, aby pokazać typowe wahania.'
                  : 'Demo data is refreshed automatically to show typical fluctuations.'
              }
            >
              {isPl ? 'Ostatnia synchronizacja:' : 'Last sync:'}{' '}
              <span className="font-medium">12:57</span>
            </span>
          </div>

          {/* Avatar / konto demo */}
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 text-xs font-semibold text-slate-950 shadow-lg"
            title={isPl ? 'Konto demo: JD Store' : 'Demo account: JD Store'}
          >
            JD
          </div>
        </div>
      </div>
    </header>
  );
}

type RangeChipProps = {
  isPl: boolean;
  labelPl: string;
  labelEn: string;
  active: boolean;
  onClick: () => void;
};

function RangeChip({ isPl, labelPl, labelEn, active, onClick }: RangeChipProps) {
  const label = isPl ? labelPl : labelEn;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[11px] transition ${
        active
          ? 'bg-emerald-500 text-slate-950'
          : 'text-slate-300 hover:bg-slate-900'
      }`}
    >
      {label}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                              DASHBOARD SECTION                             */
/* -------------------------------------------------------------------------- */

type DashboardSectionProps = {
  isPl: boolean;
  timeRange: TimeRange;
  theme: DemoTheme;
};

function DashboardSection({ isPl, timeRange }: DashboardSectionProps) {
  return (
    <div className="space-y-6">
      {/* AI Asystent */}
      <AIAssistantPanel isPl={isPl} />

      {/* KPI GRID */}
      <KPIGallery isPl={isPl} timeRange={timeRange} />

      {/* Główny wykres */}
      <PerformanceTimeline isPl={isPl} timeRange={timeRange} />
    </div>
  );
}

type AIAssistantPanelProps = {
  isPl: boolean;
};

function AIAssistantPanel({ isPl }: AIAssistantPanelProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [activeInsightIndex, setActiveInsightIndex] = useState<number>(0);
  const [showQuestionInput, setShowQuestionInput] = useState<boolean>(false);
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [mockAnswer, setMockAnswer] = useState<string | null>(null);

  const insights = useMemo(
    () =>
      isPl
        ? [
            'Przychód z kampanii „Brand Search – Google Ads” wzrósł o 28% vs poprzedni okres, ale koszt pozyskania nowych klientów w Meta Ads spadł o 18%. Sugeruję: zwiększyć budżet kampanii brandowej o 20% i przetestować nowy zestaw kreacji w Meta.',
            'Produkty z kategorii „Akcesoria zimowe” odpowiadają za 35% przychodu, ale nie mają osobnej kampanii remarketingowej. Sugeruję stworzyć kampanię dynamiczną skierowaną do osób, które dodały te produkty do koszyka.',
          ]
        : [
            'Revenue from your “Brand Search – Google Ads” campaign increased by 28% vs the previous period, while the cost of acquiring new customers via Meta Ads dropped by 18%. I suggest increasing your brand campaign budget by 20% and testing a new creative set on Meta.',
            'Products in the “Winter accessories” category generate 35% of revenue but do not have a dedicated remarketing campaign. I suggest creating a dynamic campaign targeting users who added these products to cart.',
          ],
    [isPl],
  );

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleNextInsight = () => {
    setActiveInsightIndex((prev) => (prev + 1) % insights.length);
  };

  const handleAskQuestion = (e: FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    const answer = isPl
      ? 'To odpowiedź przykładowa: w prawdziwym koncie Asystent AI przeanalizuje Twoje dane sprzedażowe i kampanie w czasie rzeczywistym, a następnie zaproponuje konkretne działania optymalizacyjne.'
      : 'This is a sample reply: in a real account, the AI Assistant would analyze your sales and campaign data in real time and then suggest concrete optimisation actions.';

    setMockAnswer(answer);
  };

  return (
    <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-950/95 p-4 shadow-[0_0_40px_rgba(16,185,129,0.25)] md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              {isPl
                ? 'Asystent AI – podsumowanie Twoich danych'
                : 'AI Assistant – summary of your data'}
            </p>
            <p className="mt-1 text-[11px] text-emerald-100/90">
              {isPl
                ? 'Na tej wersji demonstracyjnej widzisz przykładowe wnioski wygenerowane na podstawie danych e-commerce. W prawdziwym koncie AI analizuje Twoje kampanie i sprzedaż w czasie rzeczywistym.'
                : 'In this demo you see sample insights generated from e-commerce data. In your real account, the AI analyzes your campaigns and sales in real time.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-emerald-200/90">
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {isPl ? 'Demo danych e-commerce' : 'E-commerce demo data'}
          </span>
        </div>
      </div>

      {/* BODY */}
      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Lewa kolumna – status / insight */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-slate-950/80 px-3 py-2 text-[11px] text-emerald-100">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-300" />
              <span>
                {isPl
                  ? 'Analizuję dane z ostatnich 30 dni...'
                  : 'Analyzing data from the last 30 days...'}
              </span>
              <div className="ml-auto h-1 flex-1 rounded-full bg-slate-800">
                <div className="h-1 w-1/2 animate-pulse rounded-full bg-emerald-400" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border border-emerald-500/30 bg-slate-950/80 p-3 text-[12px] text-slate-100">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                    {isPl ? 'Insight AI #1' : 'AI insight #1'}
                  </p>
                  <button
                    type="button"
                    onClick={handleNextInsight}
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-100 hover:bg-emerald-500/20"
                  >
                    {isPl ? 'Następny wniosek' : 'Next insight'}
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                <p className="leading-relaxed">
                  {insights[activeInsightIndex]}
                </p>
              </div>

              {insights.length > 1 && (
                <div className="flex gap-1">
                  {insights.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 flex-1 rounded-full ${
                        idx === activeInsightIndex
                          ? 'bg-emerald-400'
                          : 'bg-emerald-500/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Prawa kolumna – zadawanie pytania */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px] text-slate-100">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {isPl ? 'Interakcja z Asystentem AI' : 'Interact with AI Assistant'}
          </p>
          <p className="mb-2 text-[11px] text-slate-400">
            {isPl
              ? 'W wersji demo możesz zasymulować zadanie pytania – poniżej zobaczysz przykładową odpowiedź.'
              : 'In the demo you can simulate asking a question – below you will see a sample answer.'}
          </p>

          {!showQuestionInput && (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:bg-slate-800"
              >
                {isPl ? 'Pokaż szczegóły' : 'Show details'}
              </button>
              <button
                type="button"
                onClick={() => setShowQuestionInput(true)}
                className="inline-flex items-center justify-center rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-100 hover:bg-emerald-500/20"
              >
                {isPl ? 'Zadaj własne pytanie' : 'Ask your own question'}
              </button>
            </div>
          )}

          {showQuestionInput && (
            <form onSubmit={handleAskQuestion} className="mt-2 space-y-2">
              <textarea
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                className="min-h-[70px] w-full rounded-lg border border-slate-700 bg-slate-950/90 px-2 py-1.5 text-[11px] text-slate-100 outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1"
                placeholder={
                  isPl
                    ? 'Np. „Które kampanie generują najwyższy ROAS w ostatnich 7 dniach?”'
                    : 'E.g. “Which campaigns generate the highest ROAS in the last 7 days?”'
                }
              />

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-3 py-1.5 text-[11px] font-medium text-slate-950 hover:bg-emerald-400"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                {isPl ? 'Wyślij do Asystenta AI (demo)' : 'Send to AI (demo)'}
              </button>

              {mockAnswer && (
                <div className="mt-2 rounded-lg border border-emerald-500/30 bg-slate-950/80 p-2 text-[11px] text-emerald-100">
                  {mockAnswer}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* KPI GRID */

type KPIGalleryProps = {
  isPl: boolean;
  timeRange: TimeRange;
};

function KPIGallery({ isPl, timeRange }: KPIGalleryProps) {
  const data = useMemo(() => {
    if (timeRange === 'today') {
      return {
        revenue: '4 320 PLN',
        marketing: '1 150 PLN',
        roas: '3.76',
        aov: '242 PLN',
        margin: '38%',
        delta: {
          revenue: '+4,2%',
          marketing: '+1,1%',
          roas: '+6,5%',
          aov: '+2,1%',
          margin: '+0,8%',
        },
      };
    }
    if (timeRange === '7d') {
      return {
        revenue: '38 920 PLN',
        marketing: '8 450 PLN',
        roas: '4.07',
        aov: '228 PLN',
        margin: '36%',
        delta: {
          revenue: '+9,8%',
          marketing: '+3,2%',
          roas: '+11,3%',
          aov: '+4,1%',
          margin: '+1,9%',
        },
      };
    }
    // 30d
    return {
      revenue: '124 592 PLN',
      marketing: '27 840 PLN',
      roas: '4.48',
      aov: '236 PLN',
      margin: '37%',
      delta: {
        revenue: '+12,5%',
        marketing: '+5,4%',
        roas: '+14,2%',
        aov: '+3,7%',
        margin: '+2,3%',
      },
    };
  }, [timeRange]);

  const vsLabel = isPl ? 'vs poprzedni okres' : 'vs previous period';

  return (
    <section className="grid gap-3 md:grid-cols-5">
      <KpiCard
        label={isPl ? 'Przychód (okres wybrany)' : 'Revenue (selected period)'}
        value={data.revenue}
        delta={`${data.delta.revenue} ${vsLabel}`}
      />
      <KpiCard
        label={isPl ? 'Wydatki marketingowe' : 'Marketing spend'}
        value={data.marketing}
        delta={`${data.delta.marketing} ${vsLabel}`}
      />
      <KpiCard
        label={isPl ? 'ROAS (łączny)' : 'ROAS (blended)'}
        value={data.roas}
        delta={`${data.delta.roas} ${vsLabel}`}
      />
      <KpiCard
        label={
          isPl
            ? 'Średnia wartość koszyka (AOV)'
            : 'Average order value (AOV)'
        }
        value={data.aov}
        delta={`${data.delta.aov} ${vsLabel}`}
      />
      <KpiCard
        label={isPl ? 'Marża szacunkowa' : 'Estimated margin'}
        value={data.margin}
        delta={`${data.delta.margin} ${vsLabel}`}
      />
    </section>
  );
}

type KpiCardProps = {
  label: string;
  value: string;
  delta: string;
};

function KpiCard({ label, value, delta }: KpiCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-3 text-[11px] shadow-sm">
      <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="text-lg font-semibold tracking-tight text-slate-50">
        {value}
      </p>
      <p className="mt-1 text-[10px] font-medium text-emerald-300">{delta}</p>
    </div>
  );
}

/* PERFORMANCE TIMELINE */

type PerformanceTimelineProps = {
  isPl: boolean;
  timeRange: TimeRange;
};

function PerformanceTimeline({
  isPl,
  timeRange,
}: PerformanceTimelineProps) {
  const [primaryMetric, setPrimaryMetric] = useState<'revenue' | 'orders'>(
    'revenue',
  );
  const [secondaryMetric, setSecondaryMetric] = useState<
    'spend' | 'sessions'
  >('spend');

  const points = useMemo(() => {
    const length = timeRange === 'today' ? 12 : timeRange === '7d' ? 7 : 30;
    const result: {
      x: number;
      revenue: number;
      orders: number;
      spend: number;
      sessions: number;
    }[] = [];
    for (let i = 0; i < length; i += 1) {
      const base = timeRange === 'today' ? 100 : timeRange === '7d' ? 800 : 2500;
      const variation = Math.sin(i / 2.3) * 0.2 + Math.random() * 0.15;
      const revenue = base * (1 + variation);
      const spend = revenue * (0.18 + Math.random() * 0.04);
      const orders = revenue / (timeRange === 'today' ? 220 : 240);
      const sessions = orders * (3 + Math.random() * 1.5);

      result.push({
        x: i,
        revenue,
        orders,
        spend,
        sessions,
      });
    }
    return result;
  }, [timeRange]);

  const maxPrimary = Math.max(...points.map((p) => p[primaryMetric]));
  const maxSecondary = Math.max(...points.map((p) => p[secondaryMetric]));

  const primaryLabel =
    primaryMetric === 'revenue'
      ? isPl
        ? 'Przychód'
        : 'Revenue'
      : isPl
      ? 'Zamówienia'
      : 'Orders';

  const secondaryLabel =
    secondaryMetric === 'spend'
      ? isPl
        ? 'Wydatki marketingowe'
        : 'Marketing spend'
      : isPl
      ? 'Sesje (GA4)'
      : 'Sessions (GA4)';

  return (
    <section className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {isPl
              ? 'Sprzedaż i wydatki w czasie'
              : 'Sales and spend over time'}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {isPl
              ? 'Porównaj przychód ze wszystkich kanałów z wydatkami marketingowymi.'
              : 'Compare total revenue from all channels with your marketing spend.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <div className="flex items-center gap-2 rounded-full bg-slate-900/80 px-2 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <select
              value={primaryMetric}
              onChange={(e) =>
                setPrimaryMetric(e.target.value as 'revenue' | 'orders')
              }
              className="bg-transparent text-xs outline-none"
            >
              <option value="revenue">
                {isPl ? 'Przychód' : 'Revenue'}
              </option>
              <option value="orders">
                {isPl ? 'Zamówienia' : 'Orders'}
              </option>
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-900/80 px-2 py-1">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            <select
              value={secondaryMetric}
              onChange={(e) =>
                setSecondaryMetric(e.target.value as 'spend' | 'sessions')
              }
              className="bg-transparent text-xs outline-none"
            >
              <option value="spend">
                {isPl ? 'Wydatki marketingowe' : 'Marketing spend'}
              </option>
              <option value="sessions">
                {isPl ? 'Sesje (GA4)' : 'Sessions (GA4)'}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Pseudo-chart */}
      <div className="mt-4 h-56 w-full rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 px-3 py-3">
        <div className="flex h-full items-end gap-[2px]">
          {points.map((p) => {
            const primaryRatio = p[primaryMetric] / maxPrimary || 0;
            const secondaryRatio = p[secondaryMetric] / maxSecondary || 0;
            return (
              <div key={p.x} className="flex flex-1 flex-col justify-end gap-0.5">
                <div
                  className="mx-auto w-[5px] rounded-full bg-sky-400/70"
                  style={{ height: `${Math.max(secondaryRatio * 90, 4)}%` }}
                />
                <div
                  className="mx-auto w-[5px] rounded-full bg-emerald-400"
                  style={{ height: `${Math.max(primaryRatio * 90, 6)}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend summary */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {primaryLabel}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-0.5">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            {secondaryLabel}
          </span>
        </div>
        <p className="text-slate-500">
          {isPl
            ? 'Zakres czasowy kontrolujesz w górnym pasku.'
            : 'Control the time range from the top bar.'}
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                            LIVE REPORTS SECTION                             */
/* -------------------------------------------------------------------------- */

type LiveReportsSectionProps = {
  isPl: boolean;
};

function LiveReportsSection({ isPl }: LiveReportsSectionProps) {
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    'sales' | 'campaigns' | 'customers' | 'technical'
  >('sales');

  return (
    <section className="space-y-4">
      {/* Obszar tła z „kombajnem” */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/90 p-4 md:p-5">
        {/* Tło rozmyte */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute inset-4 rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),transparent_60%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.25),transparent_55%)] blur-[1px]" />
          <div className="absolute inset-4 rounded-2xl border border-slate-800/60" />
        </div>

        {!unlocked && (
          <div className="relative z-10 mx-auto max-w-xl rounded-2xl border border-slate-700 bg-slate-950/95 p-4 text-sm shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
              {isPl ? 'Serce systemu PapaData' : 'The heart of PapaData'}
            </p>
            <h2 className="mt-2 text-base font-semibold">
              {isPl
                ? 'Tutaj zobaczysz wszystkie raporty Live'
                : 'This is where you see all Live Reports'}
            </h2>
            <p className="mt-2 text-[13px] text-slate-300">
              {isPl
                ? 'W pełnym koncie zobaczysz tutaj wszystkie raporty Live – sprzedaż, kampanie, techniczne, customer journey i wiele więcej. Wersja demo pokazuje tylko przykładowe dane. Pełny dostęp odblokujesz po założeniu konta i rozpoczęciu 14-dniowego okresu próbnego.'
                : 'In your real account you will see all Live Reports here – sales, campaigns, technical, customer journey and much more. The demo shows only sample data. Full access is unlocked after you create an account and start a 14-day trial.'}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/wizard"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-medium text-slate-950 shadow-sm hover:bg-emerald-400"
              >
                {isPl
                  ? 'Odblokuj w pełnej wersji (14 dni za darmo)'
                  : 'Unlock in full version (14 days free)'}
              </Link>
              <button
                type="button"
                onClick={() => setUnlocked(true)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-emerald-500"
              >
                {isPl
                  ? 'Zobacz, jak wygląda raport demo'
                  : 'View demo report'}
              </button>
            </div>
          </div>
        )}

        {unlocked && (
          <div className="relative z-10 space-y-4">
            {/* Pasek trybu demo */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>
                  {isPl
                    ? 'Tryb demonstracyjny. Dane są przykładowe – aby zobaczyć własne raporty Live, załóż konto.'
                    : 'Demo mode. Data is sample only – to see your own Live Reports, create an account.'}
                </span>
              </div>
              <Link
                href="/wizard"
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-3 py-1 text-[11px] font-medium text-slate-950 hover:bg-amber-300"
              >
                {isPl ? 'Załóż konto' : 'Create account'}
              </Link>
            </div>

            {/* Zakładki */}
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <LiveTab
                isPl={isPl}
                labelPl="Sprzedaż"
                labelEn="Sales"
                active={activeTab === 'sales'}
                onClick={() => setActiveTab('sales')}
              />
              <LiveTab
                isPl={isPl}
                labelPl="Kampanie"
                labelEn="Campaigns"
                active={activeTab === 'campaigns'}
                onClick={() => setActiveTab('campaigns')}
              />
              <LiveTab
                isPl={isPl}
                labelPl="Klienci"
                labelEn="Customers"
                active={activeTab === 'customers'}
                onClick={() => setActiveTab('customers')}
              />
              <LiveTab
                isPl={isPl}
                labelPl="Techniczne"
                labelEn="Technical"
                active={activeTab === 'technical'}
                onClick={() => setActiveTab('technical')}
              />
            </div>

            {/* „Kombajn raportowy” */}
            <div className="grid gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              {/* Filtry */}
              <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px]">
                <p className="flex items-center gap-2 text-[11px] font-semibold text-slate-200">
                  <Filter className="h-4 w-4 text-slate-400" />
                  {isPl ? 'Filtry' : 'Filters'}
                </p>
                <div className="space-y-2">
                  <FilterField
                    label={isPl ? 'Kanał' : 'Channel'}
                    options={['Google Ads', 'Meta Ads', 'Allegro', 'GA4']}
                  />
                  <FilterField
                    label={isPl ? 'Kampania' : 'Campaign'}
                    options={
                      isPl
                        ? ['Brand Search', 'Performance Max', 'Remarketing']
                        : ['Brand Search', 'Performance Max', 'Remarketing']
                    }
                  />
                  <FilterField
                    label={isPl ? 'Kraj' : 'Country'}
                    options={['PL', 'DE', 'CZ', 'Other']}
                  />
                </div>
              </div>

              {/* Tabela + wykresy */}
              <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px]">
                <p className="text-[11px] font-semibold text-slate-200">
                  {activeTab === 'sales'
                    ? isPl
                      ? 'Sprzedaż wg kanału'
                      : 'Sales by channel'
                    : activeTab === 'campaigns'
                    ? isPl
                      ? 'Performance kampanii'
                      : 'Campaign performance'
                    : activeTab === 'customers'
                    ? isPl
                      ? 'Segmenty klientów'
                      : 'Customer segments'
                    : isPl
                    ? 'Parametry techniczne'
                    : 'Technical metrics'}
                </p>

                <div className="overflow-hidden rounded-lg border border-slate-800">
                  <table className="min-w-full divide-y divide-slate-800 bg-slate-950/70">
                    <thead className="bg-slate-900/80 text-[10px] uppercase tracking-[0.12em] text-slate-400">
                      <tr>
                        <th className="px-3 py-2 text-left">
                          {isPl ? 'Nazwa' : 'Name'}
                        </th>
                        <th className="px-3 py-2 text-right">
                          {isPl ? 'Przychód' : 'Revenue'}
                        </th>
                        <th className="px-3 py-2 text-right">
                          {isPl ? 'Koszt' : 'Cost'}
                        </th>
                        <th className="px-3 py-2 text-right">ROAS</th>
                        <th className="px-3 py-2 text-right">
                          {isPl ? 'Sesje' : 'Sessions'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-[11px] text-slate-100">
                      <tr>
                        <td className="px-3 py-2">
                          {isPl
                            ? 'Google Ads – Brand Search'
                            : 'Google Ads – Brand Search'}
                        </td>
                        <td className="px-3 py-2 text-right">54 320 PLN</td>
                        <td className="px-3 py-2 text-right">12 840 PLN</td>
                        <td className="px-3 py-2 text-right">4.23</td>
                        <td className="px-3 py-2 text-right">18 420</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">
                          {isPl
                            ? 'Meta Ads – Prospecting'
                            : 'Meta Ads – Prospecting'}
                        </td>
                        <td className="px-3 py-2 text-right">38 210 PLN</td>
                        <td className="px-3 py-2 text-right">9 320 PLN</td>
                        <td className="px-3 py-2 text-right">4.10</td>
                        <td className="px-3 py-2 text-right">14 980</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">
                          {isPl ? 'Allegro – Ads' : 'Allegro – Ads'}
                        </td>
                        <td className="px-3 py-2 text-right">22 062 PLN</td>
                        <td className="px-3 py-2 text-right">5 680 PLN</td>
                        <td className="px-3 py-2 text-right">3.88</td>
                        <td className="px-3 py-2 text-right">9 432</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Mini-wykres słupkowy */}
                <div className="mt-2 flex gap-1">
                  {[72, 64, 48, 82, 95, 60, 70].map((v, idx) => (
                    <div
                      key={idx}
                      className="flex-1 rounded-t-full bg-gradient-to-t from-slate-800 to-emerald-400/70"
                      style={{ height: `${v}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

type LiveTabProps = {
  isPl: boolean;
  labelPl: string;
  labelEn: string;
  active: boolean;
  onClick: () => void;
};

function LiveTab({ isPl, labelPl, labelEn, active, onClick }: LiveTabProps) {
  const label = isPl ? labelPl : labelEn;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-[11px] transition ${
        active
          ? 'bg-emerald-500 text-slate-950'
          : 'border border-slate-700 bg-slate-950/70 text-slate-200 hover:border-emerald-500/70'
      }`}
    >
      {label}
    </button>
  );
}

type FilterFieldProps = {
  label: string;
  options: string[];
};

function FilterField({ label, options }: FilterFieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
      <select className="w-full rounded-lg border border-slate-700 bg-slate-950/90 px-2 py-1 text-[11px] text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-1">
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            INTEGRATIONS SECTION                            */
/* -------------------------------------------------------------------------- */

type IntegrationStatus = 'available' | 'comingSoon' | 'voting';

type IntegrationItem = {
  id: string;
  name: string;
  category:
    | 'Marketing'
    | 'Store'
    | 'Marketplace'
    | 'Analytics'
    | 'CRM'
    | 'Tools'
    | 'Payment'
    | 'Logistics'
    | 'Accounting';
  status: IntegrationStatus;
  votes?: number;
};

const INTEGRATIONS: IntegrationItem[] = [
  { id: 'woocommerce', name: 'WooCommerce', category: 'Store', status: 'available' },
  { id: 'shopify', name: 'Shopify', category: 'Store', status: 'available' },
  { id: 'idosell', name: 'IdoSell', category: 'Store', status: 'available' },
  { id: 'skyshop', name: 'Sky-Shop', category: 'Store', status: 'available' },
  { id: 'allegro', name: 'Allegro', category: 'Marketplace', status: 'available' },
  { id: 'kaufland', name: 'Kaufland', category: 'Marketplace', status: 'voting', votes: 23 },
  { id: 'empik', name: 'Empik Place', category: 'Marketplace', status: 'voting', votes: 17 },
  { id: 'ga4', name: 'Google Analytics 4', category: 'Analytics', status: 'available' },
  { id: 'googleAds', name: 'Google Ads', category: 'Marketing', status: 'available' },
  { id: 'metaAds', name: 'Meta Ads', category: 'Marketing', status: 'available' },
  { id: 'tiktokAds', name: 'TikTok Ads', category: 'Marketing', status: 'available' },
  { id: 'microsoftAds', name: 'Microsoft Ads', category: 'Marketing', status: 'comingSoon' },
  { id: 'pinterestAds', name: 'Pinterest Ads', category: 'Marketing', status: 'comingSoon' },
  { id: 'linkedinAds', name: 'LinkedIn Ads', category: 'Marketing', status: 'voting', votes: 31 },
  { id: 'klaviyo', name: 'Klaviyo', category: 'Marketing', status: 'comingSoon' },
  { id: 'baseLinker', name: 'BaseLinker', category: 'Tools', status: 'available' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', status: 'comingSoon' },
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', status: 'voting', votes: 12 },
  { id: 'stripe', name: 'Stripe', category: 'Payment', status: 'comingSoon' },
  { id: 'przelewy24', name: 'Przelewy24', category: 'Payment', status: 'comingSoon' },
  { id: 'inpost', name: 'InPost', category: 'Logistics', status: 'comingSoon' },
  { id: 'fakturownia', name: 'Fakturownia', category: 'Accounting', status: 'comingSoon' },
  { id: 'sheets', name: 'Google Sheets', category: 'Tools', status: 'available' },
];

type IntegrationsSectionProps = {
  isPl: boolean;
  pushToast: (msg: string, variant?: 'success' | 'info') => void;
};

function IntegrationsSection({ isPl, pushToast }: IntegrationsSectionProps) {
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<
    'All' | IntegrationItem['category']
  >('All');
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    INTEGRATIONS.forEach((item) => {
      if (typeof item.votes === 'number') initial[item.id] = item.votes;
    });
    return initial;
  });

  const filtered = useMemo(
    () =>
      INTEGRATIONS.filter((i) => {
        if (categoryFilter !== 'All' && i.category !== categoryFilter) {
          return false;
        }
        if (search.trim().length > 0) {
          return i.name.toLowerCase().includes(search.toLowerCase());
        }
        return true;
      }),
    [search, categoryFilter],
  );

  const handleConnectDemo = () => {
    pushToast(
      isPl
        ? 'Symulacja: integracja połączona. W prawdziwym koncie dodasz klucze API w kilka kliknięć.'
        : 'Simulation: integration connected. In a real account you will add API keys in just a few clicks.',
      'success',
    );
  };

  const handleVote = (id: string) => {
    setVoteCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    pushToast(
      isPl
        ? 'Dziękujemy za głos! Użyj tego przycisku, aby podpowiedzieć nam, które integracje wdrożyć jako pierwsze.'
        : 'Thanks for voting! Use this button to help us prioritise which integrations to ship first.',
      'success',
    );
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 md:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {isPl
            ? 'Integracje PapaData – wersja demo'
            : 'PapaData integrations – demo mode'}
        </p>
        <p className="mt-2 text-[13px] text-slate-300">
          {isPl
            ? 'Tutaj zobaczysz wszystkie platformy, które możesz podłączyć do PapaData. Kliknięcie „Połącz” w wersji demo tylko symuluje działanie – prawdziwe klucze API dodasz po założeniu konta.'
            : 'Here you will see all platforms you can connect to PapaData. Clicking “Connect (demo)” merely simulates the action – real API keys are added after you create an account.'}
        </p>

        {/* Search + filters */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 pr-8 text-[11px] text-slate-100 outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1"
              placeholder={
                isPl ? 'Szukaj integracji...' : 'Search integrations...'
              }
            />
            <Plug className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-slate-500" />
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {(
              [
                'All',
                'Marketing',
                'Store',
                'Marketplace',
                'Analytics',
                'CRM',
                'Tools',
                'Payment',
                'Logistics',
                'Accounting',
              ] as const
            ).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-3 py-1 transition ${
                  categoryFilter === cat
                    ? 'bg-emerald-500 text-slate-950'
                    : 'border border-slate-700 bg-slate-950/80 text-slate-200 hover:border-emerald-500/60'
                }`}
              >
                {(() => {
                  if (cat === 'All') return isPl ? 'Wszystkie' : 'All';
                  if (cat === 'Marketing') return 'Marketing';
                  if (cat === 'Store') return isPl ? 'Sklep' : 'Store';
                  if (cat === 'Marketplace') return 'Marketplace';
                  if (cat === 'Analytics') return isPl ? 'Analityka' : 'Analytics';
                  if (cat === 'CRM') return 'CRM';
                  if (cat === 'Tools') return isPl ? 'Narzędzia' : 'Tools';
                  if (cat === 'Payment') return isPl ? 'Płatności' : 'Payment';
                  if (cat === 'Logistics') return isPl ? 'Logistyka' : 'Logistics';
                  if (cat === 'Accounting') return isPl ? 'Księgowość' : 'Accounting';
                  return cat;
                })()}
              </button>
            ))}
          </div>
        </div>

        {/* Katalog kafelków */}
        <div className="mt-4 grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px]"
            >
              <div>
                <p className="text-[12px] font-semibold text-slate-50">
                  {item.name}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  {item.category}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                {item.status === 'available' && (
                  <button
                    type="button"
                    onClick={handleConnectDemo}
                    className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-2.5 py-1 text-[11px] font-medium text-slate-950 hover:bg-emerald-400"
                  >
                    {isPl ? 'Połącz (demo)' : 'Connect (demo)'}
                  </button>
                )}

                {item.status === 'comingSoon' && (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-400"
                    title={
                      isPl
                        ? 'Ta integracja jest w trakcie wdrożenia.'
                        : 'This integration is currently being developed.'
                    }
                  >
                    {isPl ? 'Wkrótce' : 'Coming soon'}
                  </button>
                )}

                {item.status === 'voting' && (
                  <button
                    type="button"
                    onClick={() => handleVote(item.id)}
                    className="inline-flex items-center justify-center rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-100 hover:bg-emerald-500/20"
                  >
                    {isPl ? 'Zagłosuj' : 'Vote'}
                  </button>
                )}

                {item.status === 'voting' && (
                  <span className="text-[10px] text-slate-400">
                    {isPl ? 'Głosy:' : 'Votes:'}{' '}
                    <span className="font-semibold text-emerald-300">
                      {voteCounts[item.id] ?? item.votes ?? 0}
                    </span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                             ACADEMY SECTION                                */
/* -------------------------------------------------------------------------- */

type AcademySectionProps = {
  isPl: boolean;
  pushToast: (msg: string, variant?: 'success' | 'info') => void;
};

type AcademyModal =
  | { type: 'video' }
  | { type: 'article' }
  | { type: 'premium' }
  | null;

function AcademySection({ isPl, pushToast }: AcademySectionProps) {
  const [openModal, setOpenModal] = useState<AcademyModal>(null);

  useEffect(() => {
    if (openModal) {
      pushToast(
        isPl
          ? 'To tylko podgląd interfejsu. W pełnej wersji zobaczysz prawdziwe nagrania i artykuły.'
          : 'This is just a UI preview. In the full version you will see real recordings and articles.',
        'info',
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

  const cards = useMemo(
    () => [
      {
        id: 'video-demo',
        type: 'video' as const,
        title: isPl
          ? 'Jak w 5 minut przejść przez rejestrację w PapaData'
          : 'How to complete PapaData signup in 5 minutes',
        subtitle: isPl
          ? 'Krok po kroku: od formularza do pierwszych raportów.'
          : 'Step by step: from signup form to your first reports.',
        locked: false,
      },
      {
        id: 'article-demo',
        type: 'article' as const,
        title: isPl
          ? '3 najczęstsze błędy w raportowaniu sprzedaży e-commerce'
          : '3 most common mistakes in e-commerce sales reporting',
        subtitle: isPl
          ? 'Jak uniknąć pułapki raportów z Excela i różnych źródeł danych.'
          : 'How to avoid the trap of Excel and scattered reports.',
        locked: false,
      },
      {
        id: 'premium-1',
        type: 'premium' as const,
        title: isPl
          ? 'Case study: wzrost ROAS o 67% w 90 dni'
          : 'Case study: 67% ROAS uplift in 90 days',
        subtitle: isPl
          ? 'Pełne omówienie strategii i wdrożenia PapaData.'
          : 'Full breakdown of strategy and PapaData implementation.',
        locked: true,
      },
      {
        id: 'premium-2',
        type: 'premium' as const,
        title: isPl
          ? 'Checklista wdrożenia analityki e-commerce'
          : 'E-commerce analytics implementation checklist',
        subtitle: isPl
          ? 'Lista kroków dla zespołów marketingu i IT.'
          : 'Step-by-step list for marketing and IT teams.',
        locked: true,
      },
      {
        id: 'premium-3',
        type: 'premium' as const,
        title: isPl
          ? 'Jak czytać raporty cohortowe klientów'
          : 'How to read customer cohort reports',
        subtitle: isPl
          ? 'Praktyczne przykłady segmentacji klientów.'
          : 'Practical examples of customer segmentation.',
        locked: true,
      },
      {
        id: 'premium-4',
        type: 'premium' as const,
        title: isPl
          ? 'Zaawansowana optymalizacja kampanii Performance Max'
          : 'Advanced optimisation of Performance Max campaigns',
        subtitle: isPl
          ? 'Jak łączyć dane z wielu źródeł w jednym widoku.'
          : 'How to combine data from multiple sources in one view.',
        locked: true,
      },
    ],
    [isPl],
  );

  const handleCardClick = (type: 'video' | 'article' | 'premium') => {
    if (type === 'video') setOpenModal({ type: 'video' });
    else if (type === 'article') setOpenModal({ type: 'article' });
    else setOpenModal({ type: 'premium' });
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 md:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {isPl
            ? 'PapaData Academy – wiedza o analityce i e-commerce'
            : 'PapaData Academy – knowledge on analytics and e-commerce'}
        </p>
        <p className="mt-2 text-[13px] text-slate-300">
          {isPl
            ? 'W pełnej wersji PapaData znajdziesz tu nagrania, artykuły i case studies z prawdziwych wdrożeń. W wersji demo udostępniamy część materiałów, aby pokazać, czego możesz się spodziewać.'
            : 'In the full PapaData product you will find recordings, articles and case studies from real implementations. In the demo we share a subset of materials to give you a taste of what to expect.'}
        </p>

        {/* Grid kafelków */}
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card.type)}
              className={`flex flex-col items-start rounded-2xl border px-3 py-3 text-left text-[11px] transition ${
                card.locked
                  ? 'border-slate-800 bg-slate-950/60 opacity-80 hover:border-emerald-500/40 hover:opacity-100'
                  : 'border-slate-800 bg-slate-950/80 hover:border-emerald-500/60'
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-xl text-slate-100 ${
                    card.type === 'video'
                      ? 'bg-emerald-500/20 text-emerald-200'
                      : card.type === 'article'
                      ? 'bg-sky-500/20 text-sky-200'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  {card.type === 'video' && <PlayCircle className="h-4 w-4" />}
                  {card.type === 'article' && <FileText className="h-4 w-4" />}
                  {card.type === 'premium' && <Lock className="h-4 w-4" />}
                </div>
                <p className="text-[12px] font-semibold text-slate-50">
                  {card.title}
                </p>
              </div>
              <p className="flex-1 text-[11px] text-slate-300">
                {card.subtitle}
              </p>
              {card.locked && (
                <p className="mt-2 text-[10px] text-emerald-300">
                  {isPl
                    ? 'Materiał premium – dostępny dla klientów PapaData'
                    : 'Premium content – available for PapaData customers'}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Modale */}
      {openModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 backdrop-blur">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-4 text-[12px] text-slate-100 shadow-2xl">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {openModal.type === 'video' && (
                  <>
                    <Video className="h-4 w-4 text-emerald-300" />
                    <p className="text-[12px] font-semibold">
                      {isPl
                        ? 'Podgląd playera wideo – wersja demo'
                        : 'Video player preview – demo'}
                    </p>
                  </>
                )}
                {openModal.type === 'article' && (
                  <>
                    <FileText className="h-4 w-4 text-sky-300" />
                    <p className="text-[12px] font-semibold">
                      {isPl
                        ? 'Podgląd artykułu – wersja demo'
                        : 'Article preview – demo'}
                    </p>
                  </>
                )}
                {openModal.type === 'premium' && (
                  <>
                    <Lock className="h-4 w-4 text-emerald-300" />
                    <p className="text-[12px] font-semibold">
                      {isPl
                        ? 'Odblokuj wszystkie materiały'
                        : 'Unlock all materials'}
                    </p>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpenModal(null)}
                className="rounded-full bg-slate-900 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Treść modalowa */}
            {openModal.type === 'video' && (
              <div className="space-y-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[11px] text-slate-300">
                    <PlayCircle className="h-10 w-10 text-emerald-300" />
                    <p>
                      {isPl
                        ? 'Placeholder playera – w pełnej wersji zobaczysz tu prawdziwe nagranie.'
                        : 'Placeholder player – in the full product you will see a real recording here.'}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  {isPl
                    ? 'To tylko demonstracja interfejsu. W produkcyjnej wersji PapaData Academy każdy materiał ma pełny player, rozdziały i transkrypcję.'
                    : 'This is only a UI demo. In the production version of PapaData Academy each video has a full player, chapters and transcript.'}
                </p>
              </div>
            )}

            {openModal.type === 'article' && (
              <div className="space-y-2">
                <p className="text-[13px] font-semibold">
                  {isPl
                    ? '3 najczęstsze błędy w raportowaniu sprzedaży e-commerce'
                    : '3 most common mistakes in e-commerce sales reporting'}
                </p>
                <p className="text-[11px] text-slate-300">
                  {isPl
                    ? '1. Patrzenie tylko na przychód, bez marży i kosztów pozyskania. 2. Różne definicje „zamówienia” w analityce i platformach reklamowych. 3. Ręczne scalanie danych z wielu źródeł w Excelu, które utrudnia codzienne decyzje.'
                    : '1. Looking only at revenue, ignoring margin and acquisition cost. 2. Different “order” definitions in analytics vs. ad platforms. 3. Manually stitching data from multiple sources in Excel, making daily decisions hard.'}
                </p>
                <p className="text-[11px] text-slate-300">
                  {isPl
                    ? 'PapaData rozwiązuje te problemy, budując jeden spójny model danych, który łączy sprzedaż, marketing i klientów w jednym miejscu.'
                    : 'PapaData solves these problems by building a single, coherent data model which links sales, marketing and customers in one place.'}
                </p>
              </div>
            )}

            {openModal.type === 'premium' && (
              <div className="space-y-2 text-[11px] text-slate-300">
                <p>
                  {isPl
                    ? 'Pełny dostęp do webinarów, case studies i checklist otrzymasz po założeniu konta.'
                    : 'You get full access to webinars, case studies and checklists once you create an account.'}
                </p>
                <Link
                  href="/wizard"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-3 py-1.5 text-[11px] font-medium text-slate-950 hover:bg-emerald-400"
                >
                  {isPl
                    ? 'Załóż konto (14 dni za darmo)'
                    : 'Create account (14 days free)'}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                            SUPPORT / CONSULTATIONS                         */
/* -------------------------------------------------------------------------- */

type SupportSectionProps = {
  isPl: boolean;
  pushToast: (msg: string, variant?: 'success' | 'info') => void;
};

function SupportSection({ isPl, pushToast }: SupportSectionProps) {
  const [topic, setTopic] = useState<string>('marketing');
  const [budgetRange, setBudgetRange] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    pushToast(
      isPl
        ? 'To tylko wersja demo. W prawdziwym koncie Twoje zgłoszenie trafi bezpośrednio do zespołu PapaData.'
        : 'This is only a demo. In a real account your request would go straight to the PapaData team.',
      'info',
    );
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 md:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {isPl ? 'Wsparcie i konsultacje' : 'Support and consultations'}
        </p>
        <p className="mt-2 text-[13px] text-slate-300">
          {isPl
            ? 'Możesz zamówić analizę specjalisty lub zadać pytanie zespołowi PapaData. W wersji demo formularz pokazuje, jakie informacje zbieramy przed konsultacją.'
            : 'You can request an expert analysis or ask a question to the PapaData team. In the demo, the form shows what information we typically collect before a consultation.'}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
        >
          {/* Główne pola */}
          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px]">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-200">
                {isPl ? 'Temat konsultacji' : 'Topic of consultation'}
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/90 px-2 py-1.5 text-[11px] text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-1"
              >
                <option value="marketing">
                  {isPl ? 'Kampanie marketingowe' : 'Marketing campaigns'}
                </option>
                <option value="budget">
                  {isPl ? 'Budżet' : 'Budget'}
                </option>
                <option value="analytics">
                  {isPl ? 'Analityka' : 'Analytics'}
                </option>
                <option value="implementation">
                  {isPl ? 'Implementacja' : 'Implementation'}
                </option>
                <option value="other">
                  {isPl ? 'Inne' : 'Other'}
                </option>
              </select>
            </div>

            {topic === 'budget' && (
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-200">
                  {isPl
                    ? 'Zakres budżetu miesięcznego'
                    : 'Monthly budget range'}
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/90 px-2 py-1.5 text-[11px] text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-1"
                >
                  <option value="">
                    {isPl ? 'Wybierz zakres' : 'Select a range'}
                  </option>
                  <option value="0-10k">
                    {isPl ? 'do 10 000 PLN' : 'up to 10,000 PLN'}
                  </option>
                  <option value="10-50k">
                    {isPl ? '10 000–50 000 PLN' : '10,000–50,000 PLN'}
                  </option>
                  <option value="50-200k">
                    {isPl ? '50 000–200 000 PLN' : '50,000–200,000 PLN'}
                  </option>
                  <option value="200k+">
                    {isPl ? 'powyżej 200 000 PLN' : 'above 200,000 PLN'}
                  </option>
                </select>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-200">
                {isPl ? 'Opis sytuacji' : 'Describe your situation'}
              </label>
              <textarea
                className="min-h-[90px] w-full rounded-lg border border-slate-700 bg-slate-950/90 px-2 py-1.5 text-[11px] text-slate-100 outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1"
                placeholder={
                  isPl
                    ? 'Opisz, co dokładnie chcesz przeanalizować. Podaj dane, okres, kanały i główny cel.'
                    : 'Describe what exactly you want to analyse. Provide data, timeframe, channels and main objective.'
                }
              />
            </div>
          </div>

          {/* Dane dodatkowe */}
          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px]">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-200">
                {isPl
                  ? 'Preferowana data konsultacji'
                  : 'Preferred consultation date'}
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/90 px-2 py-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  className="flex-1 bg-transparent text-[11px] text-slate-100 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-200">
                {isPl ? 'E-mail do kontaktu' : 'Contact email'}
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/90 px-2 py-1.5">
                <Mail className="h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  className="flex-1 bg-transparent text-[11px] text-slate-100 outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1 rounded-lg bg-slate-900/60 px-2.5 py-2">
              <p className="text-[11px] font-semibold text-slate-100">
                {isPl
                  ? 'Informacja o cenie i czasie'
                  : 'Information about price and time'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isPl
                  ? 'Czas trwania konsultacji: 60 minut. Usługa jest dodatkowo płatna – wycenę otrzymasz przed potwierdzeniem terminu.'
                  : 'Consultation duration: 60 minutes. The service is billed separately – you will receive a quote before confirming the appointment.'}
              </p>
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-3 py-1.5 text-[11px] font-medium text-slate-950 hover:bg-emerald-400"
            >
              {isPl
                ? 'Wyślij prośbę o konsultację'
                : 'Send consultation request'}
            </button>

            {submitted && (
              <p className="mt-2 text-[11px] text-emerald-300">
                {isPl
                  ? 'To tylko wersja demo. W prawdziwym koncie Twoje zgłoszenie trafi bezpośrednio do zespołu PapaData.'
                  : 'This is only a demo. In a real account your request would go straight to the PapaData team.'}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              SETTINGS SECTION                              */
/* -------------------------------------------------------------------------- */

type SettingsSectionProps = {
  isPl: boolean;
  demoLanguage: DemoLanguage;
  onDemoLanguageChange: (lang: DemoLanguage) => void;
  theme: DemoTheme;
  onThemeChange: (theme: DemoTheme) => void;
  sidebarPinned: boolean;
  onSidebarPinnedChange: (value: boolean) => void;
  pushToast: (msg: string, variant?: 'success' | 'info') => void;
};

function SettingsSection({
  isPl,
  demoLanguage,
  onDemoLanguageChange,
  theme,
  onThemeChange,
  sidebarPinned,
  onSidebarPinnedChange,
  pushToast,
}: SettingsSectionProps) {
  const handleDeleteDemoAccount = () => {
    pushToast(
      isPl
        ? 'To konto demonstracyjne – nie możesz go usunąć. W pełnej wersji masz pełną kontrolę nad swoimi danymi.'
        : 'This is a demo account – you cannot delete it. In the full product you have full control over your data.',
      'info',
    );
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 md:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {isPl ? 'Ustawienia konta demo' : 'Demo account settings'}
        </p>
        <p className="mt-2 text-[13px] text-slate-300">
          {isPl
            ? 'Poniżej widzisz przykładowe opcje konfiguracyjne. Część z nich w trybie demo zmienia jedynie wygląd interfejsu.'
            : 'Below you see sample configuration options. In demo mode some of them only affect how the interface looks.'}
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {/* Język interfejsu */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px]">
            <div className="mb-1 flex items-center gap-2">
              <Languages className="h-4 w-4 text-slate-400" />
              <p className="text-[11px] font-semibold text-slate-100">
                {isPl ? 'Język interfejsu' : 'Interface language'}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 rounded-lg bg-slate-900/80 px-2 py-1">
                <input
                  type="radio"
                  name="demoLanguage"
                  checked={demoLanguage === 'pl'}
                  onChange={() => onDemoLanguageChange('pl')}
                  className="h-3 w-3 rounded-full border-slate-600 bg-slate-900 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <span>
                  {isPl ? 'Polski' : 'Polish'}
                </span>
              </label>
              <label className="flex items-center gap-2 rounded-lg bg-slate-900/80 px-2 py-1">
                <input
                  type="radio"
                  name="demoLanguage"
                  checked={demoLanguage === 'en'}
                  onChange={() => onDemoLanguageChange('en')}
                  className="h-3 w-3 rounded-full border-slate-600 bg-slate-900 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <span>{isPl ? 'Angielski' : 'English'}</span>
              </label>
              <label className="flex items-center gap-2 rounded-lg bg-slate-900/80 px-2 py-1">
                <input
                  type="radio"
                  name="demoLanguage"
                  checked={demoLanguage === 'system'}
                  onChange={() => onDemoLanguageChange('system')}
                  className="h-3 w-3 rounded-full border-slate-600 bg-slate-900 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <span>
                  {isPl
                    ? 'Zgodnie z językiem przeglądarki'
                    : 'Follow browser language'}
                </span>
              </label>
            </div>
            <p className="mt-1 text-[10px] text-slate-500">
              {isPl
                ? 'Zmiana dotyczy tylko tego demo. W prawdziwym koncie język zmienisz globalnie.'
                : 'Change applies to this demo only. In a real account language is configured globally.'}
            </p>
          </div>

          {/* Motyw */}
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px]">
            <div className="mb-1 flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-slate-400" />
              <p className="text-[11px] font-semibold text-slate-100">
                {isPl ? 'Motyw' : 'Theme'}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 rounded-lg bg-slate-900/80 px-2 py-1">
                <input
                  type="radio"
                  name="demoTheme"
                  checked={theme === 'dark'}
                  onChange={() => onThemeChange('dark')}
                  className="h-3 w-3 rounded-full border-slate-600 bg-slate-900 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <span className="inline-flex items-center gap-2">
                  <MoonStar className="h-3.5 w-3.5 text-emerald-300" />
                  {isPl ? 'Ciemny (zalecany)' : 'Dark (recommended)'}
                </span>
              </label>
              <label className="flex items-center gap-2 rounded-lg bg-slate-900/80 px-2 py-1">
                <input
                  type="radio"
                  name="demoTheme"
                  checked={theme === 'light'}
                  onChange={() => onThemeChange('light')}
                  className="h-3 w-3 rounded-full border-slate-600 bg-slate-900 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <span className="inline-flex items-center gap-2">
                  <SunMedium className="h-3.5 w-3.5 text-amber-300" />
                  {isPl ? 'Jasny' : 'Light'}
                </span>
              </label>
            </div>
            <p className="mt-1 text-[10px] text-slate-500">
              {isPl
                ? 'Przełącznik natychmiast zmienia tło demo. W produkcyjnej wersji motyw obejmie całą aplikację.'
                : 'The toggle immediately changes the demo background. In production the theme would apply to the entire app.'}
            </p>
          </div>

          {/* Panel boczny + usuwanie konta */}
          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px]">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-slate-400" />
                <p className="text-[11px] font-semibold text-slate-100">
                  {isPl ? 'Panel boczny' : 'Sidebar'}
                </p>
              </div>
              <label className="flex items-center gap-2 rounded-lg bg-slate-900/80 px-2 py-1">
                <input
                  type="checkbox"
                  checked={sidebarPinned}
                  onChange={(e) => onSidebarPinnedChange(e.target.checked)}
                  className="h-3 w-3 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <span>
                  {isPl
                    ? 'Zawsze pokazuj rozwinięty panel boczny'
                    : 'Always keep the sidebar expanded'}
                </span>
              </label>
              <p className="mt-1 text-[10px] text-slate-500">
                {isPl
                  ? 'Gdy opcja jest wyłączona, panel rozsuwa się tylko po najechaniu kursorem.'
                  : 'When disabled, the sidebar expands only on hover.'}
              </p>
            </div>

            <div className="border-t border-slate-800 pt-2">
              <p className="mb-1 text-[11px] font-semibold text-rose-300">
                {isPl ? 'Usuń konto (demo)' : 'Delete account (demo)'}
              </p>
              <p className="text-[10px] text-slate-500">
                {isPl
                  ? 'W pełnej wersji PapaData możesz poprosić o usunięcie danych w dowolnym momencie.'
                  : 'In the full PapaData product you can request data deletion at any time.'}
              </p>
              <button
                type="button"
                onClick={handleDeleteDemoAccount}
                className="mt-2 inline-flex items-center justify-center rounded-xl border border-rose-500/60 bg-rose-500/10 px-3 py-1.5 text-[11px] font-medium text-rose-200 hover:bg-rose-500/20"
              >
                {isPl ? 'Usuń konto' : 'Delete account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
