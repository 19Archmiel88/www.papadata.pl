# Runbook (operacje)

## Cel
Zasady utrzymania aplikacji oraz szybkie kroki diagnostyczne.

## Najczęstsze problemy
1) AI nie odpowiada
- sprawdź `GEMINI_API_KEY`
- sprawdź błędy w UI (timeout/safety)
- sprawdź limity i rate limit

2) Dashboard nie ładuje danych
- w demo: sprawdź generator/mock
- w produkcji: sprawdź ingestion i freshness

## Checklist release
- build przechodzi
- typecheck ok
- smoke test: landing + dashboard + AI drawer
- weryfikacja linków legal/stopki
