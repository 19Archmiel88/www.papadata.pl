# Scroll To Top Button — scroll-to-top

## Cel i kontekst
- Pływający button „scroll to top” po przewinięciu.

## Wejścia / Preconditions
- Pokazany gdy scrollY > 400.

## Układ (Figma-ready)
- Okrągły button z ikoną strzałki.

## Stany UI
- Hidden (scroll < 400).
- Visible (scroll >= 400).
- Hover/Active: delikatny scale i cień.

## Interakcje
- Klik → `window.scrollTo({ top: 0, behavior: 'smooth' })`.

## A11y
- `aria-label` t.common.scroll_to_top.

## Testy
- Spec: [tests/screens/landing.spec.md](../tests/screens/landing.spec.md)
- Dodatkowe: test widoczności po scroll.
