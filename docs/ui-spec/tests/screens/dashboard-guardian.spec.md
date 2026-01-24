# Dashboard Guardian — Test Spec

## Zakres
- Guardian alerts view.

## Test cases (manual checklist)
- [ ] Loading skeleton.
- [ ] Error → retry.
- [ ] Alerts list renders.
- [ ] DEMO disables write-actions.

## Gherkin (BDD)
Scenario: Load guardian alerts
  Given API returns guardian alerts
  Then alert list is visible

Scenario: Demo lock
  Given I am in DEMO
  Then confirm/dismiss actions are disabled

## Asercje UI
- Severity badges visible.

## Dane testowe
- Mock API `/api/dashboard/guardian`.

## Ryzyka i regresje
- DEMO disabled actions.
