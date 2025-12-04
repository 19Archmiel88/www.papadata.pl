'use client';

import Link from 'next/link';
import { ArrowRight, PlayCircle, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useI18n } from '@papadata/i18n';

import FeaturesSection from '../components/features-section';
import IntegrationsSection from '../components/integrations-section';
import ConsultationSection from '../components/consultation-section';
import FaqSection from '../components/faq-section';

export default function LandingPage() {
  const t = useI18n();
  const isPl = t.locale === 'pl';

  const [aiPhase, setAiPhase] = useState<'loading' | 'insight'>('loading');

  useEffect(() => {
    const id = setTimeout(() => setAiPhase('insight'), 1500);
    return () => clearTimeout(id);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* HERO */}
      <section className="border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950/90 pt-20 pb-16 md:pt-24 md:pb-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row md:items-center">
          {/* Teksty */}
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-300">
              <Sparkles className="h-3 w-3" />
              {t('landing.hero.tagline')}
            </p>

            <h1 className="mt-4 text-3xl font-semibold leading-snug tracking-tight text-slate-50 md:text-[34px]">
              <span>{t('landing.hero.title.line1')}</span>
              <br />
              <span className="text-slate-200">
                {t('landing.hero.title.line2')}
              </span>
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">
              {t('landing.hero.subtitle')}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/wizard"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-slate-950 shadow-sm transition hover:bg-emerald-400 hover:shadow-md"
              >
                {t('landing.hero.cta.trial')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/demo/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-emerald-500 hover:text-emerald-200"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                {isPl
                  ? 'Zobacz demo z prawdziwymi wykresami'
                  : 'View live demo with charts'}
              </Link>
            </div>

            <p className="mt-3 text-[11px] text-slate-400">
              {t('landing.hero.trustNote')}
            </p>
          </div>

          {/* Prawa kolumna – panel KPI + AI */}
          <div className="flex-1">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg md:p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-300">
                {t('landing.hero.panel.label')}
              </p>

              <div className="mt-3 rounded-xl bg-slate-950/80 p-4">
                <p className="text-xs text-slate-400">
                  {t('landing.hero.panel.kpi.title')}
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-50">
                  {t('landing.hero.panel.kpi.value')}
                </p>
                <p className="mt-1 text-xs font-medium text-emerald-400">
                  {t('landing.hero.panel.kpi.delta')}
                </p>
              </div>

              {/* AI bubble z prostą animacją */}
              <div className="mt-4 rounded-xl border border-emerald-500/40 bg-slate-950/80 p-3 text-xs text-slate-100 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 opacity-0 animate-pulse" />
                <div className="relative">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
                    AI insight
                  </p>

                  {aiPhase === 'loading' ? (
                    <div className="space-y-2">
                      <p className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        {isPl
                          ? 'Analizuję dane z ostatnich 30 dni...'
                          : 'Analyzing data from the last 30 days...'}
                      </p>
                      <div className="h-1 w-24 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full w-1/2 animate-[loading_1.2s_infinite] rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs leading-relaxed">
                      {t('landing.hero.aiBubble.text')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUNKCJE */}
      <FeaturesSection />

      {/* INTEGRACJE */}
      <IntegrationsSection />

      {/* CENNIK – placeholder z anchor #pricing */}
      <section
        id="pricing"
        className="border-t border-slate-800 bg-slate-950/80 py-16 md:py-20"
      >
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            {isPl ? 'Cennik' : 'Pricing'}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            {isPl
              ? 'Konfigurator cen pojawi się wkrótce'
              : 'Pricing configurator is coming soon'}
          </h2>
          <p className="mt-3 text-sm text-slate-300 md:text-base">
            {isPl
              ? 'Interaktywny kalkulator kosztów (liczba źródeł danych, wsparcie eksperta, rozliczenie miesięczne/roczne) dodamy w kolejnym kroku. Już teraz możesz rozpocząć trial i porozmawiać z nami o wycenie.'
              : 'An interactive pricing calculator (number of data sources, expert onboarding, monthly/yearly billing) will be added in the next iteration. You can already start a trial and talk to us about pricing.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/wizard"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-slate-950 shadow-sm transition hover:bg-emerald-400 hover:shadow-md"
            >
              {t('landing.hero.cta.trial')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="#consultations"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-emerald-500 hover:text-emerald-200"
            >
              {isPl ? 'Umów konsultację' : 'Book a consultation'}
            </Link>
          </div>
        </div>
      </section>

      {/* KONSULTACJE */}
      <ConsultationSection />

      {/* AKADEMIA / WEBINARY – placeholder #academy */}
      <section
        id="academy"
        className="border-t border-slate-800 bg-slate-950 py-16 md:py-20"
      >
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            {isPl ? 'Akademia i webinary' : 'Academy & webinars'}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            {isPl
              ? 'Materiały edukacyjne w przygotowaniu'
              : 'Educational materials are on the way'}
          </h2>
          <p className="mt-3 text-sm text-slate-300 md:text-base">
            {isPl
              ? 'Sekcja Akademii PapaData będzie zawierać webinary, nagrania i przewodniki po analityce e-commerce oraz AI. Na razie możesz zapisać się na konsultację lub rozpocząć trial.'
              : 'The PapaData Academy section will soon include webinars, recordings and guides on e-commerce analytics and AI. For now, you can book a consultation or start a trial.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="#consultations"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-emerald-500 hover:text-emerald-200"
            >
              {isPl
                ? 'Zobacz formularz konsultacji'
                : 'View consultation form'}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ + bezpieczeństwo */}
      <FaqSection />
    </main>
  );
}
