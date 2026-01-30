# Legal — DPA — legal-dpa

## Cel i kontekst

- Wyświetla dokument DPA.

## Wejścia / Preconditions

- Route: /legal/dpa
- Źródło treści: `/legal/dpa.md`.

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

- Spec: [tests/screens/legal-dpa.spec.md](../tests/screens/legal-dpa.spec.md)
- Dodatkowe: smoke + fallback na 404.
