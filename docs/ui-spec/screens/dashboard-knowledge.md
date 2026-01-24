# Dashboard — Knowledge/Support — dashboard-knowledge

## Cel i kontekst
- Baza wiedzy / support.

## Wejścia / Preconditions
- Route: /dashboard/knowledge
- Dane: `fetchDashboardKnowledge()` + fallback.

## Układ (Figma-ready)
- Lista artykułów / kategorie.

## Stany UI
- Loading: skeleton.
- Error/Empty: empty state.
- Focus/Keyboard: lista artykułów focusable.

## Interakcje
- Klik artykułu (treść symulowana).
- AI context menu (jeśli dostępne).

## Dane i integracje
- API: `/api/dashboard/knowledge`.

## A11y
- Links/buttons focusable.

## Testy
- Spec: [tests/screens/dashboard-knowledge.spec.md](../tests/screens/dashboard-knowledge.spec.md)
- Dodatkowe: test retry po błędzie.
