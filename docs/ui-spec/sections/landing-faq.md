# Landing FAQ — landing-faq

## Cel i kontekst

- Sekcja FAQ (accordion).

## Wejścia / Preconditions

- `FaqSection`.

## Układ

- Lista pytań/odpowiedzi.

## Interakcje

- Klik pytania → expand/collapse.
- Domyślnie otwarte pierwsze pytanie.

## Dane

- `t.faq.items`.

## A11y

- `aria-expanded`, `aria-controls`, `role=region`.

## Testy

- Spec: [tests/screens/landing.spec.md](../tests/screens/landing.spec.md)
- Dodatkowe: test aria-expanded i aria-controls.
