# Dashboard Settings Org — Test Spec

## Zakres
- Org settings + billing + admin panel.

## Test cases (manual checklist)
- [ ] Loading skeleton.
- [ ] Offline state + retry.
- [ ] Error → retry.
- [ ] Manage subscription CTA opens portal or pricing.
- [ ] Admin panel visible for owner/admin.
- [ ] DEMO/read-only disables actions.
- [ ] Delete org requires "DELETE" prompt.

## Gherkin (BDD)
Scenario: Open billing portal
  Given I can manage subscription
  When I click change plan
  Then billing portal opens

Scenario: Upgrade fallback
  Given I cannot manage subscription
  When I click change plan
  Then pricing modal opens

## Asercje UI
- Company fields visible.
- Billing status card visible.

## Dane testowe
- Mock API `/api/settings/org`.
- Mock API `/api/admin/*`.

## Ryzyka i regresje
- Portal URL missing → pricing modal.
- Read-only blocks destructive actions.
