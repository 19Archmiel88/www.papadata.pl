# Dashboard — Customers — dashboard-customers

## Cel i kontekst
- Segmenty klientów, LTV/CAC, insighty.

## Wejścia / Preconditions
- Route: /dashboard/customers
- Dane: `fetchDashboardCustomers({ timeRange })` z fallback mock.

## Układ (Figma-ready)
- KPI + segmenty + tabela.

## Stany UI
- Loading: `WidgetSkeleton`.
- Error/Empty: `WidgetEmptyState`.
- Success: wykresy + listy.
- Focus/Keyboard: CTA/akcje dostępne z klawiatury.

## Interakcje
- Context menu (AI/export/alert).
- Retry po błędzie.

## Dane i integracje
- API: `/api/dashboard/customers`.
- Telemetria: `captureException`.

## A11y
- Context menu ESC.

## Testy
- Spec: [tests/screens/dashboard-customers.spec.md](../tests/screens/dashboard-customers.spec.md)
- Dodatkowe: test empty state copy.
