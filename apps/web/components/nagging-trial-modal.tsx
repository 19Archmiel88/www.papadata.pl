'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@papadata/i18n';

const STORAGE_KEY = 'papadata.naggingModal.dismissed';

export const NaggingTrialModal: React.FC = () => {
  const t = useI18n();
  const isPl = t.locale === 'pl';
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showCompact, setShowCompact] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = window.sessionStorage.getItem(STORAGE_KEY);
    if (dismissed === 'true') {
      setOpen(false);
      setShowCompact(true);
      return;
    }

    const timeout = window.setTimeout(() => {
      setOpen(true);
    }, 30000);

    return () => window.clearTimeout(timeout);
  }, []);

  const closeModal = () => {
    setOpen(false);
    setShowCompact(true);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  const goToWizard = () => {
    router.push('/wizard');
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="card-glass relative mx-4 w-full max-w-md p-6 shadow-neon-cyan">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-pd-muted hover:bg-brand-border/40 hover:text-pd-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="mb-2 text-xl font-semibold">
              {isPl ? 'Odbierz Pakiet Startowy' : 'Claim your Starter Package'}
            </h2>
            <p className="mb-5 text-sm text-pd-muted">
              {isPl
                ? 'Przetestuj PapaData przez 14 dni za darmo. Bez karty, bez zobowiązań.'
                : 'Test PapaData for 14 days for free. No card, no commitment.'}
            </p>
            <button
              type="button"
              onClick={goToWizard}
              className="w-full rounded-full bg-brand-accent px-4 py-2.5 text-sm font-medium text-pd-bg shadow-neon-cyan transition-colors hover:bg-brand-accent/90"
            >
              {isPl ? 'Rozpocznij 14-dniowy Trial' : 'Start 14-day trial'}
            </button>
          </div>
        </div>
      )}

      {showCompact && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed left-0 top-1/2 z-30 -translate-y-1/2 rounded-r-full bg-brand-accent px-3 py-3 text-xs font-semibold tracking-wide text-pd-bg shadow-neon-cyan transition-colors hover:bg-brand-accent/90"
        >
          <span className="[writing-mode:vertical-rl]">
            {isPl ? '14 DNI FREE' : '14 DAYS FREE'}
          </span>
        </button>
      )}
    </>
  );
};
