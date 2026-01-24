# Integration Connect Modal — Test Spec

## Zakres
- Connect flow.

## Test cases (manual checklist)
- [ ] Modal opens with integration data.
- [ ] Connect calls onConnect.
- [ ] Close button works.

## Gherkin (BDD)
Scenario: Connect integration
  Given integration connect modal is open
  When I click Connect
  Then modal closes and integration is marked connected

## Asercje UI
- Steps and security note visible.

## Dane testowe
- IntegrationItem fixture.

## Ryzyka i regresje
- Missing integration closes modal.
