import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface AutoRotateOptions {
  itemCount: number;
  intervalMs: number;
  isDisabled?: boolean;
  /**
   * If true, when the user manually changes the index we stop autoplay until you explicitly call setAuto().
   * Default: true (more predictable for product tours).
   */
  lockOnUserInteraction?: boolean;
  /**
   * Optional callback for analytics/telemetry.
   */
  onChange?: (
    index: number,
    meta: { reason: 'auto' | 'manual' | 'next' | 'prev' | 'reset' | 'clamp' }
  ) => void;
}

/**
 * useVertexAutoRotate
 * Manages cyclic state transitions for product tours/players.
 * Auto-rotation can pause/resume, and can be "taken over" by the user with an option to return to autoplay.
 */
export const useVertexAutoRotate = ({
  itemCount,
  intervalMs,
  isDisabled,
  lockOnUserInteraction = true,
  onChange,
}: AutoRotateOptions) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isUserControlled, setIsUserControlled] = useState(false);

  const timerRef = useRef<number | null>(null);

  const hasItems = itemCount > 0;
  const canAutoRotate = useMemo(() => {
    if (isDisabled) return false;
    if (isPaused) return false;
    if (!hasItems || itemCount <= 1) return false;
    if (intervalMs <= 0) return false;
    if (lockOnUserInteraction && isUserControlled) return false;
    return true;
  }, [
    hasItems,
    intervalMs,
    isDisabled,
    isPaused,
    isUserControlled,
    itemCount,
    lockOnUserInteraction,
  ]);

  const clampIndex = useCallback(
    (value: number) => {
      if (!hasItems) return 0;
      const max = itemCount - 1;
      if (value < 0) return 0;
      if (value > max) return max;
      return value;
    },
    [hasItems, itemCount]
  );

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setIndexWithMeta = useCallback(
    (nextIndex: number, reason: 'auto' | 'manual' | 'next' | 'prev' | 'reset' | 'clamp') => {
      setIndex((prev) => {
        const clamped = clampIndex(nextIndex);
        // Avoid noisy onChange when nothing changes.
        if (clamped !== prev) {
          onChange?.(clamped, { reason });
        }
        return clamped;
      });
    },
    [clampIndex, onChange]
  );

  // Keep index valid when itemCount changes.
  useEffect(() => {
    if (!hasItems) {
      // No items -> always index 0
      setIndex(0);
      return;
    }
    const clamped = clampIndex(index);
    if (clamped !== index) {
      // Direct set to avoid double clamp via setIndexWithMeta
      setIndex(clamped);
      onChange?.(clamped, { reason: 'clamp' });
    }
  }, [itemCount, hasItems, clampIndex, index, onChange]);

  // Autoplay loop (recursive timeout to avoid interval drift).
  useEffect(() => {
    clearTimer();
    if (!canAutoRotate) return;

    const tick = () => {
      timerRef.current = window.setTimeout(() => {
        setIndex((prev) => {
          const next = hasItems ? (prev + 1) % itemCount : 0;
          if (next !== prev) onChange?.(next, { reason: 'auto' });
          return next;
        });
        tick();
      }, intervalMs);
    };

    tick();

    return () => clearTimer();
  }, [canAutoRotate, clearTimer, hasItems, intervalMs, itemCount, onChange]);

  const setManualIndex = useCallback(
    (newIndex: number) => {
      setIsUserControlled(true);
      setIndexWithMeta(newIndex, 'manual');
    },
    [setIndexWithMeta]
  );

  const next = useCallback(() => {
    setIsUserControlled(true);
    setIndex((prev) => {
      const nextIndex = hasItems ? (prev + 1) % itemCount : 0;
      if (nextIndex !== prev) onChange?.(nextIndex, { reason: 'next' });
      return nextIndex;
    });
  }, [hasItems, itemCount, onChange]);

  const prev = useCallback(() => {
    setIsUserControlled(true);
    setIndex((prev) => {
      if (!hasItems) return 0;
      const nextIndex = (prev - 1 + itemCount) % itemCount;
      if (nextIndex !== prev) onChange?.(nextIndex, { reason: 'prev' });
      return nextIndex;
    });
  }, [hasItems, itemCount, onChange]);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  /**
   * Return control back to autoplay (if enabled by other conditions).
   */
  const setAuto = useCallback(() => {
    setIsUserControlled(false);
  }, []);

  const reset = useCallback(() => {
    setIsPaused(false);
    setIsUserControlled(false);
    setIndexWithMeta(0, 'reset');
  }, [setIndexWithMeta]);

  return {
    index,

    // Direct control
    setManualIndex,
    next,
    prev,

    // Autoplay control
    pause,
    resume,
    setAuto,
    reset,

    // State flags
    isUserControlled,
    isPaused,
    canAutoRotate,
  };
};
