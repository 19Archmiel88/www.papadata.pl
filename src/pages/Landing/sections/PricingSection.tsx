import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../../../components/common/Modal';
import { StateCard } from '../../../components/common/States';
import { pricingTiers } from '../../../data/mocks/pricing';
import { useT } from '../../../hooks/useT';
import { paths } from '../../../routes/paths';

type PricingSectionProps = {
  demoState?: 'loading' | 'empty' | 'error' | 'offline' | null;
};

type BillingCycle = 'monthly' | 'yearly';

const PricingSection = ({ demoState }: PricingSectionProps) => {
  const { t, lang } = useT();
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [isEnterpriseOpen, setIsEnterpriseOpen] = useState(false);

  const currency = t('landing.pricing.currency');
  const formatter = useMemo(
    () => new Intl.NumberFormat(lang, { style: 'currency', currency }),
    [lang, currency],
  );

  return (
    <section id="pricing" className="landing-section">
      <div className="container">
        <div className="section-heading">
          <h2>{t('landing.pricing.title')}</h2>
          <p>{t('landing.pricing.subtitle')}</p>
        </div>
        {demoState ? (
          <div className="section-state">
            <StateCard kind={demoState} />
          </div>
        ) : (
          <>
            <div className="pricing-banner">{t('landing.pricing.banner')}</div>
            <div className="pricing-toggle">
              <div className="toggle-group" role="group" aria-label={t('landing.pricing.toggle.label')}>
                <button
                  type="button"
                  className="toggle-button"
                  aria-pressed={billing === 'monthly'}
                  onClick={() => setBilling('monthly')}
                >
                  {t('landing.pricing.toggle.monthly')}
                </button>
                <button
                  type="button"
                  className="toggle-button"
                  aria-pressed={billing === 'yearly'}
                  onClick={() => setBilling('yearly')}
                >
                  {t('landing.pricing.toggle.yearly')}
                </button>
              </div>
              <span className="pricing-save">{t('landing.pricing.toggle.save')}</span>
            </div>
            <div className="pricing-grid">
              {pricingTiers.map((tier) => {
                const price =
                  billing === 'monthly' ? tier.priceMonthly : tier.priceYearly;
                const priceLabel =
                  price !== null
                    ? formatter.format(price)
                    : t('landing.pricing.tiers.enterprise.priceLabel');

                return (
                  <article
                    key={tier.id}
                    className={tier.highlight ? 'pricing-card highlight' : 'pricing-card'}
                  >
                    <h3>{t(tier.nameKey)}</h3>
                    <p>{t(tier.descriptionKey)}</p>
                    <div className="pricing-price">
                      <strong>{priceLabel}</strong>
                      {price !== null && (
                        <span>
                          {billing === 'monthly'
                            ? t('landing.pricing.perMonth')
                            : t('landing.pricing.perYear')}
                        </span>
                      )}
                    </div>
                    <ul className="pricing-features">
                      {tier.featuresKeys.map((featureKey) => (
                        <li key={featureKey}>{t(featureKey)}</li>
                      ))}
                    </ul>
                    {tier.id === 'enterprise' ? (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setIsEnterpriseOpen(true)}
                      >
                        {t(tier.ctaKey)}
                      </button>
                    ) : (
                      <Link className="btn-primary" to={paths.dashboard}>
                        {t(tier.ctaKey)}
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
      <Modal
        isOpen={isEnterpriseOpen}
        onClose={() => setIsEnterpriseOpen(false)}
        title={t('landing.pricing.enterprise.modal.title')}
      >
        <form className="enterprise-form">
          <p>{t('landing.pricing.enterprise.modal.description')}</p>
          <label>
            <span>{t('landing.pricing.enterprise.form.name')}</span>
            <input
              type="text"
              placeholder={t('landing.pricing.enterprise.form.namePlaceholder')}
              aria-label={t('landing.pricing.enterprise.form.name')}
            />
          </label>
          <label>
            <span>{t('landing.pricing.enterprise.form.email')}</span>
            <input
              type="email"
              placeholder={t('landing.pricing.enterprise.form.emailPlaceholder')}
              aria-label={t('landing.pricing.enterprise.form.email')}
            />
          </label>
          <label>
            <span>{t('landing.pricing.enterprise.form.requirements')}</span>
            <textarea
              rows={4}
              placeholder={t('landing.pricing.enterprise.form.requirementsPlaceholder')}
              aria-label={t('landing.pricing.enterprise.form.requirements')}
            />
          </label>
          <div className="enterprise-actions">
            <button type="button" className="btn-primary" onClick={() => setIsEnterpriseOpen(false)}>
              {t('landing.pricing.enterprise.form.cta')}
            </button>
            <span>{t('landing.pricing.enterprise.form.responseTime')}</span>
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default PricingSection;
