import { States } from '../../components/common/States';
import ChartPlaceholder from '../../components/dashboard/ChartPlaceholder';
import { analyticsCampaignSeries, analyticsTrafficSeries } from '../../data/mocks/charts';
import { useT } from '../../hooks/useT';
import DashboardLayout from '../../layouts/DashboardLayout';

const AnalyticsPage = () => {
  const { t } = useT();

  const insights = [
    {
      id: 'focus',
      titleKey: 'dashboard.analytics.insights.focus.title',
      descriptionKey: 'dashboard.analytics.insights.focus.description',
    },
    {
      id: 'segments',
      titleKey: 'dashboard.analytics.insights.segments.title',
      descriptionKey: 'dashboard.analytics.insights.segments.description',
    },
    {
      id: 'budget',
      titleKey: 'dashboard.analytics.insights.budget.title',
      descriptionKey: 'dashboard.analytics.insights.budget.description',
    },
  ];

  const trafficSeries = analyticsTrafficSeries.map((item) => ({
    id: item.id,
    label: t(item.labelKey),
    data: item.data,
  }));

  const campaignSeries = analyticsCampaignSeries.map((item) => ({
    id: item.id,
    label: t(item.labelKey),
    data: item.data,
  }));

  return (
    <DashboardLayout>
      <div className="dashboard-content-inner">
        <section className="dashboard-header">
          <h1>{t('dashboard.analytics.title')}</h1>
          <p>{t('dashboard.analytics.description')}</p>
        </section>
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>{t('dashboard.analytics.sections.insights')}</h2>
              <p>{t('dashboard.analytics.sections.insightsSubtitle')}</p>
            </div>
          </div>
          <div className="insight-grid">
            {insights.map((item) => (
              <div key={item.id} className="insight-card">
                <h3>{t(item.titleKey)}</h3>
                <p>{t(item.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>{t('dashboard.analytics.sections.performance')}</h2>
              <p>{t('dashboard.analytics.sections.performanceSubtitle')}</p>
            </div>
          </div>
          <div className="chart-grid chart-grid--two">
            <ChartPlaceholder
              title={t('dashboard.analytics.charts.traffic.title')}
              subtitle={t('dashboard.analytics.charts.traffic.subtitle')}
              variant="line"
              series={trafficSeries}
            />
            <ChartPlaceholder
              title={t('dashboard.analytics.charts.campaigns.title')}
              subtitle={t('dashboard.analytics.charts.campaigns.subtitle')}
              variant="bar"
              series={campaignSeries}
            />
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

export default AnalyticsPage;
