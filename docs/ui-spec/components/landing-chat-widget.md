# Landing Chat Widget — landing-chat-widget

## Cel i kontekst

- Dock czatu Papa AI na landing page (demo, bez prawdziwych danych).

## Wejścia / Preconditions

- Props: `lang`, `onStartTrial`.
- Gdy aktywny modal, widget jest zablokowany i zamknięty.

## Stany UI

- Złożony (button).
- Otwarty (popover/dialog).
- Disabled (gdy aktywny modal).

## Interakcje

- Toggle open/close.
- Send message: dodaje wiadomość użytkownika + symulowana odpowiedź.
- CTA "Start trial" -> `onStartTrial` (auth modal).

## A11y

- Button z `aria-label`, popover jako `role="dialog"`, `aria-expanded`.

## Testy

- Spec: [tests/screens/landing.spec.md](../tests/screens/landing.spec.md)
