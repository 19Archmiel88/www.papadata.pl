# Dashboard — Ads — dashboard-ads

## Cel i kontekst
- Widok efektywności kanałów reklamowych (media mix, ROAS/CPA, kreacje).

## Wejścia / Preconditions
- Route: /dashboard/ads
- Dane: `fetchDashboardAds({ timeRange })` z [apps/web/data/api.ts](apps/web/data/api.ts).
- Context: global filters, timeRange.

## Układ (Figma-ready)
- KPI row + trendy.
- Media mix wykresy.
- Tabele kampanii/adset/creative (drilldown).
- Context menu dla akcji AI/export/alert.

## Stany UI
- Loading: `WidgetSkeleton`.
- Error: `WidgetEmptyState` z retry.
- Empty: `WidgetEmptyState` (desc z i18n).
- Success: wykresy + tabele.
- Focus/Keyboard: menu kontekstowe zamykane ESC.

## Interakcje
- Zmiana `mixMetric` i `effMetric`.
- Drilldown level (campaign/adset/creative).
- Retry po błędzie.
- Context menu actions (disabled w DEMO).

## Dane i integracje
- API: `/api/dashboard/ads` (client: `fetchDashboardAds`).
- Telemetria: `captureException` przy błędzie.

## A11y
- Menu kontekstowe: ESC zamyka.

## Testy
- Spec: [tests/screens/dashboard-ads.spec.md](../tests/screens/dashboard-ads.spec.md)
- Dodatkowe: test zmiany `mixMetric` i `drilldownLevel`.
