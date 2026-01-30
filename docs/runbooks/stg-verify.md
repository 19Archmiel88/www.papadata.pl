# STG Verification Runbook (Smoke + Checklist) — ETAP 3

## Cel i zakres

Weryfikacja STG po deployu (API + WEB). Pipeline `cloudbuild/stg.yaml`
uruchamia `tools/verify-stg.mjs` (smoke + SSE + CORS). Ten runbook rozszerza
weryfikacje o kroki manualne i logi.

## Wymagania

- GCP project: `papadata-platform-stg`
- Cloud Run: serwisy API i WEB w `europe-central2`
- Dostep do Cloud Logging
- `curl` lub PowerShell 7+

## Bazowe URL (STG)

- `API_BASE=https://api.papadata.pl/api`
- `WEB_BASE=https://stg.papadata.pl`

## Zmienne srodowiskowe (copy-paste)

### Windows (PowerShell)

```powershell
$env:API_BASE = "https://api.papadata.pl/api"
$env:WEB_BASE = "https://stg.papadata.pl"
$env:AUTH_TOKEN = "<opcjonalnie>"
$env:TENANT_ID = "<opcjonalnie>"
```

### macOS/Linux

```bash
export API_BASE="https://api.papadata.pl/api"
export WEB_BASE="https://stg.papadata.pl"
export AUTH_TOKEN="<opcjonalnie>"
export TENANT_ID="<opcjonalnie>"
```

## Automatyczny smoke (zalecane)

```bash
node tools/verify-stg.mjs
```

## Manualne checki (szybkie)

- `GET /api/health` -> 200
- `POST /api/ai/chat?stream=0` -> 200 JSON
- `POST /api/ai/chat?stream=1` -> SSE `[DONE]`
- CORS dla `Origin: https://stg.papadata.pl`

## Logi (Cloud Logging)

- Filtr: `resource.type="cloud_run_revision"` + nazwa serwisu
- Sprawdz: brak bledow 5xx po deployu
- Zapisz query jako „papadata-stg-5xx-after-deploy” (pod alert 5xx spike)
