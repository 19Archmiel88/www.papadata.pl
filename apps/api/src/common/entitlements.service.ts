import { Injectable } from "@nestjs/common";
import type {
  Entitlements,
  PlanId,
  BillingStatus,
  ReportCadence,
  AiTier,
} from "@papadata/shared";
import Stripe from "stripe";
import { getAppMode } from "./app-mode";
import { resolveStripeCustomerId } from "./billing.utils";
import { getApiConfig } from "./config";
import { BillingRepository } from "./billing.repository";

const parsePlan = (value?: string): PlanId | null => {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (
    normalized === "starter" ||
    normalized === "professional" ||
    normalized === "enterprise"
  ) {
    return normalized;
  }
  return null;
};

const parseBillingStatus = (value?: string): BillingStatus | null => {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (
    normalized === "trialing" ||
    normalized === "active" ||
    normalized === "past_due" ||
    normalized === "canceled" ||
    normalized === "trial_expired"
  ) {
    return normalized;
  }
  return null;
};

const parseCadence = (value?: string): ReportCadence | null => {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (
    normalized === "weekly" ||
    normalized === "daily" ||
    normalized === "realtime"
  ) {
    return normalized;
  }
  return null;
};

const parseAiTier = (value?: string): AiTier | null => {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (
    normalized === "basic" ||
    normalized === "priority" ||
    normalized === "full"
  ) {
    return normalized;
  }
  return null;
};

const parseTrialEndsAt = (value?: string): string | undefined => {
  if (!value) return undefined;
  const ts = Date.parse(value);
  if (Number.isNaN(ts)) return undefined;
  return new Date(ts).toISOString();
};

const toIsoFromUnixSeconds = (value?: number | null): string | undefined => {
  if (!value) return undefined;
  return new Date(value * 1000).toISOString();
};

const normalizeBillingStatus = (
  status: BillingStatus,
  trialEndsAt?: string,
): BillingStatus => {
  if (status !== "trialing" || !trialEndsAt) return status;
  return Date.now() > Date.parse(trialEndsAt) ? "trial_expired" : status;
};

const applyGracePeriod = (
  status: BillingStatus,
  currentPeriodEnd?: string,
): BillingStatus => {
  if (status !== "past_due" || !currentPeriodEnd) return status;
  const graceDays = getApiConfig().entitlements.gracePeriodDays ?? 0;
  if (graceDays <= 0) return status;
  const graceUntil =
    Date.parse(currentPeriodEnd) + graceDays * 24 * 60 * 60 * 1000;
  return Date.now() <= graceUntil ? "active" : status;
};

const defaultsByPlan = (plan: PlanId) => {
  switch (plan) {
    case "starter":
      return {
        maxSources: 3,
        reportCadence: "weekly" as ReportCadence,
        aiTier: "basic" as AiTier,
      };
    case "enterprise":
      return {
        maxSources: 999,
        reportCadence: "realtime" as ReportCadence,
        aiTier: "full" as AiTier,
      };
    default:
      return {
        maxSources: 15,
        reportCadence: "daily" as ReportCadence,
        aiTier: "priority" as AiTier,
      };
  }
};

const getCacheTtlMs = () => {
  const raw = getApiConfig().entitlements.cacheTtlMs;
  return Number.isFinite(raw) && raw >= 0 ? raw : 30000;
};

const createStripeClient = () => {
  const apiKey = getApiConfig().stripe.secretKey;
  if (!apiKey) return null;
  return new Stripe(apiKey, { apiVersion: "2023-10-16" });
};

@Injectable()
export class EntitlementsService {
  private readonly stripe = createStripeClient();
  private readonly cacheTtlMs = getCacheTtlMs();
  private readonly cache = new Map<
    string,
    { value: Entitlements; expiresAt: number }
  >();

  constructor(private readonly billingRepository: BillingRepository) {}

  async getEntitlements(tenantId?: string): Promise<Entitlements> {
    const cacheKey = tenantId ?? "default";
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    let entitlements: Entitlements;
    const customerId = resolveStripeCustomerId(tenantId);

    if (tenantId) {
      const fromDb = await this.billingRepository.getTenantBilling(tenantId);
      if (fromDb) {
        entitlements = this.buildEntitlements(
          fromDb.plan,
          fromDb.billingStatus,
          fromDb.trialEndsAt ?? undefined,
        );
        if (this.cacheTtlMs > 0) {
          this.cache.set(cacheKey, {
            value: entitlements,
            expiresAt: Date.now() + this.cacheTtlMs,
          });
        }
        return entitlements;
      }
    }

    if (this.stripe && customerId) {
      try {
        entitlements = await this.getStripeEntitlements(customerId);
      } catch {
        entitlements = this.getEnvEntitlements();
      }
    } else {
      entitlements = this.getEnvEntitlements();
    }

    if (this.cacheTtlMs > 0) {
      this.cache.set(cacheKey, {
        value: entitlements,
        expiresAt: Date.now() + this.cacheTtlMs,
      });
    }

    return entitlements;
  }

  isTrialExpired(entitlements: Entitlements): boolean {
    if (!entitlements.trialEndsAt)
      return entitlements.billingStatus === "trial_expired";
    return Date.now() > Date.parse(entitlements.trialEndsAt);
  }

  isAccountActive(entitlements: Entitlements): boolean {
    if (entitlements.billingStatus === "active") return true;
    if (
      entitlements.billingStatus === "trialing" &&
      !this.isTrialExpired(entitlements)
    )
      return true;
    return false;
  }

  isFeatureAllowed(
    entitlements: Entitlements,
    feature: keyof Entitlements["features"],
  ): boolean {
    if (!entitlements.features[feature]) return false;
    return this.isAccountActive(entitlements);
  }

  private getEnvEntitlements(): Entitlements {
    const env = getApiConfig().entitlements;
    const plan =
      parsePlan(env.plan) ??
      (getAppMode() === "demo" ? "professional" : "professional");

    const trialEndsAt = parseTrialEndsAt(env.trialEndsAt);
    const trialExpired = trialEndsAt
      ? Date.now() > Date.parse(trialEndsAt)
      : false;

    const envStatus = parseBillingStatus(env.billingStatus);
    const billingStatus: BillingStatus = envStatus
      ? envStatus === "trialing" && trialExpired
        ? "trial_expired"
        : envStatus
      : trialEndsAt
        ? trialExpired
          ? "trial_expired"
          : "trialing"
        : "active";

    return this.buildEntitlements(plan, billingStatus, trialEndsAt);
  }

  private async getStripeEntitlements(
    customerId: string,
  ): Promise<Entitlements> {
    if (!this.stripe) return this.getEnvEntitlements();

    const subscription = await this.fetchSubscription(customerId);
    if (!subscription) return this.getEnvEntitlements();

    const trialEndsAt = toIsoFromUnixSeconds(subscription.trial_end);
    const billingStatusRaw = this.resolveStripeBillingStatus(
      subscription.status,
      trialEndsAt,
    );
    const currentPeriodEnd = toIsoFromUnixSeconds(
      subscription.current_period_end ?? undefined,
    );
    const billingStatus = applyGracePeriod(billingStatusRaw, currentPeriodEnd);
    const plan = this.resolveStripePlan(subscription);

    return this.buildEntitlements(plan, billingStatus, trialEndsAt);
  }

  private async fetchSubscription(
    customerId: string,
  ): Promise<Stripe.Subscription | null> {
    if (!this.stripe) return null;
    const subscriptions = await this.stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 5,
    });
    if (!subscriptions.data.length) return null;

    const priority: Record<Stripe.Subscription.Status, number> = {
      active: 0,
      trialing: 1,
      past_due: 2,
      unpaid: 3,
      paused: 4,
      incomplete: 5,
      incomplete_expired: 6,
      canceled: 7,
    };

    return [...subscriptions.data].sort((a, b) => {
      const aRank = priority[a.status] ?? 99;
      const bRank = priority[b.status] ?? 99;
      if (aRank !== bRank) return aRank - bRank;
      return (b.created ?? 0) - (a.created ?? 0);
    })[0];
  }

  private resolveStripePlan(subscription: Stripe.Subscription): PlanId {
    const priceIds = subscription.items.data
      .map((item) => item.price?.id)
      .filter(Boolean) as string[];
    const planFromPrices = this.resolvePlanFromPriceIds(priceIds);
    if (planFromPrices) return planFromPrices;

    const planFromMeta = parsePlan(subscription.metadata?.plan);
    if (planFromMeta) return planFromMeta;

    const priceMetaPlan = parsePlan(
      subscription.items.data[0]?.price?.metadata?.plan,
    );
    if (priceMetaPlan) return priceMetaPlan;

    return (
      parsePlan(getApiConfig().entitlements.plan) ??
      (getAppMode() === "demo" ? "professional" : "professional")
    );
  }

  private resolvePlanFromPriceIds(priceIds: string[]): PlanId | null {
    const {
      priceStarter: starterId,
      priceProfessional: professionalId,
      priceEnterprise: enterpriseId,
    } = getApiConfig().stripe;

    if (starterId && priceIds.includes(starterId)) return "starter";
    if (enterpriseId && priceIds.includes(enterpriseId)) return "enterprise";
    if (professionalId && priceIds.includes(professionalId))
      return "professional";
    return null;
  }

  private resolveStripeBillingStatus(
    status: Stripe.Subscription.Status,
    trialEndsAt?: string,
  ): BillingStatus {
    if (status === "active") return "active";
    if (status === "trialing")
      return normalizeBillingStatus("trialing", trialEndsAt);
    if (status === "past_due" || status === "unpaid") return "past_due";
    if (status === "canceled") return "canceled";
    if (
      status === "incomplete" ||
      status === "incomplete_expired" ||
      status === "paused"
    ) {
      return "past_due";
    }
    return "canceled";
  }

  private buildEntitlements(
    plan: PlanId,
    billingStatus: BillingStatus,
    trialEndsAt?: string,
  ): Entitlements {
    const resolvedStatus = normalizeBillingStatus(billingStatus, trialEndsAt);
    const effectivePlan = resolvedStatus === "trialing" ? "professional" : plan;
    const defaults = defaultsByPlan(effectivePlan);
    const env = getApiConfig().entitlements;

    const maxSources = Number(env.maxSources ?? defaults.maxSources);
    const reportCadence =
      parseCadence(env.reportCadence) ?? defaults.reportCadence;
    const aiTier = parseAiTier(env.aiTier) ?? defaults.aiTier;

    const features = {
      ai: env.featureAi,
      exports: env.featureExports,
      integrations: env.featureIntegrations,
      reports: env.featureReports,
    };

    return {
      plan: effectivePlan,
      billingStatus: resolvedStatus,
      trialEndsAt,
      limits: {
        maxSources: Number.isFinite(maxSources)
          ? maxSources
          : defaults.maxSources,
        reportCadence,
        aiTier,
      },
      features,
    };
  }
}
