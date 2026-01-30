# Integrations Modal — Test Spec

## Zakres

- Integrations catalog search + tabs.

## Test cases (manual checklist)

- [ ] Search filters results.
- [ ] Tabs filter categories.
- [ ] Clicking item triggers select.
- [ ] Empty state when no results.

## Gherkin (BDD)

Scenario: Filter integrations
Given integrations modal is open
When I search for "Google"
Then results contain Google integrations

## Asercje UI

- Status badges visible.

## Dane testowe

- Integrations list.

## Ryzyka i regresje

- Long lists scroll.
