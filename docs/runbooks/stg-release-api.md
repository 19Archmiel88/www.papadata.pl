# STG Release Runbook — API (ETAP 2: PUSH → AUTO DEPLOY NA STG)

## Cel i zakres
Wdrożenie backendu API na środowisko **STG** poprzez **push do Git** i automatyczny deploy do **Cloud Run** w projekcie `papadata-platform-stg`, wraz z weryfikacją po deployu (smoke + logi).

---

## Wymagania

### Zależności lokalne
- Node.js: >=18.18 <23 (zalecane 20/22 LTS)
- pnpm: >= 9

### STG (GCP)
- Projekt: `papadata-platform-stg`
- Cloud Run (region): `europe-central2`
- Publiczny dostęp: HTTPS 443

### Konfiguracja środowiska (STG) — wymagane wartości w Cloud Run (ENV)
Minimalny zestaw zmiennych środowiskowych **na STG**:
- `APP_MODE=demo`
- `PORT=4000`
- `VERTEX_PROJECT_ID=papadata-platform-stg`
- `VERTEX_LOCATION=europe-central2`
- `VERTEX_MODEL=gemini-2.5-flash-lite`
- `AI_ENABLED=true`
- `AI_ENABLED_DEMO=true`
- `AI_ENABLED_PROD=false`
- `AI_TIMEOUT_MS=12000`
- `AI_RATE_LIMIT_MAX=30`
- `AI_RATE_LIMIT_WINDOW_MS=60000`
- `CORS_ALLOWED_ORIGINS=https://stg.papadata.pl`

---

## Kroki lokalne (copy-paste)

### Build (Windows PowerShell)
```powershell
Set-Location C:\path\to\www.papadata.pl
pnpm install
pnpm run api:build
