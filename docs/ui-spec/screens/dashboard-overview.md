# Dashboard — Overview — dashboard-overview

## Cel i kontekst
- Podsumowanie KPI, alertów, insightów, kampanii i SKU.

## Wejścia / Preconditions
- Route: /dashboard/overview
- Dane: mock/i18n + wyliczenia lokalne; brak fetch.
- Context: `DashboardOutletContext` (timeRange, filters, ai).

## Układ (Figma-ready)
- KPI cards + trend charty.
- Alerts/insights listy.
- Tabele kampanii i SKU.
- CTA „Explain in AI” w kartach/tabelach.

## Stany UI
- Default: dane wyliczone z mocków.
- Loading/Empty/Error: n/a (brak fetch); mogą wystąpić skeletony w `LazySection`.
- Focus/Keyboard: sortowanie dostępne z klawiatury.

## Interakcje
- Sortowanie tabel (kolumny).
- Context menu (drill/explain/export) → AI draft.
- CTA „View all Ads/Products” → /dashboard/ads lub /dashboard/products.

## Dane i integracje
- i18n: `t.dashboard.overview_v2.*`.
- AI draft: `setAiDraft`.

## A11y
- Buttons z aria-label, klawiatura dla sortowania.

## Testy
- Spec: [tests/screens/dashboard-overview.spec.md](../tests/screens/dashboard-overview.spec.md)
- Dodatkowe: test działań context menu (ESC, click outside).
