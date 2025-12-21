import { States } from '../../components/common/States';
import Table, { type TableColumn } from '../../components/dashboard/Table';
import { products, type ProductRow } from '../../data/mocks/products';
import { useT } from '../../hooks/useT';
import DashboardLayout from '../../layouts/DashboardLayout';

const ProductsPage = () => {
  const { t, lang } = useT();
  const locale = lang === 'pl' ? 'pl-PL' : 'en-US';
  const currency = t('dashboard.currency');
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
  const numberFormatter = new Intl.NumberFormat(locale);

  const statusTone: Record<string, string> = {
    'dashboard.products.status.active': 'positive',
    'dashboard.products.status.lowStock': 'warning',
    'dashboard.products.status.outOfStock': 'negative',
  };

  const columns: TableColumn<ProductRow>[] = [
    {
      header: t('dashboard.products.table.name'),
      render: (row) => t(row.nameKey),
    },
    {
      header: t('dashboard.products.table.sku'),
      render: (row) => row.sku,
    },
    {
      header: t('dashboard.products.table.category'),
      render: (row) => t(row.categoryKey),
    },
    {
      header: t('dashboard.products.table.status'),
      render: (row) => (
        <span
          className={`status-pill status-pill--${statusTone[row.statusKey] ?? 'neutral'}`}
        >
          {t(row.statusKey)}
        </span>
      ),
    },
    {
      header: t('dashboard.products.table.stock'),
      align: 'right',
      render: (row) => numberFormatter.format(row.stock),
    },
    {
      header: t('dashboard.products.table.revenue'),
      align: 'right',
      render: (row) => currencyFormatter.format(row.revenue),
    },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-content-inner">
        <section className="dashboard-header">
          <h1>{t('dashboard.products.title')}</h1>
          <p>{t('dashboard.products.description')}</p>
        </section>
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>{t('dashboard.products.sections.table')}</h2>
              <p>{t('dashboard.products.sections.tableSubtitle')}</p>
            </div>
          </div>
          <Table columns={columns} rows={products} emptyMessage={t('dashboard.products.empty')} />
        </section>
        <section className="dashboard-section">
          <h2>{t('common.states.title')}</h2>
          <States />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ProductsPage;
