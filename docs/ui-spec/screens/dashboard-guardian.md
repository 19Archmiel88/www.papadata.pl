# Dashboard — Guardian — dashboard-guardian

## Cel i kontekst

- Monitoring świeżości danych, jakości i statusu RAG z akcjami AI/ops.

## Wejścia / Preconditions

- Route: /dashboard/guardian
- Dane: `fetchDashboardGuardian({ timeRange })` + fallback z i18n (`t.dashboard.guardian_v2`).
- Context: `timeRange`, tryb DEMO (blokady akcji).

## Układ (Figma-ready)

- Header: badge + health/uptime KPI.
- Freshness monitor: tabela źródeł (status, last_sync, delay, records) + retry + menu.
- Quality issues: lista alertów z severity + akcja "fix".
- RAG status card z CTA.

## Stany UI

- Loading: `WidgetSkeleton` (sekcje w `LazySection`).
- Offline: `WidgetOfflineState` + retry.
- Error: `WidgetErrorState` + retry.
- Success: tabela + issues + RAG card.
- Empty: brak issues → komunikat "no issues" w sekcji quality.

## Interakcje

- Context menu na źródłach i issue: drill/explain/report/export/alert (report/export/alert disabled w DEMO).
- Klik issue → explain AI; akcja "fix" (disabled w DEMO).
- Retry odświeża dane.
- Drill z Guardiana → /dashboard/alerts.

## Dane i integracje

- API: `/api/dashboard/guardian` (client: `fetchDashboardGuardian`).
- AI: `setAiDraft` + `setContextLabel` (`t.dashboard.guardian_v2.ai_prompt`).

## A11y

- Issues: `role="button"` + Enter/Space.
- Tabela ma `caption` sr-only.
- Context menu: ESC zamyka.

## Testy

- Spec: [tests/screens/dashboard-guardian.spec.md](../tests/screens/dashboard-guardian.spec.md)
- Dodatkowe: offline/error, drill do alerts, DEMO disabled.
