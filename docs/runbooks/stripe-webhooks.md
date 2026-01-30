# Stripe Webhooks — event ledger + retry

## Obsługiwane eventy

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

Każdy event aktualizuje `tenant_billing` (plan, billing_status, trial_ends_at, current_period_end, stripe ids).

## Endpointy

- Preferowany: `POST /api/webhooks/stripe`
- Alias: `POST /api/billing/webhook`
- Wymagania techniczne: `STRIPE_WEBHOOK_SECRET`, raw body (Fastify plugin w `main.ts`), nagłówek `stripe-signature`.

## Event ledger (`stripe_webhook_events`)

Kolumny: `event_id` (PK), `event_type`, `status` (`received|processed|failed`), `attempts`, `last_error`, `updated_at`.

Logika:

- Idempotencja po `event_id` — jeśli `processed`, zwróć 200 i nic nie zmieniaj.
- Na wejściu zapis `received`.
- Po sukcesie: `processed`, `attempts += 1`, audit log `stripe.webhook.processed`.
- Po błędzie: `failed`, `attempts += 1`, `last_error` ustawione, audit `stripe.webhook.failed`.

## Retry job

- Plik: `apps/api/src/jobs/retry-stripe-webhooks.ts`
- Pobiera `failed` z `attempts < WEBHOOK_RETRY_MAX` (ENV, default 5).
- Odtwarza pełną logikę webhooka (ten sam mapping statusów/planów).
- Alert opcjonalny: `ALERT_WEBHOOK_URL` (JSON payload z listą eventów).

## Weryfikacja lokalna

```bash
pnpm --filter @papadata/api exec ts-node ./src/jobs/retry-stripe-webhooks.ts
```

- Wymaga `STRIPE_SECRET_KEY` (do pobrania eventów) i `DATABASE_URL`.

## Testy / DoD

- E2E: blokada premium bez billing row; trial → expiry → aktywacja płatności.
- Ledger działa: powtórny event z tym samym `event_id` nie zmienia danych.
- Retry job ponownie aplikuje biznesową logikę (nie tylko „odhacza” event).
