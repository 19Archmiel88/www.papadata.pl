# Billing Source of Truth

Single source of truth for billing and entitlements is the database. Stripe is an
event source only. ENV is allowed only in demo mode as an explicit fallback.

## Source of truth rules
- DB (`tenant_billing`) is authoritative for plan, billing status, and trial.
- Stripe events update DB; Stripe is never used directly in runtime decisions
  when DB has a row.
- ENV entitlements are allowed only in demo mode and only when explicitly set.
- Missing data (no DB row, no Stripe, no ENV) => fail-closed (no premium).

## State machine
Statuses are derived from `billing_status` with trial expiration evaluated
against `trial_ends_at`.

```
trialing --> active --> past_due --> canceled
   |                       ^
   v                       |
trial_expired -------------+
```

Notes:
- `trialing` transitions to `trial_expired` when `trial_ends_at` passes.
- `past_due` can be treated as `active` during grace period (see config).
- `canceled` and `trial_expired` are blocked states for premium features.

## Minimal data contract (tenant_billing)
- `tenant_id` (primary key)
- `plan` (starter/professional/enterprise)
- `billing_status` (trialing/active/past_due/canceled/trial_expired)
- `trial_ends_at`
- `current_period_end`
- `stripe_customer_id`
- `stripe_subscription_id`
- `updated_at`

## Fail-closed rules
- No billing row => no premium.
- Trialing without `trial_ends_at` => treated as expired.
- ENV values do not grant premium in prod mode.

## Trial policy
- Trial is started on registration with `trial_ends_at = now + 14 days`.
- Trial grants professional entitlements until expiry.

## Enforcement
- Premium endpoints are guarded with `EntitlementsGuard`.
- Access allowed only when billing status is active or in-trial.
