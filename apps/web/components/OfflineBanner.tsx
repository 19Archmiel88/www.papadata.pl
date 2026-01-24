import React from 'react';
import { useUI } from '../context/useUI';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { InteractiveButton } from './InteractiveButton';

export const OfflineBanner: React.FC = () => {
  const { t } = useUI();
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[1200] w-[calc(100%-1.5rem)] max-w-3xl">
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-200 shadow-xl"
        role="status"
        aria-live="polite"
      >
        <div className="text-center sm:text-left">
          <div className="text-xs font-black uppercase tracking-widest">
            {t.dashboard.widget.offline_title}
          </div>
          <div className="text-xs-plus font-medium">{t.dashboard.widget.offline_desc}</div>
        </div>
        <InteractiveButton
          variant="secondary"
          className="!h-9 !px-5 !text-2xs font-black uppercase tracking-widest"
          onClick={() => window.location.reload()}
        >
          {t.dashboard.widget.cta_retry}
        </InteractiveButton>
      </div>
    </div>
  );
};

export default OfflineBanner;
