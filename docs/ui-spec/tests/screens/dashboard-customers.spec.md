# Dashboard Customers — Test Spec

## Zakres

- Customers view (cohort heatmap, LTV, churn/VIP).

## Test cases (manual checklist)

- [ ] Loading skeleton (heatmap) po wejściu i po zmianie trybu.
- [ ] Offline state + retry.
- [ ] Error → retry.
- [ ] Toggle month/week aktualizuje siatkę.
- [ ] Selekcja cohortu pokazuje detail card i ustawia AI draft.
- [ ] Context menu na segmentach; report/alert disabled w DEMO.

## Gherkin (BDD)

Scenario: Select cohort cell
Given customers data is loaded
When I click a heatmap cell
Then detail card is visible
And the AI draft is prefilled

Scenario: Toggle cohort mode
When I switch to week mode
Then the heatmap grid renders 8x8

Scenario: Context menu
When I open the context menu on a churn segment
Then the menu is visible

## Asercje UI

- Heatmap grid visible.
- LTV chart visible.
- Churn i VIP lists visible.

## Dane testowe

- Mock API `/api/dashboard/customers`.
- i18n labels `dashboard.customers_v2.*`.

## Ryzyka i regresje

- Selekcja resetuje się po zmianie `timeRange`.
- Offline state maskuje error state.
