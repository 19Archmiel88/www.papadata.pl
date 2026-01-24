# Dashboard Settings Org — Test Spec

## Zakres
- Org settings and billing info.

## Test cases (manual checklist)
- [ ] Loading skeleton.
- [ ] Manage subscription CTA works.
- [ ] Fallback opens pricing modal when portal missing.

## Gherkin (BDD)
Scenario: Open billing portal
  Given I am in PROD with billing access
  When I click manage subscription
  Then I am redirected to portal

Scenario: Portal missing
  Given billing portal URL is empty
  Then pricing modal opens

## Asercje UI
- Plan details visible.

## Dane testowe
- Mock API `/api/settings/org`.

## Ryzyka i regresje
- Portal URL missing → pricing modal.
