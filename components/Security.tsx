import React from 'react';
import { ShieldCheck, Lock, Server, Network } from 'lucide-react';
import SectionCardGrid, { SectionCardItem } from './SectionCardGrid';

const items: SectionCardItem[] = [
  {
    id: 'enc',
    icon: <Lock className="w-5 h-5" />,
    title: 'Szyfrowanie end-to-end',
    desc: (
      <>
        Klucze API i tokeny szyfrujemy (AES-256) i przechowujemy w Google
        Secret Manager. Dostęp tylko dla procesów ETL.
      </>
    ),
  },
  {
    id: 'tenant',
    icon: <Network className="w-5 h-5" />,
    title: 'Izolacja tenantów',
    desc: (
      <>
        Osobne projekty i hurtownie per klient. Żaden inny sklep ani agencja
        nie zobaczy Twoich danych – ani przypadkiem, ani celowo.
      </>
    ),
  },
  {
    id: 'region',
    icon: <Server className="w-5 h-5" />,
    title: 'Region europe-central2 na sztywno',
    desc: (
      <>
        Dane i przetwarzanie tylko w UE. Region europe-central2 (Warszawa)
        jako domyślne i jedyne środowisko.
      </>
    ),
  },
  {
    id: 'compliance',
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Zgodność z RODO',
    desc: (
      <>
        Pracujemy jako procesor danych. Możemy podpisać DPA, a logi dostępu
        pozwalają przeprowadzić audyt, gdy tylko jest potrzebny.
      </>
    ),
    colSpan: 'md:col-span-2',
  },
];

const Security: React.FC = () => {
  return (
    <SectionCardGrid
      title="Bezpieczeństwo na poziomie hurtowni, nie excela"
      description={
        <>
          Zamiast arkuszy z danymi klientów na dyskach pracowników, wszystko
          ląduje w kontrolowanej, szyfrowanej infrastrukturze Google Cloud.
        </>
      }
      items={items}
      gridCols="grid-cols-1 md:grid-cols-2"
    />
  );
};

export default Security;
