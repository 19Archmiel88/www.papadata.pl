# Main Footer — main-footer

## Cel i kontekst

- Globalny footer z linkami prawnymi, kontakt, status.

## Wejścia / Preconditions

- Widoczny w `MainLayout`.

## Układ (Figma-ready)

- Kolumny linków + metadata (region, protocol).
- Legal links (buttons).

## Stany UI

- Default.

## Interakcje

- Linki → nawigacja lub modale (contact, cookie settings).
- `cookie_settings` dispatchuje event `open-cookie-settings`.
- Linki legalne → route’y `/legal/*`.

## Dane i integracje

- `t.footer.*`.

## A11y

- Buttons focusable.

## Testy

- Spec: [tests/screens/landing.spec.md](../tests/screens/landing.spec.md)
- Dodatkowe: test event `open-cookie-settings`.
