import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useT } from '../../hooks/useT';
import { useTheme } from '../../hooks/useTheme';
import { paths } from '../../routes/paths';

type TopbarProps = {
  onOpenAiDrawer: () => void;
};

const Topbar = ({ onOpenAiDrawer }: TopbarProps) => {
  const { t, lang, setLang } = useT();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate(paths.login, { replace: true });
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <span className="badge">
          {isAuthenticated
            ? user?.orgName ?? user?.name ?? t('nav.brand.short')
            : t('dashboard.demo.badge')}
        </span>
        <span>{t('dashboard.topbar.dateRange')}</span>
      </div>
      <div className="topbar-right">
        <button
          type="button"
          className="btn-secondary"
          onClick={onOpenAiDrawer}
          aria-haspopup="dialog"
          aria-controls="ai-drawer"
        >
          {t('dashboard.topbar.aiAssistant')}
        </button>
        <div className="toggle-group" role="group" aria-label={t('shell.language.label')}>
          <button
            type="button"
            className="toggle-button"
            aria-pressed={lang === 'pl'}
            onClick={() => setLang('pl')}
          >
            {t('shell.language.pl')}
          </button>
          <button
            type="button"
            className="toggle-button"
            aria-pressed={lang === 'en'}
            onClick={() => setLang('en')}
          >
            {t('shell.language.en')}
          </button>
        </div>
        <button
          type="button"
          className="btn-tertiary"
          onClick={toggleTheme}
          aria-label={t('shell.theme.toggle')}
          aria-pressed={theme === 'dark'}
        >
          {theme === 'dark' ? t('shell.theme.dark') : t('shell.theme.light')}
        </button>
        {isAuthenticated ? (
          <div className="topbar-account" ref={menuRef}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              {user?.name ?? t('nav.brand.short')}
              <span aria-hidden="true">▾</span>
            </button>
            {menuOpen && (
              <div className="account-menu" role="menu">
                <button
                  type="button"
                  className="account-menu-item"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(paths.dashboardOverview);
                  }}
                  role="menuitem"
                >
                  {t('dashboard.settings.tabs.profile')}
                </button>
                <button
                  type="button"
                  className="account-menu-item"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(paths.dashboardSettings);
                  }}
                  role="menuitem"
                >
                  {t('dashboard.sidebar.settings')}
                </button>
                <button type="button" className="account-menu-item" onClick={handleLogout} role="menuitem">
                  {t('nav.cta.logout')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="topbar-guest">
            <Link to={paths.login} className="btn-tertiary">
              {t('nav.cta.login')}
            </Link>
            <Link to={paths.signup} className="btn-primary">
              {t('nav.cta.signup')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
