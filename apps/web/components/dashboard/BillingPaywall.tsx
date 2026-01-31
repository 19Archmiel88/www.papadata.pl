import React from 'react';
import type { Translation } from '../../types';

type BillingPaywallProps = {
  t: Translation;
  canManageBilling: boolean;
  primaryBillingCta: string;
  onUpgrade: () => void;
  onManageSubscription: () => void;
};

export const BillingPaywall: React.FC<BillingPaywallProps> = ({
  t,
  canManageBilling,
  primaryBillingCta,
  onUpgrade,
  onManageSubscription,
}) => (
  <section className="mb-6 rounded-3xl border border-amber-500/30 bg-amber-500/10 px-6 py-6 md:px-8 md:py-7 space-y-6">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="space-y-2">
        <div className="text-xs font-black uppercase tracking-widest text-amber-600">
          {t.dashboard.billing.read_only_badge}
        </div>
        <h3 className="text-xl font-black text-amber-800/90 dark:text-amber-200/90 uppercase tracking-tight">
          {t.dashboard.billing.paywall_title}
        </h3>
        <p className="text-sm text-amber-800/80 dark:text-amber-200/80 font-medium">
          {t.dashboard.billing.paywall_desc}
        </p>
      </div>
      {canManageBilling ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onUpgrade}
            className="px-5 py-3 rounded-xl bg-amber-500 text-white text-xs font-black uppercase tracking-widest shadow-lg hover:bg-amber-400 transition-colors"
          >
            {primaryBillingCta}
          </button>
          <button
            type="button"
            onClick={onManageSubscription}
            className="px-5 py-3 rounded-xl border border-amber-500/40 text-amber-700 text-xs font-black uppercase tracking-widest hover:bg-amber-500/10 transition-colors"
          >
            {t.dashboard.billing.manage_link}
          </button>
        </div>
      ) : (
        <div className="text-xs font-black uppercase tracking-widest text-amber-700">
          {t.dashboard.billing.paywall_member_cta}
        </div>
      )}
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-amber-500/20 bg-white/60 dark:bg-white/5 p-4">
        <div className="text-xs font-black uppercase tracking-widest text-amber-600 mb-3">
          {t.dashboard.billing.paywall_allowed_title}
        </div>
        <ul className="space-y-2 text-xs-plus text-amber-800/80 dark:text-amber-200/80">
          {t.dashboard.billing.paywall_allowed_items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-amber-500/20 bg-white/60 dark:bg-white/5 p-4">
        <div className="text-xs font-black uppercase tracking-widest text-amber-600 mb-3">
          {t.dashboard.billing.paywall_blocked_title}
        </div>
        <ul className="space-y-2 text-xs-plus text-amber-800/80 dark:text-amber-200/80">
          {t.dashboard.billing.paywall_blocked_items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default BillingPaywall;
