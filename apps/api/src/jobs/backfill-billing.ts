import { Client } from "pg";

const getEnv = (key: string, fallback = ""): string =>
  (process.env[key] ?? fallback).trim();

const TRIAL_DAYS = Number(getEnv("BACKFILL_TRIAL_DAYS", "14"));

type TenantRow = {
  tenant_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: string;
  billing_status: string;
  trial_ends_at: string | null;
};

type Action = {
  tenantId: string;
  reason: string;
  update: {
    billing_status?: string;
    trial_ends_at?: string | null;
    plan?: string;
  };
};

const isValidPlan = (plan: string | null) =>
  plan === "starter" || plan === "professional" || plan === "enterprise";

const main = async () => {
  const databaseUrl = getEnv("DATABASE_URL");
  const apply = getEnv("BACKFILL_APPLY") === "1";
  if (!databaseUrl) throw new Error("Missing DATABASE_URL");

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  const { rows } = await client.query<TenantRow>(
    `SELECT tenant_id, stripe_customer_id, stripe_subscription_id, plan, billing_status, trial_ends_at
     FROM tenant_billing`,
  );

  const nowMs = Date.now();
  const trialEndsAt = new Date(
    nowMs + TRIAL_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();
  const actions: Action[] = [];
  const stats = new Map<string, number>();

  for (const row of rows) {
    const update: Action["update"] = {};
    let reason = "";

    if (!isValidPlan(row.plan)) {
      update.plan = "starter";
      reason = "invalid_plan";
    }

    if (row.billing_status === "trialing" && !row.trial_ends_at) {
      update.trial_ends_at = trialEndsAt;
      reason = reason ? `${reason};missing_trial_end` : "missing_trial_end";
    }

    if (
      row.billing_status === "trialing" &&
      row.trial_ends_at &&
      nowMs > Date.parse(row.trial_ends_at)
    ) {
      update.billing_status = "trial_expired";
      reason = reason ? `${reason};trial_expired` : "trial_expired";
    }

    if (
      row.billing_status === "active" &&
      !row.stripe_customer_id &&
      !row.stripe_subscription_id
    ) {
      update.billing_status = "trialing";
      update.trial_ends_at = trialEndsAt;
      reason = reason
        ? `${reason};active_without_proof`
        : "active_without_proof";
    }

    if (Object.keys(update).length > 0) {
      actions.push({ tenantId: row.tenant_id, reason, update });
      const key = reason || "unspecified";
      stats.set(key, (stats.get(key) ?? 0) + 1);
    }
  }

  const statsObject = Array.from(stats.entries()).reduce(
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {} as Record<string, number>,
  );

  if (!apply) {
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify(
        {
          apply: false,
          total: actions.length,
          stats: statsObject,
          sample: actions.slice(0, 5),
          actions,
        },
        null,
        2,
      ),
    );
    await client.end();
    return;
  }

  for (const action of actions) {
    await client.query(
      `UPDATE tenant_billing
       SET
         billing_status = COALESCE($2, billing_status),
         trial_ends_at = COALESCE($3, trial_ends_at),
         plan = COALESCE($4, plan),
         updated_at = now()
       WHERE tenant_id = $1`,
      [
        action.tenantId,
        action.update.billing_status ?? null,
        action.update.trial_ends_at ?? null,
        action.update.plan ?? null,
      ],
    );
  }

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        apply: true,
        total: actions.length,
        stats: statsObject,
        sample: actions.slice(0, 5),
        actions,
      },
      null,
      2,
    ),
  );
  await client.end();
};

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
