import { useMemo, useState } from 'react';
import { useT } from '../../hooks/useT';
import { useConsent } from '../../hooks/useConsent';
import CookieSettingsModal from './CookieSettingsModal';

const CookieBanner = () => {
  const { t } = useT();
  const { consent, acceptAll, rejectAll, savePreferences } = useConsent();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const shouldShowBanner = consent === null;
  const preferences = useMemo(
    () => ({
      analytics: consent?.analytics ?? false,
      marketing: consent?.marketing ?? false,
    }),
    [consent],
  );

  const handleSave = (next: typeof preferences) => {
    savePreferences(next);
    setIsSettingsOpen(false);
  };

  if (!shouldShowBanner && !isSettingsOpen) return null;

  return (
    <>
      {shouldShowBanner && !isSettingsOpen ? (
        <div className="cookie-banner" role="region" aria-label={t('compliance.cookies.title')}>
          <div className="container cookie-banner-inner">
            <div className="cookie-banner-content">
              <h2 className="cookie-banner-title">{t('compliance.cookies.title')}</h2>
              <p>{t('compliance.cookies.description')}</p>
            </div>
            <div className="cookie-banner-actions">
              <button type="button" className="btn-secondary" onClick={rejectAll}>
                {t('compliance.cookies.rejectAll')}
              </button>
              <button type="button" className="btn-tertiary" onClick={() => setIsSettingsOpen(true)}>
                {t('compliance.cookies.customize')}
              </button>
              <button type="button" className="btn-primary" onClick={acceptAll}>
                {t('compliance.cookies.acceptAll')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <CookieSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSave}
        preferences={preferences}
      />
    </>
  );
};

export default CookieBanner;
