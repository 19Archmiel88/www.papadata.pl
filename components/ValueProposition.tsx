import React from 'react';
import { ShieldCheck, Cpu, Database, Sparkles } from 'lucide-react';

const ValueProposition: React.FC = () => {
  const isPL =
    typeof window !== 'undefined'
      ? (document.documentElement.lang || 'pl').toLowerCase().startsWith('pl')
      : true;

  const title = isPL ? 'Dlaczego PapaData?' : 'Why PapaData?';

  const cards = isPL
    ? [
        {
          icon: Cpu,
          title: 'Asystent AI zamiast ręcznej analizy',
          desc: 'Zamiast łączyć raporty z kilku źródeł – pytasz AI i dostajesz gotową interpretację danych.',
        },
        {
          icon: Database,
          title: 'Własna hurtownia danych na Google Cloud',
          desc: 'Dane marketingowe, sprzedażowe i logistyczne w jednym miejscu – gotowe do dalszej analizy.',
        },
        {
          icon: ShieldCheck,
          title: 'Bezpieczeństwo klasy enterprise',
          desc: 'Izolacja per klient, szyfrowanie i regiony UE – projektowane jak w dużych korporacjach.',
        },
        {
          icon: Sparkles,
          title: 'Raporty gotowe zanim otworzysz laptopa',
          desc: 'Codziennie rano widzisz podsumowanie – wzrosty, spadki, alerty i rekomendacje.',
        },
      ]
    : [
        {
          icon: Cpu,
          title: 'AI assistant instead of manual analysis',
          desc: 'Instead of stitching reports from multiple tools – you ask AI and get ready-made insights.',
        },
        {
          icon: Database,
          title: 'Your own data warehouse on Google Cloud',
          desc: 'Marketing, sales and logistics data in one place – ready for deeper analysis.',
        },
        {
          icon: ShieldCheck,
          title: 'Enterprise-grade security',
          desc: 'Per-tenant isolation, encryption and EU regions – designed like a corporate stack.',
        },
        {
          icon: Sparkles,
          title: 'Reports ready before your first coffee',
          desc: 'Every morning you get a summary – growth, declines, alerts and recommendations.',
        },
      ];

  return (
    <section
      id="about"
      className="bg-slate-950/95 py-16 text-slate-50"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            {isPL
              ? 'Łączymy wygodę narzędzia low-code z możliwościami hurtowni danych. Dla e-commerce, które chcą widzieć całość – a nie tylko ROAS w jednym panelu.'
              : 'We combine the comfort of a low-code tool with the power of a data warehouse. For e-commerce brands that want the full picture – not just ROAS in a single panel.'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {cards.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-4 shadow-sm shadow-black/40"
            >
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/10 text-primary-300 ring-1 ring-primary-500/30">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-50">{title}</h3>
              <p className="mt-2 text-xs text-slate-400">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
