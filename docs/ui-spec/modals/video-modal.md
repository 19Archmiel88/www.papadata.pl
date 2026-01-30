# Video Modal — video-modal

## Cel i kontekst

- Odtwarza wideo demo (iframe YouTube).

## Wejścia / Preconditions

- `openModal('video')`.
- Parametry: `src` (opcjonalnie), `title` (opcjonalnie).

## Układ (Figma-ready)

- Kontener aspect-video + close button + brand bar.

## Stany UI

- Default: autoplay iframe.
- Focus/Keyboard: close button focusable.

## Interakcje

- Close button → close modal.

## Dane i integracje

- Iframe URL: default `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`.

## A11y

- `aria-label` close, `title` na iframe.

## Testy

- Spec: [tests/modals/video-modal.spec.md](../tests/modals/video-modal.spec.md)
- Dodatkowe: test ESC (zamknięcie przez ModalContainer).
