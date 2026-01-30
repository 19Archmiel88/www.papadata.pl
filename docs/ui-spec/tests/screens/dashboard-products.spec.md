# Dashboard Products — Test Spec

## Zakres

- Products view (scatter matrix, details, movers, table).

## Test cases (manual checklist)

- [ ] Loading skeleton (matrix).
- [ ] Offline state + retry.
- [ ] Error → retry.
- [ ] Klik w bąbel selekcjonuje SKU i pokazuje detale.
- [ ] Multi-select (Shift/Alt) dodaje/usuwa SKU.
- [ ] Context menu na bąblu/wierszu/moverze.
- [ ] Explain in AI sets draft.
- [ ] DEMO: report/export/alert disabled.

## Gherkin (BDD)

Scenario: Select SKU from matrix
Given products data is loaded
When I click a bubble
Then details panel shows the SKU

Scenario: Explain in AI
When I click Explain in AI on a product row
Then the AI draft is prefilled

Scenario: Context menu
When I open the context menu on a table row
Then the menu is visible

## Asercje UI

- Scatter matrix visible.
- Top movers visible.
- SKU table visible.

## Dane testowe

- Mock API `/api/dashboard/products`.
- i18n labels `dashboard.products_v2.*`.

## Ryzyka i regresje

- TimeRange affects data.
- Selekcja czyści się po ESC.
