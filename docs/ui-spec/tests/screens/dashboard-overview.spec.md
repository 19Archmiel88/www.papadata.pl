# Dashboard Overview — Test Spec

## Zakres

- KPI cards, alerts, insights, tables.

## Test cases (manual checklist)

- [ ] KPI cards render values.
- [ ] Sortowanie tabel działa.
- [ ] Explain in AI ustawia draft.
- [ ] View all Ads/Products prowadzi do właściwych tras.

## Gherkin (BDD)

Scenario: Explain KPI
Given I am on overview
When I click Explain in AI on a KPI
Then AI draft is prefilled

Scenario: Navigate to Ads
When I click View all Ads
Then I am on /dashboard/ads

## Asercje UI

- Tabele kampanii i SKU widoczne.

## Dane testowe

- i18n mock.

## Ryzyka i regresje

- TimeRange wpływa na mock wartości.
