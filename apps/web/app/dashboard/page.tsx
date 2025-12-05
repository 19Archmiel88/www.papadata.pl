'use client';

import React from 'react';
import { LayoutDashboard, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full rounded-2xl bg-slate-950/70 border border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-950/70 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white shadow-neon-cyan mb-2">
          <LayoutDashboard className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Dashboard produkcyjny
        </h1>
        <p className="text-sm text-slate-400">
          Jesteś na docelowym adresie <code className="font-mono text-xs">/dashboard</code>. W
          kolejnych krokach podepniemy tutaj prawdziwe dane z BFF i ETL (BigQuery, Cloud Run itd.).
        </p>
        <p className="text-xs text-slate-500">
          Na razie możesz używać{' '}
          <a
            href="/demo/dashboard"
            className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
          >
            demo dashboardu
            <ArrowRight className="w-3 h-3" />
          </a>
          , który pokazuje finalny UX.
        </p>
      </div>
    </div>
  );
}
