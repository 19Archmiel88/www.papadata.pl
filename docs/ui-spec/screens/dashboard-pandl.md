# Dashboard — P&L — dashboard-pandl

## Cel i kontekst
- Rentowność: revenue, koszty, marże (summary + detailed).

## Wejścia / Preconditions
- Route: /dashboard/pandl
- Dane: `fetchDashboardPandL({ timeRange })` lub fallback mock.

## Układ (Figma-ready)
- Tabs: summary/detailed.
- Waterfall + breakdown cards.
- Context menu dla akcji AI/export.

## Stany UI
- Loading: `WidgetSkeleton` w sekcjach.
- Error: `WidgetEmptyState` z retry.
- Empty: `WidgetEmptyState`.
- Success: wykresy + KPI.
- Focus/Keyboard: taby i menu dostępne z klawiatury.

## Interakcje
- Zmiana tabów.
- Retry po błędzie.
- Explain in AI (ustawia draft).

## Dane i integracje
- API: `/api/dashboard/pandl`.
- Telemetria: `captureException` przy błędzie.

## A11y
- Menu kontekstowe ESC.

## Testy
- Spec: [tests/screens/dashboard-pandl.spec.md](../tests/screens/dashboard-pandl.spec.md)
- Dodatkowe: test retry po błędzie i zmiany tabów.
