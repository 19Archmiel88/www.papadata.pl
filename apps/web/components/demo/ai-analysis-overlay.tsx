'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X, BrainCircuit, Database, CloudLightning } from 'lucide-react';

type AIAnalysisOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LOG_MESSAGES = [
  { text: 'Gemini analizuje miliony punktów danych...', icon: Sparkles, color: 'text-brand-secondary' },
  { text: 'Fetching BigQuery data (raw_ga4, raw_woo)...', icon: Database, color: 'text-pd-muted font-mono text-xs' },
  { text: 'Correlating weather vs conversion rates...', icon: CloudLightning, color: 'text-brand-accent font-mono text-xs' },
  { text: 'Checking competitor pricing API...', icon: BrainCircuit, color: 'text-purple-400 font-mono text-xs' },
];

export function AIAnalysisOverlay({ isOpen, onClose }: AIAnalysisOverlayProps) {
  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentLogIndex((prev) => (prev < LOG_MESSAGES.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => {
      clearInterval(interval);
      setCurrentLogIndex(0);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/70 backdrop-blur-sm"
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative flex w-full flex-col border-l border-brand-border/70 bg-[#0B1121] shadow-2xl md:w-[600px]"
        >
          <div className="flex h-16 items-center justify-between border-b border-brand-border/60 px-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-secondary" />
              <h2 className="text-lg font-semibold text-pd-foreground">Analiza Decyzyjna</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-pd-muted transition-colors hover:bg-brand-border/20 hover:text-pd-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden p-10">
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-secondary/20 blur-[80px] animate-pulse" />

            <div className="relative mb-8">
              <div className="h-16 w-16 rounded-full border-4 border-brand-secondary/30 border-t-brand-secondary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-brand-secondary animate-ping" />
              </div>
            </div>

            <div className="z-10 flex min-h-[100px] flex-col items-center space-y-3">
              {LOG_MESSAGES.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: idx === currentLogIndex ? 1 : idx < currentLogIndex ? 0.35 : 0,
                    y: 0,
                    scale: idx === currentLogIndex ? 1.05 : 1,
                  }}
                  className={`flex items-center gap-2 ${msg.color}`}
                >
                  {idx === currentLogIndex && <msg.icon className="h-4 w-4 animate-pulse" />}
                  <span>{msg.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="border-t border-brand-border/60 bg-brand-dark/70 p-6">
            <div className="pointer-events-none space-y-3 opacity-50">
              <div className="h-10 w-full rounded bg-brand-border/40 animate-pulse" />
              <div className="flex gap-4">
                <div className="h-10 w-1/2 rounded bg-brand-border/40 animate-pulse" />
                <div className="h-10 w-1/2 rounded bg-brand-border/40 animate-pulse" />
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-pd-muted">
              Symulacja na podstawie danych z {new Date().getFullYear()}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AIAnalysisOverlay;
