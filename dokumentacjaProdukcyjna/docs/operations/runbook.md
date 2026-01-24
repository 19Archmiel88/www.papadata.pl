# Operations — Runbook (Production + Public Demo 1:1)

Runbook opisuje operacje i procedury utrzymania środowisk **staging/prod**, w tym publicznego trybu **DEMO (1:1)**.

Powiązane dokumenty:
- Incident response: `incident-response.md`
- Backups & retention: `backups-and-retention.md`
- Deploy (SPA rewrites/cache/rollback): `../engineering/deploy.md`
- Observability: `../engineering/observability.md`
- Security baseline: `../engineering/security.md`
- AI integration (proxy/bezpieczeństwo): `../engineering/ai-integration.md`

---

## 1) Zakres i zasady

### 1.1 Środowiska objęte runbookiem
- **local (dev)**: uruchomienie developerskie.
- **staging**: środowisko testów przed wdrożeniem.
- **prod**: środowisko produkcyjne.
- **public demo**: publiczny dostęp do dashboardu (tryb demo), utrzymywany “produkcyjnie”.

### 1.2 DEMO = PROD 1:1 (operacyjnie)
DEMO jest uznane za 1:1 jeśli:
- ma te same ścieżki i layout co aplikacja po zalogowaniu,
- różni się tylko providerami danych/AI/persystencji,
- nie pokazuje PII ani danych realnych klientów,
- akcje “write” są blokowane lub symulowane (brak trwałych skutków),
- metryki/telemetria są tagowane `mode=demo|prod`.

---

## 2) Środowiska (URL, region, dostęp)

- local:
  - WEB: `http://localhost:3000`
  - API: `http://localhost:4000/api`
  - dostęp: lokalny
- staging:
  - WEB: `https://stg.papadata.pl`
  - API: `https://api.papadata.pl/api`
  - region: `europe-central2`
  - dostęp: publiczny
- prod:
  - WEB: `https://www.papadata.pl`
  - API: `https://api.papadata.pl/api`
  - region: `europe-central2`
- public demo:
  - URL: `https://www.papadata.pl` (tryb demo w aplikacji)
  - uwagi: publiczny ruch = wyższe ryzyko abuse

---

## 3) Dostępy i odpowiedzialności (ops/admin)

> Zasada: least privilege.

### 3.1 Role
- On-call / Incident Commander: On-call Lead
- Frontend owner: Frontend Lead
- Backend/API owner: Backend Lead
- Security/Legal contact: security@papadata.pl / legal@papadata.pl
- Support contact: support@papadata.pl

### 3.2 Dostępy (minimum)
- Hosting/CDN (statyczne pliki): Cloud Run / Cloud Storage + CDN
- Konfiguracja rewrites/headers/cache: Cloud Run (frontend) / LB rules
- Observability (error tracking/metryki/logi): Sentry, Cloud Logging, Cloud Monitoring
- Sekrety (secrets manager / env): GCP Secret Manager
- Status page / komunikacja: https://status.papadata.pl

---

## 4) Standardowe komendy (frontend)

> Zakładamy Vite SPA.

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run preview
