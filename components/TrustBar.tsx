import React from 'react';
import { ShieldCheck, Database, Brain, Cloud } from 'lucide-react';

const TrustBar: React.FC = () => {
  const items = [
    {
      label: 'Infra',
      title: 'Google Cloud • europe-central2',
      icon: <Cloud className="w-4 h-4" />,
    },
    {
      label: 'Hurtownia',
      title: 'BigQuery jako pojedyncze źródło prawdy',
      icon: <Database className="w-4 h-4" />,
    },
    {
      label: 'AI',
      title: 'Analizy oparte o modele Gemini',
      icon: <Brain className="w-4 h-4" />,
    },
    {
      label: 'Bezpieczeństwo',
      title: 'Szyfrowanie + izolacja tenantów',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
  ];

  return (
    <section className="border-y border-slate-800/70 bg-slate-950/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center gap-4 md:gap-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          ZAUFANA ARCHITEKTURA
        </p>
        <div className="flex-1 flex flex-wrap gap-x-6 gap-y-2 text-xs md:text-sm">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-2 text-slate-300"
            >
              <span className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                {item.label}
              </span>
              <span className="inline-flex items-center gap-1 text-slate-300">
                <span className="text-primary-400">{item.icon}</span>
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
