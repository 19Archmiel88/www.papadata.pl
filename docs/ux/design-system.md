# Design System

## Zasady
- Jeden system tokenów: tło/surface/tekst/border/radius/spacing + gradient + glow
- Dark i Light to osobne zestawy (bez “inwersji na siłę”)
- Glow wyłącznie na akcentach (CTA, active states, kluczowe highlighty)

## Branding
- Gradient brand: #4E26E2 → #4285F4 (135°)
- Dark mode: neon/AI, głębokie tła, glow miękki (radius ~48–72px)
- Font: Inter (Google Sans-style)
- Ikony: liniowe, spójna grubość stroke

## Komponenty (minimum)
- Buttons: primary (gradient + glow), secondary (border), tertiary (text)
- Inputs: focus ring (glow w dark), states (error/success)
- Cards: surface + subtle border, hover
- Tables: sticky header, row hover, sort
- Modals/Drawers: blur/backdrop, focus trap
- Charts: spójne style siatki/tooltip/legend, nieprzesadzone

## Motion
- micro-interactions 120–320ms, easing expo/quint
- reduced motion: respektować preferencje systemowe

## Dostępność wizualna
- kontrast, focus, hit areas
- teksty i tooltipy KPI muszą być czytelne

## Źródło prawdy
- Tokens: CSS variables / Tailwind config
- Komponenty: shadcn/ui (jeśli używasz) + własne wrappery
