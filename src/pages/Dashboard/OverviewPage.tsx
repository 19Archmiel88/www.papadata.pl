import { States } from '../../components/common/States';
import ChartPlaceholder from '../../components/dashboard/ChartPlaceholder';
import KpiCard from '../../components/dashboard/KpiCard';
import { overviewChannelSegments, overviewRevenueSeries } from '../../data/mocks/charts';
import { overviewKpis } from '../../data/mocks/kpis';
import { useT } from '../../hooks/useT';
import DashboardLayout from '../../layouts/DashboardLayout';

const OverviewPage = () => {
  const { t, lang } = useT();
  const locale = lang === 'pl' ? 'pl-PL' : 'en-US';
  const currency = t('dashboard.currency');
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
  const numberFormatter = new Intl.NumberFormat(locale);
  const percentFormatter = new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 0,
  });

  const formatChange = (value: number) => {
    const sign = value > 0 ? '+' : value < 0 ? '-' : '';
    return `${sign}${percentFormatter.format(Math.abs(value))}`;
  };

  const kpiCards = overviewKpis.map((kpi) => {
    const value =
      kpi.format === 'currency'
        ? currencyFormatter.format(kpi.value)
        : numberFormatter.format(kpi.value);

    return (
      <KpiCard
        key={kpi.id}
        label={t(kpi.labelKey)}
        value={value}
        change={formatChange(kpi.change)}
        trend={kpi.trend}
        helper={t(kpi.helperKey)}
      />
    );
  });

  const revenueSeries = overviewRevenueSeries.map((item) => ({
    id: item.id,
    label: t(item.labelKey),
    data: item.data,
  }));

  const channelSegments = overviewChannelSegments.map((item) => ({
    id: item.id,
    label: t(item.labelKey),
    value: item.value,
  }));

  return (
    <DashboardLayout>
      <div className="dashboard-content-inner">
        <section className="dashboard-header">
          <h1>{t('dashboard.overview.title')}</h1>
          <p>{t('dashboard.overview.description')}</p>
        </section>
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>{t('dashboard.overview.sections.kpis')}</h2>
              <p>{t('dashboard.overview.sections.kpisSubtitle')}</p>
            </div>
          </div>
          <div className="kpi-grid">{kpiCards}</div>
        </section>
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>{t('dashboard.overview.sections.performance')}</h2>
              <p>{t('dashboard.overview.sections.performanceSubtitle')}</p>
            </div>
          </div>
          <div className="chart-grid chart-grid--two">
            <ChartPlaceholder
              title={t('dashboard.overview.charts.revenue.title')}
              subtitle={t('dashboard.overview.charts.revenue.subtitle')}
              variant="area"
              series={revenueSeries}
            />
            <ChartPlaceholder
              title={t('dashboard.overview.charts.channels.title')}
              subtitle={t('dashboard.overview.charts.channels.subtitle')}
              variant="donut"
              segments={channelSegments}
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

export default OverviewPage;
