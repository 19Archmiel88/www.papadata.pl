# Landing Security — landing-security

## Cel i kontekst
- Sekcja bezpieczeństwa + CTA do trial.

## Wejścia / Preconditions
- `SecuritySection`.

## Układ
- 4 karty bezpieczeństwa + panel CTA.

## Interakcje
- CTA → auth modal (register).
- Hover card: scanning ray animacja.

## Dane
- `t.security.*`.

## A11y
- Karty jako div z hover; CTA jako button.

## Testy
- Spec: [tests/screens/landing.spec.md](../tests/screens/landing.spec.md)
- Dodatkowe: test hover states i CTA.
