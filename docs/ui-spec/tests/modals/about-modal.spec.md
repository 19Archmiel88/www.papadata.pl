# About Modal — Test Spec

## Zakres
- About content.

## Test cases (manual checklist)
- [ ] Modal opens and closes.
- [ ] Content is scrollable on small screens.

## Gherkin (BDD)
Scenario: Close about modal
  Given about modal is open
  When I click close
  Then modal closes

Scenario: Scroll content
  Given a small viewport
  Then the body area is scrollable

## Asercje UI
- Title and body visible.

## Dane testowe
- i18n about copy.

## Ryzyka i regresje
- Scrollable content.
