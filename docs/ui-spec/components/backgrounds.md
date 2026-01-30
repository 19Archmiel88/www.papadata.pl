# Backgrounds — backgrounds

## Cel i kontekst

- Dekoracyjne tła landing page (Aurora + Neural) budujące atmosferę.

## Wejścia / Preconditions

- `AuroraBackground`: brak propsów.
- `NeuralBackground`: `theme` (light/dark) do kolorystyki.

## Stany UI

- Zawsze aktywne w tle (fixed, bez interakcji).
- `NeuralBackground` pauzuje przy `prefers-reduced-motion`.

## Interakcje

- Brak bezpośrednich interakcji; reaguje pasywnie na ruch kursora (Neural).

## A11y

- `pointer-events: none`, brak focusu, elementy aria-hidden.

## Testy

- Spec: [tests/screens/landing.spec.md](../tests/screens/landing.spec.md)
