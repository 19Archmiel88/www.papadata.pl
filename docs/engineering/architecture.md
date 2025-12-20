# Engineering — Architecture

## Typ projektu
- Frontend: Vite SPA (React + TypeScript)
- Cel: demo/POC landing + dashboard + AI drawer
- Dane: mockowane (tablice `MOCK_*` + generator `generateData`)
- Brak persystencji: refresh = reset stanu

## Routing (MVP)
- `/` — landing page
- `/dashboard/*` — dashboard demo (overview/analytics/reports/etc.)
- `/legal/*` — strony dokumentów prawnych (w demo: treści z `docs/legal/*`)

## Warstwy
- **UI**: layouty (LandingLayout, DashboardLayout) + sekcje landing + strony dashboard
- **State**: lokalny stan i contexty (theme, i18n, ai)
- **Mock data**: `src/data/mocks/*`
- **AI**: `src/services/ai/*` (klient, rejestr promptów, token budgeting, stream utils)

## Mockowanie i walidacje
- Formularze demo: HTML `required` + symulacja sukcesu/błędu timeout
- Integrations: stan lokalny Connected/Disconnected
- Brak seed i brak storage: reset po refresh

## Performance
- Style: `src/styles/theme.css` jako source of truth + `main.css`
- Lazy loading:
  - route-level (landing/dashboard)
  - ciężkie komponenty (wykresy, player)
- Bundle split: preferowane (landing vs dashboard)

## Deployment (demo)
- Build: `vite build` -> `dist/`
- Hosting: statyczny (CDN/hosting plików)
- Rewrites: SPA fallback do `index.html`

Szczegóły wdrożenia: `engineering/deploy.md`.
