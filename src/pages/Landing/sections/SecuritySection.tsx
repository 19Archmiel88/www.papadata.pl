import { StateCard } from '../../../components/common/States';
import { useT } from '../../../hooks/useT';

type SecuritySectionProps = {
  demoState?: 'loading' | 'empty' | 'error' | 'offline' | null;
};

const securityItems = [
  {
    id: 'encryption',
    titleKey: 'landing.security.items.encryption.title',
    descriptionKey: 'landing.security.items.encryption.description',
  },
  {
    id: 'access',
    titleKey: 'landing.security.items.access.title',
    descriptionKey: 'landing.security.items.access.description',
  },
  {
    id: 'backups',
    titleKey: 'landing.security.items.backups.title',
    descriptionKey: 'landing.security.items.backups.description',
  },
  {
    id: 'gdpr',
    titleKey: 'landing.security.items.gdpr.title',
    descriptionKey: 'landing.security.items.gdpr.description',
  },
  {
    id: 'deletion',
    titleKey: 'landing.security.items.deletion.title',
    descriptionKey: 'landing.security.items.deletion.description',
  },
  {
    id: 'monitoring',
    titleKey: 'landing.security.items.monitoring.title',
    descriptionKey: 'landing.security.items.monitoring.description',
  },
];

const SecuritySection = ({ demoState }: SecuritySectionProps) => {
  const { t } = useT();

  return (
    <section id="security" className="landing-section">
      <div className="container">
        <div className="section-heading">
          <span className="section-badge">{t('landing.security.badge')}</span>
          <h2>{t('landing.security.title')}</h2>
        </div>
        {demoState ? (
          <div className="section-state">
            <StateCard kind={demoState} />
          </div>
        ) : (
          <div className="security-grid">
            {securityItems.map((item) => (
              <article key={item.id} className="security-card">
                <h3>{t(item.titleKey)}</h3>
                <p>{t(item.descriptionKey)}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SecuritySection;
