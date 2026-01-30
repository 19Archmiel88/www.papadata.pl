# Dashboard P&L — Test Spec

## Zakres

- Tabs, waterfall, breakdown.

## Test cases (manual checklist)

- [ ] Loading skeleton.
- [ ] Error → retry.
- [ ] Tab switch changes content.
- [ ] Explain in AI sets draft.

## Gherkin (BDD)

Scenario: Switch P&L tabs
Given I am on P&L
When I click Detailed tab
Then detailed view is visible

Scenario: Explain in AI
When I click Explain in AI on a line item
Then the AI draft contains that line item

## Asercje UI

- KPI values render.

## Dane testowe

- Mock API `/api/dashboard/pandl`.

## Ryzyka i regresje

- TimeRange affects fallback math.
