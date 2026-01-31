import React from 'react';
import type { Translation } from '../../types';

type TrialBannerProps = {
  t: Translation;
  canManageBilling: boolean;
  primaryBillingCta: string;
  trialBannerOwner: string;
  trialBannerMember: string;
  onUpgrade: () => void;
  onManageSubscription: () => void;
};

export const TrialBanner: React.FC<TrialBannerProps> = ({
  t,
  canManageBilling,
  primaryBillingCta,
  trialBannerOwner,
  trialBannerMember,
  onUpgrade,
  onManageSubscription,
}) => (
  <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div className="space-y-1">
      <div className="text-xs font-black uppercase tracking-widest text-emerald-600">
        {t.dashboard.billing.trial_banner_tag}
      </div>
      <p className="text-sm text-emerald-700/90 dark:text-emerald-200/90 font-medium">
        {canManageBilling ? trialBannerOwner : trialBannerMember}
      </p>
    </div>
    {canManageBilling && (
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onUpgrade}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-black uppercase tracking-widest shadow-lg hover:bg-emerald-400 transition-colors"
        >
          {primaryBillingCta}
        </button>
        <button
          type="button"
          onClick={onManageSubscription}
          className="px-4 py-2 rounded-xl border border-emerald-500/40 text-emerald-700 text-xs font-black uppercase tracking-widest hover:bg-emerald-500/10 transition-colors"
        >
          {t.dashboard.billing.manage_link}
        </button>
      </div>
    )}
  </div>
);

export default TrialBanner;
