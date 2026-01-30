# Checklist Release — LOKAL → STG → PROD (PapaData)

## Cel

Jeden, spójny workflow: **zmiany lokalnie → push do Git → auto deploy na STG (Cloud Run) → testy STG → jednokomendowy deploy na PROD**.

## Workflow (docelowy)

1. **LOKAL**: zmiany + uruchomienie API/WEB + testy (lint/e2e/unit/smoke)
2. **GIT PUSH**: push do repo → **automatyczny deploy na STG** (`papadata-platform-stg`, Cloud Run, infra 1:1 z PROD)
3. **STG**: smoke + e2e (rejestracja/płatności/integracje) + logi/observability
4. **PROD**: po pozytywnych testach → **jednokomendowy deploy na PROD** (`papadata-platform-prod`) pod `www.papadata.pl`

Repo CI/CD (source of truth):

- STG trigger: push do `main` → `cloudbuild/stg.yaml`.
- PROD trigger: tag `v*` lub manual → `cloudbuild/prod.yaml` (promocja istniejących image’ów).
- Setup w GCP: `docs/runbooks/gcp-ci-setup.md`.

---

## 1) Wymagane env vars (LOCAL vs STG)

### WEB (Vite)

Źródła: `apps/web/.env.example`, `env/apps-web.env.demo`

| Zmienna                     | LOCAL                   | STG                                                          | Uwagi                                                                             |
| --------------------------- | ----------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| VITE_API_BASE_URL           | `/api`                  | `/api` **lub** pełny URL (np. `https://api.papadata.pl/api`) | Lokalnie działa przez proxy Vite. Na STG zwykle pełny URL lub path-based routing. |
| VITE_API_PROXY_TARGET       | `http://localhost:4000` | (puste)                                                      | Tylko lokalnie.                                                                   |
| VITE_OBSERVABILITY_PROVIDER | `none`                  | `sentry`                                                     | Jeśli dotyczy.                                                                    |
| VITE_OBSERVABILITY_DSN      | (puste)                 | (DSN STG)                                                    | Jeśli dotyczy.                                                                    |

### API (Nest / Fastify)

Źródła: `apps/api/.env.example`, `env/apps-api.env.demo`

| Zmienna                 | LOCAL                                         | STG                       | Uwagi                     |
| ----------------------- | --------------------------------------------- | ------------------------- | ------------------------- |
| APP_MODE                | `demo`                                        | `demo`                    | STG działa w trybie demo. |
| PORT                    | `4000`                                        | `8080`                    | Cloud Run port 8080.      |
| VERTEX_PROJECT_ID       | (lokalnie puste lub stg)                      | `papadata-platform-stg`   | Wymagane do AI.           |
| VERTEX_LOCATION         | `europe-central2`                             | `europe-central2`         | Warszawa.                 |
| VERTEX_MODEL            | `gemini-2.5-flash-lite`                       | `gemini-2.5-flash-lite`   | —                         |
| AI_ENABLED              | `true`                                        | `true`                    | —                         |
| AI_ENABLED_DEMO         | `true`                                        | `true`                    | —                         |
| AI_ENABLED_PROD         | `true`                                        | `false`                   | —                         |
| AI_TIMEOUT_MS           | `12000`                                       | `12000`                   | —                         |
| AI_RATE_LIMIT_MAX       | `30`                                          | `30`                      | —                         |
| AI_RATE_LIMIT_WINDOW_MS | `60000`                                       | `60000`                   | —                         |
| CORS_ALLOWED_ORIGINS    | `http://localhost:3000,http://localhost:5173` | `https://stg.papadata.pl` | Ustaw wg domeny STG.      |
| OBSERVABILITY_PROVIDER  | `none`                                        | (np. `sentry`)            | Jeśli dotyczy.            |
| OBSERVABILITY_DSN       | (puste)                                       | (DSN STG)                 | Jeśli dotyczy.            |

---

## 2) Etap 1 — LOKAL: uruchomienie (2 terminale)

### Terminal 1 — API

```powershell
Set-Location C:\path\to\www.papadata.pl
pnpm install
Copy-Item -Path apps\api\.env.example -Destination apps\api\.env.local -Force
pnpm run api:dev
```
