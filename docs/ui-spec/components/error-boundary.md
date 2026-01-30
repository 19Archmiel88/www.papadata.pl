# Error Boundary — error-boundary

## Cel i kontekst

- Bezpieczny fallback dla bledow renderowania UI.
- Raportuje wyjatek do telemetry (captureException).

## Wejscia / Preconditions

- Props: `children`.

## Stany UI

- Normal: renderuje dzieci.
- Error: karta bledu z CTA (refresh/home).

## Interakcje

- Refresh -> `window.location.reload()`.
- Home -> `window.location.assign(origin + pathname)`.

## A11y

- Przyciski CTA focusable; opis bledu wprost w UI.

## Testy

- Spec: n/a (manual trigger error boundary).
