import React, { useMemo, memo, useState } from 'react';
import type { Translation } from '../types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { InteractiveButton } from './InteractiveButton';
import { useModal } from '../context/useModal';

/**
 * SecuritySection.tsx
 * Sekcja „Security” na landing page – prezentuje filary bezpieczeństwa produktu (4 karty) oraz końcowe CTA.
 */

interface SecuritySectionProps {
  t: Translation;
}

const ScanningRay = memo(({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div
        initial={{ top: '-10%', opacity: 0 }}
        animate={{ top: '110%', opacity: [0, 0.6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-start to-transparent z-10 pointer-events-none blur-[1px] shadow-[0_0_15px_rgba(78,38,226,0.8)]"
        aria-hidden="true"
      />
    )}
  </AnimatePresence>
));
ScanningRay.displayName = 'ScanningRay';

export const SecuritySection: React.FC<SecuritySectionProps> = memo(({ t }) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { openModal } = useModal();
  const reduceMotion = useReducedMotion();

  const cards = useMemo(
    () => [
      {
        tag: t.security.card1_tag,
        title: t.security.card1_title,
        desc: t.security.card1_desc,
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        ),
      },
      {
        tag: t.security.card2_tag,
        title: t.security.card2_title,
        desc: t.security.card2_desc,
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        ),
      },
      {
        tag: t.security.card3_tag,
        title: t.security.card3_title,
        desc: t.security.card3_desc,
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        ),
      },
      {
        tag: t.security.card4_tag,
        title: t.security.card4_title,
        desc: t.security.card4_desc,
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        ),
      },
    ],
    [t]
  );

  return (
    <section
      id="security"
      className="py-24 md:py-32 px-6 max-w-7xl mx-auto relative overflow-hidden"
    >
      <div className="text-center max-w-4xl mx-auto mb-20 space-y-8 animate-reveal">
        <h2
          className="font-black tracking-tighter text-gray-900 dark:text-white leading-[1.05] py-2 uppercase"
          style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}
        >
          {t.security.title_p1}
          <br />
          <span className="animated-gradient-text">{t.security.title_p2}</span>
        </h2>
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xl mx-auto italic opacity-90">
          {t.security.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            onMouseEnter={() => setHoveredCard(idx)}
            onMouseLeave={() => setHoveredCard(null)}
            whileHover={reduceMotion ? undefined : { y: -6, transition: { duration: 0.4 } }}
            className="group relative p-8 rounded-[2rem] border border-black/5 dark:border-white/5 transition-all duration-700 bg-white/95 dark:bg-[#0A0A0C]/90 backdrop-blur-3xl hover:border-brand-start/40 hover:shadow-xl overflow-hidden"
          >
            {!reduceMotion && <ScanningRay active={hoveredCard === idx} />}

            <div className="flex items-start justify-between mb-8 relative z-20">
              <div className="w-12 h-12 rounded-[1rem] brand-gradient-bg flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-all duration-500">
                {card.icon}
              </div>
            </div>

            <div className="space-y-4 relative z-20">
              <div className="inline-flex px-2.5 py-0.5 rounded bg-brand-start/10 border border-brand-start/20">
                <span className="text-3xs font-mono font-black tracking-widest uppercase text-brand-start">
                  {card.tag}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-black text-gray-900 dark:text-white tracking-tighter leading-tight group-hover:brand-gradient-text transition-all duration-500 uppercase">
                {card.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                {card.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 p-8 md:p-14 rounded-[3rem] border border-brand-start/20 bg-white/95 dark:bg-[#0A0A0C]/90 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 group shadow-2xl">
        <div className="relative z-10 space-y-6 text-center lg:text-left max-w-xl">
          <h3 className="text-2xl md:text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase leading-tight">
            {t.security.cta_title}
          </h3>
          <p className="text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic opacity-90">
            {t.security.cta_desc}
          </p>
        </div>

        <InteractiveButton
          variant="primary"
          onClick={() => openModal('auth', { isRegistered: false })}
          className="relative z-10 !h-16 !px-12 !text-xs font-black tracking-[0.3em] uppercase rounded-2xl shadow-2xl min-w-[280px]"
        >
          {t.security.cta_btn}
        </InteractiveButton>
      </div>
    </section>
  );
});
SecuritySection.displayName = 'SecuritySection';
