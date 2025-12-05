'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useI18n } from '@papadata/i18n';

export const ScrollToTopButton: React.FC = () => {
  const t = useI18n();
  const isPl = t.locale === 'pl';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      title={isPl ? 'Wróć na górę' : 'Back to top'}
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
      className="fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-border bg-brand-card/90 text-pd-foreground shadow-neon-cyan hover:bg-brand-card/80 hover:shadow-neon-cyan transition-colors"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};
