# Legal — Cookies Policy — legal-cookies

## Cel i kontekst

- Wyświetla dokument Cookies Policy jako markdown.

## Wejścia / Preconditions

- Route: /legal/cookies
- Źródło treści: `/legal/cookies-policy.md`.

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

- Spec: [tests/screens/legal-cookies.spec.md](../tests/screens/legal-cookies.spec.md)
- Dodatkowe: smoke + fallback na 404.
