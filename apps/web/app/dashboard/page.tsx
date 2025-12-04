'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, Loader2, Sparkles } from 'lucide-react';
import { useI18n } from '@papadata/i18n';

type Goal = 'roas' | 'margin' | 'newCustomers' | 'loyalty' | 'logistics';
type Report = 'dailySales' | 'campaignPerformance' | 'productsMargin' | 'funnel' | 'payments';

export default function DashboardPage() {
  const t = useI18n();
  const isPl = t.locale === 'pl';
  const [goals, setGoals] = useState<Goal[]>(['roas', 'margin']);
  const [reports, setReports] = useState<Report[]>(['dailySales', 'campaignPerformance']);
  const [expertCall, setExpertCall] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const toggleGoal = (goal: Goal) =>
    setGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  const toggleReport = (report: Report) =>
    setReports((prev) => (prev.includes(report) ? prev.filter((r) => r !== report) : [...prev, report]));

  const submitPreferences = () => {
    setSubmitted(true);
  };

  const statusCards = [
    {
      title: 'WooCommerce',
      desc: isPl
        ? 'Pobieranie ostatnich 365 dni zamówień...'
        : 'Fetching last 365 days of orders...',
      status: 'in-progress',
    },
    {
      title: 'Google Ads',
      desc: isPl
        ? 'Łączenie kampanii z zamówieniami...'
        : 'Linking campaigns with orders...',
      status: 'in-progress',
    },
    {
      title: 'Meta Ads',
      desc: isPl
        ? 'Przygotowujemy raport efektywności kampanii...'
        : 'Preparing campaign performance report...',
      status: 'waiting',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              {isPl ? 'Pulpit' : 'Dashboard'}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {isPl ? 'Zaczynamy budować Twoje dane' : 'We are building your data'}
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              {isPl
                ? 'Pierwsze KPI pojawią się w ciągu kilku–kilkunastu minut. Asystent AI wystartuje po zebraniu wiarygodnych danych.'
                : 'First KPIs will appear within minutes. AI assistant will start once we have enough reliable data.'}
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
            {isPl ? 'Trial: 14 dni' : 'Trial: 14 days'}
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {statusCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
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

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            <p className="text-sm font-semibold text-slate-100">
              {isPl
                ? 'Tworzymy Twoje Raporty Live'
                : 'We are preparing your Live Reports'}
            </p>
          </div>
          <p className="mt-2 text-sm text-slate-300">
            {isPl
              ? 'Dopasujemy widoki do Twojego biznesu. Odpowiedz na kilka pytań, a powiadomimy Cię, gdy będą gotowe.'
              : 'We will tailor the views to your business. Answer a few questions and we will notify you when they are ready.'}
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <PreferenceCard
              title={isPl ? 'Główne cele' : 'Main goals'}
              options={[
                { id: 'roas', label: isPl ? 'Maksymalizacja ROAS' : 'Maximise ROAS' },
                { id: 'margin', label: isPl ? 'Analiza marży netto' : 'Net margin analysis' },
                { id: 'newCustomers', label: isPl ? 'Pozyskiwanie nowych klientów' : 'Acquiring new customers' },
                { id: 'loyalty', label: isPl ? 'Lojalność i powroty' : 'Loyalty and retention' },
                { id: 'logistics', label: isPl ? 'Logistyka i zwroty' : 'Logistics and returns' },
              ]}
              selected={goals}
              toggle={(id: Goal) => toggleGoal(id)}
            />

            <PreferenceCard
              title={isPl ? 'Najważniejsze raporty na start' : 'Most important reports first'}
              options={[
                { id: 'dailySales', label: isPl ? 'Sprzedaż dzienna' : 'Daily sales' },
                { id: 'campaignPerformance', label: isPl ? 'Performance kampanii' : 'Campaign performance' },
                { id: 'productsMargin', label: isPl ? 'Produkty i marża' : 'Products & margin' },
                { id: 'funnel', label: isPl ? 'Lejek zakupowy (GA4)' : 'Checkout funnel (GA4)' },
                { id: 'payments', label: isPl ? 'Płatności i dostawy' : 'Payments & delivery' },
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
                  ? 'Tak – chcę bezpłatnego calla startowego z ekspertem PapaData.'
                  : 'Yes – I want a free kickoff call with a PapaData expert.'}
              </span>
            </label>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300">
              {isPl
                ? 'Spersonalizowane widoki Raportów Live pojawią się maksymalnie w ciągu 14 dni od aktywacji konta i podpięcia płatności.'
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
                  ? 'Powiadomimy Cię emailem, gdy Raporty Live będą gotowe.'
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
                ? 'Asystent AI zacznie generować wnioski, gdy pojawią się pierwsze wiarygodne dane historyczne (zwykle po kilku godzinach).'
                : 'AI assistant will start generating insights once we collect reliable historical data (usually after a few hours).'}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm font-semibold text-slate-100">
              {isPl ? 'PapaData Academy' : 'PapaData Academy'}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              {isPl
                ? 'Jesteś zalogowany jako klient PapaData. Wszystkie materiały Academy są dostępne bez ograniczeń.'
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
