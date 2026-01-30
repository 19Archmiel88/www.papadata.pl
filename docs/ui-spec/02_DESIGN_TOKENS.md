# Design Tokens (CSS Vars)

Źródło: [apps/web/styles/theme.css](apps/web/styles/theme.css)

## Colors (RGB)

- --color-white: 255 255 255
- --color-black: 0 0 0
- --primary-1: 79 70 229
- --primary-2: 14 165 233
- --color-brand-start: var(--primary-1)
- --color-brand-end: var(--primary-2)
- --color-brand-mid: 99 102 241
- --color-light-bg: 252 252 255
- --color-light-text: 15 23 42
- --color-light-muted: 100 116 139
- --color-light-surface: 255 255 255
- --color-light-border: 241 245 249
- --color-dark-bg: 3 4 7
- --color-dark-text: 249 250 251
- --color-dark-muted: 156 163 175
- --color-dark-surface: 13 14 18
- --color-dark-border: 31 41 55
- --color-dark-card: 11 11 15
- --color-shadow-glass: 31 38 135

## Radius

- --radius-sm: 0.75rem
- --radius-md: 1rem
- --radius-lg: 1.5rem

## Shadows / Glow

- --shadow-1: 0 18px 40px -20px rgb(0 0 0 / 0.2)
- --glow-1: 0 0 64px rgb(var(--primary-2) / 0.35)

## Theme tokens (computed)

- --bg, --surface, --text, --muted, --border, --shadow-1, --glow-1

## Theme rules

- .light overrides bg/surface/text/muted/border + softer shadow/glow.
- .dark uses dark palette and stronger shadows.

Uwagi implementacyjne:

- Kolory są używane przez klasy tailwind z `rgb(var(--token))`.
- Gradienty (brand) bazują na --color-brand-start/end.
