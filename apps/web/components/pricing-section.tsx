'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

type BillingPeriod = 'monthly' | 'yearly';

const BASE_PRICE_PER_SOURCE = 80; // PLN / źródło / mies.
const EXPERT_FEE = 999; // jednorazowo
const YEARLY_DISCOUNT = 0.2; // -20%

export default function PricingSection() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith('/en');

  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [sources, setSources] = useState(3);
  const [withExpert, setWithExpert] = useState(false);

  const { monthlyPrice, effectiveMonthly, expertFee } = useMemo(() => {
    const baseMonthly = sources * BASE_PRICE_PER_SOURCE;
    const discounted =
      billingPeriod === 'yearly'
        ? Math.round(baseMonthly * (1 - YEARLY_DISCOUNT))
        : baseMonthly;

    return {
      monthlyPrice: baseMonthly,
      effectiveMonthly: discounted,
      expertFee: withExpert ? EXPERT_FEE : 0,
    };
  }, [billingPeriod, sources, withExpert]);

  const totalUpfront =
    billingPeriod === 'monthly'
      ? effectiveMonthly + expertFee
      : effectiveMonthly * 12 + expertFee;

  return (
    <section
      id="pricing"
      className="border-t border-slate-800 bg-slate-950/60 py-16 md:py-24"
    >
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {isEn ? 'Pricing & configurator' : 'Cennik i konfigurator'}
          </h2>
          <p className="mt-3 text-base md:text-lg text-slate-300">
            {isEn
              ? 'Configure PapaData for your data sources and we will calculate the cost for you.'
              : 'Skonfiguruj PapaData pod liczbę źródeł danych, a my policzymy koszt za Ciebie.'}
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Konfigurator */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 md:p-6">
            {/* Przełącznik miesięcznie / rocznie */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-100">
                  {isEn ? 'Billing period' : 'Okres rozliczeniowy'}
                </p>
                <p className="text-xs text-slate-400">
                  {isEn
                    ? 'Yearly billing = 20% discount'
                    : 'Płatność roczna = rabat 20%'}
                </p>
              </div>
              <div className="inline-flex rounded-full bg-slate-800 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setBillingPeriod('monthly')}
                  className={`rounded-full px-3 py-1 font-medium transition-colors ${
                    billingPeriod === 'monthly'
                      ? 'bg-slate-950 text-emerald-400'
                      : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  {isEn ? 'Monthly' : 'Miesięcznie'}
                </button>
                <button
                  type="button"
                  onClick={() => setBillingPeriod('yearly')}
                  className={`rounded-full px-3 py-1 font-medium transition-colors ${
                    billingPeriod === 'yearly'
                      ? 'bg-slate-950 text-emerald-400'
                      : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  {isEn ? 'Yearly -20%' : 'Rocznie -20%'}
                </button>
              </div>
            </div>

            {/* Suwak źródeł */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-100">
                  {isEn ? 'Number of data sources' : 'Liczba źródeł danych'}
                </p>
                <span className="text-sm font-semibold text-emerald-400">
                  {sources}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={sources}
                onChange={(e) => setSources(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <p className="text-xs text-slate-400">
                {isEn ? 'Base price: ' : 'Cena bazowa: '}
                {sources} × {BASE_PRICE_PER_SOURCE} PLN /{' '}
                {isEn ? 'month' : 'mies.'} ={' '}
                <span className="font-semibold text-slate-100">
                  {monthlyPrice} PLN / {isEn ? 'month' : 'mies.'}
                </span>
              </p>
            </div>

            {/* Wdrożenie eksperckie */}
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <input
                id="expert-support"
                type="checkbox"
                checked={withExpert}
                onChange={(e) => setWithExpert(e.target.checked)}
                className="mt-1 h-4 w-4 cursor-pointer accent-emerald-500"
              />
              <label htmlFor="expert-support" className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-100">
                    {isEn ? 'Expert onboarding' : 'Wdrożenie z Ekspertem'}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                    +{EXPERT_FEE} PLN {isEn ? 'one-time' : 'jednorazowo'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {isEn
                    ? 'Kick-off workshop, integration setup and configuring first reports and AI assistant together.'
                    : 'Warsztat startowy, konfiguracja integracji oraz wspólne ustawienie pierwszych raportów i Asystenta AI.'}
                </p>
              </label>
            </div>
          </div>

          {/* Podsumowanie i CTA */}
          <div className="flex flex-col justify-between rounded-2xl border border-emerald-700/60 bg-gradient-to-b from-slate-900/80 to-slate-950 p-5 md:p-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                {isEn ? 'Summary' : 'Podsumowanie'}
              </p>
              <p className="text-sm text-slate-300">
                {billingPeriod === 'monthly'
                  ? isEn
                    ? 'Monthly billing for your current number of data sources.'
                    : 'Miesięczne rozliczenie za wybraną liczbę źródeł danych.'
                  : isEn
                  ? 'Yearly payment with 20% discount versus monthly price.'
                  : 'Roczna płatność z rabatem 20% względem ceny miesięcznej.'}
              </p>

              <div className="mt-4 space-y-2 rounded-xl bg-slate-950/80 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">
                    {isEn ? 'Effective monthly cost' : 'Efektywny koszt miesięczny'}
                  </span>
                  <span className="text-lg font-semibold text-emerald-400">
                    {effectiveMonthly} PLN
                  </span>
                </div>
                {withExpert && (
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>
                      {isEn
                        ? 'Expert onboarding (one-time)'
                        : 'Wdrożenie z Ekspertem (jednorazowo)'}
                    </span>
                    <span className="font-medium text-slate-100">
                      +{EXPERT_FEE} PLN
                    </span>
                  </div>
                )}
                <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3 text-xs text-slate-400">
                  <span>
                    {isEn
                      ? billingPeriod === 'monthly'
                        ? 'Total due now'
                        : 'Total yearly amount'
                      : billingPeriod === 'monthly'
                      ? 'Suma do zapłaty na start'
                      : 'Suma do zapłaty za rok'}
                  </span>
                  <span className="text-sm font-semibold text-slate-100">
                    {totalUpfront} PLN
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm md:text-base font-medium text-slate-950 shadow-sm transition-colors hover:bg-emerald-400 hover:shadow-md"
                onClick={() => {
                  // tutaj możesz później przenieść konfigurację do wizar
                }}
              >
                {isEn ? 'Contact us' : 'Skontaktuj sie'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
