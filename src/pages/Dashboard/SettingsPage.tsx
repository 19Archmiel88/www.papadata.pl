import { useState, type FormEvent } from 'react';
import { States } from '../../components/common/States';
import Table, { type TableColumn } from '../../components/dashboard/Table';
import { invoices, type Invoice } from '../../data/mocks/invoices';
import { teamMembers, type TeamMember } from '../../data/mocks/team';
import { useT } from '../../hooks/useT';
import DashboardLayout from '../../layouts/DashboardLayout';

type SettingsTab = 'profile' | 'company' | 'notifications' | 'team' | 'billing';

const SettingsPage = () => {
  const { t, lang } = useT();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const locale = lang === 'pl' ? 'pl-PL' : 'en-US';
  const currency = t('dashboard.currency');
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const tabOptions: Array<{ id: SettingsTab; labelKey: string }> = [
    { id: 'profile', labelKey: 'dashboard.settings.tabs.profile' },
    { id: 'company', labelKey: 'dashboard.settings.tabs.company' },
    { id: 'notifications', labelKey: 'dashboard.settings.tabs.notifications' },
    { id: 'team', labelKey: 'dashboard.settings.tabs.team' },
    { id: 'billing', labelKey: 'dashboard.settings.tabs.billing' },
  ];

  const teamStatusTone: Record<string, string> = {
    'dashboard.team.status.active': 'positive',
    'dashboard.team.status.invited': 'neutral',
  };

  const teamColumns: TableColumn<TeamMember>[] = [
    {
      header: t('dashboard.team.table.name'),
      render: (row) => t(row.nameKey),
    },
    {
      header: t('dashboard.team.table.role'),
      render: (row) => t(row.roleKey),
    },
    {
      header: t('dashboard.team.table.email'),
      render: (row) => row.email,
    },
    {
      header: t('dashboard.team.table.status'),
      render: (row) => (
        <span
          className={`status-pill status-pill--${teamStatusTone[row.statusKey] ?? 'neutral'}`}
        >
          {t(row.statusKey)}
        </span>
      ),
    },
  ];

  const billingStatusTone: Record<string, string> = {
    'dashboard.billing.status.paid': 'positive',
    'dashboard.billing.status.processing': 'warning',
    'dashboard.billing.status.overdue': 'negative',
  };

  const invoiceColumns: TableColumn<Invoice>[] = [
    {
      header: t('dashboard.billing.table.number'),
      render: (row) => row.number,
    },
    {
      header: t('dashboard.billing.table.status'),
      render: (row) => (
        <span
          className={`status-pill status-pill--${
            billingStatusTone[row.statusKey] ?? 'neutral'
          }`}
        >
          {t(row.statusKey)}
        </span>
      ),
    },
    {
      header: t('dashboard.billing.table.amount'),
      align: 'right',
      render: (row) => currencyFormatter.format(row.amount),
    },
    {
      header: t('dashboard.billing.table.issued'),
      align: 'right',
      render: (row) => row.issued,
    },
    {
      header: t('dashboard.billing.table.due'),
      align: 'right',
      render: (row) => row.due,
    },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-content-inner">
        <section className="dashboard-header">
          <h1>{t('dashboard.settings.title')}</h1>
          <p>{t('dashboard.settings.description')}</p>
        </section>
        <section className="dashboard-section">
          <div className="tabs" role="tablist" aria-label={t('dashboard.settings.tabs.label')}>
            {tabOptions.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
          {activeTab === 'profile' ? (
            <form className="settings-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="profile-name">{t('dashboard.settings.profile.name')}</label>
                  <input
                    id="profile-name"
                    className="input"
                    placeholder={t('dashboard.settings.profile.namePlaceholder')}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="profile-email">{t('dashboard.settings.profile.email')}</label>
                  <input
                    id="profile-email"
                    className="input"
                    type="email"
                    placeholder={t('dashboard.settings.profile.emailPlaceholder')}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="profile-role">{t('dashboard.settings.profile.role')}</label>
                  <input
                    id="profile-role"
                    className="input"
                    placeholder={t('dashboard.settings.profile.rolePlaceholder')}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="profile-timezone">
                    {t('dashboard.settings.profile.timezone')}
                  </label>
                  <input
                    id="profile-timezone"
                    className="input"
                    placeholder={t('dashboard.settings.profile.timezonePlaceholder')}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">
                {t('dashboard.settings.profile.cta')}
              </button>
            </form>
          ) : null}
          {activeTab === 'company' ? (
            <form className="settings-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="company-name">{t('dashboard.settings.company.name')}</label>
                  <input
                    id="company-name"
                    className="input"
                    placeholder={t('dashboard.settings.company.namePlaceholder')}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="company-domain">
                    {t('dashboard.settings.company.domain')}
                  </label>
                  <input
                    id="company-domain"
                    className="input"
                    placeholder={t('dashboard.settings.company.domainPlaceholder')}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="company-size">{t('dashboard.settings.company.size')}</label>
                  <select id="company-size" className="select" required>
                    <option value="">
                      {t('dashboard.settings.company.sizePlaceholder')}
                    </option>
                    <option value="small">{t('dashboard.settings.company.size.small')}</option>
                    <option value="mid">{t('dashboard.settings.company.size.mid')}</option>
                    <option value="enterprise">
                      {t('dashboard.settings.company.size.enterprise')}
                    </option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="company-industry">
                    {t('dashboard.settings.company.industry')}
                  </label>
                  <input
                    id="company-industry"
                    className="input"
                    placeholder={t('dashboard.settings.company.industryPlaceholder')}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">
                {t('dashboard.settings.company.cta')}
              </button>
            </form>
          ) : null}
          {activeTab === 'notifications' ? (
            <div className="settings-form">
              <div className="form-grid">
                <label className="checkbox-row">
                  <input type="checkbox" defaultChecked />
                  <span>{t('dashboard.settings.notifications.email')}</span>
                </label>
                <label className="checkbox-row">
                  <input type="checkbox" />
                  <span>{t('dashboard.settings.notifications.product')}</span>
                </label>
                <label className="checkbox-row">
                  <input type="checkbox" />
                  <span>{t('dashboard.settings.notifications.security')}</span>
                </label>
                <div className="form-field">
                  <label htmlFor="notifications-digest">
                    {t('dashboard.settings.notifications.digest')}
                  </label>
                  <select id="notifications-digest" className="select">
                    <option value="daily">{t('dashboard.settings.notifications.digest.daily')}</option>
                    <option value="weekly">
                      {t('dashboard.settings.notifications.digest.weekly')}
                    </option>
                    <option value="monthly">
                      {t('dashboard.settings.notifications.digest.monthly')}
                    </option>
                  </select>
                </div>
              </div>
              <button type="button" className="btn-primary">
                {t('dashboard.settings.notifications.cta')}
              </button>
            </div>
          ) : null}
          {activeTab === 'team' ? (
            <div className="settings-form">
              <div className="section-header section-header--tight">
                <div>
                  <h3>{t('dashboard.team.title')}</h3>
                  <p>{t('dashboard.team.subtitle')}</p>
                </div>
                <button type="button" className="btn-secondary">
                  {t('dashboard.team.cta')}
                </button>
              </div>
              <Table columns={teamColumns} rows={teamMembers} emptyMessage={t('dashboard.team.empty')} />
            </div>
          ) : null}
          {activeTab === 'billing' ? (
            <div className="settings-form">
              <div className="billing-grid">
                <div className="billing-card">
                  <h3>{t('dashboard.billing.currentPlan')}</h3>
                  <p className="billing-plan">{t('landing.pricing.tiers.scale.name')}</p>
                  <p>{t('dashboard.billing.planDescription')}</p>
                </div>
                <div className="billing-card">
                  <h3>{t('dashboard.billing.nextBilling')}</h3>
                  <p>{t('dashboard.billing.nextBillingDate', { date: '2024-09-01' })}</p>
                  <p>{t('dashboard.billing.paymentMethod')}</p>
                </div>
              </div>
              <div className="section-header section-header--tight">
                <div>
                  <h3>{t('dashboard.billing.invoices')}</h3>
                  <p>{t('dashboard.billing.invoicesSubtitle')}</p>
                </div>
              </div>
              <Table
                columns={invoiceColumns}
                rows={invoices}
                emptyMessage={t('dashboard.billing.empty')}
              />
            </div>
          ) : null}
        </section>
        <section className="dashboard-section">
          <h2>{t('common.states.title')}</h2>
          <States />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
