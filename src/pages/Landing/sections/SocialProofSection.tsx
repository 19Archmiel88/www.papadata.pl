import { StateCard } from '../../../components/common/States';
import { socialProofItems } from '../../../data/mocks/socialProof';
import { useT } from '../../../hooks/useT';

type SocialProofSectionProps = {
  demoState?: 'loading' | 'empty' | 'error' | 'offline' | null;
};

const SocialProofSection = ({ demoState }: SocialProofSectionProps) => {
  const { t } = useT();

  return (
    <section id="social-proof" className="landing-section">
      <div className="container">
        <div className="section-heading">
          <span className="section-badge">{t('landing.socialProof.badge')}</span>
          <h2>{t('landing.socialProof.title')}</h2>
        </div>
        {demoState ? (
          <div className="section-state">
            <StateCard kind={demoState} />
          </div>
        ) : (
          <>
            <div className="social-proof-grid">
              {socialProofItems.map((item) => (
                <article key={item.id} className="social-card">
                  <span className="social-verified">{t('landing.socialProof.verified')}</span>
                  <p className="social-quote">{t(item.quoteKey)}</p>
                  <p className="social-name">{t(item.nameKey)}</p>
                  <p className="social-role">{t(item.roleKey)}</p>
                </article>
              ))}
            </div>
            <p className="social-omnibus">{t('landing.socialProof.omnibus')}</p>
          </>
        )}
      </div>
    </section>
  );
};

export default SocialProofSection;
