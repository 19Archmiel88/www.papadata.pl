import { useMemo, useState } from 'react';
import Modal from '../../../components/common/Modal';
import { StateCard } from '../../../components/common/States';
import {
  integrationCategories,
  integrations,
  type IntegrationCategory,
  type IntegrationItem,
} from '../../../data/mocks/integrations';
import { useT } from '../../../hooks/useT';

type IntegrationsSectionProps = {
  demoState?: 'loading' | 'empty' | 'error' | 'offline' | null;
};

const IntegrationsSection = ({ demoState }: IntegrationsSectionProps) => {
  const { t } = useT();
  const [activeCategory, setActiveCategory] = useState<IntegrationCategory>('all');
  const [selected, setSelected] = useState<IntegrationItem | null>(null);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return integrations;
    return integrations.filter((item) => item.categories.includes(activeCategory));
  }, [activeCategory]);

  const statusLabel = (status: IntegrationItem['status']) =>
    t(`landing.integrations.status.${status}`);

  return (
    <section id="integrations" className="landing-section">
      <div className="container">
        <div className="section-heading">
          <h2>{t('landing.integrations.title')}</h2>
          <p>{t('landing.integrations.subtitle')}</p>
        </div>
        {demoState ? (
          <div className="section-state">
            <StateCard kind={demoState} />
          </div>
        ) : (
          <>
            <div className="integrations-filters" role="group" aria-label={t('landing.integrations.filtersLabel')}>
              {integrationCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={
                    activeCategory === category.id ? 'filter-button active' : 'filter-button'
                  }
                  aria-pressed={activeCategory === category.id}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {t(category.labelKey)}
                </button>
              ))}
            </div>
            <div className="integrations-grid">
              {filtered.length === 0 ? (
                <div className="integrations-empty">{t('landing.integrations.empty')}</div>
              ) : (
                filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="integration-card"
                    onClick={() => setSelected(item)}
                    aria-label={t('landing.integrations.openDetails', { name: t(item.nameKey) })}
                  >
                    <div className="integration-card-header">
                      <h3>{t(item.nameKey)}</h3>
                      <span className="integration-status">{statusLabel(item.status)}</span>
                    </div>
                    <p>{t(item.descriptionKey)}</p>
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>
      <Modal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? t(selected.nameKey) : t('landing.integrations.modal.title')}
      >
        <div className="integration-modal">
          <span className="integration-modal-tag">{t('landing.integrations.modal.sidebar')}</span>
          <p>{selected ? t(selected.descriptionKey) : t('landing.integrations.modal.description')}</p>
          <div className="integration-modal-grid">
            <div>
              <h3>{t('landing.integrations.modal.requirements.title')}</h3>
              <p>{t('landing.integrations.modal.requirements.description')}</p>
            </div>
            <div>
              <h3>{t('landing.integrations.modal.permissions.title')}</h3>
              <p>{t('landing.integrations.modal.permissions.description')}</p>
            </div>
          </div>
          <button type="button" className="btn-secondary">
            {t('landing.integrations.modal.cta')}
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default IntegrationsSection;
