# UX — Design System (MVP)

Ten dokument definiuje minimalne zasady wyglądu dla demo. Implementacja ma używać tokenów w CSS (theme.css) jako jedynego źródła prawdy.

## Themes

- Dwa tryby: Dark i Light
- Brak automatycznej “inwersji”: tokeny są definiowane jawnie dla każdego trybu

## Brand (MVP)

- Gradient primary: `#4E26E2 -> #4285F4` (np. 135deg)
- Dark background: `#0D0E10`
- Glow (tylko dark): miękki, duży promień (48–72px), niski alpha

## Typography

- Font: Inter
- Base: 16px
- Kontrast: tekst na tle musi spełniać wymagania WCAG (patrz accessibility.md)

## Layout & Spacing

- Sekcje landing: czytelne przerwy, jednolity rytm
- Komponenty: prosty grid, bez “losowych” odstępów

## Tokeny (minimum)

W `src/styles/theme.css` powinny istnieć przynajmniej:

- `--bg`, `--surface`, `--text`, `--muted`, `--border`
- `--primary-1`, `--primary-2` (końce gradientu)
- `--radius-sm`, `--radius-md`, `--radius-lg`
- `--shadow-1` (light) oraz `--glow-1` (dark)

## Komponenty (MVP)

- Button: primary (gradient), secondary (border), tertiary (text)
- Modal: overlay + panel + focus outline
- Cards: surface + border, opcjonalnie akcent (gradient top border)

## Motion

- Preferuj krótkie przejścia (120–240ms)
- Szanuj `prefers-reduced-motion` (patrz accessibility.md)

## Performance UX

- Bundle split: landing i dashboard (w demo można przygotować lazy loading route-level)
- Lazy-loading: ciężkie komponenty (np. wykresy, player)
- Mobile fallback: Vertex Player na małych ekranach może pokazywać statyczne preview lub uproszczony tryb

## Zakaz

- Brak zewnętrznych bibliotek UI w MVP (projekt ma pokazać strukturę i logikę)
- Brak hard-coded kolorów w komponentach poza wyjątkami opisanymi w tokenach
