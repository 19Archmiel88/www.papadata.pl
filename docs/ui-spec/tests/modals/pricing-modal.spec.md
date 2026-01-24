# Pricing Modal — Test Spec

## Zakres
- Pricing comparison table.

## Test cases (manual checklist)
- [ ] Modal opens from compare CTA.
- [ ] Close button closes modal.
- [ ] Table scrolls on small viewport.

## Gherkin (BDD)
Scenario: Open pricing modal
  Given I click compare
  Then pricing modal is visible

Scenario: Table scroll
  Given a small viewport
  Then the comparison table is horizontally scrollable

## Asercje UI
- Table headers visible.

## Dane testowe
- i18n pricing copy.

## Ryzyka i regresje
- Table overflow on small screens.
