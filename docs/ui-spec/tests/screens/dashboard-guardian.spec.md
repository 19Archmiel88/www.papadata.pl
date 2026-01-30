# Dashboard Guardian — Test Spec

## Zakres

- Guardian view (freshness, quality, RAG).

## Test cases (manual checklist)

- [ ] Loading skeleton.
- [ ] Offline state + retry.
- [ ] Error → retry.
- [ ] Freshness table renders.
- [ ] Quality issues list renders (empty state if none).
- [ ] RAG status card renders.
- [ ] DEMO disables fix/report/export/alert.

## Gherkin (BDD)

Scenario: Load guardian overview
Given API returns guardian data
Then freshness table and quality issues are visible

Scenario: Demo lock
Given I am in DEMO
Then fix/report/export/alert actions are disabled

Scenario: Context menu
When I open the context menu on a source row
Then the menu is visible

## Asercje UI

- Severity badges visible.
- Status badges visible.

## Dane testowe

- Mock API `/api/dashboard/guardian`.

## Ryzyka i regresje

- DEMO disabled actions.
- Retry resets error/offline state.
