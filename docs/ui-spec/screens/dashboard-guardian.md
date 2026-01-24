# Dashboard — Guardian — dashboard-guardian

## Cel i kontekst
- Widok alertów jakości danych i rekomendacji.

## Wejścia / Preconditions
- Route: /dashboard/guardian
- Dane: `fetchDashboardGuardian({ timeRange })` + fallback.

## Układ (Figma-ready)
- Lista alertów, severity badges, CTA.

## Stany UI
- Loading: `WidgetSkeleton`.
- Error/Empty: `WidgetEmptyState`.
- Focus/Keyboard: CTA dostępne z klawiatury.

## Interakcje
- Akcje alertów (confirm/dismiss) — DEMO może blokować.
- Context menu AI.

## Dane i integracje
- API: `/api/dashboard/guardian`.

## A11y
- Buttons z aria-label.

## Testy
- Spec: [tests/screens/dashboard-guardian.spec.md](../tests/screens/dashboard-guardian.spec.md)
- Dodatkowe: test akcji alertów w DEMO/PROD.
