import React from 'react';
import SectionCardGrid from './SectionCardGrid';
import { Zap, Wifi, Link } from 'lucide-react';

const integrationHighlights = [
  {
    title: 'Sklepy i marketplace’y',
    desc: 'WooCommerce, Shopify, Allegro, Ceneo i wiele innych platform przesyła dane o zamówieniach bez ręcznego eksportu.',
    icon: <Link className="w-6 h-6" />,
  },
  {
    title: 'Reklamy i analityka',
    desc: 'Google Ads, Meta Ads, GA4 i TikTok – kampanie trafiają od razu do hurtowni, a AI podpowiada optymalizacje.',
    icon: <Wifi className="w-6 h-6" />,
  },
  {
    title: 'Automatyzacja danych',
    desc: 'Zapytania, transformacje i raporty uruchamiają się same – Ty tylko zatwierdzasz działania.',
    icon: <Zap className="w-6 h-6" />,
  },
];

const IntegrationHighlights: React.FC = () => (
  <SectionCardGrid
    title="Łączymy się ze wszystkim, co ważne"
    description="Integracje, które łączą dane sprzedażowe, reklamowe i logistyczne w jednym widoku."
    items={integrationHighlights}
    gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  />
);

export default IntegrationHighlights;
