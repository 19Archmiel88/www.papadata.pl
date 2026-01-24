# Dashboard Products — Test Spec

## Zakres
- Products view.

## Test cases (manual checklist)
- [ ] Loading skeleton.
- [ ] Error → retry.
- [ ] Sorting works.
- [ ] Explain in AI sets draft.

## Gherkin (BDD)
Scenario: Sort products table
  Given I am on products view
  When I sort by profit
  Then rows are ordered by profit

Scenario: Explain in AI
  When I click Explain in AI on a product row
  Then the AI draft is prefilled

## Asercje UI
- SKU table visible.

## Dane testowe
- Mock API `/api/dashboard/products`.

## Ryzyka i regresje
- TimeRange affects data.
