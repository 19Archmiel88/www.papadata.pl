import { getApiConfig } from "./config";

type CustomerMap = Record<string, string>;

const parseCustomerMap = (): CustomerMap => {
  const raw = getApiConfig().stripe.customerMap;
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as CustomerMap;
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch {
    return {};
  }
  return {};
};

export const resolveStripeCustomerId = (tenantId?: string): string | null => {
  const map = parseCustomerMap();
  if (tenantId && map[tenantId]) return map[tenantId];
  return getApiConfig().stripe.customerId ?? null;
};
