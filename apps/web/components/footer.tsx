'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/60 bg-slate-950/80">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 text-sm text-slate-300 sm:grid-cols-4">
          {/* Kolumna 1 – marka */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/50">
                PD
              </span>
              <span className="text-sm font-semibold tracking-wide text-slate-100">
                PapaData
              </span>
            </div>
            <p className="text-xs text-slate-400">
              AI, które analizuje Twoje dane e-commerce.
            </p>
            <div className="flex gap-3 text-xs text-slate-400">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400"
              >
                LinkedIn
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400"
              >
                X
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400"
              >
                YouTube
              </a>
            </div>
          </div>

          {/* Kolumna 2 – Produkt */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Produkt
            </h3>
            <a
              href="#features"
              className="block text-xs text-slate-300 hover:text-emerald-400"
            >
              Funkcje
            </a>
            <a
              href="#integrations"
              className="block text-xs text-slate-300 hover:text-emerald-400"
            >
              Integracje
            </a>
            <a
              href="#security"
              className="block text-xs text-slate-300 hover:text-emerald-400"
            >
              Bezpieczeństwo
            </a>
            <a
              href="#security"
              className="block text-xs text-slate-300 hover:text-emerald-400"
            >
              Skalowalność
            </a>
          </div>

          {/* Kolumna 3 – Zasoby */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Zasoby
            </h3>
            <Link
              href="/blog"
              className="block text-xs text-slate-300 hover:text-emerald-400"
            >
              Blog
            </Link>
            <a
              href="#academy"
              className="block text-xs text-slate-300 hover:text-emerald-400"
            >
              Webinary / Akademia
            </a>
            <a
              href="#pricing"
              className="block text-xs text-slate-300 hover:text-emerald-400"
            >
              Cennik
            </a>
          </div>

          {/* Kolumna 4 – Firma & Prawne */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Firma &amp; prawne
            </h3>
            <Link
              href="/contact"
              className="block text-xs text-slate-300 hover:text-emerald-400"
            >
              Kontakt
            </Link>
            <Link
              href="/demo/dashboard"
              className="block text-xs text-slate-300 hover:text-emerald-400"
            >
              Zaloguj się
            </Link>
            <Link
              href="/wizard"
              className="block text-xs text-slate-300 hover:text-emerald-400"
            >
              Zarejestruj się
            </Link>
            <Link
              href="/privacy-policy"
              className="block text-xs text-slate-300 hover:text-emerald-400"
            >
              Polityka Prywatności
            </Link>
            <Link
              href="/terms"
              className="block text-xs text-slate-300 hover:text-emerald-400"
            >
              Regulamin
            </Link>
            <Link
              href="/cookie-policy"
              className="block text-xs text-slate-300 hover:text-emerald-400"
            >
              Polityka Cookies
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-slate-800 pt-4 text-xs text-slate-500 sm:flex-row">
          <span>© {year} PapaData. All rights reserved.</span>
          <span>Made in Poland • Demo UI</span>
        </div>
      </div>
    </footer>
  );
}
