# API Response Safety Audit — workflow LOKAL → STG → PROD

## Cel i zakres

Dokument weryfikuje klasę ryzyk „brak odpowiedzi / reset połączenia” w backendzie oraz spójność odpowiedzi po stronie frontendowej. Skupia się na:

- Handlerach z @Res({ passthrough: false }) i wszystkich ścieżkach odpowiedzi.
- Endpointach streamingowych (SSE) i poprawności zakończenia strumienia.
- Rozbieżnościach ścieżek i brakujących endpointach, które w praktyce skutkują 404 i „wiszącymi” flow w UI.

---

## Docelowy workflow (twarde etapy)

### Etap 1 — Zmiany i testy lokalnie

- Pracujesz lokalnie (kod).
- Uruchamiasz API + WEB lokalnie.
- Uruchamiasz lint + testy + smoke.

### Etap 2 — Push do Git → automatyczny deploy na STG

- Wypychasz zmiany do swojego repo.
- STG (`papadata-platform-stg`) aktualizuje się automatycznie (Cloud Run / CI/CD).
- STG ma być 1:1 z PROD (usługi/infrastruktura), różnią się projekty/domeny/sekrety.

### Etap 3 — Testy na STG (smoke + E2E)

- Wykonujesz STG smoke checklist (health, AI JSON/SSE, CORS, logi).
- Robisz E2E: rejestracja, płatności, integracje, limity, trial.

### Etap 4 — Promocja na PROD

- Po pozytywnych testach na STG wykonujesz promocję na `papadata-platform-prod`.
- Produkcyjna domena: `www.papadata.pl`.

---

## Wymagania

### Środowisko

- Node.js: >=18.18 <23 (zalecane 20/22 LTS)
- pnpm: >= 9
- Porty: API 4000, WEB 3000 (Vite dev server)

### Kluczowe zmienne środowiskowe — API

Plik: [apps/api/.env.example](../../apps/api/.env.example)

- APP_MODE, PORT
- AI_ENABLED, AI_TIMEOUT_MS
- VERTEX_PROJECT_ID, VERTEX_LOCATION, VERTEX_MODEL
- STRIPE_SECRET_KEY, STRIPE_PORTAL_RETURN_URL
- CORS_ALLOWED_ORIGINS

### Kluczowe zmienne środowiskowe — WEB

Plik: [apps/web/.env.example](../../apps/web/.env.example)

- VITE_API_BASE_URL
- VITE_API_PROXY_TARGET
- VITE_API_AI_TIMEOUT_MS

---

## Etap 1 — Kroki uruchomienia lokalnie (copy-paste)

### Windows (PowerShell)

```powershell
Set-Location C:\path\to\www.papadata.pl
pnpm install
Copy-Item -Path apps\api\.env.example -Destination apps\api\.env.local -Force
Copy-Item -Path apps\web\.env.example -Destination apps\web\.env.local -Force
pnpm run api:dev

W drugim terminalu

cd /path/to/www.papadata.pl
pnpm run dev

Etap 1 — Kroki testów (copy-paste)

Set-Location C:\path\to\www.papadata.pl
pnpm run lint:api
pnpm run lint:web
pnpm run test:api:e2e
pnpm run test:web:unit
pnpm run test:smoke

$apiBase = "http://localhost:4000/api"
$body = @{ prompt = "Test JSON"; messages = @(); context = @{ view = "overview"; dateRange = @{ start = "2026-01-01"; end = "2026-01-20"; preset = "30d" } } } | ConvertTo-Json -Depth 6
Invoke-RestMethod -Method Post -Uri "$apiBase/ai/chat?stream=0" -ContentType "application/json" -Body $body

```
