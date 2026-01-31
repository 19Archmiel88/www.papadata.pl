import { describe, it, expect, beforeEach } from 'vitest';
import {
  computeAiEnabled,
  computeIsAccountActive,
  computeIsDataStale,
  defaultEntitlements,
  deriveEntitlements,
} from '../../components/dashboard/access';
import { COOKIE_ACK_KEY, persistCookieAck } from '../../components/dashboard/cookie-resolution';
import { safeLocalStorage } from '../../utils/safeLocalStorage';
import type { BillingSummary } from '@papadata/shared';

const buildSummary = (overrides: Partial<BillingSummary> = {}): BillingSummary => ({
  entitlements: {
    ...defaultEntitlements,
    isPremiumAllowed: true,
    billingStatus: 'active',
    features: { ...defaultEntitlements.features, ai: true, integrations: true, exports: true },
  },
  plan: 'professional',
  billingStatus: 'active',
  trialEndsAt: null,
  trialDaysLeft: 14,
  isTrial: true,
  isTrialExpired: false,
  canManageSubscription: true,
  portalUrl: null,
  ...overrides,
});

describe('dashboard access helpers', () => {
  beforeEach(() => {
    try {
      safeLocalStorage.removeItem(COOKIE_ACK_KEY);
    } catch {
      // ignore
    }
  });

  it('fails closed when billing summary is missing', () => {
    const ent = deriveEntitlements(null);
    expect(ent).toEqual(defaultEntitlements);
    const active = computeIsAccountActive(null, false, false);
    expect(active).toBe(false);
  });

  it('treats active subscription as active account', () => {
    const summary = buildSummary();
    const active = computeIsAccountActive(summary, false, false);
    expect(active).toBe(true);
  });

  it('disables AI when entitlement is missing or trial expired', () => {
    const noAi = { ...defaultEntitlements, features: { ...defaultEntitlements.features, ai: false } };
    expect(computeAiEnabled(noAi, false, false)).toBe(false);

    const summary = buildSummary({
      entitlements: { ...defaultEntitlements, features: { ...defaultEntitlements.features, ai: true } },
    });
    const activeEnt = deriveEntitlements(summary);
    expect(computeAiEnabled(activeEnt, true, false)).toBe(false);
  });

  it('detects stale data based on threshold', () => {
    const now = new Date('2026-01-30T12:00:00Z');
    const fresh = new Date(now.getTime() - 30 * 60 * 1000);
    const stale = new Date(now.getTime() - 5 * 60 * 60 * 1000);

    expect(computeIsDataStale(fresh, now)).toBe(false);
    expect(computeIsDataStale(stale, now)).toBe(true);
    expect(computeIsDataStale(null, now)).toBe(true);
  });

  it('persists cookie acknowledgement', () => {
    const ts = persistCookieAck(123456);
    expect(ts).toBe(123456);
    expect(safeLocalStorage.getItem(COOKIE_ACK_KEY)).toBe('123456');
  });
});
