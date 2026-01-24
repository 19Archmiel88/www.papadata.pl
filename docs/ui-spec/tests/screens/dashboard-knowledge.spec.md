# Dashboard Knowledge — Test Spec

## Zakres
- Knowledge/support list.

## Test cases (manual checklist)
- [ ] Loading skeleton.
- [ ] Error → retry.
- [ ] Clicking item shows simulated content.

## Gherkin (BDD)
Scenario: Load knowledge items
  Given API returns knowledge data
  Then list is visible

Scenario: Open item
  When I click a knowledge item
  Then I see simulated content

## Asercje UI
- Articles list visible.

## Dane testowe
- Mock API `/api/dashboard/knowledge`.

## Ryzyka i regresje
- Empty state content.
