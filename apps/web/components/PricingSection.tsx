import React, { useMemo, useState, memo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Translation } from '../types';
import { InteractiveButton } from './InteractiveButton';
import { motion } from 'framer-motion';
import { useModal } from '../context/useModal';
import { createCheckoutSession } from '../data/billing';
import { useAuth } from '../context/useAuth';
import { safeLocalStorage } from '../utils/safeLocalStorage';

interface PricingSectionProps {
  t: Translation;
  onCompare: () => void;
  onPlanCtaClick?: (planId: string) => void;
}

type BillingCycle = 'monthly' | 'yearly';

const parsePriceNumber = (value: unknown): number | null => {
  const raw = String(value ?? '').trim();
  if (!raw) return null;

  // wyciÄ…gamy pierwszÄ… sensownÄ… liczbÄ™ (obsĹ‚uga "399", "399.00", "399,00", "399 PLN")
  const m = raw.replace(/\s+/g, '').match(/(\d+(?:[.,]\d+)?)/);
  if (!m) return null;
  const normalized = m[1].replace(',', '.');
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
};

const FeatureNode = memo(({ text, isFeatured }: { text: string; isFeatured: boolean }) => (
  <li className="flex items-start gap-3 group/node">
    <div
      className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${
        isFeatured ? 'bg-white shadow-[0_0_5px_white]' : 'bg-brand-start'
      }`}
    />
    <span
      className={`text-sm2 font-semibold leading-tight ${
        isFeatured ? 'text-white/80' : 'text-gray-700 dark:text-gray-300'
      }`}
    >
      {text}
    </span>
  </li>
));
FeatureNode.displayName = 'FeatureNode';

export const PricingSection: React.FC<PricingSectionProps> = ({ t, onCompare, onPlanCtaClick }) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const pricing = t.pricing;
  const { openModal } = useModal();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const plans = useMemo(() => {
    const isYearly = billingCycle === 'yearly';

    const starterNum = parsePriceNumber(pricing.starter.price);
    const proNum = parsePriceNumber(pricing.professional.price);

    const starterYearly =
      starterNum != null ? Math.round(starterNum * 0.8).toString() : String(pricing.starter.price);
    const proYearly =
      proNum != null ? Math.round(proNum * 0.8).toString() : String(pricing.professional.price);

    return [
      {
        id: 'starter',
        name: pricing.starter.name,
        desc: pricing.starter.desc,
        price: isYearly ? starterYearly : String(pricing.starter.price),
        features: pricing.starter.features,
        cta: pricing.starter.cta,
        featured: false,
        tag: pricing.plan_meta.starter.tag,
      },
      {
        id: 'professional',
        name: pricing.professional.name,
        desc: pricing.professional.desc,
        price: isYearly ? proYearly : String(pricing.professional.price),
        features: pricing.professional.features,
        cta: pricing.professional.cta,
        featured: true,
        tag: pricing.plan_meta.professional.tag,
      },
      {
        id: 'enterprise',
        name: pricing.enterprise.name,
        desc: pricing.enterprise.desc,
        price: pricing.enterprise.price,
        features: pricing.enterprise.features,
        cta: pricing.enterprise.cta,
        featured: false,
        tag: pricing.plan_meta.enterprise.tag,
      },
    ];
  }, [pricing, billingCycle]);

  const resolveTenantId = useCallback((): string | undefined => {
    if (typeof window === 'undefined') return undefined;
    return safeLocalStorage.getItem('pd_active_tenant_id') || undefined;
  }, []);

  const startCheckout = useCallback(
    async (planId: string, tenantId: string) => {
      setSubmitError(null);
      setLoadingPlanId(planId);

      try {
        const { url } = await createCheckoutSession({ tenantId, planId });
        if (url) window.location.assign(url);
        else setSubmitError(t.pricing.errors.payment_start);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : t.pricing.errors.payment_generic);
      } finally {
        setLoadingPlanId(null);
      }
    },
    [t.pricing.errors.payment_generic, t.pricing.errors.payment_start]
  );

  useEffect(() => {
    if (!isAuthenticated || typeof window === 'undefined') return;
    const storedPlan = safeLocalStorage.getItem('pd_selected_plan');
    if (!storedPlan) return;
    safeLocalStorage.removeItem('pd_selected_plan');

    if (storedPlan === 'enterprise') return;

    const tenantId = resolveTenantId();
    if (!tenantId) {
      setSubmitError(t.pricing.errors.tenant_missing);
      return;
    }

    void startCheckout(storedPlan, tenantId);
  }, [isAuthenticated, resolveTenantId, startCheckout, t.pricing.errors.tenant_missing]);

  const handlePlanClick = async (planId: string) => {
    if (onPlanCtaClick) {
      onPlanCtaClick(planId);
      return;
    }

    if (planId === 'enterprise') {
      window.location.href = `mailto:hello@papadata.ai?subject=${encodeURIComponent(t.pricing.actions.enterprise_subject)}`;
      return;
    }

    try {
      safeLocalStorage.setItem('pd_selected_plan', planId);
    } catch {
      // ignore
    }

    if (!isAuthenticated) {
      try {
        safeLocalStorage.setItem(
          'pd_post_login_redirect',
          window.location.pathname + window.location.search
        );
      } catch {
        // ignore
      }
      openModal('auth', { isRegistered: false });
      return;
    }

    const tenantId = resolveTenantId();
    if (!tenantId) {
      setSubmitError(t.pricing.errors.tenant_missing);
      return;
    }

    await startCheckout(planId, tenantId);
  };

  return (
    <section id="pricing" className="py-24 md:py-32 px-4 md:px-6 max-w-7xl mx-auto relative">
      <div className="text-center max-w-4xl mx-auto mb-16 md:mb-20 space-y-6">
        <h2
          className="font-black tracking-tighter text-gray-900 dark:text-white leading-[1.05] py-1"
          style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}
        >
          {pricing.title}
        </h2>

        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto italic opacity-90">
          {pricing.desc}
        </p>

        <div className="flex flex-col items-center mt-8 gap-4">
          <div className="p-1 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              aria-pressed={billingCycle === 'monthly'}
              className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-[0.18em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f] ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-white/10 shadow-lg text-brand-start dark:text-white'
                  : 'text-gray-500'
              }`}
            >
              {pricing.billing_monthly}
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              aria-pressed={billingCycle === 'yearly'}
              className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-[0.18em] transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f] ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-white/10 shadow-lg text-brand-start dark:text-white'
                  : 'text-gray-500'
              }`}
            >
              {pricing.billing_yearly}
            </button>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-black text-gray-400 tracking-[0.22em] uppercase">
              {pricing.net_prices}
            </p>
            <p className="text-2xs font-bold text-gray-400 tracking-[0.22em] uppercase">
              {pricing.meta.lowest_30d_note}
            </p>
          </div>

          <button
            type="button"
            onClick={onCompare}
            className="mt-2 inline-flex items-center gap-2 text-xs-plus font-black tracking-[0.16em] text-brand-start hover:text-brand-start/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-start/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0b0b0f]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-start/70" />
            {pricing.compare_btn}
          </button>
        </div>
      </div>

      {submitError && (
        <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-xs font-semibold text-rose-500">
          <div>{submitError}</div>
          {submitError === t.pricing.errors.tenant_missing && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate('/app/settings/workspace')}
                className="px-3 py-2 rounded-xl bg-rose-500 text-white text-2xs font-black uppercase tracking-widest"
              >
                {t.pricing.errors.tenant_missing_cta}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-6 relative z-10">
        {plans.map((plan) => {
          const isNumeric = plan.id !== 'enterprise';
          const isLoading = loadingPlanId === plan.id;
          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -5 }}
              className={`group relative flex flex-col p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-700 ${
                plan.featured
                  ? 'bg-black dark:bg-[#050507] border-brand-start/50 shadow-2xl lg:scale-105 z-20'
                  : 'bg-white/40 dark:bg-white/[0.02] border-black/10 dark:border-white/10'
              }`}
            >
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className={`text-xs font-mono font-black uppercase tracking-[0.26em] ${
                      plan.featured ? 'text-brand-start' : 'text-gray-400'
                    }`}
                  >
                    {plan.tag}
                  </span>
                  {plan.featured && (
                    <span className="px-2 py-0.5 rounded-md bg-brand-start text-white text-3xs font-black uppercase tracking-[0.22em]">
                      {pricing.meta.recommended_label}
                    </span>
                  )}
                </div>

                <h3
                  className={`text-2xl md:text-3xl font-black tracking-tighter leading-none mb-3 ${
                    plan.featured ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {plan.name}
                </h3>

                <p
                  className={`text-sm2 font-medium italic leading-relaxed min-h-[3rem] ${
                    plan.featured ? 'text-white/50' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {plan.desc}
                </p>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-4xl md:text-5xl font-black tracking-tighter ${
                      plan.featured ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {plan.price}
                  </span>
                  {isNumeric && (
                    <span
                      className={`text-lg font-black ${
                        plan.featured ? 'text-brand-start' : 'text-brand-start/60'
                      }`}
                    >
                      {t.pricing.currency}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 mb-10">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <FeatureNode key={i} text={feature} isFeatured={plan.featured} />
                  ))}
                </ul>
              </div>

              <InteractiveButton
                variant={plan.featured ? 'primary' : 'secondary'}
                onClick={() => handlePlanClick(plan.id)}
                disabled={isLoading}
                className={`w-full !h-14 !text-xs-plus font-black tracking-[0.16em] rounded-2xl shadow-xl transition-all ${
                  !plan.featured ? 'hover:border-brand-start/40' : ''
                }`}
              >
                {isLoading ? t.pricing.actions.processing : plan.cta}
              </InteractiveButton>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

