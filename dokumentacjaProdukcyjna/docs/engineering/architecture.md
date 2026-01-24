# Engineering — Architecture (Production + Public Demo 1:1)

## Typ projektu
- Frontend: Vite SPA (React + TypeScript)
- Produkt: komercyjny SaaS + publiczny dashboard DEMO 1:1
- Demo dane: mock/syntetyczne (bez danych klienta)

Powiązane:
- AI integration: `ai-integration.md`
- Deploy: `deploy.md`
- Security baseline: `security.md`
- Data model: `data-model.md`

---

## Zasada DEMO 1:1 (kontrakt architektury)
Tryb DEMO nie może wprowadzać “demo-only UI”.
Tryb wpływa wyłącznie na:
- **DataProvider** (źródło danych),
- **AiProvider / AI proxy** (źródło odpowiedzi),
- **Mutacje/persystencję** (symulacja vs zapis).

Nie wpływa na:
- routing ekranów i layout,
- komponenty prezentacyjne,
- i18n i theme,
- stany UI (loading/empty/error/offline).

---

## Mode selection (jak wybieramy DEMO vs PROD)
Stan obecny (repo):
- Wspolny routing `/dashboard/*`.
- Backend: `APP_MODE=demo|prod` w `apps/api/.env.*` determinuje tryb API.
- Frontend **nie jest** granica bezpieczenstwa; parametry URL lub przelaczniki UI sa tylko informacyjne.

Opcje:
1) **Wspólny routing (rekomendowane dla 1:1)**  
   - `/dashboard/*` — jeśli sesja istnieje → PROD, jeśli brak sesji → DEMO

2) **Oddzielne ścieżki**  
   - `/demo/dashboard/*` — DEMO  
   - `/app/dashboard/*` — PROD

W obu przypadkach:
- DEMO ma stale widoczne oznaczenie “Demo mode” + CTA do rejestracji (UX specy: `../ux/ui-specs/*`; source of truth UI w repo: `../../../docs/ui-spec/00_INDEX.md`).

---

## Routing (minimum)
- `/` — landing
- `/dashboard/*` (lub `/demo/*` + `/app/*`) — dashboard
- `/legal/*` — strony dokumentów prawnych renderowane przez `LegalRoute` w [apps/web/App.tsx](../../apps/web/App.tsx#L150-L220)

---

## Warstwy systemu

### Frontend (SPA)
Odpowiedzialności:
- UI: layouty + strony dashboard + landing
- State: lokalny stan i contexty (theme, i18n, ai)
- **Providers:**
  - `DemoDataProvider` vs `ProdDataProvider`
  - `DemoAiProvider` (mock) vs AI przez backend proxy
  - `MutationService`: DEMO = symulacja / PROD = zapis przez backend

### Backend API (produkcja)
Backend istnieje w repo (`apps/api`) i jest zbudowany w oparciu o NestJS.

Wymagane odpowiedzialności:
- auth/session (zalogowany dashboard)
- endpoints do danych dashboardu
- integracje (connect/sync/status)
- exporty (np. data export / Data Act)
- proxy do AI + rate limiting + logging (bez PII)

Kontrakty odpowiedzi/typow:
- `libs/shared/src/contracts/*`

Hosting:
- Cloud Run (szczegóły w `deploy.md`).

### Data layer (produkcja)
- Warehouse: BigQuery (region europe-central2) zgodnie z [dokumentacjaProdukcyjna/GCP.md](../../GCP.md)
- Ingest/ETL: Cloud Run Jobs + Scheduler + Pub/Sub (pipeline w GCP)
- Transformacje: Dataform / SQL (wg standardu GCP)
W repo nie ma implementacji ETL/warehouse — to infrastruktura poza kodem aplikacji.

Wymagane:
- model KPI (lineage i definicje)
- jakość danych (freshness/completeness/anomalies)

---

## Key flows (minimum)

### Flow A: Public DEMO (bez logowania)
1) Użytkownik wchodzi na dashboard w trybie DEMO.
2) Frontend pobiera dane z `DemoDataProvider` (lokalne mocki/generator).
3) Akcje “write” są symulowane (toasty/modale), bez requestów write do realnych usług.
4) AI działa przez mock lub przez backend z twardym ograniczeniem (jeśli włączone) — zgodnie z `ai-integration.md`.

### Flow B: PROD (zalogowany)
1) Użytkownik loguje się przez endpointy auth (`/api/auth/login`, `/api/auth/register`, `/api/auth/magic-link`) i zapisuje token sesji w `localStorage` (UI) — [apps/api/src/modules/auth/auth.controller.ts](../../apps/api/src/modules/auth/auth.controller.ts#L1-L35).
2) Frontend pobiera dane z `ProdDataProvider` (API).
3) Mutacje idą przez backend (z RBAC).
4) AI: frontend → `/api/ai/chat` → provider AI.

### Flow C: AI request (PROD/DEMO)
- Zawsze przez backend proxy (jeśli używasz realnego providera).
- DEMO: rate limit + abuse protection + brak PII.

---

## Mockowanie i walidacje (DEMO)
- Formularze demo: walidacja + symulacja sukcesu/błędu/timeout.
- Integrations: stan symulowany (Connected/Disconnected) + jasny komunikat “tryb demo”.
- Zalecenie: dataset DEMO deterministyczny (seed) dla spójnych wniosków AI.

---

## Performance
- Style: `src/styles/theme.css` jako source of truth + `main.css`
- Lazy loading:
  - route-level (landing/dashboard)
  - ciężkie komponenty (wykresy, player)
- Bundle split: preferowane (landing vs dashboard)

---

## Deployment (produkcja)
- SPA: build (`vite build` -> `dist/`) + hosting statyczny + rewrites do `index.html`.
- Backend API: wdrozenie przez CI/CD (hosting opisany w `deploy.md`).
- Sekrety: tylko po stronie serwera (secrets manager).

Szczegóły: `deploy.md`.
