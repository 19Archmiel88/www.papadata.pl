# Engineering — Deploy (Production + Public Demo 1:1)

Ten dokument opisuje produkcyjny proces budowania i wdrazania aplikacji (SPA) oraz backendu API.
Publiczny DEMO jest czescia produktu i musi byc wdrazany tym samym procesem.

Powiazane:

- Architecture: `architecture.md`
- Runbook: `../operations/runbook.md`
- Security: `security.md`
- Observability: `observability.md`

---

## 1) Build

Frontend (SPA):

```bash
pnpm run build
```

Backend (API):

```bash
pnpm run api:build
```

Artefakty:

- `apps/web/dist` (statyczny bundle)
- `apps/api/dist` (build NestJS)

---

## 2) CI/CD (Cloud Build + Cloud Run)

Repo (source of truth):

- STG pipeline: `cloudbuild/stg.yaml` (build/test → obrazy → deploy).
- PROD pipeline: `cloudbuild/prod.yaml` (promocja istniejących obrazów).
- Dockerfiles: `apps/api/Dockerfile`, `apps/web/Dockerfile`.

---

## 3) Srodowiska i konfiguracja

Zakladane srodowiska: `dev`, `staging`, `prod`.

Kluczowe zmienne:

- `APP_MODE=demo|prod` (tryb API; DEMO vs PROD)
- `AI_ENABLED`, `AI_ENABLED_DEMO`, `AI_ENABLED_PROD`
- `VITE_API_BASE_URL=/api` (frontend)

Zasady:

- tryb DEMO/PROD rozstrzyga backend, nie frontend.
- sekrety tylko po stronie serwera (Secret Manager / KMS).
- w DEMO brak operacji z trwalymi skutkami.

---

## 4) Hosting i routing

### Frontend (SPA)

Rekomendacje:

- Cloud Storage + CDN **lub** Cloud Run (serwis `web`)

Wymagane:

- rewrite wszystkich tras SPA do `index.html` (np. `/dashboard/*`)
- wyjatek dla `/api/*` (routowane do backendu)

### Backend (API)

Rekomendacje:

- Cloud Run (serwis `api`) w regionie produkcyjnym
- health check: `GET /api/health`

---

## 5) Cache policy (minimum)

Frontend:

- `index.html`: `Cache-Control: no-store` (zawsze swieza wersja)
- assets z hashem: `Cache-Control: public, max-age=31536000, immutable`

Backend:

- cache kontrolowany przez API (jesli dotyczy)

---

## 6) Security headers (minimum)

Wymagane naglowki (dostosuj do realnych providerow i domen):

- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`
- `Content-Security-Policy` (CSP) dopasowane do Sentry/analytics/fonts

Przykladowy CSP (do dopasowania):

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self' https://*.sentry.io;
frame-ancestors 'none';
base-uri 'self';
```

> Uwaga: CSP musi byc zgodne z faktycznymi integracjami (Sentry, analytics, fonty).

---

## 7) Rollback (minimum)

Strategia:

- utrzymuj co najmniej 1 poprzednia wersje frontend i backend
- rollback musi byc szybki i przewidywalny

Przyklady:

- Cloud Run: rollback przez promocje poprzedniej rewizji
- Hosting statyczny: wersjonowany bucket lub znacznik release (np. `release/2026-01-10`)

Po rollbacku:

- smoke test (`/` + `/dashboard/overview` + `/api/health`)
- obserwacja metryk i bledow (min. 30-60 min)

---

## 8) Deploy checklist (minimum)

- [ ] build FE i BE bez bledow
- [ ] deploy FE (rewrites + cache + headers)
- [ ] deploy BE (health check OK)
- [ ] /api/health zwraca `mode=demo|prod` zgodnie z konfiguracja
- [ ] DEMO = PROD 1:1 (te same widoki; roznica tylko w providerach danych)
- [ ] CSP i headers aktywne
- [ ] metryki/alerty dzialaja (tagi `mode`/`env`)
- [ ] rollback gotowy (poprzednia wersja dostepna)

---

## 9) Smoke tests po deployu

- landing laduje sie bez bledow
- przejscie do dashboardu DEMO dziala
- kluczowe widoki dashboardu sie renderuja
- AI drawer: wyslanie promptu zwraca odpowiedz lub czytelny fallback
- `GET /api/health` oraz kluczowe endpointy dashboardu odpowiadaja
