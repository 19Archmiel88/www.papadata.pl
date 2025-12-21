import { useEffect, useRef, useState } from 'react';
import { useT } from '../../hooks/useT';

const InitLoader = () => {
  const { t } = useT();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReduced ? 400 : 1200;
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const next = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(next);
      if (next < 100) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }
      timeoutRef.current = window.setTimeout(() => setIsVisible(false), 350);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="init-loader" role="status" aria-live="polite">
      <div className="init-loader__panel">
        <span className="init-loader__label">{t('common.loader.initializingSwarm')}</span>
        <div
          className="init-loader__bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <span className="init-loader__bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default InitLoader;
