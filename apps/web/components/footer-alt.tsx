'use client'

import Link from 'next/link'
import { Facebook, Linkedin, Twitter, Youtube } from 'lucide-react'

export const FooterAlt: React.FC = () => {
  return (
    <footer className="relative overflow-hidden border-t border-brand-border bg-brand-dark pt-16 pb-10">
      {/* Background Glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-[280px] w-[520px] rounded-full bg-brand-secondary/10 blur-[110px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="mb-14 grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Brand Column */}
          <div className="col-span-2 space-y-6 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent text-[10px] font-bold text-brand-dark shadow-neon-cyan">
                PD
              </div>
              <span className="text-xl font-bold text-pd-foreground">PapaData</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-pd-muted">
              AI, które analizuje Twoje dane e-commerce. Podejmuj decyzje na podstawie danych, nie przeczucia.
            </p>
            <div className="flex gap-3">
              {[Linkedin, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border bg-brand-dark/80 text-pd-muted transition-colors hover:border-brand-accent/60 hover:text-brand-accent hover:shadow-neon-cyan"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h5 className="mb-5 text-sm font-semibold uppercase tracking-wide text-pd-foreground">Produkt</h5>
            <ul className="space-y-3 text-sm text-pd-muted">
              <li>
                <a href="#features" className="transition-all hover:text-brand-accent hover:pl-1">
                  Funkcje
                </a>
              </li>
              <li>
                <a href="#integrations" className="transition-all hover:text-brand-accent hover:pl-1">
                  Integracje
                </a>
              </li>
              <li>
                <a href="#security" className="transition-all hover:text-brand-accent hover:pl-1">
                  Bezpieczeństwo
                </a>
              </li>
              <li>
                <a href="#pricing" className="transition-all hover:text-brand-accent hover:pl-1">
                  Skalowalność
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h5 className="mb-5 text-sm font-semibold uppercase tracking-wide text-pd-foreground">Zasoby</h5>
            <ul className="space-y-3 text-sm text-pd-muted">
              <li>
                <Link href="/blog" className="transition-all hover:text-brand-accent hover:pl-1">
                  Blog
                </Link>
              </li>
              <li>
                <a href="#academy" className="transition-all hover:text-brand-accent hover:pl-1">
                  Webinary
                </a>
              </li>
              <li>
                <a href="#pricing" className="transition-all hover:text-brand-accent hover:pl-1">
                  Cennik
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div>
            <h5 className="mb-5 text-sm font-semibold uppercase tracking-wide text-pd-foreground">Firma & Prawne</h5>
            <ul className="space-y-3 text-sm text-pd-muted">
              <li>
                <Link href="/contact" className="transition-all hover:text-brand-accent hover:pl-1">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/demo/dashboard" className="transition-all hover:text-brand-accent hover:pl-1">
                  Zaloguj się
                </Link>
              </li>
              <li>
                <Link href="/wizard" className="transition-all hover:text-brand-accent hover:pl-1">
                  Zarejestruj się
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="transition-all hover:text-brand-accent hover:pl-1">
                  Polityka Prywatności
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-all hover:text-brand-accent hover:pl-1">
                  Regulamin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-brand-border/70 pt-6 text-sm text-pd-muted md:flex-row">
          <p>© {new Date().getFullYear()} PapaData Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-brand-accent">
              Sitemap
            </a>
            <a href="/cookie-policy" className="transition-colors hover:text-brand-accent">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
