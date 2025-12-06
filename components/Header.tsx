import React, { useEffect, useState } from 'react';
import { Menu, Globe, Moon, Sun, ChevronDown, Sparkles } from 'lucide-react';
import { Language, Theme, Translation, IntegrationCategory } from '../types';

interface Props {
  /** Current active language */
  lang: Language;
  /** Function to update the language */
  setLang: (l: Language) => void;
  /** Current theme ('light' or 'dark') */
  theme: Theme;
  /** Function to update the theme */
  setTheme: (t: Theme) => void;
  /** Translation object containing header text */
  t: Translation['header'];
  /** Callback to open the integrations modal, optionally with a filter */
  onOpenIntegrations: (category?: IntegrationCategory) => void;
  /**
   * Function to handle smart navigation.
   * Redirects to appropriate sections or pages based on authentication status and target.
   */
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
  /** Indicates if a user is logged in (optional) */
  isLoggedIn?: boolean;
}

/**
 * The main site header (navigation bar).
 * Includes the logo, navigation links, theme toggle, language switcher, and mobile menu.
 * Handles sticky behavior on scroll.
 */
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleSmart = (target: Parameters<typeof smartNavigate>[0]) => {
    smartNavigate(target);
    setMobileMenuOpen(false);
  };

  const Logo = () => (
    <div
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="flex items-center gap-4 cursor-pointer group select-none"
    >
      <div className="relative w-11 h-11">
        <div className="absolute inset-0 bg-primary-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 animate-pulse-slow transition-opacity duration-1000" />
        <div className="relative w-full h-full bg-slate-950 text-white flex items-center justify-center rounded-xl shadow-2xl ring-1 ring-white/10 overflow-hidden transition-all duration-500 group-hover:shadow-primary-500/20 group-hover:-rotate-2">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <span className="relative z-10 font-bold text-lg font-sans tracking-tight">PD</span>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[150%] skew-x-[-20deg] animate-shimmer" />
        </div>
      </div>
      <div className="flex flex-col justify-center h-full">
        <span className="font-bold text-lg leading-none text-slate-900 dark:text-white transition-colors duration-300">
          PapaData
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500 mt-1 transition-all duration-300 group-hover:text-primary-500">
          Intelligence
        </span>
      </div>
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Logo />

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {/* Funkcje */}
          <div className="relative group">
            <button className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors py-2">
              {t.nav.features} <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 min-w-[220px] overflow-hidden">
                {[
                  { label: lang === 'PL' ? 'Asystent AI' : 'AI Assistant', id: 'features' },
                  { label: lang === 'PL' ? 'Raporty Sprzedaży' : 'Sales Reports', id: 'features' },
                  { label: lang === 'PL' ? 'Analiza Marży' : 'Margin Analysis', id: 'features' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollTo(item.id)}
                    className="block w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cennik */}
          <div className="relative group">
            <button className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors py-2">
              {t.nav.pricing} <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 min-w-[220px] overflow-hidden">
                {[
                  lang === 'PL' ? 'Symulator kosztów' : 'Cost Simulator',
                  lang === 'PL' ? 'Wsparcie eksperta' : 'Expert Support',
                  lang === 'PL' ? 'Kalkulator ROI' : 'ROI Calculator',
                ].map((label) => (
                  <button
                    key={label}
                    onClick={() => scrollTo('pricing')}
                    className="block w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Integracje */}
          <div className="relative group">
            <button className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors py-2">
              {t.nav.integrations} <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 min-w-[240px] overflow-hidden">
                <button
                  onClick={() => onOpenIntegrations('Store')}
                  className="block w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm transition-colors"
                >
                  {lang === 'PL' ? 'Platformy Sklepowe' : t.integrationsDropdown.ecommerce}
                </button>
                <button
                  onClick={() => onOpenIntegrations('Marketing')}
                  className="block w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm transition-colors"
                >
                  {lang === 'PL' ? 'Systemy Reklamowe' : t.integrationsDropdown.marketing}
                </button>
                <button
                  onClick={() => onOpenIntegrations('Analytics')}
                  className="block w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm transition-colors"
                >
                  {lang === 'PL' ? 'Zgłoś Integrację' : 'Request integration'}
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                <button
                  onClick={() => onOpenIntegrations()}
                  className="block w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium text-primary-600 transition-colors"
                >
                  {t.integrationsDropdown.viewAll}
                </button>
              </div>
            </div>
          </div>

          {/* Baza wiedzy */}
          <div className="relative group">
            <button className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors py-2">
              {lang === 'PL' ? 'Baza wiedzy' : 'Resources'} <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 min-w-[220px] overflow-hidden">
                <button
                  onClick={() => handleSmart('academy')}
                  className="block w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm transition-colors"
                >
                  {lang === 'PL' ? 'Szybki Start' : 'Quick Start'}
                </button>
                <button
                  onClick={() => handleSmart('academy')}
                  className="block w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm transition-colors"
                >
                  {lang === 'PL' ? 'Webinary' : 'Webinars'}
                </button>
                <button
                  onClick={() => handleSmart('academy-docs')}
                  className="block w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm transition-colors"
                >
                  {lang === 'PL' ? 'Dokumentacja API' : 'API Docs'}
                </button>
                <button
                  onClick={() => handleSmart('academy')}
                  className="block w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm transition-colors"
                >
                  {lang === 'PL' ? 'Blog' : 'Blog'}
                </button>
              </div>
            </div>
          </div>

        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(lang === 'PL' ? 'EN' : 'PL')}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors"
          >
            <Globe className="w-4 h-4" />
            {lang === 'PL' ? 'PL' : 'EN'}
          </button>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={t.actions.themeTooltip}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          >
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
            <button
              onClick={() => handleSmart('demo')}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-colors"
            >
              {t.actions.login}
            </button>
            <a
              href="/wizard"
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-primary-400 hover:text-primary-600 transition-colors"
            >
              {t.actions.signup}
            </a>
            <button
              onClick={() => handleSmart('demo')}
              className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-500/20 transition-colors"
            >
              {lang === 'PL' ? 'Zobacz Demo' : 'See Demo'}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="px-4 py-4 space-y-4">
            <button onClick={() => scrollTo('features')} className="block w-full text-left font-medium">
              {t.nav.features}
            </button>
            <button onClick={() => onOpenIntegrations()} className="block w-full text-left font-medium">
              {t.nav.integrations}
            </button>
            <button onClick={() => scrollTo('pricing')} className="block w-full text-left font-medium">
              {t.nav.pricing}
            </button>
            <button onClick={() => handleSmart('academy')} className="block w-full text-left font-medium">
              {lang === 'PL' ? 'Baza wiedzy' : 'Resources'}
            </button>
            <div className="h-px bg-slate-100 dark:bg-slate-800" />
            <button onClick={() => handleSmart('demo')} className="block font-medium">
              {t.actions.login}
            </button>
            <a href="/wizard" className="block font-bold text-primary-600">
              {t.actions.signup}
            </a>
            <button
              onClick={() => handleSmart('demo')}
              className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold"
            >
              {lang === 'PL' ? 'Zobacz Demo' : 'See Demo'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
