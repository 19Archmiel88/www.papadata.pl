import React, { useState } from 'react';
import { Slider } from '@radix-ui/react-slider';
import { Check } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language, Translation } from '../types';

interface Props {
  tOverride?: Translation['pricing'];
  langOverride?: Language;
}

const resolveLang = (override?: Language): Language => {
  if (override) return override;
  try {
    const stored = localStorage.getItem('papadata-lang') as Language | null;
    if (stored === 'PL' || stored === 'EN') return stored;
  } catch {
    // ignore
  }
  return 'PL';
};

const PricingOverview: React.FC<Props> = ({ tOverride, langOverride }) => {
  const lang = resolveLang(langOverride);
  const t = tOverride ?? TRANSLATIONS[lang].pricing;
  const isPL = lang === 'PL';

  const [sources, setSources] = useState<number>(3);
  const [withSupport, setWithSupport] = useState<boolean>(true);

  const base = 400;
  const perSource = 150;
  const price = base + sources * perSource;
  const total = price + (withSupport ? 500 : 0);

  return (
    <section className="bg-slate-950 py-16 text-slate-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t.title}
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            {isPL
              ? 'Prosty model abonamentowy – płacisz za liczbę źródeł danych i poziom wsparcia ekspertów, nie za każdy wiersz w hurtowni.'
              : 'Simple subscription model – you pay for the number of data sources and expert support level, not for every row in the warehouse.'}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
          <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-sm text-slate-200 shadow-sm shadow-black/40">
            <h3 className="text-base font-semibold text-slate-50">
              {t.calculator.title}
            </h3>

            <div className="mt-5 space-y-5 text-xs">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-300">
                  {t.calculator.sourceLabel}: <span className="font-semibold">{sources}</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Slider
                      min={1}
                      max={10}
                      defaultValue={[sources]}
                      onValueChange={([value]) => setSources(value)}
                    />
                  </div>
                  <span className="w-10 text-right text-[11px] text-slate-400">
                    {sources}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2">
                <div>
                  <p className="text-[11px] font-medium text-slate-200">
                    {t.calculator.supportLabel}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {t.calculator.supportDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWithSupport((v) => !v)}
                  className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-[11px] font-medium ${
                    withSupport
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-100'
                      : 'border-slate-600 bg-slate-900 text-slate-300'
                  }`}
                >
                  {withSupport
                    ? isPL
                      ? 'Włączone'
                      : 'Enabled'
                    : isPL
                    ? 'Wyłączone'
                    : 'Disabled'}
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-primary-500/50 bg-primary-500/10 p-4 text-xs text-primary-50">
              <p className="text-[11px] font-medium uppercase tracking-wide text-primary-200">
                {t.calculator.priceLabel}
              </p>
              <p className="mt-2 text-2xl font-semibold text-primary-50">
                {total.toLocaleString('pl-PL')} PLN
                <span className="ml-1 text-xs font-normal text-primary-100/80">
                  {t.calculator.perMonth}
                </span>
              </p>
              <p className="mt-2 text-[11px] text-primary-100/80">
                {isPL
                  ? `Szacunek: ${sources} źródła danych (${price.toLocaleString(
                      'pl-PL',
                    )} PLN) + ${withSupport ? 'pakiet wdrożeniowy' : 'bez pakietu wdrożeniowego'}.`
                  : `Estimate: ${sources} data sources (${price.toLocaleString(
                      'pl-PL',
                    )} PLN) + ${withSupport ? 'onboarding package' : 'no onboarding package'}.`}
              </p>

              <button
                type="button"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-500"
              >
                {t.calculator.cta}
              </button>
            </div>
          </article>

          <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-xs text-slate-200 shadow-sm shadow-black/40">
            <h3 className="text-sm font-semibold text-slate-50">
              {isPL ? 'W abonamencie PapaData dostajesz:' : 'Your PapaData subscription includes:'}
            </h3>
            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 text-emerald-400" />
                <span>
                  {isPL
                    ? 'Gotowe raporty sprzedażowe, marketingowe i marżowe.'
                    : 'Ready-made sales, marketing and margin dashboards.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 text-emerald-400" />
                <span>
                  {isPL
                    ? 'Asystent AI, który tłumaczy liczby na decyzje.'
                    : 'AI assistant translating numbers into decisions.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 text-emerald-400" />
                <span>
                  {isPL
                    ? 'Infrastrukturę w Google Cloud (hurtownia danych, ETL).'
                    : 'Google Cloud infrastructure (warehouse, ETL layer).'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 text-emerald-400" />
                <span>
                  {isPL
                    ? 'Pełną zgodność z RODO i regionami UE.'
                    : 'Full GDPR compliance and EU regions.'}
                </span>
              </li>
            </ul>

            <p className="mt-4 text-[11px] text-slate-500">
              {isPL
                ? 'Finalna wycena uwzględnia wolumen danych oraz indywidualne integracje. Ten kalkulator ma charakter orientacyjny.'
                : 'Final pricing depends on data volume and custom integrations. This calculator is indicative only.'}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default PricingOverview;
