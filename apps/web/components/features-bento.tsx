'use client'

import React from 'react'
import {
  Check,
  X,
  FileBarChart,
  Users,
  PieChart,
  Timer,
  RefreshCw,
  ArrowUpRight,
  Zap,
} from 'lucide-react'

export const FeaturesBento: React.FC = () => {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20">
      {/* Comparison Section */}
      <div className="mb-16 grid gap-8 md:grid-cols-2">
        {/* Old World */}
        <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-brand-dark/70 p-8 shadow-md">
          <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-red-500/15 blur-[60px]" />
          <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-red-400">
            <Timer className="h-5 w-5" /> Stary Świat
          </h3>
          <ul className="space-y-4 text-pd-muted">
            <li className="flex items-start gap-3">
              <X className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              <span>Wolne narzędzia BI (Looker Studio) ładowane w nieskończoność</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              <span>Rozproszone dane w Excelach i plikach CSV</span>
            </li>
            <li className="flex items-start gap-3">
              <X className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              <span>Brak automatycznych alertów o spadkach marży</span>
            </li>
          </ul>
        </div>

        {/* New World */}
        <div className="relative overflow-hidden rounded-2xl border border-brand-accent/40 bg-brand-dark/70 p-8 shadow-neon-cyan">
          <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-brand-accent/20 blur-[60px]" />
          <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-brand-accent">
            <Zap className="h-5 w-5" /> PapaData (Twój Świat)
          </h3>
          <ul className="space-y-4 text-pd-foreground">
            <li className="flex items-start gap-3">
              <div className="rounded-full bg-brand-accent/15 p-0.5">
                <Check className="h-4 w-4 text-brand-accent" />
              </div>
              <span>
                <strong>Szybkie dashboardy:</strong> &lt;200ms dzięki lekkim komponentom React + Tremor
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="rounded-full bg-brand-accent/15 p-0.5">
                <Check className="h-4 w-4 text-brand-accent" />
              </div>
              <span>
                <strong>Autonomiczne AI:</strong> Asystent, który sugeruje kolejne akcje zamiast samych wykresów
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="rounded-full bg-brand-accent/15 p-0.5">
                <Check className="h-4 w-4 text-brand-accent" />
              </div>
              <span>
                <strong>Real-time:</strong> Dane odświeżane co 15 minut i monitorowane pod kątem anomalii
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-pd-foreground">Wszystko, czego potrzebujesz do skalowania</h2>
      </div>

      <div className="grid auto-rows-[250px] grid-cols-1 gap-6 md:grid-cols-3">
        {/* Feature 1 - Large */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-brand-border bg-brand-dark/70 p-6 shadow-md transition-colors hover:border-brand-accent/60 md:col-span-2">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-accent/8 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative z-10">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-accent/15">
              <FileBarChart className="text-brand-accent" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-pd-foreground">Raporty Sprzedaży &amp; Marży</h4>
            <p className="max-w-md text-pd-muted">
              Dokładna analiza P&amp;L uwzględniająca zwroty, koszty marketingu i prowizje bramek płatniczych w czasie
              rzeczywistym.
            </p>
          </div>
          <div className="relative z-10 self-end opacity-50 transition-opacity group-hover:opacity-100">
            <ArrowUpRight className="h-6 w-6 text-brand-accent" />
          </div>
        </div>

        {/* Feature 2 */}
        <div className="group relative overflow-hidden rounded-2xl border border-brand-border bg-brand-dark/70 p-6 shadow-md transition-colors hover:border-brand-secondary/60">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-secondary/15">
            <Users className="text-brand-secondary" />
          </div>
          <h4 className="mb-2 text-lg font-bold text-pd-foreground">Analiza Cohort</h4>
          <p className="text-sm text-pd-muted">Sprawdź LTV i retencję klientów w podziale na miesiące pozyskania.</p>
        </div>

        {/* Feature 3 */}
        <div className="group relative overflow-hidden rounded-2xl border border-brand-border bg-brand-dark/70 p-6 shadow-md transition-colors hover:border-brand-secondary/60">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-secondary/15">
            <PieChart className="text-brand-secondary" />
          </div>
          <h4 className="mb-2 text-lg font-bold text-pd-foreground">Marketing Mix</h4>
          <p className="text-sm text-pd-muted">
            Atrybucja konwersji pomiędzy Google Ads, Meta Ads i wejściami organicznymi.
          </p>
        </div>

        {/* Feature 4 - Large */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-brand-border bg-brand-dark/70 p-6 shadow-md transition-colors hover:border-brand-accent/60 md:col-span-2">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-accent/8 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative z-10">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-accent/15">
              <RefreshCw className="text-brand-accent" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-pd-foreground">Automatyczny ETL</h4>
            <p className="max-w-md text-pd-muted">
              Zapomnij o ręcznym imporcie CSV. Pipeline’y danych działają 24/7, zapewniając świeżość bez Twojej ingerencji.
            </p>
          </div>
          <div className="relative z-10 self-end opacity-60 transition-opacity group-hover:opacity-100">
            <RefreshCw className="h-6 w-6 text-brand-accent animate-spin" />
          </div>
        </div>
      </div>
    </section>
  )
}

