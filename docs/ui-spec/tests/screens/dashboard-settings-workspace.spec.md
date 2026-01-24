# Dashboard Settings Workspace — Test Spec

## Zakres
- Workspace settings form.

## Test cases (manual checklist)
- [ ] Loading skeleton.
- [ ] Read-only disables controls.
- [ ] Changes persist locally in DEMO.

## Gherkin (BDD)
Scenario: Update retention
  Given I am in DEMO
  When I change retention days
  Then value updates locally

Scenario: Read-only
  Given my account is read-only
  Then inputs are disabled

## Asercje UI
- Inputs/toggles visible.

## Dane testowe
- Mock API `/api/settings/workspace`.

## Ryzyka i regresje
- Read-only gating.
