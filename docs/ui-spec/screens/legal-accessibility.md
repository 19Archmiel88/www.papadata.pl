# Legal — Accessibility Statement — legal-accessibility

## Cel i kontekst
- Wyświetla dokument Accessibility Statement.

## Wejścia / Preconditions
- Route: /legal/accessibility
- Źródło treści: `/legal/accessibility-statement.md`.

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
- Spec: [tests/screens/legal-accessibility.spec.md](../tests/screens/legal-accessibility.spec.md)
- Dodatkowe: smoke + fallback na 404.
