# Local Verification Runbook (API + WEB) — ETAP 1 (LOKAL)

## Cel i zakres
Pełna lokalna weryfikacja integracji API (frontend + backend) + testy automatyczne + ręczny smoke (JSON + SSE).  
Ten etap jest warunkiem wejścia w **ETAP 2: push do Git → auto deploy na STG**.

## Wymagania

### Zależności
- Node.js: >=18.18 <23 (zalecane 20/22 LTS)
- pnpm: >= 9

### Porty
- API: 4000
- WEB: 3000 (Vite dev server)

### Zmienne środowiskowe
Skopiuj przykłady i ustaw wartości minimalne.

**API:** `apps/api/.env.example`
- `APP_MODE=demo|prod`
- `PORT=4000`
- `AI_ENABLED`, `AI_ENABLED_DEMO`, `AI_ENABLED_PROD`
- `AI_TIMEOUT_MS=12000`
- `CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173`

**WEB:** `apps/web/.env.example`
- `VITE_API_BASE_URL=/api`
- `VITE_API_PROXY_TARGET=http://localhost:4000`
- `VITE_API_TIMEOUT_MS=25000`
- `VITE_API_AI_TIMEOUT_MS=60000`
- `VITE_API_RETRY_MAX=2`
- `VITE_API_RETRY_DELAY_MS=300`

---

## Uruchomienie lokalnie (2 terminale)

### Windows (PowerShell) — Terminal 1 (API)
```powershell
Set-Location C:\path\to\www.papadata.pl
pnpm install

Copy-Item -Path apps\api\.env.example -Destination apps\api\.env.local -Force
Copy-Item -Path apps\web\.env.example -Destination apps\web\.env.local -Force

pnpm run api:dev
