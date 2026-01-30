# Legal — AI Disclaimer — legal-ai

## Cel i kontekst

- Wyświetla dokument AI disclaimer.

## Wejścia / Preconditions

- Route: /legal/ai
- Źródło treści: `/legal/ai-disclaimer.md`.

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

- Spec: [tests/screens/legal-ai.spec.md](../tests/screens/legal-ai.spec.md)
- Dodatkowe: smoke + fallback na 404.
