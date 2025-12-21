import { NavLink } from 'react-router-dom';
import { useT } from '../../hooks/useT';
import { paths } from '../../routes/paths';

const Sidebar = () => {
  const { t } = useT();

  return (
    <aside className="dashboard-sidebar" aria-label={t('dashboard.sidebar.label')}>
      <span className="brand">{t('shell.brand')}</span>
      <nav>
        <ul className="sidebar-nav">
          <li>
            <NavLink
              to={paths.dashboardOverview}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              {t('dashboard.sidebar.overview')}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={paths.dashboardAnalytics}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              {t('dashboard.sidebar.analytics')}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={paths.dashboardReports}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              {t('dashboard.sidebar.reports')}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={paths.dashboardCustomers}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              {t('dashboard.sidebar.customers')}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={paths.dashboardProducts}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              {t('dashboard.sidebar.products')}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={paths.dashboardIntegrations}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              {t('dashboard.sidebar.integrations')}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={paths.dashboardSupport}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              {t('dashboard.sidebar.support')}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={paths.dashboardSettings}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              {t('dashboard.sidebar.settings')}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
