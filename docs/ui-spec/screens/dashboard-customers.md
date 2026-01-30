# Dashboard — Customers — dashboard-customers

## Cel i kontekst

- Retencja klientów: cohort heatmap, LTV, churn risk i segmenty VIP.

## Wejścia / Preconditions

- Route: /dashboard/customers
- Dane: `fetchDashboardCustomers({ timeRange })` + lokalne wyliczenia fallback.
- Context: `timeRange`, tryb DEMO (blokuje część akcji).

## Układ (Figma-ready)

- Header z KPI: średnia retencja + liczba VIP.
- Heatmapa cohortów z przełącznikiem month/week.
- Wykres LTV + karta szczegółów wybranego cohortu.
- Sekcje list: churn risk i segmenty VIP.

## Stany UI

- Loading: `WidgetSkeleton` (miękki loader heatmapy po zmianie zakresu/trybu).
- Offline: `WidgetOfflineState` z retry.
- Error: `WidgetErrorState` z retry.
- Success: heatmapa + LTV + segmenty + detail card.
- Focus/Keyboard: przełączniki trybu i komórki heatmapy fokusowalne.

## Interakcje

- Zmiana trybu heatmapy (month/week).
- Kliknięcie komórki cohortu: selekcja + detail card + kontekst dla AI.
- Context menu na cohortach/segmentach (drill/explain/report/alert; report/alert disabled w DEMO).
- Retry po błędzie/offline.

## Dane i integracje

- API: `/api/dashboard/customers` (client: `fetchDashboardCustomers`).
- Telemetria: `captureException` przy błędzie.
- AI: `setAiDraft` + `setContextLabel` (prompt `t.dashboard.customers_v2.ai_prompt`).

## A11y

- `aria-pressed` dla toggle month/week.
- Context menu: ESC zamyka.

## Testy

- Spec: [tests/screens/dashboard-customers.spec.md](../tests/screens/dashboard-customers.spec.md)
- Dodatkowe: toggle month/week, selekcja cohortu -> detail card, akcje DEMO.
