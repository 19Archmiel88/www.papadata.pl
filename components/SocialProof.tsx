import React from 'react';
import { Quote } from 'lucide-react';

const SocialProof: React.FC = () => {
  const isPL =
    typeof window !== 'undefined'
      ? (document.documentElement.lang || 'pl').toLowerCase().startsWith('pl')
      : true;

  const title = isPL ? 'Co mówią klienci (soon)' : 'What clients say (soon)';

  const items = isPL
    ? [
        {
          role: 'Head of E-commerce',
          company: 'Sklep modowy',
          quote:
            'Zastąpiliśmy 6 raportów w Excelu jednym pulpitem. Asystent AI wyłapuje rzeczy, których sami byśmy nie zauważyli.',
        },
        {
          role: 'CMO',
          company: 'D2C beauty',
          quote:
            'Wreszcie w jednym miejscu widzę marżę po kosztach reklam – nie tylko ROAS w panelu reklamowym.',
        },
        {
          role: 'Owner',
          company: 'Brand premium',
          quote:
            'Najbardziej cenię to, że rano dostaję krótkie podsumowanie: co się zmieniło i co z tym zrobić.',
        },
      ]
    : [
        {
          role: 'Head of E-commerce',
          company: 'Fashion brand',
          quote:
            'We replaced 6 spreadsheet reports with one dashboard. The AI assistant spots patterns we would simply miss.',
        },
        {
          role: 'CMO',
          company: 'D2C beauty',
          quote:
            'For the first time I can see margin after ad spend in one place – not just ROAS in ad panels.',
        },
        {
          role: 'Owner',
          company: 'Premium brand',
          quote:
            'What I value most is the daily summary: what changed and what we should do about it.',
        },
      ];

  return (
    <section className="bg-slate-950 py-16 text-slate-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              {isPL
                ? 'Wersja produkcyjna będzie zawierała case studies z konkretnymi wynikami. Poniżej placeholdery pod finalny content.'
                : 'The production version will include detailed case studies with numbers. Below are placeholders for the final content.'}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item, idx) => (
            <article
              key={idx}
              className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-200 shadow-sm shadow-black/40"
            >
              <Quote className="mb-3 h-4 w-4 text-primary-300" />
              <p className="text-[11px] text-slate-200">{item.quote}</p>
              <div className="mt-3 text-[11px] text-slate-400">
                <p className="font-medium">{item.role}</p>
                <p className="text-slate-500">{item.company}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
