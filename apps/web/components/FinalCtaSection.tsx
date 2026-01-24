import React, { memo, useCallback, useId, useMemo } from 'react';
import type { Translation } from '../types';
import { InteractiveButton } from './InteractiveButton';

/**
 * FinalCtaSection.tsx
 * Ten plik odpowiada za końcową sekcję CTA na landing page: prezentuje nagłówek, opis,
 * przyciski akcji (trial/demo) oraz zestaw badge’y z komunikatami z tłumaczeń.
 */

interface FinalCtaSectionProps {
  t: Translation;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = memo(
  ({ t, onPrimaryClick, onSecondaryClick }) => {
    const sectionId = useId();
    const titleId = `final-cta-title-${sectionId}`;
    const descId = `final-cta-desc-${sectionId}`;

    const handlePrimaryClick = useCallback(() => {
      onPrimaryClick?.();
    }, [onPrimaryClick]);

    const handleSecondaryClick = useCallback(() => {
      onSecondaryClick?.();
    }, [onSecondaryClick]);

    const badges = useMemo(() => {
      const list = (t.finalCta?.badges ?? []) as unknown;
      return Array.isArray(list) ? list : [];
    }, [t.finalCta]);

    const primaryDisabled = typeof onPrimaryClick !== 'function';
    const secondaryDisabled = typeof onSecondaryClick !== 'function';

    return (
      <section
        className="py-24 md:py-32 px-4 md:px-6 relative"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-start/5 blur-[140px] -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto">
          <div className="relative p-10 md:p-16 rounded-[2.5rem] md:rounded-[3rem] border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-[#0A0A0C]/75 backdrop-blur-2xl shadow-2xl text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 brand-gradient-bg opacity-30" />

            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-100/50 dark:bg-brand-start/10 border border-brand-start/10 mb-8">
              <span className="text-xs font-black tracking-[0.4em] uppercase text-brand-start">
                {t.finalCta.meta.top_tag}
              </span>
            </div>

            <h2
              id={titleId}
              className="font-black tracking-tighter leading-tight text-gray-900 dark:text-white uppercase"
              style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}
            >
              {t.finalCta.title}
            </h2>

            <p
              id={descId}
              className="mt-6 text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium max-w-xl mx-auto italic opacity-90"
            >
              {t.finalCta.desc}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <InteractiveButton
                variant="primary"
                onClick={handlePrimaryClick}
                disabled={primaryDisabled}
                className="w-full sm:w-auto !h-14 !px-10 !text-xs !font-black uppercase tracking-widest rounded-2xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                aria-disabled={primaryDisabled}
              >
                {t.finalCta.btn_trial}
              </InteractiveButton>

              <InteractiveButton
                variant="secondary"
                onClick={handleSecondaryClick}
                disabled={secondaryDisabled}
                className="w-full sm:w-auto !h-14 !px-10 !text-xs !font-black uppercase tracking-widest rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                aria-disabled={secondaryDisabled}
              >
                {t.finalCta.btn_demo}
              </InteractiveButton>
            </div>

            {badges.length > 0 && (
              <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-40">
                {badges.map((b, i) => (
                  <span
                    key={`${b}-${i}`}
                    className="text-2xs font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400"
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  },
);

FinalCtaSection.displayName = 'FinalCtaSection';
