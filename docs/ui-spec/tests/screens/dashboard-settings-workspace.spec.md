# Dashboard Settings Workspace — Test Spec

## Zakres

- Workspace settings form.

## Test cases (manual checklist)

- [ ] Loading skeleton.
- [ ] Offline state + retry.
- [ ] Error → retry.
- [ ] Read-only/DEMO disables controls.
- [ ] API data sets retention options and region.

## Gherkin (BDD)

Scenario: Update retention
Given I am in PROD
When I change retention days
Then value updates locally

Scenario: Read-only
Given my account is read-only
Then inputs are disabled

## Asercje UI

- Inputs/toggles visible.
- Active integrations list visible.

## Dane testowe

- Mock API `/api/settings/workspace`.

## Ryzyka i regresje

- Read-only/DEMO gating.
