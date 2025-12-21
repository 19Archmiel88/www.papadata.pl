import { Link } from 'react-router-dom';
import { StateCard } from '../../../components/common/States';
import { useT } from '../../../hooks/useT';
import { paths } from '../../../routes/paths';
import VertexPlayerSection from './VertexPlayerSection';

type HeroSectionProps = {
  demoState?: 'loading' | 'empty' | 'error' | 'offline' | null;
};

const renderHighlightedText = (value: string) => {
  const parts = value.split(/(\[.*?\])/g);
  return parts.map((part, index) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return (
        <span key={`${part}-${index}`} className="hero-highlight">
          {part.slice(1, -1)}
        </span>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
};

const HeroSection = ({ demoState }: HeroSectionProps) => {
  const { t } = useT();

  return (
    <section id="hero" className="landing-section landing-hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="hero-trust">{t('landing.hero.trust')}</span>
          <h1 className="hero-title">{renderHighlightedText(t('landing.hero.title'))}</h1>
          <p className="hero-subtitle">{t('landing.hero.subtitle')}</p>
          <div className="hero-actions">
            <Link className="btn-primary" to={`${paths.root}#pricing`}>
              {t('landing.hero.cta.primary')}
            </Link>
            <Link className="btn-secondary" to={paths.dashboard}>
              {t('landing.hero.cta.secondary')}
            </Link>
          </div>
          <div className="hero-pills">
            <span className="hero-pill">{t('landing.hero.pill.one')}</span>
            <span className="hero-pill">{t('landing.hero.pill.two')}</span>
          </div>
        </div>
        <div className="hero-player">
          {demoState ? (
            <div className="section-state">
              <StateCard kind={demoState} />
            </div>
          ) : (
            <VertexPlayerSection />
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
