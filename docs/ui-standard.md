# UI Standard — shadcn/ui

## Decyzja

- Standard: **shadcn/ui** (Button, Input, Dialog, Card) + Tailwind tokens z repo.

## Konwencja

- Katalog: `apps/web/components/ui/*`
- Helper: `apps/web/utils/cn.ts`
- Nowe komponenty dodaj w `components/ui` i re-eksportuj lokalnie (bez globalnego generatora).
- Ikony: `lucide-react`.
- Motion: `framer-motion` z `useReducedMotion` (patrz `AnimatedHero` — delikatny load hero, preferencja reduced).

## Zestaw startowy

- `Button`, `Input`, `Card`, `Dialog` — użyte na landing (`ShadcnShowcase`).

## Stylowanie

- Tailwind + `class-variance-authority` (variants) + `tailwind-merge`.
- Trzymaj spacing/rounded zgodnie z obecnym designem (rounded-xl/3xl).

## Testy

- CT Playwright: `OverviewViewV2.spec.tsx` sprawdza obecność wykresu (recharts) i widoczność widoku.

## Wizualizacje / Recharts

- Wykres demo: `OverviewViewV2` → `LineChart` (revenue/spend/roas) na trendzie syntetycznym.
- Format danych: `{ label, revenue, spend, roas }` (liczby, label = punkt czasu).
- Fallback: dane syntetyczne generowane lokalnie; jeśli tabela pusta, wykres dostaje pustą tablicę (Recharts bez błędu).
