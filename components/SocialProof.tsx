import React from 'react';
import SectionCardGrid from './SectionCardGrid';
import { Sparkles, Users } from 'lucide-react';

const socialCards = [
  {
    title: 'Liderzy e-commerce',
    desc: 'Marki, które dzięki Papadata podejmują decyzje szybciej i z większą pewnością dzięki raportom w czasie rzeczywistym.',
    icon: <Users className="w-6 h-6" />,
  },
  {
    title: 'AI podpowiada działania',
    desc: 'Asystent analizuje dane z kampanii, produktów i klientów, a potem sugeruje konkretne kroki.',
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    title: 'Integracje bez przerwy',
    desc: 'Dane z platform reklamowych, analitycznych i marketplace’ów trafiają prosto do hurtowni – bez ręcznej pracy.',
    icon: <Sparkles className="w-6 h-6" />,
  },
];

const SocialProof: React.FC = () => (
  <>
    <SectionCardGrid
      title="Wspieramy decyzje liderów e-commerce"
      description="Klienci Papadata wyróżniają się jakością danych, szybkością analiz i pewnością decyzji."
      items={socialCards}
    />

    <section className="py-16 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <blockquote className="text-2xl font-semibold leading-relaxed">
          “Dzięki Papadata wreszcie wiemy, które kampanie przynoszą realny zysk. Oszczędziliśmy dziesiątki godzin na ręcznym tworzeniu raportów.”
        </blockquote>
        <figcaption className="flex flex-col items-center space-y-3">
          <img
            className="h-16 w-16 rounded-full"
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="CEO of ExampleCorp"
          />
          <div>
            <div className="font-semibold">Anna Kowalska</div>
            <div className="text-sm text-slate-300">CEO w ExampleCorp</div>
          </div>
        </figcaption>
      </div>
    </section>
  </>
);

export default SocialProof;
