import React from 'react';
import { ExternalLink } from 'lucide-react';
import { IntegrationCategory } from '../types';
import BrandLogo from './BrandLogo';

interface Props {
  smartNavigate: (target:
    | 'demo'
    | 'demo-ai'
    | 'reports-sales'
    | 'reports-technical'
    | 'academy'
    | 'academy-docs'
    | 'contact'
    | 'pricing'
    | 'privacy'
    | 'terms'
    | 'about'
  ) => void;
  onOpenIntegrations: (category?: IntegrationCategory) => void;
}

type FooterLink =
  | { label: string; kind: 'smart'; target: Parameters<Props['smartNavigate']>[0] }
  | { label: string; kind: 'modal'; category?: IntegrationCategory }
  | { label: string; kind: 'external'; href: string };

const footerSections: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Produkt',
    links: [
      { label: 'Raporty sprzedaży', kind: 'smart', target: 'reports-sales' },
      { label: 'Asystent AI', kind: 'smart', target: 'demo-ai' },
      { label: 'Status & integracje', kind: 'smart', target: 'reports-technical' },
      { label: 'Cennik', kind: 'smart', target: 'pricing' },
    ],
  },
  {
    title: 'Zasoby',
    links: [
      { label: 'Webinary i nauka', kind: 'smart', target: 'academy' },
      { label: 'Dokumentacja API', kind: 'smart', target: 'academy-docs' },
      { label: 'Integracje', kind: 'modal' },
      { label: 'Kariera', kind: 'external', href: '/careers' },
    ],
  },
  {
    title: 'Firma',
    links: [
      { label: 'O nas', kind: 'smart', target: 'about' },
      { label: 'Regulamin', kind: 'smart', target: 'terms' },
      { label: 'Polityka prywatności', kind: 'smart', target: 'privacy' },
      { label: 'Demo', kind: 'smart', target: 'demo' },
    ],
  },
];

const Footer: React.FC<Props> = ({ smartNavigate, onOpenIntegrations }) => {
  const renderLink = (link: FooterLink, idx: number) => {
    switch (link.kind) {
      case 'smart':
        return (
          <button
            key={idx}
            onClick={() => smartNavigate(link.target)}
            className="text-sm text-slate-300 hover:text-primary-400 transition-colors text-left"
          >
            {link.label}
          </button>
        );
      case 'modal':
        return (
          <button
            key={idx}
            onClick={() => onOpenIntegrations('All')}
            className="text-sm text-slate-300 hover:text-primary-400 transition-colors text-left"
          >
            {link.label}
          </button>
        );
      case 'external':
        return (
          <a
            key={idx}
            href={link.href}
            className="text-sm text-slate-300 hover:text-primary-400 transition-colors text-left inline-flex items-center gap-1"
          >
            {link.label}
            <ExternalLink className="w-3 h-3" />
          </a>
        );
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-400">PapaData</p>
            <p className="mt-4 text-sm text-slate-400">
              Inteligentna analityka dla e-commerce. Łączymy dane, automatyzujemy raporty i dajemy głos AI w Twoim zespole.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">{section.title}</h4>
              <div className="mt-4 space-y-2">
                {section.links.map((link, idx) => renderLink(link, idx))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-400 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <BrandLogo size="sm" className="shadow-none" />
            <span>PapaData — inteligentne raporty e-commerce</span>
          </div>
          <span>&copy; {new Date().getFullYear()} PapaData. Wszystkie prawa zastrzeżone.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
