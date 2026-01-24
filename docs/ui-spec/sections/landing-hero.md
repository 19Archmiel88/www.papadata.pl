# Landing Hero — landing-hero

## Cel i kontekst
- Pierwszy ekran landing page z CTA do trial/demo.

## Wejścia / Preconditions
- `LandingPage`.

## Układ (Figma-ready)
- Pill + H1 (3 linie) + opis + CTA primary/secondary + badges.

## Stany UI
- Default.

## Interakcje
- CTA primary → modal auth (register).
- CTA secondary → modal video.
- Hover na CTA → zmiana stylu (shadow/gradient).

## Copy
- `t.hero.*`.

## A11y
- `aria-label` na H1 z pełnym tekstem.

## Testy
- Spec: [tests/screens/landing.spec.md](../tests/screens/landing.spec.md)
- Dodatkowe: test a11y (aria-label H1).
