# Dashboard — Pipeline — dashboard-pipeline

## Cel i kontekst

- Centrum zarządzania pipeline danych: źródła, transformacje, RAG, BigQuery (mock/i18n).

## Wejścia / Preconditions

- Route: /dashboard/pipeline
- Dane: i18n/mock (brak fetch).
- Context: tryb DEMO blokuje akcje.

## Układ (Figma-ready)

- Header: opis + Explain AI + Open Guardian + menu kontekstowe.
- Sources: tabela źródeł + akcje Test/Sync.
- Transforms: karty statusów + akcja Run.
- RAG: status tiles + CTA.
- BigQuery: tabela + akcje Open/Export + lineage CTA.

## Stany UI

- Default: dane z i18n.
- DEMO: akcje wykonawcze disabled, BigQuery pokazuje "Podgląd statyczny".
- Focus/Keyboard: wszystkie akcje fokusowalne.

## Interakcje

- Explain AI per sekcja/wiersz.
- Context menu (drill/explain/report/export/alert) w sekcjach i tabelach.
- Akcje: Test/Sync/Run/CTA, Open Guardian (disabled w DEMO).

## Dane i integracje

- Brak API (mock z `t.dashboard.pipeline_v2.*`).
- AI: `setAiDraft` + `setContextLabel`.

## A11y

- Standard button semantics.
- Context menu: ESC zamyka.

## Testy

- Spec: [tests/screens/dashboard-pipeline.spec.md](../tests/screens/dashboard-pipeline.spec.md)
- Dodatkowe: sekcje sources/transforms/rag/bigquery, akcje DEMO disabled.
