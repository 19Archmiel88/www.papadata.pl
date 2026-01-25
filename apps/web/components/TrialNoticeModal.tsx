import React, { useId, useMemo } from 'react';
import type { Translation } from '../types';
import { InteractiveButton } from './InteractiveButton';
import { useModal } from '../context/useModal';

interface TrialNoticeModalProps {
  t: Translation;
  daysLeft: number;
  canManageSubscription?: boolean;
  onPrimary?: () => void;
}

const resolveCopy = (t: Translation, daysLeft: number) => {
  const copy = t.dashboard.billing;

  if (daysLeft <= 1) {
    return {
      title: copy.trial_modal_title_1,
      desc: copy.trial_modal_desc_1,
    };
  }
  if (daysLeft <= 3) {
    return {
      title: copy.trial_modal_title_3,
      desc: copy.trial_modal_desc_3,
    };
  }
  return {
    title: copy.trial_modal_title_7,
    desc: copy.trial_modal_desc_7,
  };
};

export const TrialNoticeModal: React.FC<TrialNoticeModalProps> = ({
  t,
  daysLeft,
  canManageSubscription,
  onPrimary,
}) => {
  const { closeModal } = useModal();

  const uid = useId();
  const titleId = useMemo(() => `trial-title-${uid}`, [uid]);
  const descId = useMemo(() => `trial-desc-${uid}`, [uid]);

  const copy = t.dashboard.billing;
  const resolved = resolveCopy(t, daysLeft);

  const rawDesc = resolved?.desc ?? '';
  const desc = rawDesc.replace('{days}', String(daysLeft));

  const showPrimary = canManageSubscription === true && typeof onPrimary === 'function';

  return (
    <div
      className="relative w-full max-w-lg glass bg-white/95 dark:bg-[#050507]/95 rounded-[2.5rem] border border-emerald-500/20 shadow-[0_50px_120px_rgba(0,0,0,0.8)] overflow-hidden"
      role="document"
      data-testid="trial-notice-modal"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />

      <button
        onClick={closeModal}
        className="absolute top-6 right-6 p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        type="button"
        aria-label={t.common.close}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="px-8 sm:px-12 py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500 flex items-center justify-center mx-auto shadow-2xl">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="text-2xs font-mono font-bold tracking-[0.3em] uppercase text-emerald-500/80">
          {copy.trial_modal_tag}
        </div>

        <h3
          id={titleId}
          className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight"
        >
          {resolved.title}
        </h3>

        <p
          id={descId}
          className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium leading-relaxed"
          aria-live="polite"
        >
          {desc}
        </p>

        {showPrimary ? (
          <div className="flex flex-col gap-3">
            <InteractiveButton
              variant="primary"
              onClick={onPrimary}
              data-testid="trial-notice-primary"
              className="!py-3 !text-xs font-black uppercase tracking-[0.3em] rounded-2xl"
            >
              {copy.trial_modal_cta_primary}
            </InteractiveButton>
            <InteractiveButton
              variant="secondary"
              onClick={closeModal}
              data-testid="trial-notice-secondary"
              className="!py-3 !text-xs font-black uppercase tracking-[0.3em] rounded-2xl"
            >
              {copy.trial_modal_cta_secondary}
            </InteractiveButton>
          </div>
        ) : (
          <div className="text-xs font-black uppercase tracking-widest text-gray-500">
            {copy.trial_modal_member_hint}
          </div>
        )}
      </div>
    </div>
  );
};
