export type RateLimiter = {
  tryConsume: () => boolean;
  getRemaining: () => number;
  getRetryAfterMs: () => number;
};

export const createRateLimiter = (max: number, windowMs: number): RateLimiter => {
  let timestamps: number[] = [];

  const prune = (now: number) => {
    timestamps = timestamps.filter((ts) => now - ts < windowMs);
  };

  const tryConsume = () => {
    const now = Date.now();
    prune(now);
    if (timestamps.length >= max) {
      return false;
    }
    timestamps.push(now);
    return true;
  };

  const getRemaining = () => {
    const now = Date.now();
    prune(now);
    return Math.max(0, max - timestamps.length);
  };

  const getRetryAfterMs = () => {
    const now = Date.now();
    prune(now);
    if (timestamps.length < max) return 0;
    const oldest = timestamps[0] ?? now;
    return Math.max(0, windowMs - (now - oldest));
  };

  return { tryConsume, getRemaining, getRetryAfterMs };
};
