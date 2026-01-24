import React, { memo, useEffect, useId } from 'react';
import type { FeatureDetail, Translation } from '../types';
import { Logo } from './Logo';
import { motion, useReducedMotion } from 'framer-motion';
import { InteractiveButton } from './InteractiveButton';

/**
 * FeatureModal.tsx
 * Modal szczegółów funkcji (Feature).
 * Content-only: overlay/ESC/scroll/focus obsługuje ModalContainer.
 */

// --- Narrative Sub-components ---

const ScanningRay = memo(() => {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <motion.div
      initial={{ top: '-10%', opacity: 0 }}
      animate={{ top: '110%', opacity: [0, 0.35, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
      className="absolute left-0 right-0 h-[1px] bg-brand-start z-10 pointer-events-none blur-[1px]"
      aria-hidden="true"
    />
  );
});
ScanningRay.displayName = 'ScanningRay';

const CapabilityNode = memo(({ text, delay }: { text: string; delay: number }) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: -10 }}
      animate={reduce ? undefined : { opacity: 1, x: 0 }}
      transition={reduce ? undefined : { delay: 0.08 + delay * 0.04, duration: 0.35 }}
      className="group/node relative p-4 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 hover:border-brand-start/30 transition-all overflow-hidden"
    >
      <div className="relative z-10 flex items-start gap-3">
        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-start shadow-[0_0_8px_rgba(78,38,226,0.6)] group-hover/node:scale-150 transition-transform" />
        <span className="text-sm-plus md:text-sm text-gray-700 dark:text-gray-200 font-bold uppercase tracking-tight leading-tight">
          {text}
        </span>
      </div>
      <div className="absolute inset-0 bg-brand-start/[0.02] opacity-0 group-hover/node:opacity-100 transition-opacity" />
    </motion.div>
  );
});
CapabilityNode.displayName = 'CapabilityNode';

const UsageNode = memo(({ text, delay }: { text: string; delay: number }) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={reduce ? undefined : { delay: 0.22 + delay * 0.04, duration: 0.35 }}
      className="p-4 rounded-2xl bg-black/5 dark:bg-black/30 border border-transparent dark:border-white/5 font-mono text-xs-plus md:text-xs text-gray-500 dark:text-gray-400 italic"
    >
      “{text}”
    </motion.div>
  );
});
UsageNode.displayName = 'UsageNode';

interface FeatureModalProps {
  feature: FeatureDetail | null;
  t: Translation;
  isOpen?: boolean;
  onClose: () => void;
}

// --- Main Component ---

export const FeatureModal: React.FC<FeatureModalProps> = ({ feature, t, isOpen = true, onClose }) => {
  const modalId = useId();

  useEffect(() => {
    if (!isOpen) return;
    if (!feature) {
      onClose();
    }
  }, [feature, isOpen, onClose]);

  if (!isOpen || !feature) return null;

  const titleId = `feature-modal-title-${modalId}`;
  const descId = `feature-modal-desc-${modalId}`;

  return (
    <div
      role="document"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="relative w-full max-w-5xl glass bg-white/95 dark:bg-[#08080A]/95 rounded-[2.5rem] sm:rounded-[4rem] border border-black/10 dark:border-white/10 shadow-[0_50px_120px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh]"
    >
      <ScanningRay />

      <div className="p-8 sm:p-12 md:p-16 border-b border-black/5 dark:border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(78,38,226,1)_1px,transparent_1px),linear-gradient(90deg,rgba(78,38,226,1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          <div className="flex flex-col sm:flex-row items-start gap-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl brand-gradient-bg flex items-center justify-center text-white shadow-2xl shrink-0">
              <Logo className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>

            <div className="space-y-4">
              <h3
                id={titleId}
                className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight uppercase leading-[0.85]"
              >
                <span className="animated-gradient-text block">{feature.title}</span>
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 transition-all text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
            aria-label={t.common.close}
            type="button"
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
        <div className="max-w-4xl">
          <p
            id={descId}
            className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-semibold italic opacity-95 mb-16"
          >
            {feature.desc}
          </p>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-start shadow-[0_0_8px_rgba(78,38,226,0.6)]" />
                <span className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">
                  {t.featureModal.capabilities_tag}
                </span>
              </div>

              <div className="grid gap-3">
                {feature.details.map((detail, idx) => (
                  <CapabilityNode key={idx} text={detail} delay={idx} />
                ))}
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-start" />
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">
                    {t.featureModal.module_active_tag}
                  </span>
                </div>

                <div className="space-y-3">
                  {feature.commonUses?.map((use, idx) => (
                    <UsageNode key={idx} text={use} delay={idx} />
                  ))}
                </div>
              </div>

              {feature.requiredData && (
                <div className="p-6 rounded-3xl bg-brand-start/[0.03] border border-brand-start/10">
                  <div className="text-2xs font-black text-brand-start uppercase tracking-[0.3em] mb-3">
                    {t.featureModal.footer_left}
                  </div>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight leading-relaxed">
                    {feature.requiredData}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 sm:px-12 md:px-16 py-6 border-t border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-6 select-none">
        <div className="flex items-center gap-4 opacity-50">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-2xs font-mono font-bold tracking-[0.4em] uppercase text-gray-500">
            {t.featureModal.footer_right}
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
