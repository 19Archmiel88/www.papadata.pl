import React, { useMemo, useState } from 'react';
import { CheckCircle, Sparkles, ShieldCheck } from 'lucide-react';
import SectionCardGrid, { SectionCardItem } from './SectionCardGrid';

const sources = [
  { id: 'shop', name: 'Sklep (np. WooCommerce / Shopify)', price: 80 },
  { id: 'google_ads', name: 'Google Ads', price: 80 },
  { id: 'meta_ads', name: 'Meta Ads', price: 80 },
  { id: 'tiktok_ads', name: 'TikTok Ads', price: 80 },
  { id: 'allegro', name: 'Allegro', price: 80 },
];

const implementationOptions = {
  self: {
    name: 'Samodzielnie (Self-service)',
    oneTimeFee: 0,
    features: [
      '14-dniowy darmowy trial',
      'Pełny dostęp do AI i raportów',
      'Samodzielna konfiguracja integracji',
    ],
    cta: 'Rozpocznij darmowy trial',
  },
  basic: {
    name: 'Z ekspertem: Setup Basic',
    oneTimeFee: 300,
    features: [
      'Prowadzone wdrożenie krok po kroku',
      'Weryfikacja poprawności danych',
      'Rekomendacje KPI pod Twoją branżę',
    ],
    cta: 'Porozmawiaj o wdrożeniu',
  },
} as const;

type ImplementationKey = keyof typeof implementationOptions;

const PricingOverview: React.FC = () => {
  const [selectedSources, setSelectedSources] = useState<string[]>([
    'shop',
    'google_ads',
  ]);
  const [implementation, setImplementation] =
    useState<ImplementationKey>('self');

  const monthlyCost = useMemo(
    () =>
      selectedSources.reduce((sum, id) => {
        const src = sources.find((s) => s.id === id);
        return sum + (src?.price ?? 0);
      }, 0),
    [selectedSources]
  );

  const oneTimeCost = implementationOptions[implementation].oneTimeFee;
  const selectedPlan = implementationOptions[implementation];

  const helperItems: SectionCardItem[] = [
    {
      id: 'auto',
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Automatyzacja bez kontraktu na lata',
      desc: (
        <>
          Płacisz za realnie podłączone źródła danych. Nie ma limitu wierszy
          ani dziwnych „pakietów w chmurze”.
        </>
      ),
    },
    {
      id: 'secure',
      icon: <ShieldCheck className="w-5 h-5" />,
      title: 'Przejrzyste zasady',
      desc: (
        <>
          Pełna informacja o miesięcznym koszcie i jednorazowej opłacie
          wdrożeniowej. Bez ukrytych opłat za export czy dostęp do API.
        </>
      ),
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-start">
        <div className="rounded-2xl border border-primary-600/60 bg-gradient-to-br from-primary-950 via-slate-950 to-slate-900 p-6 shadow-[0_24px_80px_rgba(88,28,135,0.7)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300 mb-2">
            Sprzedaj
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-50">
            Cennik, który rośnie razem z Twoją sprzedażą.
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-200">
            Każde źródło danych ma prostą, stałą cenę miesięczną. Dodajesz tylko
            te elementy, których naprawdę używasz.
          </p>

          <div className="mt-6 space-y-5 text-sm">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-2">
                Krok 1: Wybierz źródła danych
              </h3>
              <div className="space-y-2">
                {sources.map((source) => {
                  const checked = selectedSources.includes(source.id);
                  return (
                    <label
                      key={source.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 cursor-pointer hover:border-primary-500/70"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setSelectedSources((prev) =>
                              prev.includes(source.id)
                                ? prev.filter((id) => id !== source.id)
                                : [...prev, source.id]
                            )
                          }
                          className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-slate-100">{source.name}</span>
                      </div>
                      <span className="font-mono text-xs text-slate-300">
                        +{source.price} zł / mc
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-2">
                Krok 2: Wybierz tryb wdrożenia
              </h3>
              <div className="space-y-2">
                {(Object.keys(implementationOptions) as ImplementationKey[]).map(
                  (key) => {
                    const option = implementationOptions[key];
                    const active = implementation === key;
                    return (
                      <label
                        key={key}
                        className={[
                          'flex items-center justify-between gap-3 rounded-xl border px-3 py-2 cursor-pointer',
                          active
                            ? 'border-primary-500/80 bg-slate-900'
                            : 'border-slate-800 bg-slate-950/80 hover:border-slate-700',
                        ].join(' ')}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="implementation"
                            checked={active}
                            onChange={() => setImplementation(key)}
                            className="h-4 w-4 border-slate-600 bg-slate-900 text-primary-500 focus:ring-primary-500"
                          />
                          <span className="text-slate-100">
                            {option.name}
                          </span>
                        </div>
                        {option.oneTimeFee > 0 && (
                          <span className="font-mono text-xs text-slate-300">
                            +{option.oneTimeFee} zł jednorazowo
                          </span>
                        )}
                      </label>
                    );
                  }
                )}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-slate-950/90 border border-slate-800 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-2">
                Twoje podsumowanie
              </h3>
              <p className="text-sm text-slate-200">
                Miesięcznie:{' '}
                <span className="font-mono text-lg text-primary-300">
                  {monthlyCost.toLocaleString('pl-PL')} zł netto / mc
                </span>
              </p>
              {oneTimeCost > 0 && (
                <p className="mt-1 text-sm text-slate-200">
                  Jednorazowo:{' '}
                  <span className="font-mono text-sm text-slate-100">
                    {oneTimeCost.toLocaleString('pl-PL')} zł netto
                  </span>
                </p>
              )}

              <ul className="mt-3 space-y-1 text-xs text-slate-400">
                {selectedPlan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-primary-400 mt-[2px]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="mt-4 inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-500 transition-colors">
                {selectedPlan.cta}
              </button>

              <p className="mt-3 text-[11px] text-slate-500">
                Podane ceny są kwotami netto. Do faktury doliczamy 23% VAT.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <SectionCardGrid
            title="Dlaczego ten model cenowy jest uczciwy"
            items={helperItems}
            gridCols="grid-cols-1"
          />
        </div>
      </div>
    </section>
  );
};

export default PricingOverview;
