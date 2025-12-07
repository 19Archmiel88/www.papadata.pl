import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { IntegrationCategory } from '../types';
import { checkHealth } from '../services/api';

type SmartTarget =
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
  | 'about';

interface Props {
  smartNavigate: (target: SmartTarget) => void;
  onOpenIntegrations: (category?: IntegrationCategory | 'All') => void;
}

type FooterLink =
  | { label: string; kind: 'smart'; target: SmartTarget }
  | { label: string; kind: 'modal'; category?: IntegrationCategory | 'All' }
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
      { label: 'Integracje', kind: 'modal', category: 'All' },
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
  const [isSystemOnline, setIsSystemOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    checkHealth()
      .then(() => {
        if (!cancelled) setIsSystemOnline(true);
      })
      .catch(() => {
        if (!cancelled) setIsSystemOnline(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const renderLink = (link: FooterLink, key: string) => {
    if (link.kind === 'smart') {
      return (
        <button
          type="button"
          key={key}
          onClick={() => smartNavigate(link.target)}
          className="text-left text-sm text-slate-300 hover:text-primary-300"
        >
          {link.label}
        </button>
      );
    }

    if (link.kind === 'modal') {
      return (
        <button
          type="button"
          key={key}
          onClick={() => onOpenIntegrations(link.category)}
          className="text-left text-sm text-slate-300 hover:text-primary-300"
        >
          {link.label}
        </button>
      );
    }

    return (
      <a
        key={key}
        href={link.href}
        className="inline-flex items-center gap-1 text-left text-sm text-slate-300 hover:text-primary-300"
      >
        {link.label}
        <ExternalLink className="h-3 w-3" />
      </a>
    );
  };

  const year = new Date().getFullYear();

  let statusLabel = 'Connecting...';
  let statusClass =
    'inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-[11px] text-slate-300';

  if (isSystemOnline === true) {
    statusLabel = 'System online (GCP, europe-central2)';
    statusClass =
      'inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-200';
  } else if (isSystemOnline === false) {
    statusLabel = 'System offline – tryb demo';
    statusClass =
      'inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-1 text-[11px] text-rose-200';
  }

  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Lewa strona */}
          <div>
            <BrandLogo className="mb-4" />

            <p className="max-w-sm text-sm text-slate-300">
              Inteligentna analityka dla e-commerce. Łączymy dane z Twoich
              sklepów, reklam i analityki w prywatnej hurtowni danych w Google
              Cloud i dajemy Ci gotowe odpowiedzi od AI.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className={statusClass}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {statusLabel}
              </span>
              <span className="text-[11px] text-slate-500">
                Szyfrowanie kluczy w Secret Manager, izolacja klientów per
                projekt.
              </span>
            </div>
          </div>

          {/* Prawa strona – linki */}
          <div className="grid gap-8 sm:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {section.title}
                </h4>
                <div className="flex flex-col gap-2">
                  {section.links.map((link, idx) =>
                    renderLink(link, `${section.title}-${idx}`),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dolny pasek */}
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-900 pt-4 text-[11px] text-slate-500 sm:flex-row sm:items-center">
          <p>© {year} PapaData. Wszystkie prawa zastrzeżone.</p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => smartNavigate('privacy')}
              className="hover:text-primary-300"
            >
              Polityka prywatności
            </button>
            <button
              type="button"
              onClick={() => smartNavigate('terms')}
              className="hover:text-primary-300"
            >
              Regulamin
            </button>
            <button
              type="button"
              onClick={() => smartNavigate('contact')}
              className="hover:text-primary-300"
            >
              Kontakt
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
