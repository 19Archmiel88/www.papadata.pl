# Legal — Subprocessors — legal-subprocessors

## Cel i kontekst
- Wyświetla dokument listy subprocessors.

## Wejścia / Preconditions
- Route: /legal/subprocessors
- Źródło treści: `/legal/privacy-and-data.md`.

## Układ (Figma-ready)
- Identyczny do `LegalDocPage`.

## Stany UI
- Default / fallback jak w `LegalDocPage`.
- Focus/Keyboard: przycisk „Back to home” focusable.

## Interakcje
- Back to home → /.

## Dane i integracje
- Fetch `docUrl`.

## A11y
- Standard `LegalDocPage`.

## Testy
- Spec: [tests/screens/legal-subprocessors.spec.md](../tests/screens/legal-subprocessors.spec.md)
- Dodatkowe: smoke + fallback na 404.
