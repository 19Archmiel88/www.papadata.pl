import { useState } from 'react';
import { States } from '../../components/common/States';
import EmptyPanel from '../../components/dashboard/EmptyPanel';
import { integrations } from '../../data/mocks/integrations';
import { useT } from '../../hooks/useT';
import DashboardLayout from '../../layouts/DashboardLayout';

const IntegrationsPage = () => {
  const { t } = useT();
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const statusTone: Record<string, string> = {
    live: 'positive',
    beta: 'warning',
    soon: 'neutral',
  };

  const connectedCount = integrations.reduce(
    (total, integration) => total + (connected[integration.id] ? 1 : 0),
    0,
  );

  const toggleIntegration = (id: string) => {
    setConnected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <DashboardLayout>
      <div className="dashboard-content-inner">
        <section className="dashboard-header">
          <h1>{t('dashboard.integrations.title')}</h1>
          <p>{t('dashboard.integrations.description')}</p>
        </section>
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>{t('dashboard.integrations.sections.catalog')}</h2>
              <p>{t('dashboard.integrations.sections.catalogSubtitle')}</p>
            </div>
          </div>
          {connectedCount === 0 ? (
            <EmptyPanel
              title={t('dashboard.integrations.empty.title')}
              description={t('dashboard.integrations.empty.description')}
            />
          ) : null}
          <div className="integration-grid">
            {integrations.map((integration) => {
              const isConnected = connected[integration.id] ?? false;
              const statusLabelKey = `landing.integrations.status.${integration.status}`;
              const toggleLabelKey = isConnected
                ? 'dashboard.integrations.toggle.disconnect'
                : 'dashboard.integrations.toggle.connect';

              return (
                <div key={integration.id} className="integration-card">
                  <div className="integration-card-header">
                    <h3>{t(integration.nameKey)}</h3>
                    <span
                      className={`status-pill status-pill--${
                        statusTone[integration.status] ?? 'neutral'
                      }`}
                    >
                      {t(statusLabelKey)}
                    </span>
                  </div>
                  <p>{t(integration.descriptionKey)}</p>
                  <div className="integration-card-footer">
                    <span
                      className={`status-pill ${
                        isConnected ? 'status-pill--positive' : 'status-pill--neutral'
                      }`}
                    >
                      {t(
                        isConnected
                          ? 'dashboard.integrations.connected'
                          : 'dashboard.integrations.disconnected',
                      )}
                    </span>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => toggleIntegration(integration.id)}
                      aria-pressed={isConnected}
                      aria-label={t(toggleLabelKey, { name: t(integration.nameKey) })}
                    >
                      {t(toggleLabelKey, { name: t(integration.nameKey) })}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <section className="dashboard-section">
          <h2>{t('common.states.title')}</h2>
          <States />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default IntegrationsPage;
