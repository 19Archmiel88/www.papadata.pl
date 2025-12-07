import React from 'react';
import { IntegrationCategory, Translation } from '../types';
import { INITIAL_INTEGRATIONS } from '../constants';

interface Props {
  t: Translation['integrationsSection'];
  onOpenModal: () => void;
}

const IntegrationsSection: React.FC<Props> = ({ t, onOpenModal }) => {
  const featured = INITIAL_INTEGRATIONS.slice(0, 8);

  const badgeLabel = (category: IntegrationCategory, langIsPL: boolean) => {
    switch (category) {
      case 'Store':
        return t.cardSubtitles.store;
      case 'Marketplace':
        return t.cardSubtitles.marketplace;
      case 'Analytics':
        return t.cardSubtitles.analytics;
      case 'Marketing':
        return t.cardSubtitles.marketing;
      default:
        return t.cardSubtitles.tool;
    }
  };

  const isPL = t.title.toLowerCase().includes('integrujemy');

  return (
    <section
      id="integrations"
      className="bg-slate-950 py-16 text-slate-50"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {t.title}
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              {t.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenModal}
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-100 hover:border-primary-500 hover:text-primary-100"
          >
            {t.viewAllButton}
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-3 text-xs shadow-sm shadow-black/40"
            >
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                    {item.code}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400">
                    {badgeLabel(item.category, isPL)}
                  </span>
                </div>
                <h3 className="text-[13px] font-semibold text-slate-50">
                  {item.name}
                </h3>
                <p className="mt-1 text-[11px] text-slate-400">
                  {isPL
                    ? 'Dane sprzedażowe i marketingowe w jednym widoku.'
                    : 'Sales and marketing data in one view.'}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  {isPL ? 'Głosów:' : 'Votes:'} {item.votes}
                </span>
                <button
                  type="button"
                  onClick={onOpenModal}
                  className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-medium text-slate-100 hover:bg-primary-600 hover:text-white"
                >
                  {isPL ? 'Zobacz szczegóły' : 'View details'}
                </button>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-4 text-[11px] text-slate-500">
          {isPL
            ? 'Pełny katalog obejmuje integracje z marketplace’ami, CRM, płatnościami, logistyką i księgowością.'
            : 'The full catalog includes integrations with marketplaces, CRM, payments, logistics and accounting.'}
        </p>
      </div>
    </section>
  );
};

export default IntegrationsSection;
