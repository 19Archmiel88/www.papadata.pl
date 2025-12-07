import React from 'react';
import { Quote, Users, TrendingUp } from 'lucide-react';
import SectionCardGrid, { SectionCardItem } from './SectionCardGrid';

const SocialProof: React.FC = () => {
  const items: SectionCardItem[] = [
    {
      id: 'metric-1',
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Szybsze decyzje',
      desc: (
        <>
          Klienci raportują skrócenie czasu przygotowania raportów z kilku
          godzin do kilku minut tygodniowo.
        </>
      ),
    },
    {
      id: 'metric-2',
      icon: <Users className="w-5 h-5" />,
      title: 'Zespół patrzy w te same liczby',
      desc: (
        <>
          Sprzedaż, marketing i zarząd korzystają z jednego modelu danych –
          koniec z „ale u mnie w Excelu wychodzi inaczej”.
        </>
      ),
    },
  ];

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-400 mb-2">
            Społeczny dowód
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-50">
            Narzędzie dla zespołów, które mają dość zgadywania.
          </h2>

          <figure className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 relative overflow-hidden">
            <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-primary-500/20 blur-3xl" />
            <Quote className="w-6 h-6 text-primary-400" />
            <blockquote className="mt-3 text-sm md:text-base text-slate-200 leading-relaxed">
              „Dzięki PapaData wreszcie wiemy, które kampanie przynoszą realny
              zysk. Raporty, które kiedyś powstawały raz w tygodniu, teraz mamy
              codziennie rano – automatycznie.”
            </blockquote>
            <figcaption className="mt-4 text-sm text-slate-400">
              <span className="font-semibold text-slate-100">
                Anna Kowalska
              </span>{' '}
              • Head of E-commerce
            </figcaption>
          </figure>
        </div>

        <div className="pt-2">
          <SectionCardGrid
            title="Co zyskują zespoły pracujące na jednym modelu danych"
            items={items}
            gridCols="grid-cols-1"
          />
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
