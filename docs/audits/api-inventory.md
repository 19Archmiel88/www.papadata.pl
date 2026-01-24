# API Inventory (frontend + backend) — workflow LOKAL → STG → PROD

## Cel i zakres
Ten dokument opisuje pełny inwentarz połączeń API w repozytorium (apps/web + apps/api + libs/shared), mapuje ścieżki na źródła w kodzie, kontrakty odpowiedzi i miejsca użycia w UI, a także wskazuje braki i ryzyka, które blokują stan:
**LOKAL (zweryfikowane) → STG (auto deploy + testy) → PROD (promocja).**

Zakres obejmuje:
- Endpointy REST + streaming (SSE) obsługiwane przez backend.
- Wywołania HTTP po stronie frontendowej.
- Kontrakty typów odpowiedzi z libs/shared.
- Rozbieżności (endpointy oczekiwane przez UI, ale brakujące w backendzie).

---

## Docelowy workflow (twarde etapy)

### Etap 1 — Zmiany i testy lokalnie
- Pracujesz lokalnie (kod, Terraform/SQL, konfiguracje).
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
- Multi-tenant: rejestracja tworzy osobny dataset per klient; trial 14 dni Professional; po braku płatności premium blokowane; po płatności aktywacja wg planu (Starter/Professional/Enterprise).
- Sekrety/konfiguracje odseparowane per środowisko i per tenant.

---

## Wymagania

### Środowisko
- Node.js: >=18.18 <23 (zalecane 20/22 LTS)
- pnpm: >= 9 (repo używa pnpm na podstawie pnpm-lock.yaml)
- Porty: API domyślnie 4000, WEB domyślnie 3000 (Vite dev server)

### Kluczowe zmienne środowiskowe — API
Plik: [apps/api/.env.example](../../apps/api/.env.example)
- APP_MODE=demo|prod
- PORT=4000
- CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,...
- AI_ENABLED, AI_ENABLED_DEMO, AI_ENABLED_PROD
- AI_RATE_LIMIT_MAX, AI_RATE_LIMIT_WINDOW_MS, AI_TIMEOUT_MS
- VERTEX_PROJECT_ID, VERTEX_LOCATION, VERTEX_MODEL
- STRIPE_SECRET_KEY, STRIPE_CUSTOMER_ID, STRIPE_PORTAL_RETURN_URL
- JWT_SECRET, JWT_ISSUER, JWT_AUDIENCE
- OBSERVABILITY_PROVIDER, OBSERVABILITY_DSN

### Kluczowe zmienne środowiskowe — WEB
Plik: [apps/web/.env.example](../../apps/web/.env.example)
- VITE_API_BASE_URL=/api
- VITE_API_PROXY_TARGET=http://localhost:4000
- VITE_API_TIMEOUT_MS (opcjonalnie)
- VITE_API_AI_TIMEOUT_MS (opcjonalnie)
- VITE_API_RETRY_MAX, VITE_API_RETRY_DELAY_MS (opcjonalnie)
- VITE_AI_CLIENT_RATE_LIMIT_MAX, VITE_AI_CLIENT_RATE_LIMIT_WINDOW_MS (opcjonalnie)
- VITE_OBSERVABILITY_PROVIDER, VITE_OBSERVABILITY_DSN

---

## Etap 1 — Kroki uruchomienia lokalnie (copy-paste)

### Windows (PowerShell)
```powershell
Set-Location C:\path\to\www.papadata.pl
pnpm install

Copy-Item -Path apps\api\.env.example -Destination apps\api\.env.local -Force
Copy-Item -Path apps\web\.env.example -Destination apps\web\.env.local -Force

pnpm run api:dev
