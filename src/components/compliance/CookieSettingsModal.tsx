import { useEffect, useRef, useState, type FormEvent } from 'react';
import Modal from '../common/Modal';
import { useT } from '../../hooks/useT';
import type { ConsentPreferences } from '../../contexts/ConsentContext';

type CookieSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: ConsentPreferences) => void;
  preferences: ConsentPreferences;
};

const CookieSettingsModal = ({
  isOpen,
  onClose,
  onSave,
  preferences,
}: CookieSettingsModalProps) => {
  const { t } = useT();
  const [analytics, setAnalytics] = useState(preferences.analytics);
  const [marketing, setMarketing] = useState(preferences.marketing);
  const analyticsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setAnalytics(preferences.analytics);
    setMarketing(preferences.marketing);
  }, [isOpen, preferences.analytics, preferences.marketing]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({ analytics, marketing });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('compliance.cookies.settingsTitle')}
      initialFocusRef={analyticsRef}
    >
      <form className="cookie-settings" onSubmit={handleSubmit}>
        <div className="cookie-settings-grid">
          <label className="cookie-setting">
            <input type="checkbox" checked disabled />
            <span>{t('compliance.cookies.categories.necessary')}</span>
          </label>
          <label className="cookie-setting">
            <input
              ref={analyticsRef}
              type="checkbox"
              checked={analytics}
              onChange={(event) => setAnalytics(event.target.checked)}
            />
            <span>{t('compliance.cookies.categories.analytics')}</span>
          </label>
          <label className="cookie-setting">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(event) => setMarketing(event.target.checked)}
            />
            <span>{t('compliance.cookies.categories.marketing')}</span>
          </label>
        </div>
        <div className="cookie-settings-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            {t('compliance.cookies.close')}
          </button>
          <button type="submit" className="btn-primary">
            {t('compliance.cookies.save')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CookieSettingsModal;
