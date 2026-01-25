# Dashboard — Integrations — dashboard-integrations

## Cel i kontekst
- Centrum integracji: statusy runtime, connect/test i bezpieczeństwo.

## Wejścia / Preconditions
- Route: /dashboard/integrations
- Dane: `fetchIntegrations()` + polling `GET /api/integrations/status` (fallback na logikę lokalną przy 404).
- Context: `timeRange`, `isDemo`, `isReadOnly`, `integrationStatus`, `openIntegrationModal`.

## Układ (Figma-ready)
- Header: search + sort, filtry statusów (all/active/attention/disabled), freshness i licznik aktywnych.
- Grid kart integracji z badge, health dots, metrykami i CTA connect.
- Error/empty states na liście.
- Sekcja bezpieczeństwa (keys/AI/SLA).

## Stany UI
- Error: `WidgetEmptyState` z retry.
- Empty (filtry): `WidgetEmptyState` + clear filters.
- Polling: wskaźnik "connecting" przy pobieraniu statusów.
- DEMO/Read-only: akcje disabled (tooltipy).

## Interakcje
- Search + sort + filtry statusów.
- Connect: `openIntegrationModal` (disabled gdy nie-live/locked/connecting).
- Context menu na karcie: drill (open modal), explain, report/export/alert (disabled gdy locked).
- CTA "Keys" -> `/dashboard/settings/workspace`.
- CTA SLA -> draft AI (disabled gdy locked).

## Dane i integracje
- API: `/api/integrations` + `/api/integrations/status` (client: `fetchIntegrations`, `apiGet`).
- Mock metryki skalowane względem `timeRange`.
- AI: `setAiDraft` + `setContextLabel`.

## A11y
- Filtry statusów mają `aria-pressed`.
- Health bar ma `aria-label`.
- Context menu: ESC zamyka.

## Testy
- Spec: [tests/screens/dashboard-integrations.spec.md](../tests/screens/dashboard-integrations.spec.md)
- Dodatkowe: search/filter/sort, polling statusów, DEMO/read-only disabled.
