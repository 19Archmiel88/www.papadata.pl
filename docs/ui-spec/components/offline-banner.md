# Offline Banner — offline-banner

## Cel i kontekst
- Informuje o braku polaczenia i daje szybki retry.

## Wejscia / Preconditions
- Brak propsow; korzysta z `useOnlineStatus` i i18n `t.dashboard.widget.*`.

## Stany UI
- Online: nie renderuje.
- Offline: banner fixed u gory, CTA retry.

## Interakcje
- CTA retry -> `window.location.reload()`.

## A11y
- `role="status"` i `aria-live="polite"`.

## Testy
- Spec: [tests/screens/dashboard-shell.spec.md](../tests/screens/dashboard-shell.spec.md)
