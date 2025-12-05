'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown, Globe2, Sun, Moon, LogIn } from 'lucide-react';
import { useI18n } from '@papadata/i18n';
import { useTheme } from './theme-provider';

type HeaderProps = {
  onOpenIntegrationsCatalog?: () => void;
  onOpenNaggingModal?: () => void;
};

export function Header({
  onOpenIntegrationsCatalog,
}: HeaderProps) {
  const t = useI18n();
  const isPl = t.locale === 'pl';
  const { theme, toggleTheme } = useTheme();

  const switchLocale = () => {
    t.setLocale(t.locale === 'pl' ? 'en' : 'pl');
  };

  const scrollToId = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = `/${id}`;
    }
  };

  const navLinkClass =
    'text-xs md:text-sm text-pd-muted hover:text-brand-accent transition-colors';

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-brand-border bg-brand-dark/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-accent text-[11px] font-bold text-pd-bg shadow-md">
              PD
            </div>
            <span className="text-sm font-semibold tracking-tight text-pd-foreground">
              {t('landing.header.logo.text')}
            </span>
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            <div className="group relative">
              <button
                type="button"
                className={`${navLinkClass} inline-flex items-center gap-1`}
              >
                {t('landing.header.nav.features.label')}
                <ChevronDown className="h-3 w-3" />
              </button>
              <div className="invisible absolute left-0 top-full z-30 mt-2 w-64 rounded-xl border border-brand-border bg-brand-dark/95 p-3 text-xs text-pd-foreground shadow-xl opacity-0 transition group-hover:visible group-hover:opacity-100">
                <ul className="space-y-1.5">
                  <li>
                    <button
                      type="button"
                      onClick={() => scrollToId('#features-sales')}
                      className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-left text-[11px] hover:bg-brand-card/10"
                    >
                      <span>{isPl ? 'Analiza sprzedaży' : 'Sales analysis'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => scrollToId('#features-marketing')}
                      className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-left text-[11px] hover:bg-brand-card/10"
                    >
                      <span>{isPl ? 'Marketing i kampanie' : 'Marketing & campaigns'}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => scrollToId('#features-customers')}
                      className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-left text-[11px] hover:bg-brand-card/10"
                    >
                      <span>{isPl ? 'Klienci i lojalność' : 'Customers & loyalty'}</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative">
              <button
                type="button"
                className={`${navLinkClass} inline-flex items-center gap-1`}
              >
                {t('landing.header.nav.integrations.label')}
                <ChevronDown className="h-3 w-3" />
              </button>

              <div className="invisible absolute left-0 top-full z-30 mt-2 w-64 rounded-xl border border-brand-border bg-brand-dark/95 p-3 text-xs text-pd-foreground shadow-xl opacity-0 transition group-hover:visible group-hover:opacity-100">
                <div className="mb-2 text-[11px] font-semibold text-pd-muted">
                  {isPl ? 'Skróty do katalogu:' : 'Quick links:'}
                </div>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenIntegrationsCatalog?.()}
                    className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-left text-[11px] hover:bg-brand-card/10"
                  >
                    <span>{isPl ? 'Platformy sklepowe' : 'E-commerce platforms'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenIntegrationsCatalog?.()}
                    className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-left text-[11px] hover:bg-brand-card/10"
                  >
                    <span>{isPl ? 'Reklama i analityka' : 'Ads & Analytics'}</span>
                  </button>
                  <div className="border-t border-brand-border pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenIntegrationsCatalog?.()}
                      className="inline-flex w-full items-center justify-center rounded-lg border border-brand-accent/60 bg-brand-accent/10 px-3 py-1.5 text-[11px] font-semibold text-brand-accent hover:bg-brand-accent/20"
                    >
                      {isPl ? 'Zobacz wszystkie integracje' : 'View all integrations'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('#pricing');
              }}
              className={navLinkClass}
            >
              {t('landing.header.nav.pricing.label')}
            </a>

            <a
              href="#academy"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('#academy');
              }}
              className={navLinkClass}
            >
              {t('landing.header.nav.resources.label')}
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={switchLocale}
            className="inline-flex items-center gap-1 rounded-full border border-brand-border bg-brand-dark/70 px-2.5 py-1 text-[11px] font-medium text-pd-foreground hover:border-brand-accent hover:text-brand-accent"
          >
            <Globe2 className="h-3.5 w-3.5" />
            <span>{t.locale === 'pl' ? 'PL' : 'EN'}</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            title={t('landing.header.actions.themeToggle.tooltip')}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-brand-border bg-brand-dark/70 text-pd-foreground hover:border-brand-accent hover:text-brand-accent"
          >
            {theme === 'dark' ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
          </button>

          <Link
            href="/demo/dashboard"
            className="hidden items-center gap-1 rounded-full border border-brand-accent/60 bg-brand-accent/10 px-3 py-1.5 text-[11px] font-semibold text-brand-accent hover:bg-brand-accent/20 md:inline-flex"
          >
            <LogIn className="h-3.5 w-3.5" />
            {isPl ? 'Zobacz demo' : 'View demo'}
          </Link>

          <Link
            href="/demo/dashboard"
            className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-medium text-pd-foreground hover:text-brand-accent"
          >
            {isPl ? 'Zaloguj' : 'Log in'}
          </Link>

          <Link
            href="/wizard"
            className="hidden items-center rounded-full bg-brand-accent px-3.5 py-1.5 text-[11px] font-semibold text-pd-bg shadow-sm hover:bg-brand-accent md:inline-flex"
          >
            {isPl ? 'Zarejestruj się' : 'Sign up'}
          </Link>
        </div>
      </div>
    </header>
  );
}
