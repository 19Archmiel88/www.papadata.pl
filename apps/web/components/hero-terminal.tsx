'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Play, Activity, Database, BrainCircuit, ArrowRight } from 'lucide-react'

const TerminalSimulation = () => {
  const [lines, setLines] = useState<string[]>(['> Initializing Vertex AI...'])

  useEffect(() => {
    const sequence = [
      { text: '> Connecting to WooCommerce API...', delay: 800 },
      { text: '> Fetching last 30 days transactions...', delay: 1800 },
      { text: '> Analyzing retention metrics...', delay: 2800 },
      { text: '> Anomaly detected in Cohort B.', delay: 3600 },
      { text: '> Generating optimization suggestions...', delay: 4500 },
      { text: '> Report ready. Loading dashboard.', delay: 5500 },
    ]

    const timeouts = sequence.map(({ text, delay }) =>
      setTimeout(() => setLines((prev) => [...prev.slice(-6), text]), delay),
    )
    return () => timeouts.forEach(clearTimeout)
  }, [])

  return (
    <div className="relative flex h-[350px] w-full flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-dark/85 p-4 font-mono text-xs shadow-neon-cyan md:h-[450px] md:p-6">
      <div className="flex items-center gap-2 border-b border-brand-border/80 bg-brand-dark/90 px-4">
        <div className="flex h-8 items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400/70" />
          <span className="h-3 w-3 rounded-full bg-amber-300/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
        </div>
        <span className="text-[11px] text-pd-muted">ai_agent_v3.tsx</span>
      </div>
      <div className="mt-4 flex-1 space-y-2 text-pd-foreground">
        {lines.map((line, i) => (
          <div
            key={i}
            className="flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <span className="text-brand-accent">$</span>
            <span
              className={
                line.includes('Anomaly')
                  ? 'text-red-400'
                  : line.includes('Ready')
                  ? 'text-brand-accent'
                  : ''
              }
            >
              {line}
            </span>
          </div>
        ))}
        <div className="text-brand-accent animate-pulse">_</div>
      </div>

      {/* Visual Abstract Graph */}
      <div className="absolute bottom-6 right-6 flex h-20 w-32 items-end justify-between gap-1 opacity-60">
        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}%` }}
            className="w-3 rounded-t-sm bg-brand-secondary shadow-[0_0_10px_rgba(129,140,248,0.45)]"
          />
        ))}
      </div>
    </div>
  )
}

export const HeroTerminal: React.FC = () => {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-32 md:pb-32 md:pt-48">
      {/* Background Glows */}
      <div className="absolute left-1/4 top-1/4 -z-10 h-96 w-96 rounded-full bg-brand-secondary/20 blur-[128px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-brand-accent/15 blur-[128px]" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        {/* Left Content */}
        <div className="z-10 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-accent">
            <Activity className="h-4 w-4" />
            <span>Google Vertex AI Inside</span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-pd-foreground md:text-6xl">
            AI E-commerce <br />
            Analytics: <br />
            <span className="bg-gradient-to-r from-brand-accent to-brand-secondary bg-clip-text text-transparent">
              Twoje Single Source of Truth.
            </span>
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-pd-muted">
            Połącz dane z Allegro, WooCommerce, Google Ads i Meta w jednym miejscu.
            Automatyczna analiza anomalii i estymacja ROI bez kodowania.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/wizard"
              className="inline-flex items-center justify-center rounded-xl bg-brand-accent px-5 py-3 text-sm font-semibold text-brand-dark shadow-neon-cyan transition hover:bg-brand-accent/90"
            >
              Rozpocznij 14-dniowy Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/demo/dashboard"
              className="inline-flex items-center justify-center rounded-xl border border-brand-border bg-brand-dark/70 px-5 py-3 text-sm font-semibold text-pd-foreground transition hover:border-brand-accent hover:text-brand-accent"
            >
              <Play className="mr-2 h-4 w-4" />
              Zobacz Demo
            </Link>
          </div>

          <div className="flex items-center gap-4 pt-4 text-xs text-pd-muted">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-border bg-brand-dark/80 text-[10px] text-pd-foreground"
                >
                  U{i}
                </div>
              ))}
            </div>
            <p>Dołącz do +500 sklepów e-commerce</p>
          </div>
        </div>

        {/* Right Content - Widget */}
        <div className="relative z-10">
          <TerminalSimulation />

          {/* Floating Feature Badges */}
          <div className="absolute -top-6 -right-6 hidden items-center gap-2 rounded-lg border border-brand-border bg-brand-dark/80 px-4 py-2 shadow-neon-cyan md:flex">
            <Database className="h-4 w-4 text-brand-accent" />
            <span className="text-xs font-bold text-pd-foreground">Data Warehouse</span>
          </div>
          <div className="absolute -bottom-6 -left-6 hidden items-center gap-2 rounded-lg border border-brand-border bg-brand-dark/80 px-4 py-2 shadow-neon-cyan md:flex">
            <BrainCircuit className="h-4 w-4 text-brand-secondary" />
            <span className="text-xs font-bold text-pd-foreground">Predictive AI</span>
          </div>
        </div>
      </div>
    </section>
  )
}

