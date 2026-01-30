import React, { useEffect, useId, useMemo, useState, useCallback } from 'react';
import type { Translation } from '../types';
import { InteractiveButton } from './InteractiveButton';

export type PromoMode = 'main' | 'intercept';

interface PromoModalProps {
  t: Translation;
  isOpen?: boolean;
  onClose: () => void;

  mode?: PromoMode;

  onSelectPlan: (plan: 'starter' | 'professional') => void;
  onDemo: () => void;
}

const PromoModalComponent: React.FC<PromoModalProps> = ({
  t,
  isOpen = true,
  onClose,
  mode = 'main',
  onSelectPlan,
  onDemo,
}) => {
  const rid = useId();
  const titleId = `promo-modal-title-${rid}`;
  const descId = `promo-modal-desc-${rid}`;

  const [localMode, setLocalMode] = useState<PromoMode>(mode);

  useEffect(() => {
    setLocalMode(mode);
  }, [mode]);

  const mainCopy = t.promo_v2.main;
  const interceptCopy = t.promo_v2.intercept;

  const trustMeta = useMemo(
    () => [t.promo_v2.system_label, t.promo_v2.trust_bar].filter(Boolean).join(' · '),
    [t.promo_v2.system_label, t.promo_v2.trust_bar]
  );

  const headerPill = useMemo(
    () => t.promo_v2.trust_security_label,
    [t.promo_v2.trust_security_label]
  );

  const handleStarterSelect = useCallback(() => {
    if (localMode === 'intercept') {
      onSelectPlan('starter');
      return;
    }
    setLocalMode('intercept');
  }, [localMode, onSelectPlan]);

  const backLabel = (t.common as any)?.back ?? 'Back';

  if (!isOpen) return null;

  return (
    <div
      // UWAGA: ModalShell już jest role="dialog" + aria-modal.
      // Tu zostawiamy content jako dokument.
      role="document"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="relative w-full max-w-4xl glass bg-white/95 dark:bg-[#07070A]/95 rounded-[2.5rem] border border-brand-start/20 shadow-[0_50px_120px_rgba(0,0,0,0.8)] overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 brand-gradient-bg" />

      <button
        type="button"
        onClick={onClose}
        aria-label={t.common.close}
        className="absolute top-6 right-6 p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {localMode === 'main' ? (
        <div className="px-6 sm:px-10 lg:px-12 py-12 space-y-10">
          <div className="text-center space-y-4">
            <div className="text-2xs font-mono font-bold tracking-[0.3em] uppercase text-brand-start">
              {headerPill}
            </div>

            <h2
              id={titleId}
              className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight"
            >
              {mainCopy.title}
            </h2>

            <p
              id={descId}
              className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto"
            >
              {mainCopy.subhead}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/5 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-black tracking-[0.3em] uppercase text-emerald-500">
                  {mainCopy.pro_card.tag}
                </div>
                <div className="text-2xs font-mono font-bold tracking-[0.3em] uppercase text-emerald-500/80">
                  {t.promo_v2.plan_meta.premium_label}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  {mainCopy.pro_card.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{mainCopy.pro_card.desc}</p>
              </div>

              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {mainCopy.pro_card.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <InteractiveButton
                variant="primary"
                onClick={() => onSelectPlan('professional')}
                className="w-full !h-12 !text-xs font-black uppercase tracking-[0.22em] rounded-2xl"
              >
                {mainCopy.cta_pro}
              </InteractiveButton>
            </div>

            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="text-2xs font-mono font-bold tracking-[0.3em] uppercase text-gray-500">
                  {t.promo_v2.plan_meta.standard_label}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  {mainCopy.starter_card.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {mainCopy.starter_card.desc}
                </p>
              </div>

              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {mainCopy.starter_card.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-gray-400" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <InteractiveButton
                variant="secondary"
                onClick={handleStarterSelect}
                className="w-full !h-12 !text-xs font-black uppercase tracking-[0.22em] rounded-2xl"
              >
                {mainCopy.cta_starter}
              </InteractiveButton>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {mainCopy.microcopy}
            </div>
            <InteractiveButton
              variant="secondary"
              onClick={onDemo}
              className="!h-12 !px-8 !text-xs font-black uppercase tracking-[0.22em] rounded-2xl"
            >
              {mainCopy.cta_demo}
            </InteractiveButton>
          </div>

          <div className="text-xs uppercase tracking-[0.3em] text-gray-400 text-center">
            {trustMeta}
          </div>
        </div>
      ) : (
        <div className="px-6 sm:px-10 lg:px-12 py-12 space-y-8 text-center">
          <div className="text-2xs font-mono font-bold tracking-[0.3em] uppercase text-amber-500">
            {t.promo_v2.plan_meta.standard_label}
          </div>

          <h2
            id={titleId}
            className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white"
          >
            {interceptCopy.title}
          </h2>

          <p id={descId} className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {interceptCopy.subhead}
          </p>

          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-left">
            {interceptCopy.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
            <InteractiveButton
              variant="primary"
              onClick={() => onSelectPlan('professional')}
              className="!h-12 !px-8 !text-xs font-black uppercase tracking-[0.22em] rounded-2xl"
            >
              {interceptCopy.cta_pro}
            </InteractiveButton>

            <InteractiveButton
              variant="secondary"
              onClick={handleStarterSelect}
              className="!h-12 !px-8 !text-xs font-black uppercase tracking-[0.22em] rounded-2xl"
            >
              {interceptCopy.cta_starter}
            </InteractiveButton>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">{interceptCopy.microcopy}</div>

          <button
            type="button"
            onClick={() => setLocalMode('main')}
            className="text-xs font-black uppercase tracking-[0.25em] text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 rounded-xl px-3 py-2"
          >
            {backLabel}
          </button>
        </div>
      )}
    </div>
  );
};

export const PromoModal = React.memo(PromoModalComponent);
