import React, { useMemo, useState, memo, useCallback, useId } from 'react';
import { InteractiveButton } from './InteractiveButton';
import { integrations, type IntegrationItem } from '../data/integrations';
import { useModal } from '../context/useModal';
import { Translation } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface IntegrationsSectionProps {
  t: Translation;
}

// Icon mapping for top featured items
const getBrandIcon = (id: string) => {
  switch (id) {
    case 'google_ads':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
        </svg>
      );
    case 'meta_ads':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
        </svg>
      );
    case 'shopify':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M16.5 2h-9L2 22h20L16.5 2z" />
        </svg>
      );
    case 'allegro':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 2L2 12l10 10 10-10L12 2zM5.8 12L12 5.8 18.2 12 12 18.2 5.8 12z" />
        </svg>
      );
    default:
      return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13.828 10.172a4 4 0 00-5.656 0l-1.415 1.414a4 4 0 105.657 5.657l1.414-1.415M10.172 13.828a4 4 0 005.656 0l1.415-1.414a4 4 0 10-5.657-5.657l-1.414 1.415"
          />
        </svg>
      );
  }
};

const ScanningRay = memo(({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div
        initial={{ top: '-10%', opacity: 0 }}
        animate={{ top: '110%', opacity: [0, 0.4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-[1px] bg-brand-start z-10 pointer-events-none blur-[1px]"
      />
    )}
  </AnimatePresence>
));

const PingTrace = memo(({ active }: { active: boolean }) => (
  <div className="flex items-end gap-1 h-3 w-10 overflow-hidden opacity-30 group-hover:opacity-100 transition-opacity">
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.div
        key={i}
        animate={
          active
            ? {
                height: [2, 10, 4, 12, 6, 2],
              }
            : { height: 2 }
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.2,
          ease: 'easeInOut',
        }}
        className={`w-1.5 rounded-full ${
          active
            ? 'bg-brand-start shadow-[0_0_8px_rgba(78,38,226,0.6)]'
            : 'bg-gray-400 dark:bg-gray-700'
        }`}
      />
    ))}
  </div>
));

export const IntegrationsSection: React.FC<IntegrationsSectionProps> = ({ t }) => {
  const { openModal } = useModal();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const sectionId = useId();
  const titleId = `integrations-title-${sectionId}`;
  const descId = `integrations-desc-${sectionId}`;

  const featuredItems = useMemo(() => (integrations || []).filter(Boolean).slice(0, 8), []);
  const getName = useCallback((id: string) => t.integrations.items[id]?.name ?? id, [t.integrations.items]);

  const handleOpenAll = useCallback(() => {
    openModal('integrations', {
      category: 'all',
      onSelectIntegration: (item: IntegrationItem) =>
        openModal('integration_connect', { integration: item }),
    });
  }, [openModal]);

  const handleCardActivate = useCallback(
    (item: any) => {
      // Spójnie z IntegrationsModal: coming_soon nie otwiera connect flow.
      if (item?.status === 'coming_soon') {
        openModal('coming_soon', { context: getName(item.id) });
        return;
      }

      openModal('integration_connect', { integration: item });
    },
    [getName, openModal],
  );

  return (
    <section
      id="integrations"
      className="py-24 md:py-32 px-6 max-w-7xl mx-auto relative overflow-hidden"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(78,38,226,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(78,38,226,0.01)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_90%)]" />
      </div>

      <div className="flex flex-col items-center gap-16 md:gap-24">
        {/* Centered Header */}
        <div className="space-y-10 animate-reveal text-center max-w-4xl mx-auto">
          <header className="space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-black tracking-[0.4em] uppercase text-brand-start inline-block px-4 py-1.5 rounded-full bg-brand-start/5 border border-brand-start/10">
                {t.integrations.pill}
              </span>

              <h2
                id={titleId}
                className="font-black tracking-tighter leading-[1.05] text-gray-900 dark:text-white uppercase"
                style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
              >
                {t.integrations.title_part1} <br />
                <span className="animated-gradient-text">{t.integrations.title_part2}</span>
              </h2>
            </div>

            <p
              id={descId}
              className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto italic opacity-90"
            >
              {t.integrations.desc}
            </p>
          </header>

          <div className="flex justify-center">
            <InteractiveButton
              variant="primary"
              className="!h-14 !px-12 !text-xs-plus font-black tracking-[0.3em] uppercase rounded-2xl shadow-2xl"
              onClick={handleOpenAll}
            >
              {t.integrations.btn_all}
            </InteractiveButton>
          </div>
        </div>

        {/* Full-width Grid Below Header */}
        <div className="relative w-full">
          {/* Spotlight background effect centered */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[120%] bg-brand-start/[0.02] blur-[120px] rounded-full pointer-events-none -z-10" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10">
            {featuredItems.map((item) => {
              const active = hoveredId === item.id;
              const isSoon = item.status === 'coming_soon';

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => !isSoon && setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => !isSoon && setHoveredId(item.id)}
                  onBlur={() => setHoveredId(null)}
                  whileHover={isSoon ? undefined : { y: -4, scale: 1.02 }}
                  onClick={() => {
                    if (isSoon) return;
                    handleCardActivate(item);
                  }}
                  aria-label={getName(item.id)}
                  aria-disabled={isSoon}
                  disabled={isSoon}
                  className={`group relative p-6 sm:p-8 rounded-[2.5rem] border transition-all duration-700 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 ${
                    active
                      ? 'bg-white dark:bg-[#0A0A0C] border-brand-start/40 shadow-[0_30px_70px_rgba(78,38,226,0.12)]'
                      : 'bg-white/40 dark:bg-white/[0.02] border-black/5 dark:border-white/5 opacity-80'
                  } ${isSoon ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <ScanningRay active={active} />

                  <div className="flex items-start justify-between mb-8 relative z-20">
                    <div
                      className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all duration-700 ${
                        active
                          ? 'brand-gradient-bg text-white shadow-xl rotate-2'
                          : 'bg-black/5 dark:bg-white/5 text-gray-500'
                      }`}
                    >
                      {getBrandIcon(item.id)}
                    </div>
                    <PingTrace active={active} />
                  </div>

                  <div className="space-y-2 relative z-20">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter group-hover:brand-gradient-text transition-all duration-500 leading-none">
                      {getName(item.id)}
                    </h3>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] opacity-60">
                      {t.integrations.categories[item.category]}
                    </p>
                  </div>

                  {isSoon && (
                    <span className="sr-only">{t.integrations.status_soon}</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
