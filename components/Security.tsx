import React from 'react';
import { ShieldCheck, Shield, Server } from 'lucide-react';
import { LockClosedIcon } from './icons';
import SectionCardGrid from './SectionCardGrid';

const securityCards = [
  {
    title: 'Szyfrowanie AES-256',
    desc: 'Dane w tranzycie i spoczynku są szyfrowane na poziomie bankowym, chroniąc każdy punkt integracji.',
    icon: <ShieldCheck className="w-6 h-6" />,
  },
  {
    title: 'Separacja danych klientów',
    desc: 'Oddzielne instancje hurtowni i projektów gwarantują izolację i brak przecieku między kontami.',
    icon: <Shield className="w-6 h-6" />,
  },
  {
    title: 'Zgodność z RODO',
    desc: 'Pełna zgodność z europejskimi wymaganiami prawnymi, audytowana infrastruktura i operacje z zachowaniem DPA.',
    icon: <LockClosedIcon className="w-6 h-6" />,
  },
  {
    title: 'Infrastruktura Google Cloud',
    desc: 'ISO 27001, regularne audyty i bezpieczne strefy chmurowe (Europe Central 2) dla każdego klienta.',
    icon: <Server className="w-6 h-6" />,
  },
];

const Security: React.FC = () => (
  <SectionCardGrid
    title="Bezpieczeństwo na pierwszym miejscu"
    description="Twoje dane biznesowe to najcenniejszy zasób. Traktujemy ich ochronę z najwyższą powagą."
    items={securityCards}
    gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  />
);

export default Security;
