import React from 'react';
import { Activity, Layers, Gauge } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

const ScalabilitySection: React.FC<Props> = ({ lang }) => {
  const isPL = lang === 'PL';

  return (
    <section className="border-t border-slate-800 bg-slate-950 py-16 text-slate-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {isPL ? 'Rośnie razem z Twoim sklepem' : 'Scales with your e-commerce'}
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            {isPL
              ? 'Od pierwszych kilkuset zamówień miesięcznie po setki tysięcy rekordów dziennie – architektura jest gotowa na wzrost bez przepisywania raportów.'
              : 'From your first few hundred orders per month to hundreds of thousands of events per day – the architecture is ready to scale without rewriting reports.'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-200">
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-primary-300 ring-1 ring-primary-500/40">
              <Layers className="h-4 w-4" />
            </div>
            <h3 className="text-[13px] font-semibold text-slate-50">
              {isPL ? 'BigQuery pod maską' : 'BigQuery under the hood'}
            </h3>
            <p className="mt-2 text-[11px] text-slate-400">
              {isPL
                ? 'Raporty korzystają z wydzielonej hurtowni BigQuery. Możesz zostać przy UI PapaData albo podpiąć własne narzędzia BI.'
                : 'Reports run on a dedicated BigQuery warehouse. Use the PapaData UI or plug in your own BI tools.'}
            </p>
          </article>

          <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-200">
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-primary-300 ring-1 ring-primary-500/40">
              <Activity className="h-4 w-4" />
            </div>
            <h3 className="text-[13px] font-semibold text-slate-50">
              {isPL ? 'Automatyczne odświeżanie danych' : 'Automatic data refresh'}
            </h3>
            <p className="mt-2 text-[11px] text-slate-400">
              {isPL
                ? 'Harmonogram ETL pobiera dane z kampanii i sklepu o wybranych godzinach. Rano widzisz świeże KPI bez czekania.'
                : 'ETL schedules pull data from your ads and store at chosen times. Each morning your KPIs are fresh without waiting.'}
            </p>
          </article>

          <article className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-200">
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-primary-300 ring-1 ring-primary-500/40">
              <Gauge className="h-4 w-4" />
            </div>
            <h3 className="text-[13px] font-semibold text-slate-50">
              {isPL ? 'Koszty pod kontrolą' : 'Cost under control'}
            </h3>
            <p className="mt-2 text-[11px] text-slate-400">
              {isPL
                ? 'Model kosztowy jest dostosowany do etapu rozwoju sklepu – bez niespodzianek w rachunkach przy wzroście ruchu.'
                : 'Pricing is aligned with your growth stage – no billing surprises when traffic and data volume increase.'}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ScalabilitySection;
