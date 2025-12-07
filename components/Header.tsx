import React, { useEffect, useState } from 'react';
import { Menu, Globe2, Moon, Sun, ChevronDown } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { Language, Theme, Translation, IntegrationCategory } from '../types';

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
  lang: Language;
  setLang: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  t: Translation['header'];
  onOpenIntegrations: (category?: IntegrationCategory | 'All') => void;
  smartNavigate: (target: SmartTarget) => void;
  isLoggedIn?: boolean;
}

const Header: React.FC<Props> = ({
  lang,
  setLang,
  theme,
  setTheme,
  t,
  onOpenIntegrations,
  smartNavigate,
  isLoggedIn,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
    setMobileOpen(false);
  };

  const handleSmart = (target: SmartTarget) => {
    smartNavigate(target);
    setMobileOpen(false);
  };

  const isPL = lang === 'PL';

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur border-b border-slate-800 bg-slate-950/90'
          : 'bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-18">
        {/* Logo */}
        <BrandLogo className="shrink-0" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          {/* Funkcje */}
          <div className="relative group">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
            >
              <span>{t.nav.features}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" />
            </button>
            <div className="pointer-events-none absolute left-0 top-full mt-3 hidden min-w-[240px] rounded-xl border border-slate-800 bg-slate-950/95 p-3 shadow-xl shadow-black/40 group-hover:pointer-events-auto group-hover:block">
              <button
                type="button"
                onClick={() => scrollToId('features')}
                className="block w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-900"
              >
                {isPL ? 'Asystent AI' : 'AI Assistant'}
              </button>
              <button
                type="button"
                onClick={() => scrollToId('features')}
                className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-900"
              >
                {isPL ? 'Raporty sprzedaży' : 'Sales reports'}
              </button>
              <button
                type="button"
                onClick={() => scrollToId('features')}
                className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-900"
              >
                {isPL ? 'Analiza marży i LTV' : 'Margin & LTV analysis'}
              </button>
            </div>
          </div>

          {/* Integracje */}
          <div className="relative group">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
            >
              <span>{t.nav.integrations}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" />
            </button>
            <div className="pointer-events-none absolute left-0 top-full mt-3 hidden min-w-[260px] rounded-xl border border-slate-800 bg-slate-950/95 p-3 shadow-xl shadow-black/40 group-hover:pointer-events-auto group-hover:block">
              <button
                type="button"
                onClick={() => onOpenIntegrations('Store')}
                className="block w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-900"
              >
                {isPL ? 'Platformy sklepowe' : 'E-commerce platforms'}
              </button>
              <button
                type="button"
                onClick={() => onOpenIntegrations('Marketing')}
                className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-900"
              >
                {isPL ? 'Systemy reklamowe' : 'Ad platforms'}
              </button>
              <button
                type="button"
                onClick={() => onOpenIntegrations('Analytics')}
                className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-900"
              >
                {isPL ? 'Analityka i atrybucja' : 'Analytics & attribution'}
              </button>
              <button
                type="button"
                onClick={() => onOpenIntegrations('All')}
                className="mt-2 block w-full rounded-lg bg-slate-900/60 px-3 py-2 text-left text-xs font-semibold text-primary-300 hover:bg-slate-900"
              >
                {t.integrationsDropdown.viewAll}
              </button>
            </div>
          </div>

          {/* Cennik */}
          <button
            type="button"
            onClick={() => handleSmart('pricing')}
            className="rounded-lg px-2 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
          >
            {t.nav.pricing}
          </button>

          {/* Baza wiedzy */}
          <div className="relative group">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
            >
              <span>{t.nav.resources}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" />
            </button>
            <div className="pointer-events-none absolute left-0 top-full mt-3 hidden min-w-[220px] rounded-xl border border-slate-800 bg-slate-950/95 p-3 shadow-xl shadow-black/40 group-hover:pointer-events-auto group-hover:block">
              <button
                type="button"
                onClick={() => handleSmart('academy')}
                className="block w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-900"
              >
                {isPL ? 'Webinary i nagrania' : 'Webinars'}
              </button>
              <button
                type="button"
                onClick={() => handleSmart('academy-docs')}
                className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-900"
              >
                {isPL ? 'Dokumentacja API' : 'API docs'}
              </button>
              <button
                type="button"
                onClick={() => handleSmart('academy')}
                className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-900"
              >
                {isPL ? 'Blog & case studies' : 'Blog & case studies'}
              </button>
            </div>
          </div>
        </nav>

        {/* Prawa strona: akcje */}
        <div className="flex items-center gap-2">
          {/* Język */}
          <button
            type="button"
            onClick={() => setLang(lang === 'PL' ? 'EN' : 'PL')}
            className="hidden items-center gap-1 rounded-full border border-slate-800 bg-slate-950/70 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white md:inline-flex"
          >
            <Globe2 className="h-3.5 w-3.5" />
            <span>{lang === 'PL' ? 'PL' : 'EN'}</span>
          </button>

          {/* Motyw */}
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={t.actions.themeTooltip}
            className="hidden rounded-full border border-slate-800 bg-slate-950/70 p-1.5 text-slate-300 hover:border-slate-700 hover:text-white md:inline-flex"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Login / CTA – desktop */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => handleSmart('demo')}
              className="text-xs font-medium text-slate-300 hover:text-white"
            >
              {t.actions.login}
            </button>
            <button
              type="button"
              onClick={() => handleSmart('demo')}
              className="rounded-lg bg-primary-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-500"
            >
              {isLoggedIn
                ? isPL
                  ? 'Przejdź do pulpitu'
                  : 'Go to dashboard'
                : t.actions.signup}
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-800 bg-slate-950/80 p-2 text-slate-200 hover:border-slate-700 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-800 bg-slate-950/98 px-4 pb-4 pt-3 md:hidden">
          <div className="flex flex-col gap-2 text-sm text-slate-200">
            <button
              type="button"
              onClick={() => scrollToId('features')}
              className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-900"
            >
              {t.nav.features}
            </button>
            <button
              type="button"
              onClick={() => onOpenIntegrations('All')}
              className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-900"
            >
              {t.nav.integrations}
            </button>
            <button
              type="button"
              onClick={() => handleSmart('pricing')}
              className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-900"
            >
              {t.nav.pricing}
            </button>
            <button
              type="button"
              onClick={() => handleSmart('academy')}
              className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-900"
            >
              {t.nav.resources}
            </button>

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setLang(lang === 'PL' ? 'EN' : 'PL')}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs font-medium text-slate-300"
              >
                <Globe2 className="h-3.5 w-3.5" />
                <span>{lang === 'PL' ? 'PL' : 'EN'}</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs font-medium text-slate-300"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-3.5 w-3.5" />
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5" />
                    <span>Dark</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleSmart('demo')}
                className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-300 hover:bg-slate-900"
              >
                {t.actions.login}
              </button>
              <button
                type="button"
                onClick={() => handleSmart('demo')}
                className="w-full rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-500"
              >
                {isLoggedIn
                  ? isPL
                    ? 'Przejdź do pulpitu'
                    : 'Go to dashboard'
                  : t.actions.signup}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
