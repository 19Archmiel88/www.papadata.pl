# Dashboard Integrations — Test Spec

## Zakres
- Integrations list + connect.

## Test cases (manual checklist)
- [ ] Loading skeleton.
- [ ] Error → retry.
- [ ] Connect opens modal.
- [ ] Read-only redirects to pricing modal.

## Gherkin (BDD)
Scenario: Connect integration
  Given I am in PROD
  When I click connect on an integration
  Then integration connect modal opens

Scenario: Read-only
  Given my account is read-only
  When I click connect
  Then pricing modal opens

## Asercje UI
- Status badges visible.

## Dane testowe
- Mock API `/api/integrations`.

## Ryzyka i regresje
- DEMO shows demo notice.
