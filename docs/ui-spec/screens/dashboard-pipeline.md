# Dashboard — Pipeline — dashboard-pipeline

## Cel i kontekst
- Widok pipeline danych i statusów ETL (mock/i18n).

## Wejścia / Preconditions
- Route: /dashboard/pipeline
- Dane: i18n/mock (brak fetch).

## Układ (Figma-ready)
- Lista pipeline’ów + statusy + CTA.

## Stany UI
- Default: dane z i18n.
- Empty/Error: n/a (mock).
- Focus/Keyboard: elementy listy focusable.

## Interakcje
- Context menu (AI / drill) jeśli dostępne.

## Dane i integracje
- Brak API (mock).

## A11y
- Standard list semantics.

## Testy
- Spec: [tests/screens/dashboard-pipeline.spec.md](../tests/screens/dashboard-pipeline.spec.md)
- Dodatkowe: test widoku w DEMO.
