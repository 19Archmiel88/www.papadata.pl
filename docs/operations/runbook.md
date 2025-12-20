# Operations — Runbook (MVP)

## Cel
Runbook opisuje operacje i podstawowe procedury utrzymania (na start: dla demo, docelowo dla produkcji).

## Środowiska
- local: dev na Vite
- staging: [PLACEHOLDER]
- prod: [PLACEHOLDER]

## Standardowe komendy
- instalacja: `npm install`
- dev: `npm run dev`
- build: `npm run build`
- preview: `npm run preview`

## Konfiguracja
- Sekrety: `.env.local` (nie commitować)
- Klucze:
  - `GEMINI_API_KEY` (opcjonalnie; bez niego AI jest disabled)

## Checklist po deploy
- Landing `/` działa i ma sekcje
- Dashboard `/dashboard/overview` działa
- Linki prawne z footer działają
- Cookie banner działa
- AI drawer:
  - bez klucza: komunikat “AI unavailable”
  - cancel działa (jeśli implementowane)

## Known issues (demo)
- Brak persystencji: refresh resetuje
- Integracje: tylko UI, brak realnych API
