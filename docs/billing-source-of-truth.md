# Billing Source of Truth

Single source of truth for billing and entitlements is the database. Stripe is an
event source only. ENV is allowed only in demo mode as an explicit fallback.

## Source precedence (hard rule)
1. **DB (`tenant_billing`)** — autorytatywne: plan, billing_status, trial.
2. **Stripe** — tylko event source; używamy do backfillu, gdy brak wiersza DB (APP_MODE=demo).
3. **ENV (demo only)** — wyłącznie jawnie ustawione wartości.
4. **Fail-closed** — brak 1–3 ⇒ starter/canceled (brak premium).

## State machine (runtime)

```
           invoice.paid                  invoice.payment_failed
trialing ---------------> active -----------------> past_due
   |                         ^                         |
   |                         | cancel/unpaid           |
   | (trial_ends_at passed)  |                         |
   v                         |                         |
trial_expired <--------------+-------------------------+
                cancel
```

- `trialing` → `trial_expired` gdy `trial_ends_at` minęło.
- `past_due` może być tymczasowo traktowane jako `active` (grace period).
- Blokujące stany premium: `trial_expired`, `canceled`, `past_due` po grace.

## Status → dostęp → UI/komunikaty
| billing_status       | isPremiumAllowed | UI copy / guidance                               |
| ---                  | ---              | ---                                              |
| trialing (not expired) | ✅             | Pełny Professional (trial). Pokaż licznik dni.   |
| active               | ✅               | Plan opłacony. Pokaż datę `current_period_end`.  |
| past_due (in grace)  | ✅               | Pokaż ostrzeżenie o płatności, ale nie blokuj.   |
| past_due (after grace) | ❌            | Blokada premium, CTA do płatności.               |
| trial_expired        | ❌               | Blokada premium, CTA do płatności.               |
| canceled             | ❌               | Brak premium, CTA do reaktywacji.                |
| missing data         | ❌ (fail-closed) | Starter/canceled; UI: „Brak subskrypcji”.        |

## Minimal data contract (tenant_billing)
- `tenant_id` (primary key)
- `plan` (starter/professional/enterprise)
- `billing_status` (trialing/active/past_due/canceled/trial_expired)
- `trial_ends_at`
- `current_period_end`
- `stripe_customer_id`
- `stripe_subscription_id`
- `updated_at`

## Scenariusze brzegowe (must handle)
- Brak DB: fail-closed (prod), fallback trial 14d (demo) z `reason=missing_billing` / `demo_fallback_trial`.
- Stripe niedostępne: korzystamy z DB; brak DB ⇒ fail-closed.
- Błędne ENV: ignorujemy (wymagane jawne, parsowalne wartości).
- Trialing bez `trial_ends_at`: traktuj jak `trial_expired`.
- `past_due` z `current_period_end` sprzed > grace: blokada premium.

## Trial policy
- Signup → insert w DB: `plan=professional`, `billing_status=trialing`, `trial_ends_at = now + 14 dni`.
- Idempotencja: ponowna rejestracja nie resetuje trialu, jeśli wiersz istnieje.
- Audit log: `trial.started` + moment expiry (log + backfill/cron).

## Enforcement (API)
- Centralny wynik entitlements: `{ isPremiumAllowed, plan, billingStatus, trialEndsAt, reason, features, limits }`.
- Premium endpoints mapowane w `apps/api/src/common/premium-features.ts`.
- `EntitlementsGuard` jest jedyną bramką; brak demo-bypass poza explicit APP_MODE=demo fallback trial 14d.
