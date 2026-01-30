# Demo Notice Modal — Test Spec

## Zakres

- Demo warning modal.

## Test cases (manual checklist)

- [ ] Modal opens in DEMO when write-action.
- [ ] Close works.
- [ ] Primary CTA shown only when provided.

## Gherkin (BDD)

Scenario: Demo notice
Given I am in DEMO
When I attempt a write action
Then demo notice modal is shown

Scenario: No primary CTA
Given demo notice modal without onPrimary
Then only secondary close CTA is visible

## Asercje UI

- Title and description visible.

## Dane testowe

- context string.

## Ryzyka i regresje

- Repeat suppression not required.
