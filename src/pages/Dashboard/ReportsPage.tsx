import { States } from '../../components/common/States';
import EmptyPanel from '../../components/dashboard/EmptyPanel';
import { reports } from '../../data/mocks/reports';
import { useT } from '../../hooks/useT';
import DashboardLayout from '../../layouts/DashboardLayout';

const ReportsPage = () => {
  const { t } = useT();

  const statusTone: Record<string, string> = {
    'dashboard.reports.status.ready': 'positive',
    'dashboard.reports.status.scheduled': 'neutral',
    'dashboard.reports.status.processing': 'warning',
  };

  return (
    <DashboardLayout>
      <div className="dashboard-content-inner">
        <section className="dashboard-header">
          <h1>{t('dashboard.reports.title')}</h1>
          <p>{t('dashboard.reports.description')}</p>
        </section>
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>{t('dashboard.reports.sections.library')}</h2>
              <p>{t('dashboard.reports.sections.librarySubtitle')}</p>
            </div>
          </div>
          {reports.length === 0 ? (
            <EmptyPanel
              title={t('dashboard.reports.empty.title')}
              description={t('dashboard.reports.empty.description')}
            />
          ) : (
            <div className="report-grid">
              {reports.map((report) => (
                <div key={report.id} className="report-card">
                  <div className="report-card-header">
                    <div>
                      <h3>{t(report.titleKey)}</h3>
                      <p>{t(report.descriptionKey)}</p>
                    </div>
                    <span
                      className={`status-pill status-pill--${
                        statusTone[report.statusKey] ?? 'neutral'
                      }`}
                    >
                      {t(report.statusKey)}
                    </span>
                  </div>
                  <div className="report-meta">
                    <span>
                      {t('dashboard.reports.meta.format')}: {t(report.formatKey)}
                    </span>
                    <span>
                      {t('dashboard.reports.meta.updated')}: {report.updated}
                    </span>
                  </div>
                  <button type="button" className="btn-secondary">
                    {t('dashboard.reports.cta.download')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="dashboard-section">
          <h2>{t('common.states.title')}</h2>
          <States />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
