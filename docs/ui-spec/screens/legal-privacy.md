# Legal — Privacy Policy — legal-privacy

## Cel i kontekst
- Wyświetla dokument Privacy Policy jako markdown.

## Wejścia / Preconditions
- Route: /legal/privacy
- Źródło treści: `/legal/privacy-policy.md` lub `VITE_LEGAL_DOCS_BASE_URL/privacy-policy.md`.

## Układ (Figma-ready)
- Identyczny do `LegalDocPage`.

## Stany UI
- Default: treść dokumentu.
- Empty/error: fallback z t.common.
- Focus/Keyboard: przycisk „Back to home” focusable.

## Interakcje
- Back to home → /.

## Dane i integracje
- Fetch `docUrl`.

## A11y
- Standard `LegalDocPage`.

## Testy
- Spec: [tests/screens/legal-privacy.spec.md](../tests/screens/legal-privacy.spec.md)
- Dodatkowe: smoke + fallback na 404.
