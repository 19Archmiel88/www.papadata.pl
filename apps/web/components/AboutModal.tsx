/**
 * apps/web/components/AboutModal.tsx
 *
 * - Renderuje modal "O nas" (About) jako samą kartę z treścią (bez overlayu).
 * - Content-only: zamykanie/ESC/scroll/focus obsługuje ModalContainer.
 * - Treści są pobierane z i18n (t) – bez hard-coded merytoryki.
 */

import React, { useId, memo } from 'react';
import type { Translation } from '../types';
import { Logo } from './Logo';
import { motion, useReducedMotion } from 'framer-motion';
import { InteractiveButton } from './InteractiveButton';

interface AboutModalProps {
  t: Translation;
  isOpen?: boolean;
  onClose: () => void;
}

const TeamNode = memo(({ text, idx }: { text: string; idx: number }) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={reduce ? undefined : { delay: 0.2 + idx * 0.08, duration: 0.35 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 hover:border-brand-start/30 transition-all group"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-brand-start shadow-[0_0_8px_rgba(78,38,226,0.6)] group-hover:scale-150 transition-transform" />
      <span className="text-sm sm:text-base text-gray-700 dark:text-gray-200 font-bold uppercase tracking-tight">
        {text}
      </span>
    </motion.div>
  );
});
TeamNode.displayName = 'TeamNode';

export const AboutModal: React.FC<AboutModalProps> = ({ t, isOpen = true, onClose }) => {
  const modalId = useId();

  const titleId = `about-modal-title-${modalId}`;
  const descId = `about-modal-desc-${modalId}`;

  if (!isOpen) return null;

  return (
    <div
      role="document"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="relative w-full max-w-4xl glass bg-white/95 dark:bg-[#08080A]/95 rounded-[2.5rem] sm:rounded-[4rem] border border-black/10 dark:border-white/10 shadow-[0_50px_120px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh]"
    >
      <div className="absolute top-0 left-0 right-0 h-1 brand-gradient-bg z-30" />

      <div className="p-8 sm:p-12 md:p-16 border-b border-black/5 dark:border-white/5 relative overflow-hidden bg-black/[0.02] dark:bg-black/20">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(78,38,226,1)_1px,transparent_1px),linear-gradient(90deg,rgba(78,38,226,1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl brand-gradient-bg flex items-center justify-center text-white shadow-2xl shrink-0">
              <Logo className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-start/10 border border-brand-start/20">
                <span className="text-2xs font-mono font-black tracking-[0.3em] uppercase text-brand-start">
                  {t.about.tag}
                </span>
              </div>

              <h3
                id={titleId}
                className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight uppercase leading-[0.85]"
              >
                <span className="animated-gradient-text">{t.about.title}</span>
              </h3>

              <p className="text-sm sm:text-lg text-gray-500 dark:text-gray-400 font-semibold italic">
                {t.about.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 transition-all text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 cursor-pointer"
            aria-label={t.common.close}
          >
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 group-hover:rotate-90 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-8 sm:p-12 md:p-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <p
            id={descId}
            className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium italic opacity-90"
          >
            {t.about.body}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {t.about.points.map((point, idx) => (
              <TeamNode key={idx} text={point} idx={idx} />
            ))}
          </div>

          <div className="pt-10 border-t border-black/5 dark:border-white/5 opacity-40">
            <div className="flex items-center gap-6 mb-8">
              <span className="text-xs font-mono font-black tracking-[0.4em] uppercase text-gray-500">
                {t.about.meta_tag}
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-500 to-transparent" />
            </div>

            <div className="grid sm:grid-cols-3 gap-8">
              <div className="space-y-2">
                <span className="text-3xs font-mono font-bold uppercase tracking-widest text-gray-500">
                  EU_FIRST_ARCHITECTURE
                </span>
                <div className="h-1 w-full bg-brand-start/20 rounded-full" />
              </div>
              <div className="space-y-2">
                <span className="text-3xs font-mono font-bold uppercase tracking-widest text-gray-500">
                  GDPR_CORE_COMPLIANCE
                </span>
                <div className="h-1 w-full bg-brand-start/20 rounded-full" />
              </div>
              <div className="space-y-2">
                <span className="text-3xs font-mono font-bold uppercase tracking-widest text-gray-500">
                  WAW_CENTER_HUB
                </span>
                <div className="h-1 w-full bg-brand-start/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 sm:px-12 md:px-16 py-6 border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-6 select-none">
        <div className="flex items-center gap-8 opacity-50">
          <span className="text-2xs font-mono font-black tracking-[0.4em] uppercase text-gray-500">
            {t.about.footer_left}
          </span>
          <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 hidden sm:block" />
          <span className="text-2xs font-mono font-black tracking-[0.4em] uppercase text-gray-500">
            {t.about.footer_right}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2 opacity-60" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-brand-start" />
            ))}
          </div>
          <InteractiveButton
            variant="secondary"
            onClick={onClose}
            className="!h-9 !px-6 !text-2xs !font-black uppercase tracking-widest rounded-xl"
          >
            {t.common.close}
          </InteractiveButton>
        </div>
      </div>
    </div>
  );
};
