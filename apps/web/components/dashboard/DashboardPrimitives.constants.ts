/** Utility for clamping values */
export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Utility for delta formatting */
export const formatDelta = (v: number) => {
  if (!Number.isFinite(v)) return '0%';
  return v >= 0 ? `+${v}%` : `${v}%`;
};
