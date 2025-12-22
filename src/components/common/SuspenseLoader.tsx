import { useT } from '../../hooks/useT';

const SuspenseLoader = () => {
  const { t } = useT();
  return (
    <div className="init-loader" role="status" aria-live="polite">
      <div className="init-loader__panel">
        <span className="init-loader__label">{t('common.loader.loading')}</span>
        <div className="loading-spinner" />
      </div>
    </div>
  );
};

export default SuspenseLoader;
