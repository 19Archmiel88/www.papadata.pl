'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  Globe2,
  Sun,
  Moon,
  LogIn,
} from 'lucide-react';
import { useI18n } from '@papadata/i18n';

type HeaderProps = {
  onOpenIntegrationsCatalog?: () => void;
  onOpenNaggingModal?: () => void;
};

export function Header({
  onOpenIntegrationsCatalog,
  onOpenNaggingModal,
}: HeaderProps) {
  const t = useI18n();
  const pathname = usePathname();
  const isPl = t.locale === 'pl';

  // prosty toggle motywu – dark / light
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const switchLocale = () => {
    t.setLocale(t.locale === 'pl' ? 'en' : 'pl');
  };

  const navLinkClass =
    'text-xs md:text-sm text-slate-300 hover:text-emerald-300 transition-colors';

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16">
        {/* LEWA STRONA – logo + nawigacja */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-[11px] font-bold text-slate-950 shadow-md">
              PD
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-50">
              {t('landing.header.logo.text')}
            </span>
          </Link>

          {/* Nawigacja – desktop */}
          <nav className="hidden items-center gap-5 md:flex">
            <a href="#features" className={navLinkClass}>
              {t('landing.header.nav.features.label')}
            </a>

            {/* Integracje – z rozwijaną akcją „Zobacz wszystkie” */}
            <div className="relative group">
              <button
                type="button"
                className={`${navLinkClass} inline-flex items-center gap-1`}
              >
                {t('landing.header.nav.integrations.label')}
                <ChevronDown className="h-3 w-3" />
              </button>

              <div className="invisible absolute left-0 top-full z-30 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-950/95 p-3 text-xs text-slate-200 shadow-xl opacity-0 transition group-hover:visible group-hover:opacity-100">
                <p className="mb-2 text-[11px] font-semibold text-slate-400">
                  {isPl ? 'Popularne integracje:' : 'Popular integrations:'}
                </p>
                <ul className="space-y-1.5">
                  <li className="flex justify-between text-[11px]">
                    <span>WooCommerce</span>
                    <span className="text-slate-500">
                      {isPl ? 'Sklep' : 'Store'}
                    </span>
                  </li>
                  <li className="flex justify-between text-[11px]">
                    <span>Google Ads</span>
                    <span className="text-slate-500">Ads</span>
                  </li>
                  <li className="flex justify-between text-[11px]">
                    <span>Meta Ads</span>
                    <span className="text-slate-500">Ads</span>
                  </li>
                  <li className="flex justify-between text-[11px]">
                    <span>GA4</span>
                    <span className="text-slate-500">Analytics</span>
                  </li>
                </ul>
                <button
                  type="button"
                  onClick={() => onOpenIntegrationsCatalog?.()}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/20"
                >
                  {t('landing.integrations.viewAllButton')}
                </button>
              </div>
            </div>

            <a href="#pricing" className={navLinkClass}>
              {t('landing.header.nav.pricing.label')}
            </a>

            <a href="#academy" className={navLinkClass}>
              {t('landing.header.nav.resources.label')}
            </a>
          </nav>
        </div>

        {/* PRAWA STRONA – akcje */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Przełącznik języka */}
          <button
            type="button"
            onClick={switchLocale}
            className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:border-emerald-500 hover:text-emerald-200"
          >
            <Globe2 className="h-3.5 w-3.5" />
            <span>{t.locale === 'pl' ? 'PL' : 'EN'}</span>
          </button>

          {/* Przełącznik motywu */}
          <button
            type="button"
            onClick={toggleTheme}
            title={t('landing.header.actions.themeToggle.tooltip')}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 text-slate-200 hover:border-emerald-500 hover:text-emerald-200"
          >
            {theme === 'dark' ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Link: Demo Dashboard */}
          <Link
            href="/demo/dashboard"
            className="hidden items-center gap-1 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/20 md:inline-flex"
          >
            <LogIn className="h-3.5 w-3.5" />
            {isPl ? 'Zobacz demo' : 'View demo'}
          </Link>

          {/* Link: Zaloguj (na razie też na demo, ale inny styl) */}
          <Link
            href="/demo/dashboard"
            className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:text-emerald-300"
          >
            {t('landing.header.actions.login')}
          </Link>

          {/* CTA: Rozpocznij trial – może otwierać modal trial / wizard */}
          <button
            type="button"
            onClick={() => onOpenNaggingModal?.()}
            className="hidden items-center rounded-full bg-emerald-500 px-3.5 py-1.5 text-[11px] font-semibold text-slate-950 shadow-sm hover:bg-emerald-400 md:inline-flex"
          >
            {t('landing.hero.cta.trial')}
          </button>
        </div>
      </div>
    </header>
  );
}
