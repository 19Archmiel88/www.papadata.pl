import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import type {
  BillingCheckoutSessionResponse,
  BillingStatusResponse,
  BillingSummary,
} from "@papadata/shared";
import Stripe from "stripe";
import { EntitlementsService } from "../../common/entitlements.service";
import { resolveStripeCustomerId } from "../../common/billing.utils";
import { getApiConfig } from "../../common/config";
import { getAppMode } from "../../common/app-mode";
import { TimeProvider } from "../../common/time.provider";

const createStripeClient = () => {
  const apiKey = getApiConfig().stripe.secretKey;
  if (!apiKey) return null;
  return new Stripe(apiKey, { apiVersion: "2023-10-16" });
};

const resolveTrialDaysLeft = (
  trialEndsAt: string | null | undefined,
  nowMs: number,
): number | null => {
  if (!trialEndsAt) return null;
  const msLeft = Date.parse(trialEndsAt) - nowMs;
  if (!Number.isFinite(msLeft)) return null;
  return Math.max(0, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
};

const canManageSubscription = (roles: string[] | undefined): boolean => {
  if (!roles) return false;
  return roles.includes("owner") || roles.includes("admin");
};

@Injectable()
export class BillingService {
  private readonly mode = getAppMode();
  private readonly stripe: Stripe | null;

  constructor(
    private readonly entitlementsService: EntitlementsService,
    private readonly timeProvider: TimeProvider,
  ) {
    this.stripe = createStripeClient();
    if (this.mode !== "demo" && !this.stripe) {
      throw new ServiceUnavailableException(
        "Stripe is not configured outside demo mode",
      );
    }
  }

  async getSummary(params?: {
    tenantId?: string;
    roles?: string[];
  }): Promise<BillingSummary> {
    const entitlements = await this.entitlementsService.getEntitlements(
      params?.tenantId,
    );
    const trialEndsAt = entitlements.trialEndsAt ?? null;
    const isTrialExpired =
      this.entitlementsService.isTrialExpired(entitlements);
    const isTrial =
      entitlements.billingStatus === "trialing" && !isTrialExpired;
    const trialDaysLeft = resolveTrialDaysLeft(
      trialEndsAt,
      this.timeProvider.nowMs(),
    );

    return {
      entitlements,
      plan: entitlements.plan,
      billingStatus: entitlements.billingStatus,
      trialEndsAt,
      trialDaysLeft,
      isTrial,
      isTrialExpired,
      canManageSubscription: canManageSubscription(params?.roles),
    };
  }

  async createPortalSession(params: {
    tenantId?: string;
    returnUrl: string;
  }): Promise<string> {
    if (!this.stripe) {
      throw new ServiceUnavailableException("Stripe is not configured");
    }
    const customerId = resolveStripeCustomerId(params.tenantId);
    if (!customerId) {
      throw new ServiceUnavailableException(
        "Stripe customer is not configured",
      );
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: params.returnUrl,
    });

    if (!session.url) {
      throw new ServiceUnavailableException("Stripe portal unavailable");
    }

    return session.url;
  }

  async getStatus(params?: {
    tenantId?: string;
  }): Promise<BillingStatusResponse> {
    const entitlements = await this.entitlementsService.getEntitlements(
      params?.tenantId,
    );
    return {
      plan: entitlements.plan,
      trialEndsAt: entitlements.trialEndsAt ?? null,
      subscriptionStatus: entitlements.billingStatus,
    };
  }

  async createCheckoutSession(params: {
    tenantId?: string;
    planId: string;
    requestBaseUrl: string;
  }): Promise<BillingCheckoutSessionResponse> {
    const safePlan = params.planId?.trim() || "professional";
    const base = params.requestBaseUrl.replace(/\/$/, "");
    const url = `${base}/billing/checkout-stub?plan=${encodeURIComponent(safePlan)}`;
    return { url };
  }
}
