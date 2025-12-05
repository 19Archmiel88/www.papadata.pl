'use client';

import React from 'react';
import { Header } from './header';
import { ScrollToTopButton } from './scroll-to-top-button';
import { NaggingTrialModal } from './nagging-trial-modal';
import IntegrationsCatalogModal from './integrations-catalog-modal';
import Link from 'next/link';
import { useI18n } from '@papadata/i18n';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type SiteShellProps = {
  children: React.ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  const t = useI18n();
  const isPl = t.locale === 'pl';
  const pathname = usePathname();
  const bare =
    pathname?.startsWith('/wizard') || pathname?.startsWith('/dashboard');
  const isLanding = pathname === '/';
  const [catalogOpen, setCatalogOpen] = useState(false);

  useEffect(() => {
    const handler = () => setCatalogOpen(true);
    document.addEventListener('papadata:openIntegrationsCatalog', handler);
    return () => document.removeEventListener('papadata:openIntegrationsCatalog', handler);
  }, []);

  if (bare) {
    return <main className="min-h-screen bg-brand-dark text-pd-foreground">{children}</main>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-dark text-pd-foreground">
      {/* Górny sticky header */}
      <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-dark/80 backdrop-blur">
        <Header onOpenIntegrationsCatalog={() => setCatalogOpen(true)} />
      </header>

      {/* Główna treść */}
      <main className="flex-1">{children}</main>

      {/* STOPKA */}
      <footer className="border-t border-brand-border bg-brand-dark">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-4">
          {/* Kolumna 1: Marka */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-accent text-sm font-bold text-pd-bg shadow-neon-cyan">
                PD
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight">
                  PapaData
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-brand-accent">
                  {t('landing.hero.tagline')}
                </p>
              </div>
            </div>
            <p className="text-xs text-pd-muted">
              {isPl
                ? 'AI, które analizuje Twoje dane e-commerce i codziennie przygotowuje raporty sprzedaży, marketingu i klientów.'
                : 'AI that analyzes your e-commerce data and prepares daily sales, marketing and customer reports.'}
            </p>
            <div className="flex gap-3 text-pd-muted">
              <Link
                href="https://www.linkedin.com"
                target="_blank"
                className="text-xs transition-colors hover:text-brand-accent"
              >
                LinkedIn
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="text-xs transition-colors hover:text-brand-accent"
              >
                X
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                className="text-xs transition-colors hover:text-brand-accent"
              >
                YouTube
              </Link>
            </div>
          </div>

          {/* Kolumna 2: Produkt */}
          <div className="space-y-2 text-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pd-muted">
              {isPl ? 'Produkt' : 'Product'}
            </p>
            <nav className="space-y-1 text-sm">
              <Link
                href="#features"
                className="block text-pd-foreground transition-colors hover:text-brand-accent"
              >
                {isPl ? 'Funkcje' : 'Features'}
              </Link>
              <Link
                href="#integrations"
                className="block text-pd-foreground transition-colors hover:text-brand-accent"
              >
                {isPl ? 'Integracje' : 'Integrations'}
              </Link>
              <Link
                href="#security"
                className="block text-pd-foreground transition-colors hover:text-brand-accent"
              >
                {isPl ? 'Bezpieczeństwo' : 'Security'}
              </Link>
              <Link
                href="#security"
                className="block text-pd-foreground transition-colors hover:text-brand-accent"
              >
                {isPl ? 'Skalowalność' : 'Scalability'}
              </Link>
            </nav>
          </div>

          {/* Kolumna 3: Zasoby */}
          <div className="space-y-2 text-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pd-muted">
              {isPl ? 'Zasoby' : 'Resources'}
            </p>
            <nav className="space-y-1 text-sm">
              <Link
                href="/blog"
                className="block text-pd-foreground transition-colors hover:text-brand-accent"
              >
                Blog
              </Link>
              <Link
                href="#academy"
                className="block text-pd-foreground transition-colors hover:text-brand-accent"
              >
                {isPl ? 'Webinary' : 'Webinars'}
              </Link>
              <Link
                href="#pricing"
                className="block text-pd-foreground transition-colors hover:text-brand-accent"
              >
                {isPl ? 'Cennik' : 'Pricing'}
              </Link>
            </nav>
          </div>

          {/* Kolumna 4: Firma & Prawne */}
          <div className="space-y-2 text-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pd-muted">
              {isPl ? 'Firma & Prawne' : 'Company & Legal'}
            </p>
            <nav className="space-y-1 text-sm">
              <Link
                href="/contact"
                className="block text-pd-foreground transition-colors hover:text-brand-accent"
              >
                {isPl ? 'Kontakt' : 'Contact'}
              </Link>
              <Link
                href="/demo/dashboard"
                className="block text-pd-foreground transition-colors hover:text-brand-accent"
              >
                {isPl ? 'Zaloguj się (demo)' : 'Log in (demo)'}
              </Link>
              <Link
                href="/wizard"
                className="block text-pd-foreground transition-colors hover:text-brand-accent"
              >
                {isPl ? 'Zarejestruj się' : 'Sign up'}
              </Link>
              <Link
                href="/privacy-policy"
                className="block text-pd-foreground transition-colors hover:text-brand-accent"
              >
                {isPl ? 'Polityka prywatności' : 'Privacy Policy'}
              </Link>
              <Link
                href="/terms"
                className="block text-pd-foreground transition-colors hover:text-brand-accent"
              >
                {isPl ? 'Regulamin' : 'Terms of Service'}
              </Link>
              <Link
                href="/cookie-policy"
                className="block text-pd-foreground transition-colors hover:text-brand-accent"
              >
                {isPl ? 'Polityka Cookies' : 'Cookie Policy'}
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-brand-border/70">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <p className="text-[11px] text-pd-muted">
              © {new Date().getFullYear()} PapaData.{' '}
              {isPl ? 'Wszystkie prawa zastrzeżone.' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>

      <ScrollToTopButton />
      {!isLanding && <NaggingTrialModal />}
      <IntegrationsCatalogModal open={catalogOpen} onClose={() => setCatalogOpen(false)} />
    </div>
  );
}
