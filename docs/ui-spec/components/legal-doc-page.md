# Legal Doc Page — legal-doc-page

## Cel i kontekst
- Renderuje dokumenty prawne z markdown.

## Wejścia / Preconditions
- Props: `content`, `fallbackTitle`, `onBack`.

## Układ
- Header z logo + button back.
- Body card z tytułem i `pre` treści.

## Stany UI
- Fallback title/body gdy brak treści lub błąd.
- Renderuje nagłówek z markdown (# ...).

## Interakcje
- Back → callback.

## A11y
- Struktura nagłówków + `pre`.

## Testy
- Spec: [tests/screens/legal-terms.spec.md](../tests/screens/legal-terms.spec.md)
- Dodatkowe: test parsing title z markdown.
