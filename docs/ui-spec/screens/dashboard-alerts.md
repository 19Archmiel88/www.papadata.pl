# Dashboard — Alerts — dashboard-alerts

## Cel i kontekst
- Operacyjne alerty i eskalacje.

## Wejścia / Preconditions
- Route: /dashboard/alerts
- Dane: `fetchDashboardAlerts({ timeRange })` + fallback.

## Układ (Figma-ready)
- Lista alertów, status, CTA.

## Stany UI
- Loading: `WidgetSkeleton`.
- Error/Empty: `WidgetEmptyState`.
- Focus/Keyboard: menu i CTA dostępne z klawiatury.

## Interakcje
- Acknowledge/resolve (DEMO disabled).
- Context menu AI.

## Dane i integracje
- API: `/api/dashboard/alerts`.

## A11y
- ESC closes menu.

## Testy
- Spec: [tests/screens/dashboard-alerts.spec.md](../tests/screens/dashboard-alerts.spec.md)
- Dodatkowe: test state „empty” + retry.
