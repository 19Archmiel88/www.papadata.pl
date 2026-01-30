# Backend (GCP) ↔ Frontend — Integracja + workflow LOKAL → STG → PROD

> Cel: jednoznacznie opisać, **co musi być przygotowane w GCP i w konfiguracji aplikacji**, aby frontend mógł bezpiecznie i stabilnie komunikować się z backendem — oraz jak to przechodzi przez **nasz workflow**.

Dokument bazuje na: `dokumentacjaProdukcyjna/GCP.md`, `docs/runbooks/stg-release-api.md`, `docs/runbooks/stg-verification.md` (smoke), konfiguracji frontu `apps/web/config.ts` oraz API `apps/api/src/common/config.ts` i `apps/api/src/main.ts`.

---

## 0) Definicje i założenia (stan „jak robimy”)

- **Frontend**: `apps/web` (Vite/React).
- **Backend**: `apps/api` (NestJS/Fastify), globalny prefix **`/api`**.
- **Region**: `europe-central2` (Warszawa).
- **STG = PROD 1:1**: STG ma odzwierciedlać produkcję w usługach i infrastrukturze (różnią się projekty, domeny, sekrety).
- **Środowiska GCP**:
  - STG: `papadata-platform-stg`
  - PROD: `papadata-platform-prod`
- **Domeny używane w testach/runbookach**:
  - STG WEB: `https://stg.papadata.pl`
  - API (STG/PROD): `https://api.papadata.pl/api`
  - PROD WWW: `https://www.papadata.pl`

---

## 1) Workflow release (nasz docelowy)

### Etap 1 — Lokalnie: zmiany + weryfikacja

- Zmiany robisz lokalnie.
- Odpalasz API + WEB lokalnie.
- Uruchamiasz lint/testy i robisz smoke endpointów (JSON + SSE).

### Etap 2 — Push do Git → auto deploy na STG

- Push do repo.
- STG aktualizuje się automatycznie (Cloud Run / pipeline powiązany z repo).

### Etap 3 — STG: smoke + E2E

- Smoke: health, AI chat (JSON + SSE), CORS.
- E2E: rejestracja, płatności, integracje, limity/trial.

### Etap 4 — Promocja na PROD

- Po przejściu STG: jeden krok wdrożenia na `papadata-platform-prod`.
- Produkcyjny entrypoint: `https://www.papadata.pl`.

---

## 2) Wymagania infrastrukturalne po stronie GCP (MUST)

### 2.1 Cloud Run — API

- STG: serwis **`papadata-api-stg`** (deploy wg runbooka STG).
- PROD: serwis **`papadata-api-v2`** (wg status/checklist).
- Region: `europe-central2`.
- Publiczny dostęp (allow-unauthenticated) + autoryzacja w aplikacji (JWT/IdP) zgodnie z konfiguracją.

### 2.2 Global HTTPS Load Balancer + NEG (edge)

- HTTPS LB skonfigurowany z backend service → **serverless NEG** → Cloud Run.
- Managed Certificate aktywny dla `www.papadata.pl` (PROD).

### 2.3 Cloud Armor (WAF)

- Polityka `papadata-security-policy` podpięta do backend service dla API.

### 2.4 DNS (Cyber_Folks + Cloud DNS)

- Rejestrator domeny: Cyber_Folks.
- DNS zarządzany w Cloud DNS (NS ustawione w Cyber_Folks).
- `www.papadata.pl` wskazuje na IP LB.

### 2.5 Identity Platform (Auth)

- Włączone metody logowania: Email + Google + Microsoft.
- Auth Domain (z notatek): `papadata-platform-prod.firebaseapp.com`.

### 2.6 Secret Manager

- Sekrety (JWT, Stripe, itp.) trzymane w Secret Manager.
- Brak sekretów w kodzie i w froncie.
- Sekrety odseparowane per środowisko (STG/PROD) i docelowo per tenant.

---

## 3) Konfiguracja backendu (API) — wymagane zmienne

Źródło: `apps/api/src/common/config.ts` i `apps/api/.env.example`.

### 3.1 Minimalny zestaw

- `PORT=4000`
- `APP_MODE=demo|prod`
- `CORS_ALLOWED_ORIGINS=...` (dokładne originy WEB)
- AI (gdy włączone):
  - `VERTEX_PROJECT_ID`
  - `VERTEX_LOCATION=europe-central2`
  - `VERTEX_MODEL=gemini-2.5-flash-lite`
  - `AI_ENABLED`, `AI_ENABLED_DEMO`, `AI_ENABLED_PROD`
  - `AI_TIMEOUT_MS`, `AI_RATE_LIMIT_MAX`, `AI_RATE_LIMIT_WINDOW_MS`

### 3.2 STG values (z runbooków)

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

### 3.3 PROD values (wg założeń środowisk)

- `APP_MODE=prod`
- `PORT=4000`
- `VERTEX_PROJECT_ID=papadata-platform-prod`
- `VERTEX_LOCATION=europe-central2`
- `VERTEX_MODEL=gemini-2.5-flash-lite`
- `AI_ENABLED=true`
- `AI_ENABLED_DEMO=false`
- `AI_ENABLED_PROD=true`
- `CORS_ALLOWED_ORIGINS=https://www.papadata.pl`

---

## 4) Konfiguracja frontu (WEB) — wymagane zmienne

Źródło: `apps/web/config.ts` + `.env.example`.

### 4.1 Lokalne dev

- `VITE_API_BASE_URL=/api`
- `VITE_API_PROXY_TARGET=http://localhost:4000`

### 4.2 STG/PROD (wg runbooków testowych)

- API w testach idzie po: `https://api.papadata.pl/api`
- WEB:
  - STG: `https://stg.papadata.pl`
  - PROD: `https://www.papadata.pl`

---

## 5) Kontrakt routingu (CRITICAL)

- Backend działa pod prefiksem: **`/api`** (`apps/api/src/main.ts`).
- W smoke/runbookach przyjęte endpointy:
  - `https://api.papadata.pl/api/health`
  - `https://api.papadata.pl/api/ai/chat?stream=0`
  - `https://api.papadata.pl/api/ai/chat?stream=1` (SSE)

---

## 6) CORS — warunek konieczny

- CORS w API jest włączony.
- `CORS_ALLOWED_ORIGINS` musi zawierać dokładny origin WEB.

Przykład:

```bash
CORS_ALLOWED_ORIGINS=https://www.papadata.pl,https://stg.papadata.pl
```
