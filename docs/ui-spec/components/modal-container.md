# Modal Container — modal-container

## Cel i kontekst

- Host wszystkich modali (overlay, ESC, focus trap, lazy load).

## Wejścia / Preconditions

- `ModalContext` wskazuje `activeModal` i `modalProps`.

## Układ

- Overlay + modal shell (size sm/md/lg/xl/full).

## Stany UI

- Open/Close z animacją framer-motion.
- Fallback podczas lazy-load.

## Interakcje

- ESC zamyka (o ile nie `disableEsc`).
- Klik overlay zamyka (o ile nie `disableOverlayClose`).
- Body scroll lock podczas otwarcia.

## A11y

- `role=dialog`, `aria-modal`, `aria-labelledby`, `aria-describedby`.
- Focus trap.

## Testy

- Spec: [tests/modals/auth-modal.spec.md](../tests/modals/auth-modal.spec.md)
- Dodatkowe: test przywracania scroll po zamknięciu.
