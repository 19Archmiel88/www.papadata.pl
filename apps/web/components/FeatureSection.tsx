import React, { memo, useCallback, useMemo, useRef } from 'react';
import type { FeatureDetail, Translation } from '../types';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface FeaturesSectionProps {
  t: Translation;
  onFeatureClick: (feature: FeatureDetail) => void;
}

const featureKeys: Array<keyof Translation['features']> = [
  'campaign_perf',
  'ai_assistant',
  'growth_recs',
  'discounts',
  'products',
  'reports',
  'funnel',
  'conv_path',
  'customers',
];

const ScanningRay = memo(({ enabled }: { enabled: boolean }) => {
  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      animate={{
        top: ['-10%', '110%'],
        opacity: [0, 0.6, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-start to-transparent z-10 pointer-events-none shadow-[0_0_15px_rgba(78,38,226,0.8)]"
    />
  );
});
ScanningRay.displayName = 'ScanningRay';

const renderAnimatedTitle = (title: string) => {
  const words = title.trim().split(/\s+/);

  return words.map((word, i) => {
    const lower = word.toLowerCase();
    const isIntelligence = lower.includes('inteligencj') || lower.includes('intelligence');

    return (
      <React.Fragment key={`${word}-${i}`}>
        {isIntelligence ? (
          <span className="animated-gradient-text inline-block">{word}</span>
        ) : (
          <span>{word}</span>
        )}
        {i < words.length - 1 && ' '}
      </React.Fragment>
    );
  });
};

interface FeatureCardProps {
  feature: FeatureDetail;
  index: number;
  onSelect: (feature: FeatureDetail) => void;
  reducedMotion: boolean;
}

const FeatureCard = memo(({ feature, index, onSelect, reducedMotion }: FeatureCardProps) => {
  const handleSelect = useCallback(() => {
    onSelect(feature);
  }, [onSelect, feature]);

  const titleId = useMemo(
    () => `feature-title-${feature.title.replace(/\s+/g, '-').toLowerCase()}`,
    [feature.title]
  );

  const descId = useMemo(
    () => `feature-desc-${feature.title.replace(/\s+/g, '-').toLowerCase()}`,
    [feature.title]
  );

  return (
    <motion.button
      type="button"
      aria-haspopup="dialog"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClick={handleSelect}
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={reducedMotion ? undefined : { once: true, margin: '-100px' }}
      transition={reducedMotion ? undefined : { delay: index * 0.05, duration: 0.8 }}
      whileHover={reducedMotion ? undefined : { y: -5, scale: 1.01 }}
      className="group relative p-8 rounded-[2rem] md:rounded-[2.5rem] flex flex-col cursor-pointer border border-black/5 dark:border-white/5 bg-white/90 dark:bg-[#0A0A0C]/85 backdrop-blur-xl hover:border-brand-start/40 hover:shadow-2xl transition-all overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0A0A0C]"
    >
      <ScanningRay enabled={!reducedMotion} />

      <div className="flex-grow relative z-20">
        <div className="mb-5 flex gap-1" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-1 h-1 bg-brand-start/20 rounded-full" />
          ))}
        </div>

        <h3
          id={titleId}
          className="text-lg md:text-xl font-black tracking-tighter text-gray-900 dark:text-white mb-4 group-hover:brand-gradient-text transition-all duration-500 leading-tight uppercase"
        >
          {feature.title}
        </h3>

        <p
          id={descId}
          className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8 font-medium"
        >
          {feature.desc}
        </p>
      </div>

      <div className="relative z-20 pt-6 border-t border-black/5 dark:border-white/5">
        <ul className="grid grid-cols-1 gap-2.5">
          {feature.details.slice(0, 3).map((detail, i) => (
            <li key={`${detail}-${i}`} className="flex items-center gap-2.5 group/item">
              <div
                className="w-1 h-1 rounded-full bg-brand-start/20 group-hover/item:bg-brand-start transition-all"
                aria-hidden="true"
              />
              <span className="text-xs md:text-xs-plus text-gray-700 dark:text-gray-300 font-bold uppercase tracking-tight opacity-70 group-hover/item:opacity-100">
                {detail}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.button>
  );
});
FeatureCard.displayName = 'FeatureCard';

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ t, onFeatureClick }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.3, 1, 1, 0.3]);

  const animatedTitle = useMemo(
    () => renderAnimatedTitle(t.featuresSection.title),
    [t.featuresSection.title]
  );

  const headingId = 'features-heading';

  return (
    <motion.section
      id="features"
      aria-labelledby={headingId}
      ref={sectionRef}
      style={{ opacity }}
      className="py-24 sm:py-32 portrait:py-20 px-4 xs:px-5 md:px-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(78,38,226,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(78,38,226,0.01)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24 space-y-6 animate-reveal">
          <h2
            id={headingId}
            className="font-black tracking-tighter text-gray-900 dark:text-white leading-[1.1] py-2 uppercase"
            style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}
          >
            {animatedTitle}
          </h2>

          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic max-w-2xl mx-auto opacity-90 px-4">
            {t.featuresSection.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 xl:gap-10">
          {featureKeys.map((key, index) => {
            const feature = t.features[key];
            return (
              <FeatureCard
                key={String(key)}
                feature={feature}
                index={index}
                onSelect={onFeatureClick}
                reducedMotion={!!reducedMotion}
              />
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};
