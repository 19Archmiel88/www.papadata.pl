# Dashboard Ads — Test Spec

## Zakres

- Media mix, KPI, tabele, drilldown.

## Test cases (manual checklist)

- [ ] Loading skeleton na start.
- [ ] Error state pokazuje retry.
- [ ] Drilldown zmienia tabelę.
- [ ] Context menu działa.
- [ ] Globalny filtr channel wpływa na selected channel.

## Gherkin (BDD)

Scenario: Retry after error
Given the ads API returns error
When I click retry
Then data loads and error disappears

Scenario: Global filter
Given global channel filter is set to "meta"
Then only Meta Ads data is highlighted

## Asercje UI

- KPI roas/cpa widoczne.
- Channel cards dostępne.

## Dane testowe

- Mock API `/api/dashboard/ads`.

## Ryzyka i regresje

- DEMO disables actions.
