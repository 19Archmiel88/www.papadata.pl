import React from 'react';
import { SparklesIcon, ChartBarIcon, CpuChipIcon, LockClosedIcon } from './icons';

const features = [
  {
    name: 'AI Analyst',
    description: 'Twój osobisty analityk 24/7. Zadawaj pytania w języku naturalnym i otrzymuj natychmiastowe, trafne odpowiedzi.',
    icon: <SparklesIcon className="h-8 w-8" />,
    className: 'md:col-span-2',
  },
  {
    name: 'Integracje API',
    description: 'Wszystkie platformy w jednym miejscu. Połącz dane ze sklepu, reklam i marketplace, bez pisania kodu.',
    icon: <ChartBarIcon className="h-8 w-8" />,
    className: '',
  },
  {
    name: 'Własność danych (no vendor lock-in)',
    description: 'Twoje dane są Twoje. Możesz je wyeksportować do własnego BigQuery w każdej chwili.',
    icon: <CpuChipIcon className="h-8 w-8" />,
    className: '',
  },
  {
    name: 'Bezpieczeństwo',
    description: 'Zgodność z RODO i serwery w UE. Gwarantujemy najwyższy standard ochrony Twoich danych.',
    icon: <LockClosedIcon className="h-8 w-8" />,
    className: 'md:col-span-2',
  },
];

const KeyFeatures: React.FC = () => (
  <section className="py-20 sm:py-32">
    <div className="container mx-auto max-w-7xl px-4">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Wszystko, czego potrzebujesz do wzrostu</h2>
        <p className="mt-4 text-lg text-slate-300">
          Skup się na strategii, a nie na zbieraniu danych. PapaData dostarcza narzędzia, które napędzają mądre decyzje.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`rounded-2xl bg-slate-800/50 p-8 ring-1 ring-white/10 transition-all duration-300 hover:bg-slate-800 hover:ring-primary-400/50 ${feature.className}`}
          >
            <div className="text-primary-400">{feature.icon}</div>
            <h3 className="mt-4 text-xl font-semibold">{feature.name}</h3>
            <p className="mt-2 text-slate-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default KeyFeatures;
