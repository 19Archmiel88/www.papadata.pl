# Security baseline (STG → PROD)

## Role / IAM (least privilege)

- Cloud Build SA:
  - `roles/artifactregistry.writer` (push image)
  - `roles/run.admin` (deploy) — ogranicz do konkretnych usług jeśli możliwe
- Runtime SA (Cloud Run):
  - `roles/secretmanager.secretAccessor` tylko do wymaganych sekretów (JWT, Stripe, DB)
  - `roles/logging.logWriter`
- Cloud Scheduler → Cloud Run Job (jeśli używane): `roles/run.invoker`
- Rotacja DB (job): `roles/cloudsql.client`, `roles/secretmanager.secretVersionAdder`

## Alerty (minimum)

- Deploy failed (Cloud Build trigger)
- 5xx spike na API (Cloud Monitoring alert policy)
- Health endpoint brak odpowiedzi 5+ minut
- (Opcja) Sentry alert na wzrost error rate po deployu

## STG/PROD checklist przed promocją

- Sekrety zmapowane przez Secret Manager (brak plaintext w `--set-env-vars`).
- `DATABASE_URL` wskazuje na właściwą instancję (STG/PROD).
- CORS: STG `https://stg.papadata.pl`, PROD `https://www.papadata.pl`.
- Webhook Stripe: `STRIPE_WEBHOOK_SECRET` ustawione; endpoint przyjmuje raw body.
- Smoke: `tools/verify-stg.mjs` / analogiczny na PROD (health + AI json + AI SSE + CORS).
- Observability: log queries zapisane (Cloud Logging) + dashboard.
