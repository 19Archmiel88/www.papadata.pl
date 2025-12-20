# Integracja AI (Gemini)

## Cel
Asystent AI wspiera interpretację danych, nie zastępuje systemu metryk.

## Zasady
- jawność: AI informuje, czy odpowiada na podstawie danych w systemie czy ogólnej wiedzy
- bezpieczeństwo: mapowanie safety/blocked na komunikaty UI
- kontrola: cancel/abort, retry, timeout
- koszty: token budgeting + podsumowania

## Implementacja (wymagania)
- sesje: createChatSession
- streaming: chunk buffer + render incremental
- AbortController: cancel na unmount
- telemetry: czas odpowiedzi, finishReason, błędy

## Prompt registry
- persony (np. “Analyst”, “Executive”, “Support”)
- wersjonowanie promptów
- changelog promptów

## Zakazy
- nie wysyłamy PII do AI
- nie renderujemy niesanitowanej treści jako HTML
