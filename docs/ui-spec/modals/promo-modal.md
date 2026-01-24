# Promo Modal — promo-modal

## Cel i kontekst
- Oferta promocyjna po consent (plan selection).

## Wejścia / Preconditions
- Wyświetlany po 30s od cookie consent (LandingPage).

## Układ
- Tryb main: 2 karty planów + CTA demo.
- Tryb intercept: oferta upsell.

## Stany UI
- Default (main).
- Intercept po kliknięciu starter.
- Focus/Keyboard: CTA focusable.

## Interakcje
- CTA plan → `onSelectPlan` (starter/professional).
- CTA demo → `onDemo`.
- Close → pokazuje teaser button.

## Dane
- `t.promo_v2.*`.

## A11y
- `aria-modal` + `aria-labelledby`.

## Testy
- Spec: [tests/modals/promo-modal.spec.md](../tests/modals/promo-modal.spec.md)
- Dodatkowe: test teaser button po zamknięciu.
