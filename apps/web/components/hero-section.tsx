'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@papadata/i18n';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const chartData = [
  { day: 'D-6', value: 180 },
  { day: 'D-5', value: 190 },
  { day: 'D-4', value: 210 },
  { day: 'D-3', value: 205 },
  { day: 'D-2', value: 230 },
  { day: 'D-1', value: 240 },
  { day: 'D', value: 260 }
];

export const HeroSection: React.FC = () => {
  const  t  = useI18n();
  const router = useRouter();

  const goTrial = () => router.push('/wizard');
  const goDemo = () => router.push('/demo/dashboard');

  return (
    <section
      id="hero"
      className="section-container pt-16 pb-16 lg:pt-20 lg:pb-24 flex flex-col lg:flex-row items-center gap-10"
    >
      {/* Lewy blok */}
      <div className="flex-1 space-y-5">
        <div className="inline-flex items-center rounded-full border border-brand-accent/40 bg-brand-dark/80 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-accent shadow-neon-cyan">
          {t('landing.hero.tagline')}
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
            {t('landing.hero.title.line1')}
          </h1>
          <p className="text-xl sm:text-2xl text-brand-accent">
            {t('landing.hero.title.line2')}
          </p>
        </div>
        <p className="max-w-xl text-sm sm:text-base text-pd-muted">
          {t('landing.hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={goTrial}
            className="inline-flex items-center justify-center rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-pd-bg shadow-neon-cyan hover:bg-brand-accent"
          >
            {t('landing.hero.cta.trial')}
          </button>
          <button
            type="button"
            onClick={goDemo}
            className="inline-flex items-center justify-center rounded-full border border-brand-secondary/50 bg-brand-dark/80 px-5 py-2.5 text-sm font-semibold text-brand-secondary shadow-neon-cyan hover:bg-brand-border/90"
          >
            {t('landing.hero.cta.demo')}
          </button>
        </div>
        <p className="text-xs text-pd-muted max-w-md">
          {t('landing.hero.trustNote')}
        </p>
      </div>

      {/* Prawy blok – panel */}
      <div className="flex-1 w-full max-w-md lg:max-w-lg">
        <div className="card-glass p-4 sm:p-5 shadow-neon-cyan">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-pd-muted">
              {t('landing.hero.panel.label')}
            </p>
            <span className="rounded-full bg-brand-dark/60 px-2 py-0.5 text-[10px] text-pd-muted border border-brand-border/80">
              Demo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="col-span-2 card-glass p-3 border-brand-border/80">
              <p className="text-[11px] text-pd-muted mb-1">
                {t('landing.hero.panel.kpi.title')}
              </p>
              <p className="text-lg font-semibold">
                {t('landing.hero.panel.kpi.value')}
              </p>
              <p className="text-[11px] text-brand-accent">
                {t('landing.hero.panel.kpi.delta')}
              </p>
            </div>
            <div className="card-glass p-3 border-brand-border/80">
              <p className="text-[11px] text-pd-muted mb-1">Conversion rate</p>
              <p className="text-lg font-semibold text-brand-secondary">3.4%</p>
              <p className="text-[11px] text-cyan-400">+0.6 pp WoW</p>
            </div>
          </div>

          <div className="h-36 sm:h-40 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    border: '1px solid #1e293b',
                    borderRadius: '0.75rem',
                    fontSize: 11
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 0,
                    fill: '#22c55e'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card-glass border-brand-border/80 p-3 flex gap-2">
            <div className="mt-0.5 h-7 w-7 rounded-full bg-gradient-to-br from-brand-accent to-brand-secondary flex items-center justify-center text-xs font-bold text-pd-bg shadow-neon-cyan">
              AI
            </div>
            <p className="text-[11px] text-pd-foreground">
              {t('landing.hero.aiBubble.text')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
