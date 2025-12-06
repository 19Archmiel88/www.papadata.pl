import React, { useMemo, useState } from 'react';
import { Check, Plus, Minus, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface Props {
  /** Current active language */
  lang: Language;
}

type Billing = 'monthly' | 'yearly';

/**
 * A pricing configurator component that allows users to estimate their subscription cost.
 * Users can adjust the number of data sources and billing frequency (monthly/yearly).
 */
const PricingConfigurator: React.FC<Props> = ({ lang }) => {
  const [billing, setBilling] = useState<Billing>('monthly');
  const [sources, setSources] = useState(3);
  const [expert, setExpert] = useState(false);

  const basePerSource = 350; // PLN netto / źródło
  const expertFee = 1400; // jednorazowo

  const price = useMemo(() => {
    const subtotal = sources * basePerSource;
    const discounted = billing === 'yearly' ? subtotal * 0.8 : subtotal;
    return Math.round(discounted);
  }, [billing, sources]);

  const ctaHref = `/wizard?sources=${sources}&billing=${billing}&expert=${expert ? 1 : 0}`;

  const copy = lang === 'EN'
    ? {
        title: 'Pay only for what you use.',
        desc: 'All features, AI assistant, unlimited users included.',
        toggleMonthly: 'Monthly',
        toggleYearly: 'Yearly (-20%)',
        sourcesLabel: 'Number of data sources',
        expertTitle: 'Implementation with Expert',
        expertDesc: 'Our analyst will configure everything for you.',
        expertPrice: `One-time +${expertFee} PLN`,
        addExpert: 'Add to plan',
        summary: 'Price includes',
        includes: ['All PapaData features', 'AI Assistant', 'Unlimited users'],
        btn: 'Choose this plan',
        note: 'Net prices. Taxes may apply.',
      }
    : {
        title: 'Płać tylko za to, czego używasz.',
        desc: 'W cenie: wszystkie funkcje, Asystent AI, nielimitowani użytkownicy.',
        toggleMonthly: 'Miesięcznie',
        toggleYearly: 'Rocznie (-20%)',
        sourcesLabel: 'Liczba źródeł danych',
        expertTitle: 'Wdrożenie z Ekspertem',
        expertDesc: 'Nasz analityk skonfiguruje wszystko za Ciebie.',
        expertPrice: `Jednorazowo +${expertFee} PLN`,
        addExpert: 'Dodaj do planu',
        summary: 'Cena zawiera',
        includes: ['Wszystkie funkcje PapaData', 'Asystent AI', 'Nielimitowanych użytkowników'],
        btn: 'Wybieram ten plan',
        note: 'Ceny netto. Mogą pojawić się podatki.',
      };

  return (
    <section id="pricing" className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-500 mb-3">
            {lang === 'EN' ? 'Pricing' : 'Cennik'}
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
            {copy.title}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">{copy.desc}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-10">
          {/* Configurator */}
          <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-semibold text-slate-800 dark:text-slate-100">{copy.toggleMonthly}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={billing === 'yearly'}
                  onChange={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
                />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 border border-slate-300"></div>
              </label>
              <span className="font-semibold text-slate-800 dark:text-slate-100">{copy.toggleYearly}</span>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{copy.sourcesLabel}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSources((s) => Math.max(1, s - 1))}
                      className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{sources}</span>
                    <button
                      type="button"
                      onClick={() => setSources((s) => Math.min(12, s + 1))}
                      className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={sources}
                  onChange={(e) => setSources(parseInt(e.target.value, 10))}
                  className="w-full accent-primary-500"
                />
                <p className="text-sm text-slate-500 mt-1">
                  {lang === 'EN'
                    ? 'Example: 1 store + 2 ad platforms = 3 sources.'
                    : 'Przykład: 1 sklep + 2 systemy reklamowe = 3 źródła.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{copy.summary}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {copy.includes.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                      >
                        <Check className="w-3 h-3" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary card */}
          <div className="bg-gradient-to-br from-primary-600 to-indigo-600 text-white rounded-3xl p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide">{billing === 'yearly' ? copy.toggleYearly : copy.toggleMonthly}</p>
                <p className="text-4xl font-extrabold mt-1">{price} PLN</p>
                <p className="text-sm text-white/80">{billing === 'yearly' ? 'za miesiąc, rozliczenie roczne' : 'netto / miesiąc'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-white/70">{copy.sourcesLabel}</p>
                <p className="text-2xl font-bold">{sources}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
              <div className="flex items-start gap-3">
                <input
                  id="expert"
                  type="checkbox"
                  checked={expert}
                  onChange={() => setExpert(!expert)}
                  className="mt-1"
                />
                <div>
                  <p className="font-semibold">{copy.expertTitle}</p>
                  <p className="text-sm text-white/80">{copy.expertDesc}</p>
                  <p className="text-sm font-semibold mt-1">{copy.expertPrice}</p>
                  <label htmlFor="expert" className="text-xs underline cursor-pointer">
                    {copy.addExpert}
                  </label>
                </div>
              </div>
            </div>

            <a
              href={ctaHref}
              className="w-full py-3 text-center font-bold text-primary-700 bg-white rounded-xl hover:bg-slate-100 transition-colors"
            >
              {copy.btn}
            </a>

            <p className="text-xs text-white/80 text-center">{copy.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingConfigurator;
