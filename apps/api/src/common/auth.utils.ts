export const normalizeRoles = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter((role): role is string => typeof role === 'string' && role.length > 0);
  }
  if (typeof value === 'string' && value.length > 0) {
    return [value];
  }
  return [];
};

const normalizeString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value : undefined;

export const resolveTenantId = (source: Record<string, unknown>): string | undefined =>
  normalizeString(source.tenantId) ??
  normalizeString(source['tenant_id']) ??
  normalizeString(source.uid) ??
  normalizeString(source.sub);
