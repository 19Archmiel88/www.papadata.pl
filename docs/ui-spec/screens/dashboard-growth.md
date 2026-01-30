# Dashboard — Growth — dashboard-growth

## Cel i kontekst

- Widok wzrostu (Growth) z insightami/metrykami (mock/i18n).

## Wejścia / Preconditions

- Route: /dashboard/growth
- Dane: mock/i18n (brak fetch).
- Context: timeRange, filters.

## Układ (Figma-ready)

- Karty metryk, segmenty wzrostu, insighty.

## Stany UI

- Default: dane z i18n/mock.
- Loading/Empty/Error: brak (dane symulowane lokalnie).
- Focus/Keyboard: CTA/akcje dostępne z klawiatury.

## Interakcje

- CTA do AI (explain) i context menu (jeśli występuje w widoku).

## Dane i integracje

- i18n: `t.dashboard.growth_*`.

## A11y

- Standard button/heading semantics.

## Testy

- Spec: [tests/screens/dashboard-growth.spec.md](../tests/screens/dashboard-growth.spec.md)
- Dodatkowe: smoke w trybie DEMO/PROD.
