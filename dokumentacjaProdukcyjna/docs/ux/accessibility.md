# UX — Accessibility (WCAG)

Cel: utrzymać minimum zgodności z WCAG 2.1 AA dla demo.

## Wymagania bazowe
- Wszystkie elementy interaktywne dostępne z klawiatury (Tab/Shift+Tab/Enter/Space)
- Widoczny focus state (nie usuwać outline bez zamiennika)
- Kontrast tekstu i ikon zgodny z WCAG (minimum AA dla tekstu)
- Semantyka HTML: nagłówki h1–h3, listy, przyciski jako <button>

## Modal / Drawer (wymagania)
- ESC zamyka modal/drawer
- Klik overlay zamyka (jeśli nie blokuje flow)
- Focus po otwarciu trafia do sensownego elementu (np. input)
- Focus trap w obrębie modala/drawera
- Po zamknięciu focus wraca do elementu, który otworzył modal
- ARIA:
  - modal: `role="document"`, `aria-modal="true"`, `aria-labelledby`
  - drawer: analogicznie, lub `role="document"`

## Preferencje ruchu
- Szanuj `prefers-reduced-motion`:
  - wyłącz/ogranicz animacje
  - unikaj intensywnych efektów

## Media i obrazy
- `alt` dla obrazów (lub `alt=""` dla dekoracyjnych)
- Video/player: na mobile fallback, brak blokowania przewijania

## Deklaracja dostępności
- Link w stopce do `Accessibility Statement` (legal/accessibility-statement.md)
- W deklaracji: kontakt do zgłaszania problemów i opis stanu zgodności

## Checklista testowa (manual)
- Tab: przejście po header → sekcje → footer
- Modal Integrations: otwarcie, focus, ESC, zamknięcie, powrót focus
- Drawer AI: otwarcie, focus, ESC, powrót focus
