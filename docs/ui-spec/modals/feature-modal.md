# Feature Modal — feature-modal

## Cel i kontekst
- Szczegóły funkcji z landing.

## Wejścia / Preconditions
- `openModal('feature', { feature })`.

## Układ
- Header z title.
- Body: opis + capabilities + uses + required data.
- Footer: close CTA.

## Stany UI
- Default.
- Brak danych: auto-close.
- Focus/Keyboard: close button focusable.

## Interakcje
- Close.

## Dane
- `FeatureDetail` z i18n.

## A11y
- `aria-labelledby`, `aria-describedby`.

## Testy
- Spec: [tests/modals/feature-modal.spec.md](../tests/modals/feature-modal.spec.md)
- Dodatkowe: test fallback gdy `feature` null.
