# Dashboard Primitives — dashboard-primitives

## Cel i kontekst
- Kontekstowe menu, skeletony, empty state, lazy sections.

## Składniki
- `ContextMenu` + `useContextMenu`.
- `WidgetSkeleton`.
- `WidgetEmptyState`.
- `LazySection` (animacje + lazy).

## Interakcje
- ESC zamyka menu.
- Klik poza menu zamyka.
- Menu ogranicza pozycję do viewport.

## A11y
- `role=menu`, `role=menuitem`.

## Testy
- Spec: [tests/screens/dashboard-ads.spec.md](../tests/screens/dashboard-ads.spec.md)
- Dodatkowe: test disabled menu items.
