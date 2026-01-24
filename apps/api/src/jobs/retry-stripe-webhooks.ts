import Stripe from "stripe";
import { Client } from "pg";

const getEnv = (key: string, fallback = ""): string =>
  (process.env[key] ?? fallback).trim();

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

  for (const row of rows) {
    try {
      const event = await stripe.events.retrieve(row.event_id);
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
