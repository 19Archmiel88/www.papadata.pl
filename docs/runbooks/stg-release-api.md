# STG Release Runbook — API (ETAP 2: PUSH -> AUTO DEPLOY NA STG)

## Cel i zakres
Wdrozenie backendu API na STG przez push do Git i Cloud Build. Po deployu
pipeline uruchamia `tools/verify-stg.mjs`.

## Wymagania
- Node.js: >=18.18 <23
- pnpm: >=9
- Projekt GCP: `papadata-platform-stg`
- Cloud Run region: `europe-central2`

## Wymagane ENV/Secrets (Cloud Run)
ENV:
- `APP_MODE=demo`
- `PORT=8080`
- `NODE_ENV=production`
- `CORS_ALLOWED_ORIGINS=https://stg.papadata.pl`
- `ENTITLEMENTS_PLAN=professional`
- `ENTITLEMENTS_BILLING_STATUS=active`
- `VERTEX_PROJECT_ID=papadata-platform-stg`
- `VERTEX_LOCATION=europe-central2`
- `VERTEX_MODEL=gemini-2.5-flash-lite`
- `AI_ENABLED=true`
- `AI_ENABLED_DEMO=true`
- `AI_ENABLED_PROD=false`
- `AI_RATE_LIMIT_MAX=30`
- `AI_RATE_LIMIT_WINDOW_MS=60000`
- `AI_TIMEOUT_MS=12000`

Secrets (Secret Manager -> Cloud Run):
- `DATABASE_URL`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Migracje (Cloud SQL)
Canonical path:
```bash
pnpm --filter @papadata/api run db:migrate
```
Plik referencyjny schematu:
- `docs/runbooks/cloudsql-schema.sql`

## Verifikacja po deployu
- `node tools/verify-stg.mjs`
- Logi Cloud Logging (brak 5xx po deployu)
