export type WebVitalName = 'CLS' | 'LCP' | 'INP' | 'TTFB';

export type WebVitalMetric = {
  name: WebVitalName;
  value: number;
};

type ReportCallback = (metric: WebVitalMetric) => void;

let initialized = false;

type LcpEntry = PerformanceEntry & { startTime: number };

type LayoutShiftEntry = PerformanceEntry & {
  value?: number;
  hadRecentInput?: boolean;
};

type PerformanceEventTimingEntry = PerformanceEntry & {
  duration?: number;
  interactionId?: number;
};

const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

/**
 * CLS per Web Vitals: session windows (max 5s, max 1s gap),
 * take the max window score.
 */
const createClsAccumulator = () => {
  let sessionValue = 0;
  let sessionStart = 0;
  let sessionLast = 0;
  let maxSessionValue = 0;

  const push = (entry: LayoutShiftEntry) => {
    const v = entry.value ?? 0;
    const t = entry.startTime ?? 0;

    // Start new session window if:
    // - first entry
    // - gap > 1s
    // - window length > 5s
    const isNewSession =
      sessionStart === 0 || t - sessionLast > 1000 || t - sessionStart > 5000;

    if (isNewSession) {
      sessionValue = v;
      sessionStart = t;
      sessionLast = t;
    } else {
      sessionValue += v;
      sessionLast = t;
    }

    if (sessionValue > maxSessionValue) {
      maxSessionValue = sessionValue;
    }
  };

  const get = () => maxSessionValue;

  return { push, get };
};

/**
 * INP per Web Vitals:
 * - observe "event" entries (PerformanceEventTiming)
 * - take the max duration among entries with interactionId > 0
 * (Good enough approximation for typical telemetry; mirrors common lightweight implementations.)
 */
const createInpAccumulator = () => {
  let maxDuration = 0;

  const push = (entry: PerformanceEventTimingEntry) => {
    const id = entry.interactionId ?? 0;
    const dur = entry.duration ?? 0;
    if (id > 0 && dur > maxDuration) {
      maxDuration = dur;
    }
  };

  const get = () => maxDuration;

  return { push, get };
};

export const initWebVitals = (report: ReportCallback) => {
  if (initialized) return;
  initialized = true;

  if (
    typeof window === 'undefined' ||
    typeof PerformanceObserver === 'undefined' ||
    typeof performance === 'undefined'
  ) {
    return;
  }

  const clsAcc = createClsAccumulator();
  const inpAcc = createInpAccumulator();

  let lcp = 0;

  // Observers
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries() as LcpEntry[];
    const last = entries[entries.length - 1];
    if (last) {
      lcp = last.startTime;
    }
  });

  const clsObserver = new PerformanceObserver((list) => {
    for (const e of list.getEntries() as LayoutShiftEntry[]) {
      // ignore shifts caused by user input
      if (!e.hadRecentInput) {
        clsAcc.push(e);
      }
    }
  });

  const inpObserver = new PerformanceObserver((list) => {
    for (const e of list.getEntries() as PerformanceEventTimingEntry[]) {
      inpAcc.push(e);
    }
  });

  // Safely attach observers (some browsers throw on unsupported entry types)
  try {
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {
    lcpObserver.disconnect();
  }

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch {
    clsObserver.disconnect();
  }

  // INP: PerformanceEventTiming. durationThreshold filters out very short events.
  try {
    const inpObserverOptions: PerformanceObserverInit & {
      durationThreshold?: number;
    } = {
      type: 'event',
      buffered: true,
      durationThreshold: 40,
    };
    inpObserver.observe(inpObserverOptions);
  } catch {
    inpObserver.disconnect();
  }

  const reportVitals = () => {
    // LCP (ms)
    if (lcp > 0) {
      report({ name: 'LCP', value: Math.round(lcp) });
    }

    // CLS (unitless)
    const cls = clsAcc.get();
    if (cls > 0) {
      report({ name: 'CLS', value: Number(cls.toFixed(4)) });
    }

    // INP (ms)
    const inp = inpAcc.get();
    if (inp > 0) {
      report({ name: 'INP', value: Math.round(inp) });
    }

    // TTFB (ms) from Navigation Timing
    const navEntry = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;

    if (navEntry) {
      // responseStart - requestStart is a common approximation
      const ttfb = navEntry.responseStart - navEntry.requestStart;
      if (Number.isFinite(ttfb) && ttfb >= 0) {
        report({ name: 'TTFB', value: Math.round(ttfb) });
      }
    }
  };

  const disconnectAll = () => {
    lcpObserver.disconnect();
    clsObserver.disconnect();
    inpObserver.disconnect();
  };

  const flush = () => {
    reportVitals();
    disconnectAll();
    window.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pagehide', onPageHide as any);
    window.removeEventListener('pageshow', onPageShow as any);
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      flush();
    }
  };

  const onPageHide = () => {
    flush();
  };

  /**
   * BFCache: when a page is restored from the back/forward cache,
   * some metrics may behave unexpectedly. We re-init a lightweight flush-on-hide.
   * (We don't re-register observers here to avoid double-reporting; init is one-shot.)
   */
  const onPageShow = (event: PageTransitionEvent) => {
    if (event.persisted) {
      // We can still flush if user leaves again; keep listeners consistent.
      // No-op beyond ensuring we won't crash on BFCache restores.
      void now();
    }
  };

  window.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);
};
