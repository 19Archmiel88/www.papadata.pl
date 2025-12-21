import { StateCard } from '../../../components/common/States';
import { useT } from '../../../hooks/useT';
import { paths } from '../../../routes/paths';
import { Link } from 'react-router-dom';

type FinalCtaSectionProps = {
  demoState?: 'loading' | 'empty' | 'error' | 'offline' | null;
};

const FinalCtaSection = ({ demoState }: FinalCtaSectionProps) => {
  const { t } = useT();

  return (
    <section id="final-cta" className="landing-section">
      <div className="container">
        {demoState ? (
          <div className="section-state">
            <StateCard kind={demoState} />
          </div>
        ) : (
          <div className="final-cta-card">
            <div className="final-cta-content">
              <h2>{t('landing.finalCta.title')}</h2>
              <p>{t('landing.finalCta.subtitle')}</p>
            </div>
            <div className="final-cta-actions">
              <Link className="btn-primary" to={`${paths.root}#pricing`}>
                {t('landing.finalCta.cta.primary')}
              </Link>
              <Link className="btn-secondary" to={paths.dashboard}>
                {t('landing.finalCta.cta.secondary')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FinalCtaSection;
