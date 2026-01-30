# Cloud SQL (Postgres) — konfiguracja + połączenie z Cloud Run

## Decyzja

- **TAK** (docelowa baza na GCP, region `europe-central2`).

## Konfiguracja (GCP)

- Utwórz instancję Postgres (prefer HA jeśli RPO/RTO wymagane).
- Ustaw:
  - Automated backups + PITR (jeśli dostępne) + retencja ≥ 7 dni.
  - Maintenance window (noc, okno niskiego ruchu).
  - Private IP + Serverless VPC Connector (dla Cloud Run) — unikamy publicznego IP.
- IAM:
  - Aplikacja: `roles/cloudsql.client` na runtime SA (tylko potrzebne projekty).
  - Job rotacji hasła: `roles/cloudsql.client` + `roles/secretmanager.secretVersionAdder`.

## Łączenie Cloud Run → Cloud SQL

- Używamy `DATABASE_URL` (postgres) z parametrami SSL:
  - `DATABASE_SSL_ENABLED=true`
  - `DATABASE_SSL_REJECT_UNAUTHORIZED=true` (jeśli certyfikaty poprawne)
- Mapuj `DATABASE_URL` z Secret Manager (`--set-secrets` lub YAML).
- Jeśli Private IP: podaj host z prywatnym adresem; zapewnij VPC connector w deployu.

## Migracje

- Canonical: `pnpm --filter @papadata/api run db:migrate`
- Tabela `schema_migrations` w DB zapewnia idempotencję.
- Referencja schematu: `docs/runbooks/cloudsql-schema.sql`.

## Weryfikacja

- Po deployu: `pnpm --filter @papadata/api run db:migrate` w STG.
- `SELECT count(*) FROM tenant_billing;` — sanity check.
- Smoke API: `tools/verify-stg.mjs` (AI json + SSE) — wymaga danych billing w DB.
