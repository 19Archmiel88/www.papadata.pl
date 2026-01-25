import React, { useId } from 'react';
import { InteractiveButton } from './InteractiveButton';
import type { Translation } from '../types';

interface ComingSoonModalProps {
  t: Translation;
  context?: string;
  isOpen?: boolean;
  onClose: () => void;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ t, context, isOpen = true, onClose }) => {
  const titleId = useId();
  const descId = useId();

  if (!isOpen) return null;

  return (
    <div
      className="relative w-full max-w-lg glass bg-white/95 dark:bg-[#050507]/95 rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-[0_50px_120px_rgba(0,0,0,0.8)] overflow-hidden"
      role="document"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div className="absolute top-0 left-0 right-0 h-1 brand-gradient-bg" />

      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
        type="button"
        aria-label={t.common.close}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="px-8 sm:px-12 py-12 text-center space-y-6">
        <div className="w-16 h-16 brand-gradient-bg rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l2 2m8-2a8 8 0 11-16 0 8 8 0 0116 0z" />
          </svg>
        </div>

        {context && (
          <div className="text-2xs font-mono font-bold tracking-[0.3em] uppercase text-brand-start/80">
            {context}
          </div>
        )}

        <h3 id={titleId} className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
          {t.common.coming_soon_title}
        </h3>

        <p id={descId} className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
          {t.common.coming_soon_desc}
        </p>

        <InteractiveButton
          variant="secondary"
          onClick={onClose}
          className="!py-3 !text-xs font-black uppercase tracking-[0.3em] rounded-2xl"
        >
          {t.common.close}
        </InteractiveButton>
      </div>
    </div>
  );
};
