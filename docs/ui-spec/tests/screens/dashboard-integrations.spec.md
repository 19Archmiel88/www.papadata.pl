# Dashboard Integrations — Test Spec

## Zakres

- Integrations list + runtime status + connect.

## Test cases (manual checklist)

- [ ] Error → retry.
- [ ] Search/filter/sort działa.
- [ ] Connect opens modal (live, not locked).
- [ ] Context menu opens.
- [ ] Polling status updates badges (fallback on 404).
- [ ] DEMO/read-only disables actions.

## Gherkin (BDD)

Scenario: Connect integration
Given I am not in DEMO and not read-only
When I click connect on a live integration
Then integration connect modal opens

Scenario: Read-only
Given my account is read-only
When I click connect
Then the action is disabled

## Asercje UI

- Status badges visible.
- Health bar visible.

## Dane testowe

- Mock API `/api/integrations` + `/api/integrations/status`.

## Ryzyka i regresje

- DEMO/read-only lock UX.
