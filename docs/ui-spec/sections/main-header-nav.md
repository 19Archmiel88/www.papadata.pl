# Main Header / Navigation — main-header-nav

## Cel i kontekst
- Globalny header z logo, menu, CTA, login, language/theme toggle.

## Wejścia / Preconditions
- Widoczny na wszystkich stronach w `MainLayout`.

## Układ (Figma-ready)
- Logo + brand name.
- Menu desktop z dropdownami.
- CTA „DEMO” i „Zaloguj”.
- Mobile menu overlay.

## Stany UI
- Default: header widoczny.
- Scrolled: kompaktowy styl + progress bar.
- Mobile menu open: overlay z listą.

## Interakcje
- Logo click → /.
- Menu items → scroll lub route.
- Dropdown item → Feature/Integrations modal.
- Login → open auth (login).
- Demo CTA → /dashboard?mode=demo.
- Theme toggle + language toggle.
- Mobile menu: klik poza zamyka.

## Walidacje i komunikaty
- Brak.

## Dane i integracje
- `t.nav`, `t.common`.

## A11y
- `aria-label` na nav i przyciskach.

## Testy
- Spec: [tests/screens/landing.spec.md](../tests/screens/landing.spec.md)
- Dodatkowe: test klawiatury (Tab/Enter) w menu.
