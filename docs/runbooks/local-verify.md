# Local Verification Runbook (API + WEB) — ETAP 1 (LOKAL)

## Cel i zakres
Pełna lokalna weryfikacja integracji API (frontend + backend) + testy automatyczne + ręczny smoke (JSON + SSE).  
Ten etap jest warunkiem wejścia w **ETAP 2: push do Git → auto deploy na STG**.

## Wymagania

### Zależności
- Node.js: >=18.18 <23 (zalecane 20/22 LTS)
- pnpm: >= 9
- Playwright browsers (smoke/E2E): `pnpm --filter @papadata/web exec playwright install`

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
- `DATABASE_URL` (jesli uruchamiasz DB lokalnie)

Jeśli DB jest skonfigurowana, odpal migracje:
```bash
pnpm --filter @papadata/api run db:migrate
```

**WEB:** `apps/web/.env.example`
- `VITE_API_BASE_URL=/api`
- `VITE_API_PROXY_TARGET=http://localhost:4000`
- `VITE_API_TIMEOUT_MS=25000`
- `VITE_API_AI_TIMEOUT_MS=60000`
- `VITE_API_RETRY_MAX=2`
- `VITE_API_RETRY_DELAY_MS=300`

### Windows troubleshooting (EPERM / esbuild)
- Uruchom `pnpm run diagnose:windows`, jeśli instalacja lub Vite kończą się EPERM.
- Gdy nie da się usuwać `_tmp_*` w katalogu repo, napraw ACL/AV albo przenieś repo poza chronione ścieżki.
- `pnpm --filter @papadata/web dev` używa `apps/web/scripts/run-vite.mjs` i ustawia `ESBUILD_BINARY_PATH`, jeśli binarka jest dostępna.

---

## Uruchomienie lokalnie (2 terminale)

### Windows (PowerShell) — Terminal 1 (API)
```powershell
Set-Location C:\path\to\www.papadata.pl
pnpm install

Copy-Item -Path apps\api\.env.example -Destination apps\api\.env.local -Force
Copy-Item -Path apps\web\.env.example -Destination apps\web\.env.local -Force

pnpm run api:dev
