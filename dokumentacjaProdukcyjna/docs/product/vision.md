# PapaData Intelligence — Vision (Production)

## Cel produktu

PapaData Intelligence to komercyjna platforma analityczna dla e-commerce, która:

- scala rozproszone dane (sklep, reklamy, analityka) w spójny obraz,
- pokazuje wyniki w dashboardzie (KPI, wykresy, raporty),
- wspiera analizę przez kontekstowego asystenta AI (Gemini/Vertex).

## Publiczny Dashboard Demo 1:1 (wymóg produktu)

Wersja produkcyjna udostępnia publiczny dashboard DEMO dla użytkownika niezalogowanego/zarejestrowanego.
DEMO ma odzwierciedlać wygląd i funkcjonalność dashboardu zalogowanego **1:1**:

- te same ekrany i nawigacja,
- te same komponenty i interakcje,
- te same teksty i i18n,
- te same stany UI i zachowania.

Różnice w DEMO:

- dane są syntetyczne/mock (bez danych klienta),
- brak trwałej persystencji (zapisy symulowane lub nietrwałe),
- integracje są symulowane,
- AI bazuje na danych demo (predefiniowane pytania/rekomendacje są dozwolone).

## Zakres funkcjonalny (high-level)

### Landing page

- prezentacja możliwości platformy (IA w `docs/ux/information-architecture.md`),
- pricing + trial/demo flow,
- sekcje zaufania i bezpieczeństwa,
- stopka z linkami prawnymi.

### Dashboard (DEMO i PROD)

- layout: sidebar + topbar,
- widoki: Overview, Analytics, Reports, Customers, Products, Integrations, Support, Settings,
- globalne filtry + porównania + model atrybucji,
- AI Assistant Drawer zgodnie z „Trust UX”.

## Kryteria jakości (production baseline)

- Dostępność: minimum WCAG AA (focus, aria, klawiatura, kontrast, reduced motion).
- Stany UI: loading / empty / error / offline.
- i18n: pełne pokrycie tekstów UI (brak hard-coded strings).
- Bezpieczeństwo: brak sekretów w kliencie; AI przez backend; brak PII w demo.
- Observability: Sentry (FE/BE) + Cloud Logging/Monitoring dla uptime i 4xx/5xx.
