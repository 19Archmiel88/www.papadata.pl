# Dashboard Customers — Test Spec

## Zakres
- Customer segments view.

## Test cases (manual checklist)
- [ ] Loading skeleton.
- [ ] Error → retry.
- [ ] Context menu opens.

## Gherkin (BDD)
Scenario: Load customers data
  Given API returns customers data
  Then charts and tables render

Scenario: Context menu
  When I open the context menu on a customer card
  Then the menu is visible

## Asercje UI
- Segment cards visible.

## Dane testowe
- Mock API `/api/dashboard/customers`.

## Ryzyka i regresje
- Empty state messaging.
