# PapaData Intelligence — komercyjny SaaS (Production + Public Demo)

Repo zawiera aplikację web (Vite SPA: React + TypeScript) oraz dokumentację produktu/UX/engineering/ops/compliance/legal.

## Ważne: Publiczny Dashboard Demo 1:1

Wersja produkcyjna zawiera **publiczny dashboard DEMO** dla użytkownika niezalogowanego.
DEMO jest **1:1** z dashboardem użytkownika zalogowanego (ten sam UI/UX i funkcje), a różni się tylko:

- źródłem danych (**mock/syntetyczne**, bez danych klienta),
- persystencją (brak trwałych zapisów lub zapisy symulowane),
- integracjami (symulowane połączenia),
- AI (pytania/rekomendacje oparte o dane demo; dopuszczalne predefiniowane prompty/odpowiedzi).

DEMO jest **trybem produktu**, a nie osobnym “demo-dashboardem”.
Szczegóły: `docs/product/scope-and-nongoals.md` + `docs/engineering/architecture.md`.

## Start here

- Pełna dokumentacja: `docs/index.md`
- Repo policy:
  - `SECURITY.md` — zgłaszanie podatności
  - `CONTRIBUTING.md` — zasady wkładu
  - `CHANGELOG.md` — historia zmian

## Quickstart (lokalnie)

### Wymagania

- Node.js: >=18.18 <23 (zalecane 20/22 LTS)
- pnpm: >= 9

### Środowisko

Skopiuj przykłady do `.env.local`:

```bash
cp apps/api/.env.example apps/api/.env.local
cp apps/web/.env.example apps/web/.env.local
```

```powershell
Copy-Item -Path apps\api\.env.example -Destination apps\api\.env.local -Force
Copy-Item -Path apps\web\.env.example -Destination apps\web\.env.local -Force
```

### Instalacja

```bash
pnpm install
```

### Playwright (testy smoke/E2E)

```bash
pnpm --filter @papadata/web exec playwright install
```

### Uruchomienie

```bash
# terminal 1
pnpm run api:dev

# terminal 2
pnpm run dev
```

Więcej: `docs/engineering/setup.md` oraz `docs/runbooks/local-verify.md`.
