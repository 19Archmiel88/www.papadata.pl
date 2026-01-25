# Dashboard — Knowledge/Support — dashboard-knowledge

## Cel i kontekst
- Baza wiedzy z wyszukiwaniem, filtrowaniem i widokiem szczegółowym + booking konsultacji.

## Wejścia / Preconditions
- Route: /dashboard/knowledge
- Dane: `fetchDashboardKnowledge()` (gdy `apiAvailable !== false`) + fallback z i18n (`t.dashboard.knowledge_v2.resources`).
- Context: `isDemo`, `apiAvailable`.

## Układ (Figma-ready)
- Header: badge + search input + category select.
- Lista zasobów (karty) + Expert CTA card (booking).
- Detail panel (sticky): nagłówek, treść, opcjonalny video, karta AI.
- Booking modal (formularz: temat, data, budżet) + CTA.

## Stany UI
- Offline: `WidgetOfflineState` + retry.
- Error: `WidgetErrorState` + retry.
- Empty (filtry): `WidgetEmptyState` + clear filters.
- No selection: placeholder detail panel.
- Success: lista + detail view.

## Interakcje
- Search + category filter.
- Klik/Enter/Space na karcie → detail view.
- Context menu na karcie: open/explain/share/bookmark (share/bookmark disabled w DEMO).
- Explain AI w headerach i detail view.
- Booking modal open/close (ESC zamyka, focus trap, restore focus); disabled w DEMO.

## Dane i integracje
- API: `/api/dashboard/knowledge` (client: `fetchDashboardKnowledge`).
- Fallback: i18n `t.dashboard.knowledge_v2.resources`.
- AI: `setAiDraft` + `setContextLabel` (`t.dashboard.knowledge_v2.ai_prompt`).

## A11y
- Karty zasobów mają `role="button"` + Enter/Space.
- Modal: `role="dialog"`, `aria-modal`, focus trap, ESC.

## Testy
- Spec: [tests/screens/dashboard-knowledge.spec.md](../tests/screens/dashboard-knowledge.spec.md)
- Dodatkowe: search/filter, booking modal, DEMO disabled.
