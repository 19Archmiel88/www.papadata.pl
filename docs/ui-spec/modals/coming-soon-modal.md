# Coming Soon Modal — coming-soon-modal

## Cel i kontekst

- Informacja o niedostępnej funkcji.

## Wejścia / Preconditions

- `openModal('coming_soon', { context })`.

## Układ

- Ikona + tytuł + opis + close CTA.

## Stany UI

- Default.
- Focus/Keyboard: close button focusable.

## Interakcje

- Close.

## Dane

- `t.common.coming_soon_*`.

## A11y

- `aria-labelledby`, `aria-describedby`.

## Testy

- Spec: [tests/modals/coming-soon-modal.spec.md](../tests/modals/coming-soon-modal.spec.md)
- Dodatkowe: test `context` label rendering.
