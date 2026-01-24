# Demo Notice Modal — demo-notice-modal

## Cel i kontekst
- Informuje o ograniczeniach DEMO.

## Wejścia / Preconditions
- `openModal('demo_notice', { context, onPrimary })`.

## Układ
- Ikona + tytuł + opis + CTA (opcjonalny) + close.

## Stany UI
- Default.
- Focus/Keyboard: CTA focusable.

## Interakcje
- CTA primary → callback.
- Close.

## Dane
- `t.dashboard.demo_banner_*`.

## A11y
- `aria-labelledby`, `aria-describedby`.

## Testy
- Spec: [tests/modals/demo-notice-modal.spec.md](../tests/modals/demo-notice-modal.spec.md)
- Dodatkowe: test wariantu bez `onPrimary`.
