# Coming Soon Modal — Test Spec

## Zakres

- Coming soon modal.

## Test cases (manual checklist)

- [ ] Modal opens with context.
- [ ] Close works.
- [ ] Context label is rendered when provided.

## Gherkin (BDD)

Scenario: Close coming soon
Given coming soon modal is open
When I click close
Then modal closes

## Asercje UI

- Title and description visible.

## Dane testowe

- context="Feature X".

## Ryzyka i regresje

- None.
