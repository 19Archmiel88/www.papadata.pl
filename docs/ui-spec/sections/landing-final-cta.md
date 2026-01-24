# Landing Final CTA — landing-final-cta

## Cel i kontekst
- Ostatnie CTA: trial/demo.

## Wejścia / Preconditions
- `FinalCtaSection` (jeśli użyte w layoutach/landing).

## Układ
- Title + desc + 2 CTA + badges.

## Interakcje
- CTA primary/secondary → callbacks (zwykle auth / video).
- Hover CTA: zmiana shadow/gradient.

## Dane
- `t.finalCta.*`.

## A11y
- Buttons focusable.

## Testy
- Spec: [tests/screens/landing.spec.md](../tests/screens/landing.spec.md)
- Dodatkowe: test widoczności badge’y.
