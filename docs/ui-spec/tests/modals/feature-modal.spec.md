# Feature Modal — Test Spec

## Zakres

- Feature details modal.

## Test cases (manual checklist)

- [ ] Opens with feature details.
- [ ] Close works.
- [ ] Missing feature auto-closes modal.

## Gherkin (BDD)

Scenario: Open feature modal
Given I click a feature tile
Then feature modal shows details

## Asercje UI

- Title, description, capability list visible.

## Dane testowe

- FeatureDetail from i18n.

## Ryzyka i regresje

- Missing feature closes modal.
