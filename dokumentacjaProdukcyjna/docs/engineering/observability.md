# Observability (Production + Public Demo)

## Cel

Zapewnić mierzalność jakości produktu w produkcji oraz odseparować metryki trybu DEMO od PROD.

## Co mierzymy (minimum)

### Frontend (SPA)

- czas renderu kluczowych widoków (np. Overview/Analytics)
- błędy runtime (Error Boundary)
- błędy sieciowe (API) i retry rate
- Web Vitals (LCP/INP/CLS) — zalecane

### AI (PROD i DEMO)

- latency (p50/p95)
- timeout rate
- safety blocks
- retries / cancel rate
- (opcjonalnie) token usage i koszt — jeśli dostępne po stronie backendu

### UX / Produkt

- kliknięcia CTA (np. „See Demo”, „Start Trial”)
- otwarcia AI drawer + wysłane wiadomości
- użycie kalkulatora ROI
- konwersje (trial/signup) — jeśli dotyczy

## Zasady danych i prywatności

- nie logujemy PII ani sekretów (także w eventach/telemetrii),
- w DEMO zbieramy wyłącznie metadane techniczne bez identyfikatorów osobowych (brak emaili, brak userId).

## Narzedzia (ustalone MVP)

- Frontend: Sentry (error + performance), DSN przez `VITE_OBSERVABILITY_DSN`.
- Backend: Sentry Node (ten sam vendor dla spojnosci).
- GCP Error Reporting: tylko jako baseline z Cloud Logging (bez procesu triage).
- Logi: Cloud Logging (backend), brak PII w payloadach.
- Metryki: Cloud Monitoring (latency, 4xx/5xx, uptime).
- Uptime checks: `/` i `/api/health` (Cloud Monitoring lub zewnetrzny probe).
- Produkt/UX: eventy tylko jesli potrzebne (CTA, AI drawer), z tagami `mode` i `env`.

Konfiguracja (minimum):

- Frontend:
  - `VITE_OBSERVABILITY_PROVIDER=sentry`
  - `VITE_OBSERVABILITY_DSN` ustawiane per env (np. demo: `env/apps-web.env.demo`)
- Backend:
  - `OBSERVABILITY_PROVIDER=sentry`
  - `OBSERVABILITY_DSN=...`
  - `NODE_ENV=dev|staging|prod`
- tagi w kazdym evencie: `mode=demo|prod`, `env=dev|staging|prod` (opcjonalnie `release`).
- sampling dopasowany do ruchu (osobno DEMO i PROD).

---

## Checklist wdrozenia obserwowalnosci (MVP)

- [ ] Sentry FE: DSN ustawiony per env, source maps w buildzie.
- [ ] Sentry BE: DSN ustawiony per env, release i env tagowane.
- [ ] Cloud Logging: logi BE bez PII, retention zgodna z polityka.
- [ ] Cloud Monitoring: uptime checki `/` i `/api/health`.
- [ ] Alerty: spike error rate, p95 latency, timeouty AI, 5xx.
- [ ] Tagowanie: `mode`, `env`, `release` w eventach.

## Alerty (minimum)

- spike bledow runtime (frontend) po release
- wzrost timeoutow AI / safety blocks (szczegolnie DEMO)
- wzrost 5xx i p95 latency backendu
- brak uptime na `/` lub `/api/health`
- (opcjonalnie) spadek konwersji, jesli mierzysz

## Tagowanie DEMO vs PROD

Każdy event/metryka powinny mieć wymiar:

- `mode = demo | prod`
- `env = dev | staging | prod`

To pozwala:

- nie mylić danych demo z rzeczywistą adopcją,
- szybciej wykrywać abuse na public demo.
