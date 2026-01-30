# About Modal — about-modal

## Cel i kontekst

- Informacje o firmie.

## Wejścia / Preconditions

- `openModal('about')`.

## Układ

- Header z logo + title.
- Body z opisem i listą punktów.
- Footer z CTA close.

## Stany UI

- Default.
- Focus/Keyboard: close button focusable.

## Interakcje

- Close buttons.

## Dane

- `t.about.*`.

## A11y

- `aria-labelledby`, `aria-describedby`.

## Testy

- Spec: [tests/modals/about-modal.spec.md](../tests/modals/about-modal.spec.md)
- Dodatkowe: test scroll w body.
