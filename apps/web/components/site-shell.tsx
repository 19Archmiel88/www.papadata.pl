'use client';

import React from 'react';
import { Header } from './header';
import { ScrollToTopButton } from './scroll-to-top-button';
import { NaggingTrialModal } from './nagging-trial-modal';
import Link from 'next/link';
import { useI18n } from '@papadata/i18n';
import { usePathname } from 'next/navigation';

type SiteShellProps = {
  children: React.ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  const t = useI18n();
  const isPl = t.locale === 'pl';
  const pathname = usePathname();
  const bare =
    pathname?.startsWith('/wizard') || pathname?.startsWith('/dashboard');

  if (bare) {
    return <main className="min-h-screen bg-slate-950 text-slate-50">{children}</main>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      {/* Górny sticky header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <Header />
      </header>

      {/* Główna treść */}
      <main className="flex-1">{children}</main>

      {/* STOPKA */}
      <footer className="border-t border-slate-800 bg-slate-950/95">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-4">
          {/* Kolumna 1: Marka */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-sm font-bold text-slate-950 shadow shadow-emerald-500/50">
                PD
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight">
                  PapaData
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-300">
                  {t('landing.hero.tagline')}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              {isPl
                ? 'AI, które analizuje Twoje dane e-commerce i codziennie przygotowuje raporty sprzedaży, marketingu i klientów.'
                : 'AI that analyzes your e-commerce data and prepares daily sales, marketing and customer reports.'}
            </p>
            <div className="flex gap-3 text-slate-400">
              <Link
                href="https://www.linkedin.com"
                target="_blank"
                className="text-xs transition-colors hover:text-emerald-300"
              >
                LinkedIn
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="text-xs transition-colors hover:text-emerald-300"
              >
                X
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                className="text-xs transition-colors hover:text-emerald-300"
              >
                YouTube
              </Link>
            </div>
          </div>

          {/* Kolumna 2: Produkt */}
          <div className="space-y-2 text-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {isPl ? 'Produkt' : 'Product'}
            </p>
            <nav className="space-y-1 text-sm">
              <Link
                href="#features"
                className="block text-slate-300 transition-colors hover:text-emerald-300"
              >
                {isPl ? 'Funkcje' : 'Features'}
              </Link>
              <Link
                href="#integrations"
                className="block text-slate-300 transition-colors hover:text-emerald-300"
              >
                {isPl ? 'Integracje' : 'Integrations'}
              </Link>
              <Link
                href="#security"
                className="block text-slate-300 transition-colors hover:text-emerald-300"
              >
                {isPl ? 'Bezpieczeństwo' : 'Security'}
              </Link>
              <Link
                href="#security"
                className="block text-slate-300 transition-colors hover:text-emerald-300"
              >
                {isPl ? 'Skalowalność' : 'Scalability'}
              </Link>
            </nav>
          </div>

          {/* Kolumna 3: Zasoby */}
          <div className="space-y-2 text-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {isPl ? 'Zasoby' : 'Resources'}
            </p>
            <nav className="space-y-1 text-sm">
              <Link
                href="/blog"
                className="block text-slate-300 transition-colors hover:text-emerald-300"
              >
                Blog
              </Link>
              <Link
                href="#academy"
                className="block text-slate-300 transition-colors hover:text-emerald-300"
              >
                {isPl ? 'Webinary' : 'Webinars'}
              </Link>
              <Link
                href="#pricing"
                className="block text-slate-300 transition-colors hover:text-emerald-300"
              >
                {isPl ? 'Cennik' : 'Pricing'}
              </Link>
            </nav>
          </div>

          {/* Kolumna 4: Firma & Prawne */}
          <div className="space-y-2 text-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {isPl ? 'Firma & Prawne' : 'Company & Legal'}
            </p>
            <nav className="space-y-1 text-sm">
              <Link
                href="/contact"
                className="block text-slate-300 transition-colors hover:text-emerald-300"
              >
                {isPl ? 'Kontakt' : 'Contact'}
              </Link>
              <Link
                href="/demo/dashboard"
                className="block text-slate-300 transition-colors hover:text-emerald-300"
              >
                {isPl ? 'Zaloguj się (demo)' : 'Log in (demo)'}
              </Link>
              <Link
                href="/wizard"
                className="block text-slate-300 transition-colors hover:text-emerald-300"
              >
                {isPl ? 'Zarejestruj się' : 'Sign up'}
              </Link>
              <Link
                href="/privacy-policy"
                className="block text-slate-300 transition-colors hover:text-emerald-300"
              >
                {isPl ? 'Polityka prywatności' : 'Privacy Policy'}
              </Link>
              <Link
                href="/terms"
                className="block text-slate-300 transition-colors hover:text-emerald-300"
              >
                {isPl ? 'Regulamin' : 'Terms of Service'}
              </Link>
              <Link
                href="/cookie-policy"
                className="block text-slate-300 transition-colors hover:text-emerald-300"
              >
                {isPl ? 'Polityka Cookies' : 'Cookie Policy'}
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-slate-800/70">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <p className="text-[11px] text-slate-500">
              © {new Date().getFullYear()} PapaData.{' '}
              {isPl ? 'Wszystkie prawa zastrzeżone.' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>

      <ScrollToTopButton />
      <NaggingTrialModal />
    </div>
  );
}
