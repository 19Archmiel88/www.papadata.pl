'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useI18n } from '@papadata/i18n';

export const ScrollToTopButton: React.FC = () => {
  const  t  = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      title={t('landing.global.scrollTop.tooltip')}
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
      className="fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/90 text-slate-100 shadow-neon-cyan border border-cyan-500/40 hover:bg-slate-800 hover:shadow-neon-emerald transition-colors"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};
