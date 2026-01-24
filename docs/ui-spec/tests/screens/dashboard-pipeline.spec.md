# Dashboard Pipeline — Test Spec

## Zakres
- Pipeline status view.

## Test cases (manual checklist)
- [ ] Pipeline cards render.
- [ ] Status badges show severity.

## Gherkin (BDD)
Scenario: View pipeline
  Given I open /dashboard/pipeline
  Then pipeline list is visible

Scenario: Status badges
  Then each pipeline item shows a status badge

## Asercje UI
- Status badges visible.

## Dane testowe
- i18n mock.

## Ryzyka i regresje
- Mock data drift.
