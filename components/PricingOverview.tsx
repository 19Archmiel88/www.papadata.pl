import React, { useState, useMemo } from 'react';
import { CheckCircleIcon } from './icons';
import SectionCardGrid from './SectionCardGrid';
import { Sparkles, Link, ShieldCheck } from 'lucide-react';

const sources = [
  { id: 'shop', name: 'Sklep', price: 80 },
  { id: 'google_ads', name: 'Google Ads', price: 80 },
  { id: 'meta_ads', name: 'Meta Ads', price: 80 },
  { id: 'allegro', name: 'Allegro', price: 80 },
];

const implementationOptions = {
  self: {
    name: 'Samodzielnie',
    oneTimeFee: 0,
    features: ['14-dniowy darmowy trial', 'Pełny dostęp do funkcji AI', 'Samodzielna konfiguracja'],
    cta: 'Rozpocznij darmowy trial',
  },
  basic: {
    name: 'Z ekspertem: Setup Basic',
    oneTimeFee: 300,
    features: ['Gwarancja poprawnej konfiguracji', 'Analiza poprawności danych', 'Płatność z góry (brak trialu)'],
    cta: 'Zamów wdrożenie',
  },
  audit: {
    name: 'Z ekspertem: Audyt & Strategia',
    oneTimeFee: 900,
    features: ['Wszystko z Setup Basic', 'Dogłębny audyt analityczny', 'Spersonalizowana strategia wdrożenia'],
    cta: 'Zamów wdrożenie',
  },
};

type ImplementationKey = keyof typeof implementationOptions;

const planHighlights = [
  {
    title: 'Pełna automatyzacja',
    desc: 'Łączymy dane z kampanii reklamowych, sklepu i hurtowni w jednym miejscu bez skryptów.',
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    title: 'Bezpieczne połączenia',
    desc: 'Tokeny i klucze są szyfrowane w Google Secret Manager i odświeżane w tle.',
    icon: <ShieldCheck className="w-6 h-6" />,
  },
  {
    title: 'Elastyczne integracje',
    desc: 'Dodajesz tylko to, czego potrzebujesz. Resztę kosztów pokazujemy w czasie rzeczywistym.',
    icon: <Link className="w-6 h-6" />,
  },
];

/**
 * A detailed pricing overview component.
 * Allows users to select specific data sources and implementation options to calculate a custom price.
 * Displays a summary of the monthly and one-time costs.
 */
const PricingOverview: React.FC = () => {
  const [selectedSources, setSelectedSources] = useState<string[]>(['shop', 'google_ads']);
  const [implementation, setImplementation] = useState<ImplementationKey>('self');

  const handleSourceChange = (sourceId: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId) ? prev.filter((id) => id !== sourceId) : [...prev, sourceId]
    );
  };

  const monthlyCost = useMemo(
    () =>
      selectedSources.reduce((total, id) => {
        const source = sources.find((s) => s.id === id);
        return total + (source ? source.price : 0);
      }, 0),
    [selectedSources]
  );

  const oneTimeCost = implementationOptions[implementation].oneTimeFee;
  const selectedPlan = implementationOptions[implementation];

  return (
    <section className="bg-slate-800 py-20 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Skonfiguruj swój plan</h2>
          <p className="mt-4 text-lg text-slate-300">Żadnych ukrytych opłat. Płacisz tylko za to, czego potrzebujesz.</p>
        </div>

        <SectionCardGrid
          title="Dlaczego klienci wybierają Papadata"
          description="Te elementy pojawiają się w każdym wdrożeniu."
          items={planHighlights}
          gridCols="grid-cols-1 md:grid-cols-3"
        />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <div className="rounded-xl bg-slate-900/50 p-8">
              <h3 className="text-xl font-semibold">Krok 1: Wybierz źródła danych</h3>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {sources.map((source) => (
                  <label
                    key={source.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg p-4 ring-1 ${
                      selectedSources.includes(source.id) ? 'bg-primary-900/50 ring-primary-500' : 'bg-slate-800 ring-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSources.includes(source.id)}
                      onChange={() => handleSourceChange(source.id)}
                      className="h-5 w-5 rounded border-slate-600 bg-slate-700 text-primary-600 focus:ring-primary-600"
                    />
                    <div>
                      <span className="font-medium text-white">{source.name}</span>
                      <p className="text-sm text-slate-400">+{source.price} zł netto/mc</p>
                    </div>
                  </label>
                ))}
              </div>

              <h3 className="mt-10 text-xl font-semibold">Krok 2: Wybierz tryb wdrożenia</h3>
              <div className="mt-6 space-y-4">
                {(Object.keys(implementationOptions) as ImplementationKey[]).map((key) => (
                  <label
                    key={key}
                    className={`flex cursor-pointer flex-col rounded-lg p-4 ring-1 ${
                      implementation === key ? 'bg-primary-900/50 ring-primary-500' : 'bg-slate-800 ring-slate-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="implementation"
                        checked={implementation === key}
                        onChange={() => setImplementation(key)}
                        className="h-5 w-5 border-slate-600 bg-slate-700 text-primary-600 focus:ring-primary-600"
                      />
                      <div className="ml-3">
                        <span className="font-medium text-white">{implementationOptions[key].name}</span>
                        {implementationOptions[key].oneTimeFee > 0 && (
                          <p className="text-sm text-slate-400">
                            +{implementationOptions[key].oneTimeFee} zł netto (jednorazowo)
                          </p>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-2xl bg-slate-900 p-8 shadow-2xl ring-2 ring-primary-500">
              <h3 className="text-2xl font-semibold text-center text-primary-400">Twoje podsumowanie</h3>
              <div className="mt-8 flex items-end justify-center gap-4">
                <div>
                  <span className="text-5xl font-bold tracking-tight">{monthlyCost}</span>
                  <span className="text-lg font-medium text-slate-400"> zł netto/mc</span>
                </div>
                {oneTimeCost > 0 && (
                  <div className="flex items-baseline">
                    <span className="text-slate-400">+</span>
                    <span className="text-3xl font-bold">{oneTimeCost}</span>
                    <span className="text-base font-medium text-slate-400"> zł netto na start</span>
                  </div>
                )}
              </div>

              <ul className="mt-8 space-y-3 text-sm leading-6 text-slate-300">
                {selectedPlan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckCircleIcon className="h-6 w-5 flex-none text-primary-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className="mt-10 block w-full rounded-md bg-primary-600 px-3 py-3 text-center text-lg font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                {selectedPlan.cta}
              </a>
              <p className="mt-6 text-xs text-center text-slate-500">Podane ceny są cenami netto. Należy doliczyć 23% VAT.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingOverview;
