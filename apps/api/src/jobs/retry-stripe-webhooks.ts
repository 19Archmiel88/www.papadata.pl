import Stripe from "stripe";
import { Client } from "pg";

const getEnv = (key: string, fallback = ""): string =>
  (process.env[key] ?? fallback).trim();

const mapStatus = (
  status: Stripe.Subscription.Status,
  trialEndsAt: string | null | undefined,
  nowMs: number,
) => {
  if (status === "active") return "active";
  if (status === "trialing") {
    if (trialEndsAt && nowMs > Date.parse(trialEndsAt)) {
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

const mapPlanFromPriceIds = (priceIds: string[]) => {
  const priceStarter = getEnv("STRIPE_PRICE_STARTER");
  const priceProfessional = getEnv("STRIPE_PRICE_PROFESSIONAL");
  const priceEnterprise = getEnv("STRIPE_PRICE_ENTERPRISE");
  if (priceStarter && priceIds.includes(priceStarter)) {
    return "starter";
  }
  if (priceEnterprise && priceIds.includes(priceEnterprise)) {
    return "enterprise";
  }
  if (priceProfessional && priceIds.includes(priceProfessional)) {
    return "professional";
  }
  return "starter";
};

const resolveTenantIdFromCustomer = async (
  stripe: Stripe,
  customerId: string,
): Promise<string | null> => {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer && !Array.isArray(customer)) {
      if ((customer as Stripe.DeletedCustomer).deleted) {
        return null;
      }
      const meta = (customer as Stripe.Customer).metadata || {};
      return (meta.tenant_id || meta.tenantId) ?? null;
    }
  } catch {
    return null;
  }
  return null;
};

const upsertTenantBilling = async (
  client: Client,
  input: {
    tenantId: string;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    plan: string;
    billingStatus: string;
    trialEndsAt: string | null;
    currentPeriodEnd: string | null;
  },
) => {
  await client.query(
    `INSERT INTO tenant_billing (
       tenant_id,
       stripe_customer_id,
       stripe_subscription_id,
       plan,
       billing_status,
       trial_ends_at,
       current_period_end,
       updated_at
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,now())
     ON CONFLICT (tenant_id) DO UPDATE SET
       stripe_customer_id = EXCLUDED.stripe_customer_id,
       stripe_subscription_id = EXCLUDED.stripe_subscription_id,
       plan = EXCLUDED.plan,
       billing_status = EXCLUDED.billing_status,
       trial_ends_at = EXCLUDED.trial_ends_at,
       current_period_end = EXCLUDED.current_period_end,
       updated_at = now()`,
    [
      input.tenantId,
      input.stripeCustomerId,
      input.stripeSubscriptionId,
      input.plan,
      input.billingStatus,
      input.trialEndsAt,
      input.currentPeriodEnd,
    ],
  );
};

const handleSubscription = async (
  client: Client,
  stripe: Stripe,
  subscription: Stripe.Subscription,
  nowMs: number,
): Promise<void> => {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;
  if (!customerId) return;

  const meta = subscription.metadata || {};
  const tenantId =
    meta.tenant_id ||
    meta.tenantId ||
    (await resolveTenantIdFromCustomer(stripe, customerId));
  if (!tenantId) return;

  const trialEndsAt = subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null;
  const billingStatus = mapStatus(subscription.status, trialEndsAt, nowMs);

  const priceIds = subscription.items.data
    .map((item) => item.price?.id)
    .filter(Boolean) as string[];
  let plan = mapPlanFromPriceIds(priceIds);
  if (billingStatus === "trialing") {
    plan = "professional";
  }

  await upsertTenantBilling(client, {
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
};

const handleInvoice = async (
  client: Client,
  stripe: Stripe,
  invoice: Stripe.Invoice,
): Promise<void> => {
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id;
  if (!customerId) return;

  const tenantId = await resolveTenantIdFromCustomer(stripe, customerId);
  if (!tenantId) return;

  const priceIds = (invoice.lines?.data ?? [])
    .map((line) => line.price?.id)
    .filter(Boolean) as string[];
  const plan = mapPlanFromPriceIds(priceIds);
  const status = invoice.paid ? "active" : "past_due";
  await upsertTenantBilling(client, {
    tenantId,
    stripeCustomerId: customerId,
    stripeSubscriptionId:
      typeof invoice.subscription === "string"
        ? invoice.subscription
        : (invoice.subscription?.id ?? null),
    plan,
    billingStatus: status,
    trialEndsAt: null,
    currentPeriodEnd: invoice.period_end
      ? new Date(invoice.period_end * 1000).toISOString()
      : null,
  });
};

const handleStripeEvent = async (
  client: Client,
  stripe: Stripe,
  event: Stripe.Event,
  nowMs: number,
): Promise<void> => {
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await handleSubscription(
        client,
        stripe,
        event.data.object as Stripe.Subscription,
        nowMs,
      );
      return;
    case "invoice.paid":
    case "invoice.payment_failed":
      await handleInvoice(client, stripe, event.data.object as Stripe.Invoice);
      return;
    default:
      return;
  }
};

const main = async () => {
  const apiKey = getEnv("STRIPE_SECRET_KEY");
  const databaseUrl = getEnv("DATABASE_URL");
  const alertUrl = getEnv("ALERT_WEBHOOK_URL");
  const maxAttempts = Number(getEnv("WEBHOOK_RETRY_MAX", "5"));

  if (!apiKey) throw new Error("Missing STRIPE_SECRET_KEY");
  if (!databaseUrl) throw new Error("Missing DATABASE_URL");

  const stripe = new Stripe(apiKey, { apiVersion: "2023-10-16" });
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  const { rows } = await client.query<{
    event_id: string;
    attempts: number;
  }>(
    `SELECT event_id, attempts
     FROM stripe_webhook_events
     WHERE status = 'failed' AND attempts < $1
     ORDER BY updated_at ASC
     LIMIT 20`,
    [maxAttempts],
  );

  const failures: string[] = [];
  const nowMs = Date.now();

  for (const row of rows) {
    try {
      const event = await stripe.events.retrieve(row.event_id);
      await handleStripeEvent(client, stripe, event, nowMs);
      await client.query(
        `UPDATE stripe_webhook_events
         SET status = 'processed', attempts = attempts + 1, last_error = NULL, updated_at = now()
         WHERE event_id = $1`,
        [row.event_id],
      );
      // eslint-disable-next-line no-console
      console.log(`Processed ${row.event_id} (${event.type})`);
    } catch (err: any) {
      failures.push(row.event_id);
      await client.query(
        `UPDATE stripe_webhook_events
         SET status = 'failed', attempts = attempts + 1, last_error = $2, updated_at = now()
         WHERE event_id = $1`,
        [row.event_id, err?.message ?? "unknown error"],
      );
    }
  }

  await client.end();

  if (alertUrl && failures.length > 0) {
    await fetch(alertUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Stripe webhook retry failures",
        failures,
        count: failures.length,
      }),
    });
  }
};

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
