# Landing Features — landing-features

## Cel i kontekst
- Grid funkcji produktu + wejście w modal szczegółów.

## Wejścia / Preconditions
- `FeaturesSection`.

## Układ
- Tytuł + opis + grid kart (9).

## Interakcje
- Click/Enter na karcie → `FeatureModal`.
- Hover: delikatny lift + gradient text.

## Dane
- `t.features` i `t.featuresSection`.

## A11y
- Karty to button, obsługa Enter/Space.

## Testy
- Spec: [tests/screens/landing.spec.md](../tests/screens/landing.spec.md)
- Dodatkowe: test Enter/Space na kartach.
