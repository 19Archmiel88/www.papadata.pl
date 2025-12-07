import React from 'react';

const TrustBar: React.FC = () => {
  const isPL =
    typeof window !== 'undefined'
      ? (document.documentElement.lang || 'pl').toLowerCase().startsWith('pl')
      : true;

  return (
    <section className="border-y border-slate-900 bg-slate-950/80 py-4 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-[11px] sm:flex-row sm:justify-between">
        <p className="text-center text-[11px] text-slate-500 sm:text-left">
          {isPL
            ? 'Budowane na infrastrukturze Google Cloud, zaprojektowane z myślą o e-commerce.'
            : 'Built on Google Cloud infrastructure, designed for modern e-commerce.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-medium uppercase tracking-wide text-slate-500">
          <span className="rounded-full border border-slate-800 px-3 py-1">
            Google Cloud
          </span>
          <span className="rounded-full border border-slate-800 px-3 py-1">
            BigQuery
          </span>
          <span className="rounded-full border border-slate-800 px-3 py-1">
            GA4
          </span>
          <span className="rounded-full border border-slate-800 px-3 py-1">
            GDPR Ready
          </span>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
