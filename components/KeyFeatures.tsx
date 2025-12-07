import React from 'react';
import { PlugZap, Workflow, LineChart, Bot } from 'lucide-react';
import SectionCardGrid, { SectionCardItem } from './SectionCardGrid';

const items: SectionCardItem[] = [
  {
    id: 'step-1',
    icon: <PlugZap className="w-5 h-5" />,
    title: 'Krok 1: Podłącz źródła danych',
    desc: (
      <>
        Integracje ze sklepami (WooCommerce, Shopify, IdoSell), reklamą
        (Google Ads, Meta, TikTok) i marketplace’ami. Bez kodu – tylko klucze
        API / OAuth.
      </>
    ),
  },
  {
    id: 'step-2',
    icon: <Workflow className="w-5 h-5" />,
    title: 'Krok 2: Jeden model danych w Google Cloud',
    desc: (
      <>
        Dane lądują w izolowanej hurtowni BigQuery w regionie europe-central2.
        Gotowe widoki dla sprzedaży, marży, kampanii i klientów.
      </>
    ),
  },
  {
    id: 'step-3',
    icon: <LineChart className="w-5 h-5" />,
    title: 'Krok 3: Dashboard + raporty + AI',
    desc: (
      <>
        Dashboard dla zarządu, raporty operacyjne dla zespołu i asystent AI,
        który odpowiada na pytania wprost z Twoich danych.
      </>
    ),
  },
  {
    id: 'step-4',
    icon: <Bot className="w-5 h-5" />,
    title: 'Alerty zamiast odgrzewania raportów',
    desc: (
      <>
        Gdy marża spada albo ROAS kampanii leci w dół – dostajesz alert.
        Zamiast co tydzień grzebać w Excelu.
      </>
    ),
    colSpan: 'md:col-span-2',
  },
];

const KeyFeatures: React.FC = () => {
  return (
    <SectionCardGrid
      title="Jak działa PapaData – od integracji do decyzji"
      description={
        <>
          Cała platforma sprowadza się do prostego łańcucha:{' '}
          <span className="text-slate-200">
            Źródła danych → Hurtownia → Modele → Dashboard &amp; AI
          </span>
          . Reszta to wygoda i bezpieczeństwo.
        </>
      }
      items={items}
      gridCols="grid-cols-1 md:grid-cols-2"
    />
  );
};

export default KeyFeatures;
