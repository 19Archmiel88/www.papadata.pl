# Landing ROI — landing-roi

## Cel i kontekst

- Kalkulator ROI (suwaki + wyliczenia).

## Wejścia / Preconditions

- `RoiSection` w LandingPage.

## Układ (Figma-ready)

- 3 suwaki + metryki savings/time/fte.
- CTA trial.

## Stany UI

- Default: live computation.

## Interakcje

- Zmiana suwaków → live update.
- CTA → auth modal (register) lub callback.
- Focus/Keyboard: suwaki dostępne z klawiatury.

## Walidacje

- Suwaki ograniczone min/max.

## Dane

- Lokalny state; formatowanie Intl.

## A11y

- `label` połączone z input range.

## Testy

- Spec: [tests/screens/landing.spec.md](../tests/screens/landing.spec.md)
- Dodatkowe: test formatowania liczb wg locale.
