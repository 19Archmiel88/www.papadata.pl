# STG Verification Runbook (Smoke + Checklist) — (ETAP 3: TESTY NA STG)

## Cel i zakres
Weryfikacja środowiska STG po wdrożeniu (API + WEB) po **automatycznym deployu po push do Git**. Obejmuje szybkie smoke testy kluczowych endpointów, kontrolę CORS i sanity check logów/metryk.

Uwaga: pipeline `cloudbuild/stg.yaml` wykonuje minimalny smoke (HTTP 200). Ten runbook rozszerza weryfikację o dodatkowe kroki ręczne.

## Wymagania

### Dostępy
- GCP project: `papadata-platform-stg`
- Cloud Run: serwis API i WEB w regionie `europe-central2`
- Dostęp do logów w Cloud Logging

### Zależności lokalne
- `curl` (macOS/Linux) lub PowerShell 7+ (Windows)

### Porty
- HTTPS: 443

### Bazowe URL (STG)
- `API_BASE=https://api.papadata.pl/api`
- `WEB_BASE=https://stg.papadata.pl`

Jeśli używasz innych domen w STG, ustaw `API_BASE` i `WEB_BASE` przed testem.

---

## Ustawienie zmiennych do testów (copy-paste)

### Windows (PowerShell)
```powershell
$env:API_BASE = "https://api.papadata.pl/api"
$env:WEB_BASE = "https://stg.papadata.pl"
