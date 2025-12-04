'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Globe2,
  Loader2,
  Moon,
  RefreshCcw,
  Sparkles,
  Sun,
} from 'lucide-react';
import { useI18n } from '@papadata/i18n';
import { useTheme } from '../../components/theme-provider';

type Goal = 'roas' | 'margin' | 'newCustomers' | 'loyalty' | 'logistics';
type Report = 'dailySales' | 'campaignPerformance' | 'productsMargin' | 'funnel' | 'payments';

type IntegrationHealth = {
  id: string;
  status: 'ok' | 'connected' | 'needs_reauth' | 'error';
  updatedAt: number;
};

export default function DashboardPage() {
  const t = useI18n();
  const { theme, toggleTheme } = useTheme();
  const isPl = t.locale === 'pl';

  const [goals, setGoals] = useState<Goal[]>(['roas', 'margin']);
  const [reports, setReports] = useState<Report[]>(['dailySales', 'campaignPerformance']);
  const [expertCall, setExpertCall] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [integrationHealth, setIntegrationHealth] = useState<IntegrationHealth[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.sessionStorage.getItem('papadata.integrationHealth');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as IntegrationHealth[];
      setIntegrationHealth(parsed);
    } catch {
      // ignore parse errors
    }
  }, []);

  const needsAttention = useMemo(
    () => integrationHealth.some((item) => item.status === 'needs_reauth' || item.status === 'error'),
    [integrationHealth],
  );

  const toggleGoal = (goal: Goal) =>
    setGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  const toggleReport = (report: Report) =>
    setReports((prev) => (prev.includes(report) ? prev.filter((r) => r !== report) : [...prev, report]));

  const submitPreferences = () => setSubmitted(true);

  const statusCards = [
    {
      title: 'WooCommerce',
      desc: isPl ? 'Pobieranie ostatnich 365 dni zamowien...' : 'Fetching last 365 days of orders...',
      status: 'in-progress',
    },
    {
      title: 'Google Ads',
      desc: isPl ? 'Laczenie kampanii z zamowieniami...' : 'Linking campaigns with orders...',
      status: 'in-progress',
    },
    {
      title: 'Meta Ads',
      desc: isPl ? 'Przygotowujemy raport efektywnosci kampanii...' : 'Preparing campaign performance report...',
      status: 'waiting',
    },
  ];

  const updateIntegrationStatus = (id: string, status: IntegrationHealth['status']) => {
    setIntegrationHealth((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, status, updatedAt: Date.now() } : item));
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('papadata.integrationHealth', JSON.stringify(next));
      }
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              {isPl ? 'Pulpit' : 'Dashboard'}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {isPl ? 'Zaczynamy budowac Twoje dane' : 'We are building your data'}
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              {isPl
                ? 'Pierwsze KPI pojawia sie w ciagu kilku minut. Asystent AI ruszy po zebraniu wiarygodnych danych.'
                : 'First KPIs will appear within minutes. AI assistant will start once we have reliable data.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => t.setLocale(isPl ? 'en' : 'pl')}
              className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:border-emerald-500 hover:text-emerald-200"
            >
              <Globe2 className="h-3.5 w-3.5" />
              <span>{isPl ? 'PL' : 'EN'}</span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:border-emerald-500 hover:text-emerald-200"
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              {isPl ? 'Trial: 14 dni' : 'Trial: 14 days'}
            </span>
          </div>
        </div>

        {needsAttention && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            <AlertTriangle className="h-4 w-4" />
            <span>
              {isPl
                ? 'Niektóre integracje wymagają ponownego połączenia. Kliknij Reconnect poniżej.'
                : 'Some integrations need re-authentication. Use Reconnect below.'}
            </span>
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {statusCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-50">{card.title}</p>
                {card.status === 'in-progress' ? (
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-300" />
                ) : (
                  <Clock3 className="h-4 w-4 text-slate-400" />
                )}
              </div>
              <p className="mt-2 text-xs text-slate-300">{card.desc}</p>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            <p className="text-sm font-semibold text-slate-100">
              {isPl ? 'Stan integracji i ponowne logowanie' : 'Integration health and re-auth'}
            </p>
          </div>

          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">{isPl ? 'Integracja' : 'Integration'}</th>
                  <th className="px-4 py-3 font-semibold">{isPl ? 'Status' : 'Status'}</th>
                  <th className="px-4 py-3 font-semibold">{isPl ? 'Akcja' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {integrationHealth.length === 0 && (
                  <tr>
                    <td className="px-4 py-3 text-slate-400" colSpan={3}>
                      {isPl
                        ? 'Brak danych o integracjach. Uzupełnij kroki w kreatorze.'
                        : 'No integration data yet. Complete the wizard steps.'}
                    </td>
                  </tr>
                )}
                {integrationHealth.map((item) => {
                  const healthy = item.status === 'ok' || item.status === 'connected';
                  const statusLabel = healthy
                    ? isPl
                      ? 'OK'
                      : 'OK'
                    : item.status === 'needs_reauth'
                    ? isPl
                      ? 'Wymaga ponownego logowania'
                      : 'Re-authentication required'
                    : isPl
                    ? 'Błąd klucza'
                    : 'Invalid key';
                  return (
                    <tr key={item.id} className="border-t border-slate-800">
                      <td className="px-4 py-3 font-semibold text-slate-100">{item.id}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] ${
                            healthy
                              ? 'bg-emerald-500/10 text-emerald-200'
                              : item.status === 'needs_reauth'
                              ? 'bg-amber-500/10 text-amber-200'
                              : 'bg-rose-500/10 text-rose-200'
                          }`}
                        >
                          {healthy ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {!healthy && (
                          <button
                            type="button"
                            onClick={() => updateIntegrationStatus(item.id, 'ok')}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-200 hover:bg-emerald-500/20"
                          >
                            <RefreshCcw className="h-3.5 w-3.5" />
                            {isPl ? 'Reconnect' : 'Reconnect'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            <p className="text-sm font-semibold text-slate-100">
              {isPl ? 'Tworzymy Twoje Raporty Live' : 'We are preparing your Live Reports'}
            </p>
          </div>
          <p className="mt-2 text-sm text-slate-300">
            {isPl
              ? 'Dopasujemy widoki do Twojego biznesu. Odpowiedz na kilka pytan, a powiadomimy Cie, gdy beda gotowe.'
              : 'We will tailor the views to your business. Answer a few questions and we will notify you when they are ready.'}
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <PreferenceCard
              title={isPl ? 'Glowne cele' : 'Main goals'}
              options={[
                { id: 'roas', label: isPl ? 'Maksymalizacja ROAS' : 'Maximise ROAS' },
                { id: 'margin', label: isPl ? 'Analiza marzy netto' : 'Net margin analysis' },
                { id: 'newCustomers', label: isPl ? 'Pozyskiwanie nowych klientow' : 'Acquiring new customers' },
                { id: 'loyalty', label: isPl ? 'Lojalnosc i powroty' : 'Loyalty and retention' },
                { id: 'logistics', label: isPl ? 'Logistyka i zwroty' : 'Logistics and returns' },
              ]}
              selected={goals}
              toggle={(id: Goal) => toggleGoal(id)}
            />

            <PreferenceCard
              title={isPl ? 'Najwazniejsze raporty na start' : 'Most important reports first'}
              options={[
                { id: 'dailySales', label: isPl ? 'Sprzedaz dzienna' : 'Daily sales' },
                { id: 'campaignPerformance', label: isPl ? 'Performance kampanii' : 'Campaign performance' },
                { id: 'productsMargin', label: isPl ? 'Produkty i marza' : 'Products & margin' },
                { id: 'funnel', label: isPl ? 'Lejek zakupowy (GA4)' : 'Checkout funnel (GA4)' },
                { id: 'payments', label: isPl ? 'Platnosci i dostawy' : 'Payments & delivery' },
              ]}
              selected={reports}
              toggle={(id: Report) => toggleReport(id)}
            />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <label className="flex items-start gap-2 rounded-xl bg-slate-950/70 p-3 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={expertCall}
                onChange={(e) => setExpertCall(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
              />
              <span>
                {isPl
                  ? 'Tak - chce bezplatnego calla startowego z ekspertem PapaData.'
                  : 'Yes - I want a free kickoff call with a PapaData expert.'}
              </span>
            </label>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300">
              {isPl
                ? 'Spersonalizowane widoki Raportow Live pojawia sie maksymalnie w ciagu 14 dni od aktywacji konta i podpiecia platnosci.'
                : 'Personalised Live Reports will be ready within 14 days of activation and adding payment method.'}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={submitPreferences}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-400"
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {isPl ? 'Zapisano preferencje' : 'Preferences saved'}
                </>
              ) : (
                <>
                  {isPl ? 'Zapisz preferencje' : 'Save preferences'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            {submitted && (
              <span className="text-xs text-emerald-300">
                {isPl
                  ? 'Powiadomimy Cie emailem, gdy Raporty Live beda gotowe.'
                  : 'We will email you when Live Reports are ready.'}
              </span>
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm font-semibold text-slate-100">
              {isPl ? 'Asystent AI' : 'AI Assistant'}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              {isPl
                ? 'Asystent AI zacznie generowac wnioski, gdy pojawia sie pierwsze wiarygodne dane historyczne (zwykle po kilku godzinach).'
                : 'AI assistant will start generating insights once we collect reliable historical data (usually after a few hours).'}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm font-semibold text-slate-100">
              {isPl ? 'PapaData Academy' : 'PapaData Academy'}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              {isPl
                ? 'Jestes zalogowany jako klient PapaData. Wszystkie materialy Academy sa dostepne bez ograniczen.'
                : 'You are logged in as a PapaData customer. All Academy materials are available without limits.'}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function PreferenceCard({
  title,
  options,
  selected,
  toggle,
}: {
  title: string;
  options: { id: string; label: string }[];
  selected: string[];
  toggle: (id: any) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
      <p className="text-sm font-semibold text-slate-100">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              className={`rounded-full border px-3 py-1.5 text-[12px] transition ${
                active
                  ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-emerald-500/60'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
