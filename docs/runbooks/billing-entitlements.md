# Billing + Entitlements — workflow LOKAL → STG → PROD (plan, trial, limits)

Source of truth: `docs/billing-source-of-truth.md`.

Cel: egzekucja planów (Starter/Professional/Trial), monitoring płatności oraz limitów AI i źródeł danych — zgodnie z naszym przepływem release.

---

## 0) Workflow (jak to przechodzi przez środowiska)

### Etap 1 — LOKAL (kod + migracje)
- Przygotowujesz lokalnie w repo:
  - kod API (webhooki, entitlements, limity, joby),
  - migracje SQL: `apps/api/migrations/*` (canonical path),
  - SQL schema referencyjny: `docs/runbooks/cloudsql-schema.sql`.
- Lokalna weryfikacja: lint/testy/smoke (API+WEB).

### Etap 2 — PUSH → STG (auto deploy runtime)
- Push do Git.
- STG aktualizuje runtime automatycznie (Cloud Run/pipeline).

### Etap 3 — STG (pełna weryfikacja)
- W STG robisz:
  - uruchomienie migracji (`pnpm --filter @papadata/api run db:migrate`),
  - ustawienie secretów/env w API (Cloud Run),
  - test webhooks Stripe i egzekucji limitów,
  - E2E: rejestracja → trial → płatność → zmiana planu → limity.

### Etap 4 — PROD (promocja)
- Po pozytywnym STG: wdrożenie na PROD (papadata-platform-prod).
- Te same kroki (schema/sekrety/webhooki/joby) są już gotowe 1:1.

---

## 1) Wymagane działania (MUST)

### 1.1 Stripe
- Ustaw metadata `tenant_id` w Stripe (Customer lub Subscription).

### 1.2 Cloud SQL
- Zastosuj migracje do Cloud SQL:
  - `pnpm --filter @papadata/api run db:migrate`
- Plik referencyjny:
  - `docs/runbooks/cloudsql-schema.sql`

### 1.3 API ENV/Secrets (Cloud Run)
- Ustaw w API:
  - `DATABASE_URL`
  - `STRIPE_WEBHOOK_SECRET`
  - `AI_USAGE_LIMIT_*`

### 1.4 Zależności w API
- Doinstaluj w `apps/api`:
  - `pg`
  - `fastify-raw-body`
  - `@google-cloud/secret-manager`

---

## 2) Definicje planów (MUST)

- **Trial 14 dni** = **pełny Professional**
  - max źródeł: 15
  - AI tier: priority
  - dane klienta: do 30 dni wstecz
- **Professional (płatny)**
  - max źródeł: 15
  - AI tier: priority
  - raporty dzienne
- **Starter (płatny)**
  - max źródeł: 3
  - AI tier: basic
  - raporty tygodniowe

Źródło domyślnych limitów w API:
- `apps/api/src/common/entitlements.service.ts`

---

## 3) Monitorowanie płatności (Stripe) — kanał zdarzeń

Kanał prawdy: Stripe Webhooks + zapis do Cloud SQL.

### 3.1 Webhooki (MUST)
Zdarzenia:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

Endpointy (aliasy):
- `POST /api/webhooks/stripe` (preferowany)
- `POST /api/billing/webhook` (wsteczna kompatybilnosc)

Wymóg techniczny:
- API musi mieć ustawiony `STRIPE_WEBHOOK_SECRET`
- webhook endpoint musi działać w STG przed promocją na PROD

### 3.2 Retry job (MUST)
Kod:
- `apps/api/src/jobs/retry-stripe-webhooks.ts`

Uruchomienie:
- Cloud Run Job + Cloud Scheduler (np. co 10 min)

---

## 4) Stan w Cloud SQL (schemat i pola)

Schemat:
- `docs/runbooks/cloudsql-schema.sql`

Tabela `tenant_billing` (minimalnie):
- `tenant_id`
- `stripe_customer_id`
- `stripe_subscription_id`
- `plan` (starter/professional/enterprise)
- `billing_status` (trialing/active/past_due/canceled/trial_expired)
- `trial_ends_at`
- `current_period_end`
- `updated_at`

Egzekucja:
- API odczytuje status i plan z Cloud SQL (ENV tylko w demo i tylko jawnie ustawione),
- generuje `Entitlements`,
- blokuje funkcje po `trial_expired` lub `past_due`.

---

## 5) Monitorowanie pakietu AI (miesięczne limity)

Tabela `ai_usage` (Cloud SQL):
- `tenant_id`
- `period_start`
- `period_end`
- `requests_count`
- `tokens_in`
- `tokens_out`

Limity wg planu (z ENV):
- `AI_USAGE_LIMIT_BASIC`
- `AI_USAGE_LIMIT_PRIORITY`
- `AI_USAGE_LIMIT_FULL`

Egzekucja:
- przed wywołaniem AI: sprawdź `Entitlements` i `ai_usage`,
- po przekroczeniu limitu: blokada endpointu AI (HTTP 402/429 + komunikat w UI).

---

## 6) Limit źródeł danych (MUST)

Wymóg:
- liczba źródeł w integracjach nie może przekroczyć `Entitlements.limits.maxSources`.

Egzekucja:
- przy dodawaniu integracji: policz aktywne źródła dla tenant,
- jeśli limit przekroczony: blokada dodania + UI prompt do odłączenia źródeł.

---

## 7) Zmiana planu: Trial → Starter (bez usuwania danych)

Zasada:
- nie usuwamy danych automatycznie,
- blokujemy dodawanie nowych źródeł powyżej limitu,
- UI wymusza odłączenie nadmiaru,
- po zejściu do 3 źródeł: pełny dostęp Starter.

Kroki:
1. Zmiana planu w Stripe.
2. Webhook aktualizuje `tenant_billing.plan = starter`.
3. API przelicza `Entitlements`.
4. Integracje i AI egzekwują limity w runtime.

---

## 7.5) Backfill niespojnych danych

Skrypt jednorazowy:
- `apps/api/src/jobs/backfill-billing.ts`
- Tryb dry-run (domyslny): bez zmian w DB.
- Tryb apply: `BACKFILL_APPLY=1` (wymaga `DATABASE_URL`).

## 8) Powiadomienia o końcu triala

- Job dzienny (Cloud Scheduler + Cloud Function/Cloud Run job):
  - wysyła email/in-app 7 dni i 1 dzień przed `trial_ends_at`.
- Po `trial_expired`: blokada funkcji premium + przekierowanie do płatności.

---

## 9) UI monitoring

- `/billing/summary` zwraca: `plan`, `billingStatus`, `trialEndsAt`, `trialDaysLeft`.
- UI pokazuje: plan, status, dni do końca triala, limit AI, liczbę źródeł.

---

## 10) Panel admin (API)

Tylko role `owner`/`admin`:
- `GET /api/admin/ai-usage?tenantId=...`
- `GET /api/admin/sources?tenantId=...`
- `GET /api/admin/billing?tenantId=...`

---

## 11) Grace period

- Po `past_due` dostęp utrzymany przez:
  - `ENTITLEMENTS_GRACE_PERIOD_DAYS`

---

## 12) Usunięcie organizacji (GDPR)

- `POST /api/settings/org/delete` (roles: owner/admin)

---

## 13) Audyt zdarzeń

- Tabela `audit_events` w `docs/runbooks/cloudsql-schema.sql`
- Zdarzenia:
  - `stripe.webhook.processed`
  - `stripe.webhook.failed`
  - `org.delete`

Runbook rotacji hasła DB:
- `docs/runbooks/db-password-rotation.md`

---

## 14) Definition of Done (STG → PROD)

### STG
- Schema Cloud SQL zaaplikowany (`cloudsql-schema.sql`).
- `STRIPE_WEBHOOK_SECRET`, `DATABASE_URL`, `AI_USAGE_LIMIT_*` ustawione w API.
- Webhook `POST /api/billing/webhook` przyjmuje zdarzenia i zapisuje stan do `tenant_billing`.
- Retry job działa (Cloud Run Job + Scheduler).
- Limity AI i źródeł egzekwowane runtime.

### PROD
- Te same elementy działają w `papadata-platform-prod` po promocji.
