# Dashboard Reports — Test Spec

## Zakres

- Report list, generate, export buttons.

## Test cases (manual checklist)

- [ ] DEMO disables buttons.
- [ ] Context menu opens.
- [ ] Generate CTA disabled in DEMO.

## Gherkin (BDD)

Scenario: Demo disables export
Given I am in DEMO
Then export buttons are disabled

Scenario: Context menu
When I open context menu on a report
Then menu items are visible

## Asercje UI

- Last report card visible.

## Dane testowe

- i18n mock.

## Ryzyka i regresje

- Disabled tooltips.
