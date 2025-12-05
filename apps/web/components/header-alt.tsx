'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Activity, Moon, Sun, Globe } from 'lucide-react'
import { useTheme } from './theme-provider'
import { useI18n } from '@papadata/i18n'

export const HeaderAlt: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const t = useI18n()
  const [lang, setLang] = useState<'PL' | 'EN'>(t.locale === 'pl' ? 'PL' : 'EN')

  const toggleLang = () => {
    const next = lang === 'PL' ? 'EN' : 'PL'
    setLang(next)
    t.setLocale(next.toLowerCase() as 'pl' | 'en')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-brand-border bg-brand-dark/80 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
        {/* Logo */}
        <Link href="/" className="group relative z-10 flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border bg-brand-dark transition-colors duration-300 group-hover:border-brand-accent">
            <Activity className="h-5 w-5 text-brand-accent" />
            <div className="absolute inset-0 rounded-lg bg-brand-accent/30 blur-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <span className="text-lg font-bold tracking-tight text-pd-foreground transition-all duration-300 group-hover:text-brand-accent">
            PapaData
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-pd-muted md:flex">
          {[
            { id: 'features', label: t('landing.header.nav.features.label') },
            { id: 'integrations', label: t('landing.header.nav.integrations.label') },
            { id: 'pricing', label: t('landing.header.nav.pricing.label') },
            { id: 'academy', label: t('landing.header.nav.resources.label') },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="group relative py-2 transition-colors duration-300 hover:text-pd-foreground"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-accent shadow-neon-cyan transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          <div className="hidden items-center gap-3 border-r border-brand-border pr-4 sm:flex">
            <button
              type="button"
              onClick={toggleLang}
              className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-bold text-pd-muted transition-colors hover:bg-brand-card/10 hover:text-brand-accent"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded p-1.5 text-pd-muted transition-colors hover:bg-brand-card/10 hover:text-brand-accent"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/demo/dashboard"
              className="hidden text-sm font-medium text-pd-muted transition-colors hover:text-brand-accent sm:inline-block"
            >
              {t.locale === 'pl' ? 'Zaloguj' : 'Log in'}
            </Link>
            <Link
              href="/wizard"
              className="rounded-lg border border-brand-accent/40 bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-dark shadow-neon-cyan transition hover:bg-brand-accent/90"
            >
              {t.locale === 'pl' ? 'Wypróbuj za darmo' : 'Try for free'}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

