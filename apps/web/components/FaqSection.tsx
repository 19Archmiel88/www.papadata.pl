import React, { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Translation } from '../types';

/**
 * FaqSection.tsx
 * Placeholder dla sekcji FAQ na landing page.
 * (Sekcja Features znajduje się w FeatureSection.tsx.)
 */

export const FaqSection: React.FC<{ t: Translation }> = ({ t }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section
      id="faq"
      className="py-24 md:py-32 px-6 max-w-5xl mx-auto relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-brand-start/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-[520px] h-[520px] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(78,38,226,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(78,38,226,0.04)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
      </div>

      <div className="text-center max-w-3xl mx-auto mb-14 space-y-6">
        <span className="text-xs font-black tracking-[0.4em] uppercase text-brand-start inline-block px-4 py-1.5 rounded-full bg-brand-start/5 border border-brand-start/10">
          {t.faq.pill}
        </span>
        <h2
          className="font-black tracking-tighter text-gray-900 dark:text-white leading-[1.05] py-2 uppercase"
          style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}
        >
          {t.faq.title}
        </h2>
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic opacity-90">
          {t.faq.meta.header_tag}
        </p>
      </div>

      <div className="space-y-4">
        {t.faq.items.map((item, index) => {
          const isOpen = openIndex === index;
          const buttonId = `faq-btn-${baseId}-${index}`;
          const panelId = `faq-panel-${baseId}-${index}`;

          return (
            <div
              key={`${item.q}-${index}`}
              className={`group rounded-[2rem] border bg-white/90 dark:bg-[#0b0b0f] shadow-lg overflow-hidden transition-all ${
                isOpen
                  ? 'border-brand-start/30 shadow-[0_25px_70px_rgba(0,0,0,0.16)] dark:shadow-[0_35px_100px_rgba(0,0,0,0.55)]'
                  : 'border-black/10 dark:border-white/10 hover:border-brand-start/20'
              }`}
            >
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-6 p-6 text-left focus:outline-none"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 w-9 h-9 rounded-2xl bg-brand-start/10 border border-brand-start/15 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-brand-start" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6l4 2" />
                      </svg>
                    </div>
                    <span className="text-sm md:text-base font-black text-gray-900 dark:text-white tracking-tight">
                      {item.q}
                    </span>
                  </div>

                  <span
                    className={`w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-gray-200 transition-all ${
                      isOpen ? 'rotate-180 border-brand-start/30' : 'rotate-0 group-hover:border-brand-start/20'
                    }`}
                    aria-hidden="true"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 ml-[52px] text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center space-y-2 opacity-70">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">
          {t.faq.meta.footer_line1}
        </p>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">
          {t.faq.meta.footer_line2}
        </p>
      </div>
    </section>
  );
};
