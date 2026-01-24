# Dashboard Shell — dashboard-shell

## Cel i kontekst
- Główny layout dashboardu: sidebar, topbar, globalne filtry, AI drawer, sesja/billing.
- Użytkownicy: zalogowani (PROD) lub demo (DEMO).

## Wejścia / Preconditions
- Route: /dashboard/*
- Auth: token w localStorage (PROD), DEMO działa bez logowania.
- Dane: `api.health()`, `api.billingSummary()` z [apps/web/hooks/useApi.ts](apps/web/hooks/useApi.ts).
- Query params: `mode=demo` wpływa na tryb DEMO.

## Układ (Figma-ready)
### Struktura
- Sidebar (menu widoków + pinned/hover state).
- Topbar (status sesji, last update, time range, attribution, badges).
- Outlet (render wybranego widoku).
- Papa AI drawer (prawy panel).
- CookieBanner (overlay) na dashboardzie.

### Komponenty
- `DashboardSection`, `PapaAI`, `CookieBanner`, `InteractiveButton`, `ContextMenu`.

### Copy (teksty UI)
- Wszystkie etykiety z `t.dashboard.*` i `t.pricing.*`.

### RWD
- Sidebar collapse na mobile, hamburger.
- Drawer AI overlay.

## Stany UI
- Default: aktywny widok w `Outlet`.
- Loading: skeletony w widokach.
- Error: banner błędu billing lub widgets.
- Empty: widgets pokazują `WidgetEmptyState`.
- Disabled/Readonly: w trybie read-only (brak aktywnej subskrypcji) blokuje write-actions.
- Focus/Keyboard: sidebar i topbar dostępne z klawiatury.

## Interakcje (klik po kliku)
### Akcja: zmiana zakresu czasu
- Trigger: select w topbar.
- Efekt: aktualizacja `timeRange`, re-render widoków.

### Akcja: zmiana atrybucji
- Trigger: toggle.
- Efekt: zapis w state, wpływa na copy/wykresy (mock).

### Akcja: otwarcie AI drawer
- Trigger: button „Papa AI”.
- Efekt: drawer open, focus na input.
- Side effects: jeśli `aiMode` false, pokazuje warning chip.

### Akcja: Trial notice
- Warunki: trialDays ∈ {7,3,1}, raz/dzień (localStorage).
- Efekt: otwiera `trial_notice` modal.

### Akcja: Demo notice
- Warunek: DEMO i próba write-action.
- Efekt: `demo_notice` modal.

### Akcja: Integrations connect (w shellu)
- Trigger: z widoku integracji.
- Warunki: DEMO → demo_notice; read-only → pricing.
- Efekt: `integration_connect` modal.

## Walidacje i komunikaty
- Billing error: `t.common.error_desc`.
- Status sesji: ready/processing/error.

## Dane i integracje
- `api.health()` → `mode`.
- `api.billingSummary()` → plan, trial, billing status.
- AI chat: `/api/ai/chat`.

## A11y
- User menu zamykany ESC/klik poza.
- Drawer: focus trap + ESC.

## Testy
- Spec: [tests/screens/dashboard-shell.spec.md](../tests/screens/dashboard-shell.spec.md)
- Dodatkowe: test focus trap w drawer oraz ESC zamyka.
