import { States } from '../../components/common/States';
import Table, { type TableColumn } from '../../components/dashboard/Table';
import { customers, type CustomerRow } from '../../data/mocks/customers';
import { useT } from '../../hooks/useT';
import DashboardLayout from '../../layouts/DashboardLayout';

const CustomersPage = () => {
  const { t, lang } = useT();
  const locale = lang === 'pl' ? 'pl-PL' : 'en-US';
  const currency = t('dashboard.currency');
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });

  const statusTone: Record<string, string> = {
    'dashboard.customers.status.active': 'positive',
    'dashboard.customers.status.new': 'neutral',
    'dashboard.customers.status.atRisk': 'warning',
  };

  const columns: TableColumn<CustomerRow>[] = [
    {
      header: t('dashboard.customers.table.name'),
      render: (row) => t(row.nameKey),
    },
    {
      header: t('dashboard.customers.table.email'),
      render: (row) => row.email,
    },
    {
      header: t('dashboard.customers.table.plan'),
      render: (row) => t(row.planKey),
    },
    {
      header: t('dashboard.customers.table.status'),
      render: (row) => (
        <span
          className={`status-pill status-pill--${statusTone[row.statusKey] ?? 'neutral'}`}
        >
          {t(row.statusKey)}
        </span>
      ),
    },
    {
      header: t('dashboard.customers.table.ltv'),
      align: 'right',
      render: (row) => currencyFormatter.format(row.ltv),
    },
    {
      header: t('dashboard.customers.table.lastOrder'),
      align: 'right',
      render: (row) => row.lastOrder,
    },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-content-inner">
        <section className="dashboard-header">
          <h1>{t('dashboard.customers.title')}</h1>
          <p>{t('dashboard.customers.description')}</p>
        </section>
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>{t('dashboard.customers.sections.table')}</h2>
              <p>{t('dashboard.customers.sections.tableSubtitle')}</p>
            </div>
          </div>
          <Table columns={columns} rows={customers} emptyMessage={t('dashboard.customers.empty')} />
        </section>
        <section className="dashboard-section">
          <h2>{t('common.states.title')}</h2>
          <States />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default CustomersPage;
