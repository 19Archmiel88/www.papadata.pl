# Product — Scope & Non-goals (Production + Public Demo 1:1)

## Zakres (Scope) — Produkcja
Ten projekt dostarcza komercyjną aplikację SaaS oraz publiczny tryb DEMO.

### W scope (produkcyjnie)
- Landing page (zgodnie z `docs/ux/information-architecture.md`).
- Dashboard (zalogowany):
  - widoki: Overview, Analytics, Reports, Customers, Products, Integrations, Support, Settings,
  - spójne KPI i definicje wg `docs/engineering/data-model.md`,
  - stany UI: loading/empty/error/offline.
- Publiczny Dashboard DEMO 1:1:
  - te same ekrany, komponenty i zachowania co wersja zalogowana,
  - dane demo (mock/syntetyczne) spójne z modelem KPI,
  - symulowane mutacje (brak trwałych skutków),
  - AI w trybie demo (pytania/rekomendacje/insighty oparte o dane demo).
- AI Assistant:
  - streaming (jeśli używane), cancel, safety/blocked, timeout/offline, token budgeting,
  - oznaczenia „Odpowiedzi generowane przez AI”,
  - governance promptów.
- i18n PL/EN + theme (dark/light) przez tokeny.

### Kontrakt „DEMO = PROD 1:1” (twarde wymagania)
DEMO jest uznane za 1:1, jeśli:
- ma te same ekrany i nawigację (brak demo-only layout),
- ma te same komponenty i interakcje (filtry, wykresy, drill-down, raporty, AI drawer),
- ma te same teksty i tłumaczenia (poza oznaczeniami trybu demo),
- ma te same stany UI i błędy (różni się tylko dostawcą danych i persystencją),
- nie pokazuje PII ani danych klientów,
- jasno komunikuje „Tryb demo” + CTA do logowania/rejestracji.

## Poza zakresem (Non-goals)
Lista rzeczy, których nie planujemy jako część produktu (nie „jeszcze nie zrobione”):
- Funkcje niezwiązane z analityką e-commerce (np. CMS/ERP jako osobny produkt).
- Gwarancje „100% accuracy” dla AI i automatyczne podejmowanie decyzji bez udziału człowieka.
- Write-back do platform reklamowych (np. bezpośrednia edycja budżetów w Meta/Google) nie jest częścią obecnego produktu; wszelkie rekomendacje trafiają do użytkownika do manualnej akceptacji.

## Definicja “done” — Produkcja (minimum)
- Auth i sesje: w produkcji bazujemy na JWT generowanych przez `apps/api` (`JwtService`) oraz na integracji z Firebase (patrz `FirebaseAuthGuard`). Tokeny zawierają `tenantId`, role i są weryfikowane przez middleware (`AppAuthGuard` + `Throttler`). Magic linki/mailowe logowanie, rejestracja z walidacją NIP/firmy i sesje w tokenach HTTP-only zapewniają silne uwierzytelnienie bez przechowywania haseł po stronie klienta. Role (`owner`, `admin`, `user`) są propagowane do odpowiedzialnych usług.
- Dane produkcyjne: pipeline pobiera dane z źródeł typu Shopify/Allegro (platforma e-commerce), Meta Ads / Google Ads (kampanie) oraz GA4 i BigQuery (dane analityczne). `apps/etl` i `libs/shared` transformują je do jednego modelu KPI, walidując spójność, metryki i świeżość (codzienny refresh, alerty o opóźnieniach w `apps/api/src/modules/dashboard/dashboard.service.ts`). Dane są maskowane tam, gdzie są PII, a retencja jest zarządzana przez polityki opisane w `docs/operations/backups-and-retention.md`.
- Observability: Sentry (główny DSN w `VITE_OBSERVABILITY_DSN`/`OBSERVABILITY_DSN`) rejestruje błędy, a logging middleware (`apps/api/src/common/logging.middleware.ts`) dopisuje identyfikatory requestów. Frontend przesyła telemetryjne eventy przez `utils/telemetry.ts`, a `telemetry` i `consent-mode` ustalają tagi GA4/Meta w oparciu o zgodę. Alerty o błędach i opóźnieniu danych (np. `GuardianViewV2`) są powiązane z SLO – incydenty, które łamią SLA (np. >5% zapytań z błędem) są eskalowane do zespołu ops, a wyniki zapisujemy w `docs/operations/incident-response.md`.
- Security baseline: zgodnie z `docs/engineering/security.md`.
- Operacje: incident response, backup/retencja, release/rollback.
- Legal/compliance: komplet dokumentów + procesy (DSAR, subprocessors, eksport danych).
- Dostępność: minimum WCAG AA + deklaracja.

## Definicja “done” — Publiczny DEMO 1:1
- Wszystkie widoki dostępne bez logowania.
- Dane demo spójne w całym produkcie (zalecany seed + deterministyczny dataset).
- Integracje w demo są wyłącznie symulowane i jasno opisane.
- AI demo:
  - sugerowane pytania + rekomendacje + odpowiedzi oparte o dane demo,
  - brak możliwości przekazania PII/sekretów (walidacja/ostrzeżenia),
  - mechanizmy rate limiting i anti-abuse są scalone z backendową ochroną AI (throttler 60s/100 req) oraz frontendowym blokowaniem szybkich kliknięć w `PapaAI` i telemetryką wykrywającą nienaturalne wzorce (metoda `logTelemetry`).
