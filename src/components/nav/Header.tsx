import { Link } from 'react-router-dom';
import { useT } from '../../hooks/useT';
import { useTheme } from '../../hooks/useTheme';
import { paths } from '../../routes/paths';

const Header = () => {
  const { t, lang, setLang } = useT();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="shell-header">
      <div className="container header-inner">
        <Link to={paths.root} className="brand">
          {t('shell.brand')}
        </Link>
        <nav className="header-nav" aria-label={t('nav.mainLabel')}>
          <Link className="nav-link" to={`${paths.root}#features`}>
            {t('nav.features')}
          </Link>
          <Link className="nav-link" to={`${paths.root}#pipeline`}>
            {t('nav.pipeline')}
          </Link>
          <Link className="nav-link" to={`${paths.root}#pricing`}>
            {t('nav.pricing')}
          </Link>
          <Link className="nav-link" to={`${paths.root}#integrations`}>
            {t('nav.integrations')}
          </Link>
          <Link className="nav-link" to={`${paths.root}#faq`}>
            {t('nav.faq')}
          </Link>
          <Link className="nav-link" to={`${paths.root}#resources`}>
            {t('nav.resources')}
          </Link>
        </nav>
        <div className="header-actions">
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
          <Link to={paths.dashboard} className="btn-secondary">
            {t('nav.login')}
          </Link>
          <Link to={paths.dashboard} className="btn-primary">
            {t('nav.demo')}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
