# Dashboard Alerts — Test Spec

## Zakres
- Alerts view.

## Test cases (manual checklist)
- [ ] Loading skeleton.
- [ ] Error → retry.
- [ ] DEMO disables resolve CTA.

## Gherkin (BDD)
Scenario: Load alerts
  Given API returns alerts
  Then alerts list is visible

Scenario: Demo lock
  Given I am in DEMO
  Then resolve actions are disabled

## Asercje UI
- Alert cards visible.

## Dane testowe
- Mock API `/api/dashboard/alerts`.

## Ryzyka i regresje
- Empty state copy.
