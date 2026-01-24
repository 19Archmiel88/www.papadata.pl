# Landing Vertex Player — landing-vertex-player

## Cel i kontekst
- Interaktywny demo terminal (Pipeline/Exec/AI).

## Wejścia / Preconditions
- Renderowany w LandingPage (desktop-only).

## Układ (Figma-ready)
- Tabs: Pipeline, Exec, AI.
- Chat stream + progress bar.
- CTA „Dashboard” → demo.

## Stany UI
- Default: autoplay scen.
- Paused: hover zatrzymuje timeline.

## Interakcje
- Klik tab → zmiana sceny.
- CTA Dashboard → /dashboard?mode=demo.
- Hover wstrzymuje auto-rotację scen.

## Dane i integracje
- Dane sekwencji lokalne (PL/EN) w komponencie.

## A11y
- Tabs focusable.

## Testy
- Spec: [tests/screens/landing.spec.md](../tests/screens/landing.spec.md)
- Dodatkowe: test ręcznej zmiany tabów.
