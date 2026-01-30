# Dashboard Pipeline — Test Spec

## Zakres

- Pipeline view (sources, transforms, RAG, BigQuery).

## Test cases (manual checklist)

- [ ] Sources table renders.
- [ ] Transforms cards render.
- [ ] RAG status tiles render.
- [ ] BigQuery table renders.
- [ ] Context menu opens (sekcja lub wiersz).
- [ ] DEMO: akcje wykonawcze disabled + statyczne etykiety.

## Gherkin (BDD)

Scenario: View pipeline sections
Given I open /dashboard/pipeline
Then sources, transforms, RAG and BigQuery sections are visible

Scenario: Context menu
When I open the context menu on a source row
Then the menu is visible

## Asercje UI

- Sources table visible.
- Transforms list visible.
- RAG status tiles visible.
- BigQuery table visible.

## Dane testowe

- i18n mock `dashboard.pipeline_v2.*`.

## Ryzyka i regresje

- Mock data drift.
