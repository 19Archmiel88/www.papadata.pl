export const normalizeApiError = (error: unknown, fallback: string): string => {
  const safeFallback =
    typeof fallback === 'string' && fallback.trim()
      ? fallback.trim()
      : 'Wystąpił nieoczekiwany błąd.';

  const pickFirstMeaningful = (candidates: unknown[]): string | null => {
    for (const c of candidates) {
      if (typeof c === 'string' && c.trim()) return c.trim();
    }
    return null;
  };

  const joinValidationErrors = (errors: unknown): string | null => {
    // Accept common shapes:
    // - errors: string[]
    // - errors: { field: string | string[] }
    if (!errors) return null;

    if (Array.isArray(errors)) {
      const msgs = errors
        .filter((x): x is string => typeof x === 'string')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);

      return msgs.length ? msgs.join(' • ') : null;
    }

    if (typeof errors === 'object') {
      const vals = Object.values(errors as Record<string, unknown>);
      const collected: string[] = [];

      for (const v of vals) {
        if (typeof v === 'string' && v.trim()) collected.push(v.trim());
        else if (Array.isArray(v)) {
          for (const item of v) {
            if (typeof item === 'string' && item.trim()) collected.push(item.trim());
          }
        }
        if (collected.length >= 3) break;
      }

      const unique = Array.from(new Set(collected)).slice(0, 3);
      return unique.length ? unique.join(' • ') : null;
    }

    return null;
  };

  const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null;

  // 1) Native Error
  if (error instanceof Error) {
    const msg = pickFirstMeaningful([error.message]);
    return msg ?? safeFallback;
  }

  // 2) String
  if (typeof error === 'string') {
    const msg = pickFirstMeaningful([error]);
    return msg ?? safeFallback;
  }

  // 3) Response (fetch)
  // In practice you often normalize after you already parsed JSON,
  // so here we only handle the obvious "status/statusText" shape.
  if (isRecord(error)) {
    const maybeStatus = error.status;
    const maybeStatusText = error.statusText;

    if (typeof maybeStatus === 'number') {
      const st = typeof maybeStatusText === 'string' ? maybeStatusText.trim() : '';
      const httpMsg = st ? `HTTP ${maybeStatus}: ${st}` : `HTTP ${maybeStatus}`;
      // Keep searching for better message first (below), but have HTTP fallback ready.
      // We'll return httpMsg if we cannot extract anything more meaningful.
      // (We do not return immediately.)
      const extracted = (() => {
        // 4) Axios-like / generic nested shapes
        // Common: { response: { data, status }, message }
        const response = isRecord(error.response) ? error.response : null;
        const data = response && isRecord(response.data) ? response.data : response?.data;

        // Try common message fields on:
        // - error (top-level)
        // - response.data (backend payload)
        const validation = joinValidationErrors(
          (isRecord(data) && (data.errors ?? (data as any).validationErrors)) ??
            (isRecord(error) && (error.errors ?? (error as any).validationErrors))
        );

        const message = pickFirstMeaningful([
          // top-level "message"
          error.message,
          // payload candidates (problem+json and common APIs)
          isRecord(data) ? (data.message as unknown) : undefined,
          isRecord(data) ? (data.detail as unknown) : undefined,
          isRecord(data) ? (data.title as unknown) : undefined,
          isRecord(data) ? (data.error as unknown) : undefined,
          isRecord(data) ? (data.reason as unknown) : undefined,
          // sometimes: { error: { message } }
          isRecord(data) && isRecord((data as any).error) ? (data as any).error.message : undefined,
          // sometimes: { data: { ... } } directly
          isRecord(error.data) ? (error.data as any).message : undefined,
          isRecord(error.data) ? (error.data as any).detail : undefined,
        ]);

        return validation ?? message;
      })();

      return extracted ?? httpMsg;
    }
  }

  // 4) Axios-like / generic object (no status)
  if (isRecord(error)) {
    const response = isRecord(error.response) ? error.response : null;
    const data = response && isRecord(response.data) ? response.data : response?.data;

    const validation = joinValidationErrors(
      (isRecord(data) && (data.errors ?? (data as any).validationErrors)) ??
        error.errors ??
        (error as any).validationErrors
    );

    const message = pickFirstMeaningful([
      error.message,
      isRecord(data) ? (data.message as unknown) : undefined,
      isRecord(data) ? (data.detail as unknown) : undefined,
      isRecord(data) ? (data.title as unknown) : undefined,
      isRecord(data) ? (data.error as unknown) : undefined,
      isRecord(data) ? (data.reason as unknown) : undefined,
    ]);

    return validation ?? message ?? safeFallback;
  }

  return safeFallback;
};
