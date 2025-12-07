import React from 'react';
import { BarChart2, Users, ShoppingBag, Target, Repeat, LineChart } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language, Translation } from '../types';

interface Props {
  t?: Translation['featuresSection'];
  lang?: Language;
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

const KeyFeatures: React.FC<Props> = ({ t, lang }) => {
  const effectiveLang = resolveLang(lang);
  const dict = t ?? TRANSLATIONS[effectiveLang].featuresSection;

  const cards = [
    {
      key: 'sales',
      icon: LineChart,
      title: dict.cards.sales.title,
      desc: dict.cards.sales.desc,
    },
    {
      key: 'period',
      icon: BarChart2,
      title: dict.cards.period.title,
      desc: dict.cards.period.desc,
    },
    {
      key: 'products',
      icon: ShoppingBag,
      title: dict.cards.products.title,
      desc: dict.cards.products.desc,
    },
    {
      key: 'conversion',
      icon: Target,
      title: dict.cards.conversion.title,
      desc: dict.cards.conversion.desc,
    },
    {
      key: 'marketing',
      icon: BarChart2,
      title: dict.cards.marketing.title,
      desc: dict.cards.marketing.desc,
    },
    {
      key: 'customers',
      icon: Users,
      title: dict.cards.customers.title,
      desc: dict.cards.customers.desc,
    },
    {
      key: 'discounts',
      icon: Repeat,
      title: dict.cards.discounts.title,
      desc: dict.cards.discounts.desc,
    },
    {
      key: 'funnel',
      icon: Target,
      title: dict.cards.funnel.title,
      desc: dict.cards.funnel.desc,
    },
    {
      key: 'trends',
      icon: LineChart,
      title: dict.cards.trends.title,
      desc: dict.cards.trends.desc,
    },
  ];

  const exportCard = {
    key: 'export',
    icon: BarChart2,
    title: dict.cards.export.title,
    desc: dict.cards.export.desc,
  };

  return (
    <section className="bg-slate-950 py-16 text-slate-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {dict.title}
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            {/* Delikatny opis – nie z tłumaczeń, żeby nie komplikować */}
            {effectiveLang === 'PL'
              ? 'Najważniejsze raporty e-commerce w jednym panelu – bez przerzucania się między Google Ads, GA4 i Excelem.'
              : 'Your key e-commerce dashboards in one panel – no more jumping between Google Ads, GA4 and spreadsheets.'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ key, icon: Icon, title, desc }) => (
            <article
              key={key}
              className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-4 shadow-sm shadow-black/40 transition hover:-translate-y-0.5 hover:border-primary-500/60 hover:bg-slate-900/70 hover:shadow-primary-500/20"
            >
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/10 text-primary-300 ring-1 ring-primary-500/30">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-50">{title}</h3>
              <p className="mt-2 text-xs text-slate-400">{desc}</p>
            </article>
          ))}

          <article className="group flex flex-col rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-4 shadow-sm shadow-black/40 transition hover:-translate-y-0.5 hover:border-primary-500/60 hover:bg-slate-900/70 hover:shadow-primary-500/20">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-primary-300 ring-1 ring-primary-500/30">
              <exportCard.icon className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-50">
              {exportCard.title}
            </h3>
            <p className="mt-2 text-xs text-slate-400">{exportCard.desc}</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
