import { useEffect, useRef, useState } from 'react';

export interface InViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
  enabled?: boolean;
  initialInView?: boolean;
}

/**
 * useInView Hook
 * Efficiently detects when an element enters the viewport.
 *
 * - SSR-safe
 * - Works with any Element (generic)
 * - Optional fallback when IntersectionObserver isn't available
 */
export const useInView = <T extends Element = HTMLDivElement>(
  options: InViewOptions = {}
): [React.RefObject<T | null>, boolean] => {
  const {
    threshold = 0.1,
    rootMargin = '200px',
    root = null,
    triggerOnce = true,
    enabled = true,
    initialInView = false,
  } = options;

  const [isInView, setIsInView] = useState<boolean>(initialInView);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // SSR guard
    if (typeof window === 'undefined') return;

    const element = ref.current;
    if (!element) return;

    // Fallback: if IntersectionObserver is not supported, assume visible
    if (!('IntersectionObserver' in window)) {
      setIsInView((prev) => (prev ? prev : true));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const next = Boolean(entry?.isIntersecting);

        setIsInView((prev) => {
          // Avoid redundant state updates / rerenders
          if (prev === next) return prev;
          return next;
        });

        if (next && triggerOnce) {
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin, root }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, root, triggerOnce, enabled]);

  return [ref, isInView];
};

type IdleCallbackHandle = number;

type RequestIdleCallback = (
  callback: (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void,
  options?: { timeout?: number }
) => IdleCallbackHandle;

type CancelIdleCallback = (handle: IdleCallbackHandle) => void;

export interface IdleLoadOptions {
  timeout?: number; // requestIdleCallback timeout (ms)
  fallbackDelay?: number; // setTimeout delay when requestIdleCallback is unavailable (ms)
  enabled?: boolean;
}

/**
 * useIdleLoad Hook
 * Defers heavy tasks until the browser is idle to keep LCP/FID low.
 *
 * - SSR-safe
 * - Uses a ref to keep the latest callback without re-scheduling on every render
 */
export const useIdleLoad = (callback: () => void, options: IdleLoadOptions = {}) => {
  const { timeout = 2000, fallbackDelay = 1000, enabled = true } = options;

  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    // SSR guard
    if (typeof window === 'undefined') return;

    const w = window as unknown as {
      requestIdleCallback?: RequestIdleCallback;
      cancelIdleCallback?: CancelIdleCallback;
    };

    if (typeof w.requestIdleCallback === 'function' && typeof w.cancelIdleCallback === 'function') {
      const handle = w.requestIdleCallback(
        () => {
          cbRef.current();
        },
        { timeout }
      );

      return () => {
        w.cancelIdleCallback?.(handle);
      };
    }

    const handle = window.setTimeout(() => {
      cbRef.current();
    }, fallbackDelay);

    return () => {
      window.clearTimeout(handle);
    };
  }, [timeout, fallbackDelay, enabled]);
};
