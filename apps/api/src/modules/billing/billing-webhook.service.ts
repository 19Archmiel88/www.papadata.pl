import { Injectable } from "@nestjs/common";
import Stripe from "stripe";
import type { BillingStatus, PlanId } from "@papadata/shared";
import { getApiConfig } from "../../common/config";
import { BillingRepository } from "../../common/billing.repository";
import { getLogger } from "../../common/logger";

const createStripeClient = () => {
  const apiKey = getApiConfig().stripe.secretKey;
  if (!apiKey) return null;
  return new Stripe(apiKey, { apiVersion: "2023-10-16" });
};

const mapStatus = (
  status: Stripe.Subscription.Status,
  trialEndsAt?: string,
): BillingStatus => {
  if (status === "active") return "active";
  if (status === "trialing") {
    if (trialEndsAt && Date.now() > Date.parse(trialEndsAt)) {
      return "trial_expired";
    }
    return "trialing";
  }
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
};

const mapPlanFromPriceIds = (priceIds: string[]): PlanId => {
  const { priceStarter, priceProfessional, priceEnterprise } =
    getApiConfig().stripe;
  if (priceStarter && priceIds.includes(priceStarter)) return "starter";
  if (priceEnterprise && priceIds.includes(priceEnterprise))
    return "enterprise";
  if (priceProfessional && priceIds.includes(priceProfessional))
    return "professional";
  return "professional";
};

@Injectable()
export class BillingWebhookService {
  private readonly logger = getLogger(BillingWebhookService.name);
  private readonly stripe = createStripeClient();

  constructor(private readonly billingRepository: BillingRepository) {}

  async handleWebhook(
    rawBody: string,
    signature: string | undefined,
  ): Promise<void> {
    const secret = (
      getApiConfig().stripe as { webhookSecret?: string | undefined }
    ).webhookSecret;
    if (!this.stripe || !secret) {
      this.logger.warn("Stripe not configured; webhook ignored.");
      return;
    }
    if (!signature) {
      throw new Error("Missing Stripe signature");
    }
    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      secret,
    );
    await this.trackWebhook(event.id, event.type, "received");
    try {
      await this.handleStripeEvent(event);
      await this.trackWebhook(event.id, event.type, "processed", 1);
      await this.billingRepository.insertAuditEvent({
        tenantId: "system",
        action: "stripe.webhook.processed",
        details: { eventId: event.id, eventType: event.type },
      });
    } catch (error: any) {
      await this.trackWebhook(
        event.id,
        event.type,
        "failed",
        1,
        error?.message,
      );
      await this.billingRepository.insertAuditEvent({
        tenantId: "system",
        action: "stripe.webhook.failed",
        details: {
          eventId: event.id,
          eventType: event.type,
          error: error?.message,
        },
      });
      throw error;
    }
  }

  async handleStripeEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await this.handleSubscription(event.data.object as Stripe.Subscription);
        break;
      case "invoice.paid":
      case "invoice.payment_failed":
        await this.handleInvoice(event.data.object as Stripe.Invoice);
        break;
      default:
        break;
    }
  }

  private async trackWebhook(
    eventId: string,
    eventType: string,
    status: "received" | "processed" | "failed",
    attempts = 0,
    lastError?: string,
  ): Promise<void> {
    await this.billingRepository.upsertWebhookEvent({
      eventId,
      eventType,
      status,
      attempts,
      lastError,
    });
  }

  private async resolveTenantIdFromCustomer(
    customerId: string,
  ): Promise<string | null> {
    if (!this.stripe) return null;
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      if (customer && !Array.isArray(customer)) {
        if ((customer as Stripe.DeletedCustomer).deleted) {
          return null;
        }
        const meta = (customer as Stripe.Customer).metadata || {};
        return meta.tenant_id || meta.tenantId || null;
      }
    } catch {
      return null;
    }
    return null;
  }

  private async handleSubscription(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id;
    if (!customerId) return;

    const meta = subscription.metadata || {};
    const tenantId =
      meta.tenant_id ||
      meta.tenantId ||
      (await this.resolveTenantIdFromCustomer(customerId));
    if (!tenantId) {
      this.logger.warn(
        { customerId },
        "Missing tenantId for subscription webhook",
      );
      return;
    }

    const trialEndsAt = subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null;
    const billingStatus = mapStatus(
      subscription.status,
      trialEndsAt ?? undefined,
    );

    const priceIds = subscription.items.data
      .map((item) => item.price?.id)
      .filter(Boolean) as string[];
    let plan = mapPlanFromPriceIds(priceIds);
    if (billingStatus === "trialing") {
      plan = "professional";
    }

    await this.billingRepository.upsertTenantBilling({
      tenantId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      plan,
      billingStatus,
      trialEndsAt,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null,
    });
  }

  private async handleInvoice(invoice: Stripe.Invoice): Promise<void> {
    const customerId =
      typeof invoice.customer === "string"
        ? invoice.customer
        : invoice.customer?.id;
    if (!customerId) return;

    const tenantId = await this.resolveTenantIdFromCustomer(customerId);
    if (!tenantId) {
      this.logger.warn({ customerId }, "Missing tenantId for invoice webhook");
      return;
    }

    const priceIds = (invoice.lines?.data ?? [])
      .map((line) => line.price?.id)
      .filter(Boolean) as string[];
    const plan = mapPlanFromPriceIds(priceIds);
    const status: BillingStatus = invoice.paid ? "active" : "past_due";
    await this.billingRepository.upsertTenantBilling({
      tenantId,
      stripeCustomerId: customerId,
      stripeSubscriptionId:
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription?.id,
      plan,
      billingStatus: status,
      trialEndsAt: null,
      currentPeriodEnd: invoice.period_end
        ? new Date(invoice.period_end * 1000).toISOString()
        : null,
    });
  }
}
