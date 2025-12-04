'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@papadata/i18n';

const STORAGE_KEY = 'papadata.naggingModal.dismissed';

export const NaggingTrialModal: React.FC = () => {
  const  t  = useI18n();
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
          <div className="card-glass max-w-md w-full mx-4 p-6 shadow-neon-cyan relative">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="text-xl font-semibold mb-2">
              {t('landing.global.naggingModal.title')}
            </h2>
            <p className="text-sm text-slate-300 mb-5">
              {t('landing.global.naggingModal.subtitle')}
            </p>
            <button
              type="button"
              onClick={goToWizard}
              className="w-full rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-medium text-slate-950 shadow-neon-emerald hover:bg-emerald-400 transition-colors"
            >
              {t('landing.global.naggingModal.button')}
            </button>
          </div>
        </div>
      )}

      {showCompact && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed left-0 top-1/2 z-30 -translate-y-1/2 rounded-r-full bg-emerald-500 px-3 py-3 text-xs font-semibold tracking-wide text-slate-950 shadow-neon-emerald hover:bg-emerald-400 transition-colors"
        >
          <span className="[writing-mode:vertical-rl]">
            {t('landing.global.naggingModal.compactLabel')}
          </span>
        </button>
      )}
    </>
  );
};
