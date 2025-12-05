'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-border/60 bg-brand-dark/80">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 text-sm text-pd-muted sm:grid-cols-4">
          {/* Kolumna 1 – marka */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent text-xs font-semibold text-pd-bg shadow-lg shadow-brand-accent/40">
                PD
              </span>
              <span className="text-sm font-semibold tracking-wide text-pd-foreground">
                PapaData
              </span>
            </div>
            <p className="text-xs text-pd-muted">
              AI, które analizuje Twoje dane e-commerce.
            </p>
            <div className="flex gap-3 text-xs text-pd-muted">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-accent"
              >
                LinkedIn
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-accent"
              >
                X
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-accent"
              >
                YouTube
              </a>
            </div>
          </div>

          {/* Kolumna 2 – Produkt */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-pd-muted">
              Produkt
            </h3>
            <a
              href="#features"
              className="block text-xs text-pd-muted hover:text-brand-accent"
            >
              Funkcje
            </a>
            <a
              href="#integrations"
              className="block text-xs text-pd-muted hover:text-brand-accent"
            >
              Integracje
            </a>
            <a
              href="#security"
              className="block text-xs text-pd-muted hover:text-brand-accent"
            >
              Bezpieczeństwo
            </a>
            <a
              href="#security"
              className="block text-xs text-pd-muted hover:text-brand-accent"
            >
              Skalowalność
            </a>
          </div>

          {/* Kolumna 3 – Zasoby */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-pd-muted">
              Zasoby
            </h3>
            <Link
              href="/blog"
              className="block text-xs text-pd-muted hover:text-brand-accent"
            >
              Blog
            </Link>
            <a
              href="#academy"
              className="block text-xs text-pd-muted hover:text-brand-accent"
            >
              Webinary / Akademia
            </a>
            <a
              href="#pricing"
              className="block text-xs text-pd-muted hover:text-brand-accent"
            >
              Cennik
            </a>
          </div>

          {/* Kolumna 4 – Firma & Prawne */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-pd-muted">
              Firma &amp; prawne
            </h3>
            <Link
              href="/contact"
              className="block text-xs text-pd-muted hover:text-brand-accent"
            >
              Kontakt
            </Link>
            <Link
              href="/demo/dashboard"
              className="block text-xs text-pd-muted hover:text-brand-accent"
            >
              Zaloguj się
            </Link>
            <Link
              href="/wizard"
              className="block text-xs text-pd-muted hover:text-brand-accent"
            >
              Zarejestruj się
            </Link>
            <Link
              href="/privacy-policy"
              className="block text-xs text-pd-muted hover:text-brand-accent"
            >
              Polityka Prywatności
            </Link>
            <Link
              href="/terms"
              className="block text-xs text-pd-muted hover:text-brand-accent"
            >
              Regulamin
            </Link>
            <Link
              href="/cookie-policy"
              className="block text-xs text-pd-muted hover:text-brand-accent"
            >
              Polityka Cookies
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-brand-border pt-4 text-xs text-pd-foreground0 sm:flex-row">
          <span>© {year} PapaData. All rights reserved.</span>
          <span>Made in Poland • Demo UI</span>
        </div>
      </div>
    </footer>
  );
}
