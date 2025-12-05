'use client';

import React, { useEffect, useState, useRef } from 'react';
import { TERMINAL_LOGS } from '../constants';
import { CompanyDetails } from '../types';

interface TerminalProps {
  company: CompanyDetails;
  integrations: string[];
  onComplete: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ company, integrations, onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let delay = 0;
    const allLogs = [...TERMINAL_LOGS];

    allLogs.forEach((logTemplate, index) => {
      const log = logTemplate
        .replace('{company_id}', company.nip || 'nieznany')
        .replace('{sources}', integrations.join(', ') || 'brak');

      const stepDelay = Math.random() * 800 + 400;
      delay += stepDelay;

      setTimeout(() => {
        setLogs((prev) => [...prev, log]);
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }

        if (index === allLogs.length - 1) {
          setTimeout(onComplete, 2000);
        }
      }, delay);
    });
  }, [company, integrations, onComplete]);

  return (
    <div className="w-full max-w-5xl mx-auto shadow-2xl rounded-lg overflow-hidden border border-slate-700 font-mono text-sm bg-[#0d1117]">
      <div className="bg-[#161b22] px-4 py-2 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-xs">papadata-provisioning — -bash</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
        </div>
      </div>

      <div ref={scrollRef} className="p-6 h-[550px] overflow-y-auto custom-scrollbar bg-[#0d1117] text-slate-300">
        <div className="mb-4 text-slate-500">
          Ostatnie logowanie: {new Date().toLocaleTimeString()} na ttys001
          <br />
          Inicjalizacja Srodowiska Enterprise PapaData...
        </div>

        <div className="space-y-1">
          {logs.map((log, i) => {
            const isError = log.includes('[ERROR]') || log.includes('Blad');
            const isSuccess = log.includes('[OK]') || log.includes('[ZALICZONY]');
            const time = new Date().toLocaleTimeString('pl-PL', { hour12: false });

            return (
              <div key={i} className="flex gap-3">
                <span className="text-slate-600 select-none shrink-0">[{time}]</span>
                <span className={`${isError ? 'text-red-400' : isSuccess ? 'text-green-400' : 'text-slate-300'}`}>
                  {log}
                </span>
              </div>
            );
          })}
          <div className="flex gap-3 mt-1">
            <span className="text-slate-600 select-none shrink-0">
              [{new Date().toLocaleTimeString('pl-PL', { hour12: false })}]
            </span>
            <div className="flex items-center gap-1">
              <span className="text-cyan-500">➜</span>
              <span className="text-blue-400">~</span>
              <span className="w-2 h-4 bg-slate-400 animate-pulse block"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#161b22] border-t border-slate-800 px-3 py-1 flex justify-between items-center text-[10px] text-slate-500">
        <span>Region: europe-central2-a</span>
        <span>Pamiec: 46% | CPU: 12%</span>
      </div>
    </div>
  );
};
