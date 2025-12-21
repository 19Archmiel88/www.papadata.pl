import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../hooks/useT';
import { useTheme } from '../../hooks/useTheme';
import { paths } from '../../routes/paths';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const FixedHud = () => {
  const { t, lang, setLang } = useT();
  const { theme, toggleTheme } = useTheme();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId = 0;

    const update = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      const next = maxScroll > 0 ? scrollTop / maxScroll : 0;
      setProgress(clamp(next, 0, 1));
      frameId = 0;
    };

    const handleScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const coords = useMemo(() => {
    const x = Math.round(progress * 360);
    const y = Math.round(progress * 100);
    return `${x.toString().padStart(3, '0')}.${y.toString().padStart(2, '0')}`;
  }, [progress]);

  const density = useMemo(() => Math.round(60 + progress * 40), [progress]);

  return (
    <div className="fixed-hud">
      <div className="hud-corners" aria-hidden="true">
        <span className="hud-corner hud-corner--tl" />
        <span className="hud-corner hud-corner--tr" />
        <span className="hud-corner hud-corner--bl" />
        <span className="hud-corner hud-corner--br" />
      </div>

      <div className="hud-top hud-interactive">
        <Link to={paths.root} className="hud-brand">
          {t('nav.brand.short')}
        </Link>
        <div className="hud-controls">
          <span className="hud-status">{t('common.status.systemOnline')}</span>
          <div className="hud-lang" role="group" aria-label={t('nav.controls.lang')}>
            <button
              type="button"
              className="hud-toggle"
              aria-pressed={lang === 'pl'}
              onClick={() => setLang('pl')}
            >
              {t('shell.language.pl')}
            </button>
            <button
              type="button"
              className="hud-toggle"
              aria-pressed={lang === 'en'}
              onClick={() => setLang('en')}
            >
              {t('shell.language.en')}
            </button>
          </div>
          <button
            type="button"
            className="hud-toggle hud-theme"
            onClick={toggleTheme}
            aria-label={t('nav.controls.theme')}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? t('shell.theme.dark') : t('shell.theme.light')}
          </button>
        </div>
      </div>

      <div className="hud-side" aria-hidden="true">
        <div className="hud-stat">
          <span>{t('hud.stats.coords')}</span>
          <strong>{coords}</strong>
        </div>
        <div className="hud-stat">
          <span>{t('hud.stats.swarmDensity')}</span>
          <strong>{density}</strong>
        </div>
      </div>

      <div className="hud-scroll" aria-hidden="true">
        <span className="hud-scroll-track">
          <span className="hud-scroll-progress" style={{ height: `${progress * 100}%` }} />
        </span>
      </div>
    </div>
  );
};

export default FixedHud;
