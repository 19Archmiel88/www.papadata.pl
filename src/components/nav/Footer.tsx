import { Link } from 'react-router-dom';
import { useT } from '../../hooks/useT';
import { paths } from '../../routes/paths';

const Footer = () => {
  const { t } = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="shell-footer" id="footer">
      <div className="container footer-grid">
        <div className="footer-column">
          <Link to={paths.root} className="brand">
            {t('shell.brand')}
          </Link>
          <p>{t('footer.description')}</p>
          <p>{t('footer.tagline')}</p>
          <div className="footer-status">
            <span>{t('footer.status.label')}</span>
            <span>{t('footer.status.value')}</span>
          </div>
        </div>
        <div className="footer-column">
          <h3>{t('footer.column.product')}</h3>
          <ul className="footer-links">
            <li>
              <Link className="nav-link" to={`${paths.root}#features`}>
                {t('nav.features')}
              </Link>
            </li>
            <li>
              <Link className="nav-link" to={`${paths.root}#integrations`}>
                {t('nav.integrations')}
              </Link>
            </li>
            <li>
              <Link className="nav-link" to={`${paths.root}#pricing`}>
                {t('nav.pricing')}
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>{t('footer.column.company')}</h3>
          <ul className="footer-links">
            <li>
              <Link className="nav-link" to={`${paths.root}#about`}>
                {t('nav.about')}
              </Link>
            </li>
            <li>
              <Link className="nav-link" to={`${paths.root}#resources`}>
                {t('nav.knowledgeBase')}
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>{t('footer.column.resources')}</h3>
          <ul className="footer-links">
            <li>
              <Link className="nav-link" to={`${paths.root}#resources`}>
                {t('nav.resources')}
              </Link>
            </li>
            <li>
              <Link className="nav-link" to={`${paths.root}#resources`}>
                {t('footer.link.apiDocs')}
              </Link>
            </li>
            <li>
              <Link className="nav-link" to={`${paths.root}#resources`}>
                {t('footer.link.changelog')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-legal">
        <Link to={paths.legalTerms}>{t('legal.terms.title')}</Link>
        <Link to={paths.legalPrivacy}>{t('legal.privacy.title')}</Link>
        <Link to={paths.legalCookies}>{t('legal.cookies.title')}</Link>
        <Link to={paths.legalDpa}>{t('legal.dpa.title')}</Link>
        <Link to={paths.legalAi}>{t('legal.ai.title')}</Link>
        <Link to={paths.legalAccessibility}>{t('legal.accessibility.title')}</Link>
      </div>
      <div className="container footer-meta">
        <span>{t('footer.rights', { year })}</span>
      </div>
    </footer>
  );
};

export default Footer;
