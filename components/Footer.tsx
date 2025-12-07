import React from 'react';
import { Globe2 } from 'lucide-react';
import { IntegrationCategory, Translation } from '../types';
import { TRANSLATIONS } from '../constants';

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

const resolveLang = (): 'PL' | 'EN' => {
  try {
    const stored = localStorage.getItem('papadata-lang') as 'PL' | 'EN' | null;
    if (stored === 'PL' || stored === 'EN') return stored;
  } catch {
    // ignore
  }
  return 'PL';
};

const Footer: React.FC<Props> = ({ smartNavigate, onOpenIntegrations }) => {
  const lang = resolveLang();
  const t: Translation['footer'] = TRANSLATIONS[lang].footer;
  const isPL = lang === 'PL';

  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-8 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:justify-between">
        <div className="space-y-2 text-xs">
          <div className="inline-flex items-center gap-2 text-slate-100">
            <span className="font-semibold">PapaData</span>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-slate-700 text-[10px]">
              PD
            </span>
          </div>
          <p className="max-w-sm text-[11px] text-slate-500">
            {isPL
              ? 'AI-first analytics dla e-commerce. Hurtownia BigQuery, raporty i asystent AI w jednym narzędziu.'
              : 'AI-first analytics for e-commerce. BigQuery warehouse, reports and AI assistant in one tool.'}
          </p>
          <p className="mt-2 text-[10px] text-slate-600">
            © {new Date().getFullYear()} PapaData. All rights reserved.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 text-[11px] md:grid-cols-3">
          <div className="space-y-2">
            <p className="font-medium text-slate-200">
              {isPL ? 'Nawigacja' : 'Navigation'}
            </p>
            <button
              type="button"
              onClick={() => smartNavigate('about')}
              className="block text-left text-slate-400 hover:text-slate-100"
            >
              {isPL ? 'O produkcie' : 'About'}
            </button>
            <button
              type="button"
              onClick={() => smartNavigate('pricing')}
              className="block text-left text-slate-400 hover:text-slate-100"
            >
              {isPL ? 'Cennik' : 'Pricing'}
            </button>
            <button
              type="button"
              onClick={() => smartNavigate('academy')}
              className="block text-left text-slate-400 hover:text-slate-100"
            >
              {isPL ? 'Akademia' : 'Academy'}
            </button>
          </div>

          <div className="space-y-2">
            <p className="font-medium text-slate-200">
              {isPL ? 'Integracje' : 'Integrations'}
            </p>
            <button
              type="button"
              onClick={() => onOpenIntegrations('Store')}
              className="block text-left text-slate-400 hover:text-slate-100"
            >
              {isPL ? 'Sklepy' : 'Stores'}
            </button>
            <button
              type="button"
              onClick={() => onOpenIntegrations('Marketing')}
              className="block text-left text-slate-400 hover:text-slate-100"
            >
              {isPL ? 'Kampanie' : 'Campaigns'}
            </button>
            <button
              type="button"
              onClick={() => onOpenIntegrations('All')}
              className="block text-left text-slate-400 hover:text-slate-100"
            >
              {isPL ? 'Wszystkie integracje' : 'All integrations'}
            </button>
          </div>

          <div className="space-y-2">
            <p className="font-medium text-slate-200">
              {t.socials}
            </p>
            <a
              href="#"
              className="flex items-center gap-1 text-slate-400 hover:text-slate-100"
            >
              <Globe2 className="h-3.5 w-3.5" />
              <span>LinkedIn</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-1 text-slate-400 hover:text-slate-100"
            >
              <Globe2 className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="space-y-1 text-[11px]">
          <p className="font-medium text-slate-200">
            {isPL ? 'Regulacje' : 'Legal'}
          </p>
          <button
            type="button"
            onClick={() => smartNavigate('privacy')}
            className="block text-left text-slate-400 hover:text-slate-100"
          >
            {t.links.privacy}
          </button>
          <button
            type="button"
            onClick={() => smartNavigate('terms')}
            className="block text-left text-slate-400 hover:text-slate-100"
          >
            {t.links.terms}
          </button>
          <span className="block text-slate-500">
            {t.links.cookies}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
