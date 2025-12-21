import { StateCard } from '../../../components/common/States';
import { featureCards } from '../../../data/mocks/features';
import { useT } from '../../../hooks/useT';

type FeaturesSectionProps = {
  demoState?: 'loading' | 'empty' | 'error' | 'offline' | null;
};

const FeaturesSection = ({ demoState }: FeaturesSectionProps) => {
  const { t } = useT();

  return (
    <section id="features" className="landing-section">
      <div className="container">
        <div className="section-heading">
          <span className="section-badge">{t('landing.features.badge')}</span>
          <h2>{t('landing.features.title')}</h2>
          <p>{t('landing.features.subtitle')}</p>
        </div>
        {demoState ? (
          <div className="section-state">
            <StateCard kind={demoState} />
          </div>
        ) : (
          <div className="features-grid">
            {featureCards.map((card) => (
              <article key={card.id} className="feature-card">
                <div className="feature-icon" aria-hidden="true" />
                <h3>{t(card.titleKey)}</h3>
                <p>{t(card.descriptionKey)}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturesSection;
