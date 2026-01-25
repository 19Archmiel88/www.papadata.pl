# Dashboard — Products — dashboard-products

## Cel i kontekst
- Analiza SKU: macierz marża vs zysk, top movers, tabela SKU.

## Wejścia / Preconditions
- Route: /dashboard/products
- Dane: `fetchDashboardProducts({ timeRange })` + fallback mock.
- Context: `timeRange`, tryb DEMO (blokuje część akcji).

## Układ (Figma-ready)
- Header KPI + CTA AI.
- Scatter matrix (margin x profit, bubble size = volume) z hintami ćwiartek.
- Panel szczegółów SKU (pusty/wybrany) + multi-select.
- Top movers (rising/falling).
- Tabela SKU z filtrami (UI-only, bez sortowania).

## Stany UI
- Loading: `WidgetSkeleton` (miękki loader macierzy).
- Offline: `WidgetOfflineState` z retry.
- Error: `WidgetErrorState` z retry.
- Success: macierz + detale + movers + tabela.
- Focus/Keyboard: ESC czyści selekcję.

## Interakcje
- Klik w bąbel/tabelę: selekcja SKU + kontekst AI.
- Multi-select: Shift/Alt dodaje/usuwa SKU.
- Context menu na bąblu/wierszu/moverze (drill -> scroll do detali, explain, report/export/alert; disabled w DEMO).
- Explain in AI w nagłówkach i kartach.
- Filtry tabeli (UI-only).
- Retry po błędzie/offline.

## Dane i integracje
- API: `/api/dashboard/products` (client: `fetchDashboardProducts`).
- Telemetria: `captureException` przy błędzie.
- AI: `setAiDraft` + `setContextLabel`.

## A11y
- Standard button semantics.

## Testy
- Spec: [tests/screens/dashboard-products.spec.md](../tests/screens/dashboard-products.spec.md)
- Dodatkowe: selekcja SKU -> detale, multi-select, context menu, DEMO disabled.
