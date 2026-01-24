# Dashboard — Products — dashboard-products

## Cel i kontekst
- Rentowność i performance SKU.

## Wejścia / Preconditions
- Route: /dashboard/products
- Dane: `fetchDashboardProducts({ timeRange })` + fallback mock.

## Układ (Figma-ready)
- KPI cards + tabela SKU + insighty.

## Stany UI
- Loading: `WidgetSkeleton`.
- Error/Empty: `WidgetEmptyState`.
- Focus/Keyboard: sortowanie tabeli dostępne z klawiatury.

## Interakcje
- Sortowanie tabel.
- Explain in AI / context menu.
- Retry po błędzie.

## Dane i integracje
- API: `/api/dashboard/products`.

## A11y
- Standard button semantics.

## Testy
- Spec: [tests/screens/dashboard-products.spec.md](../tests/screens/dashboard-products.spec.md)
- Dodatkowe: test sortowania rosnąco/malejąco.
