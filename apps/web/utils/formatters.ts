const formatterCache = new Map<string, Intl.NumberFormat>();

const DEFAULT_CACHE_LIMIT = 200;

const stableStringify = (value: unknown): string => {
  const seen = new WeakSet<object>();

  const inner = (v: unknown): unknown => {
    if (v === null) return null;

    const t = typeof v;

    if (t === 'string' || t === 'number' || t === 'boolean') return v;
    if (t === 'undefined') return '__undefined__';
    if (t === 'bigint') return `__bigint__:${String(v)}`;
    if (t === 'symbol') return `__symbol__:${String(v)}`;
    if (t === 'function') return '__function__';

    if (Array.isArray(v)) return v.map(inner);

    if (t === 'object') {
      const obj = v as Record<string, unknown>;
      if (seen.has(obj)) return '__circular__';
      seen.add(obj);

      const keys = Object.keys(obj).sort();
      const out: Record<string, unknown> = {};
      for (const k of keys) out[k] = inner(obj[k]);

      return out;
    }

    return String(v);
  };

  return JSON.stringify(inner(value));
};

const buildKey = (locale: string, options?: Intl.NumberFormatOptions) =>
  `${locale}:${stableStringify(options ?? {})}`;

const setCache = (key: string, formatter: Intl.NumberFormat, limit: number) => {
  // LRU-lite: refresh key order and cap size
  if (formatterCache.has(key)) formatterCache.delete(key);
  formatterCache.set(key, formatter);

  while (formatterCache.size > limit) {
    const oldestKey = formatterCache.keys().next().value as string | undefined;
    if (!oldestKey) break;
    formatterCache.delete(oldestKey);
  }
};

export const getNumberFormatter = (
  locale: string,
  options: Intl.NumberFormatOptions = {},
  cacheLimit: number = DEFAULT_CACHE_LIMIT,
) => {
  const key = buildKey(locale, options);

  const cached = formatterCache.get(key);
  if (cached) {
    // refresh key order for LRU-lite behavior
    formatterCache.delete(key);
    formatterCache.set(key, cached);
    return cached;
  }

  const formatter = new Intl.NumberFormat(locale, options);
  setCache(key, formatter, cacheLimit);
  return formatter;
};

export const formatNumber = (
  value: number,
  locale: string,
  options: Intl.NumberFormatOptions = {},
  fallback: string = '—',
) => {
  if (!Number.isFinite(value)) return fallback;
  return getNumberFormatter(locale, options).format(value);
};

export const formatPercent = (
  value: number,
  locale: string,
  maximumFractionDigits = 1,
  fallback: string = '—',
) => {
  // Intl percent expects fraction: 0.25 => 25%
  if (!Number.isFinite(value)) return fallback;
  return getNumberFormatter(locale, {
    style: 'percent',
    maximumFractionDigits,
  }).format(value);
};

export const formatPercentValue = (
  value: number,
  locale: string,
  maximumFractionDigits = 1,
  fallback: string = '—',
) => {
  if (!Number.isFinite(value)) return fallback;
  const formatted = getNumberFormatter(locale, { maximumFractionDigits }).format(value);
  return `${formatted}%`;
};

export const formatSignedPercentValue = (
  value: number,
  locale: string,
  maximumFractionDigits = 1,
  fallback: string = '—',
) => {
  if (!Number.isFinite(value)) return fallback;
  const abs = Math.abs(value);
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  const formatted = getNumberFormatter(locale, { maximumFractionDigits }).format(abs);
  return `${sign}${formatted}%`;
};

export const formatRatio = (
  value: number,
  locale: string,
  maximumFractionDigits = 2,
  suffix = 'x',
  fallback: string = '—',
) => {
  if (!Number.isFinite(value)) return fallback;
  const formatted = getNumberFormatter(locale, { maximumFractionDigits }).format(value);
  return `${formatted}${suffix}`;
};

export const formatCurrency = (
  value: number,
  locale: string,
  maximumFractionDigits = 0,
  fallback: string = '—',
) => {
  // Requirement: currency always PLN
  if (!Number.isFinite(value)) return fallback;
  return getNumberFormatter(locale, {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits,
  }).format(value);
};

export const formatCompactCurrency = (
  value: number,
  locale: string,
  maximumFractionDigits = 1,
  fallback: string = '—',
) => {
  // Requirement: currency always PLN
  if (!Number.isFinite(value)) return fallback;
  const abs = Math.abs(value);
  if (abs < 10000) {
    return formatCurrency(value, locale, 0, fallback);
  }
  return getNumberFormatter(locale, {
    style: 'currency',
    currency: 'PLN',
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits,
  }).format(value);
};
