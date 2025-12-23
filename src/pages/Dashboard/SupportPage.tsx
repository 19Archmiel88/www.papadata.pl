import { type FormEvent, useState } from 'react';
import { States } from '../../components/common/States';
import { tickets } from '../../data/mocks/tickets';
import { useT } from '../../hooks/useT';
import DashboardLayout from '../../layouts/DashboardLayout';

const SupportPage = () => {
  const { t } = useT();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const statusTone: Record<string, string> = {
    'dashboard.support.tickets.status.open': 'positive',
    'dashboard.support.tickets.status.pending': 'warning',
    'dashboard.support.tickets.status.solved': 'neutral',
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      (event.target as HTMLFormElement).reset();

      // Reset success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="dashboard-content-inner">
        <section className="dashboard-header">
          <h1>{t('dashboard.support.title')}</h1>
          <p>{t('dashboard.support.description')}</p>
        </section>
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>{t('dashboard.support.sections.contact')}</h2>
              <p>{t('dashboard.support.sections.contactSubtitle')}</p>
            </div>
            <span className="status-pill status-pill--neutral">
              {t('dashboard.support.responseTimeLabel')}: {t('dashboard.support.responseTime')}
            </span>
          </div>
          <div className="support-grid">
            <form className="support-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="support-subject">{t('dashboard.support.form.subject')}</label>
                  <input
                    id="support-subject"
                    className="input"
                    placeholder={t('dashboard.support.form.subjectPlaceholder')}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="support-category">{t('dashboard.support.form.category')}</label>
                  <select id="support-category" className="select" required>
                    <option value="">
                      {t('dashboard.support.form.categoryPlaceholder')}
                    </option>
                    <option value="billing">{t('dashboard.support.form.category.billing')}</option>
                    <option value="technical">
                      {t('dashboard.support.form.category.technical')}
                    </option>
                    <option value="access">{t('dashboard.support.form.category.access')}</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="support-priority">{t('dashboard.support.form.priority')}</label>
                  <select id="support-priority" className="select" required>
                    <option value="">
                      {t('dashboard.support.form.priorityPlaceholder')}
                    </option>
                    <option value="high">{t('dashboard.support.tickets.priority.high')}</option>
                    <option value="medium">{t('dashboard.support.tickets.priority.medium')}</option>
                    <option value="low">{t('dashboard.support.tickets.priority.low')}</option>
                  </select>
                </div>
                <div className="form-field form-field--full">
                  <label htmlFor="support-message">{t('dashboard.support.form.message')}</label>
                  <textarea
                    id="support-message"
                    className="textarea"
                    placeholder={t('dashboard.support.form.messagePlaceholder')}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting || isSuccess}
                aria-disabled={isSubmitting || isSuccess}
              >
                {isSubmitting
                  ? t('dashboard.support.form.sending')
                  : isSuccess
                    ? t('dashboard.support.form.success')
                    : t('dashboard.support.form.cta')}
              </button>
            </form>
            <div className="support-panel">
              <div className="section-header section-header--tight">
                <div>
                  <h3>{t('dashboard.support.tickets.title')}</h3>
                  <p>{t('dashboard.support.tickets.subtitle')}</p>
                </div>
              </div>
              <div className="ticket-list">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="ticket-card">
                    <div className="ticket-card-header">
                      <div>
                        <h4>{t(ticket.subjectKey)}</h4>
                        <p>{t(ticket.channelKey)}</p>
                      </div>
                      <span
                        className={`status-pill status-pill--${
                          statusTone[ticket.statusKey] ?? 'neutral'
                        }`}
                      >
                        {t(ticket.statusKey)}
                      </span>
                    </div>
                    <div className="ticket-meta">
                      <span>
                        {t('dashboard.support.tickets.priorityLabel')}:{' '}
                        {t(ticket.priorityKey)}
                      </span>
                      <span>
                        {t('dashboard.support.tickets.updatedLabel')}: {ticket.updated}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

export default SupportPage;
