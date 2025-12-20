# Engineering — AI integration (Gemini/Vertex)

## Cel
Zapewnić UI + warstwę techniczną do rozmowy z modelem (Gemini/Vertex) w trybie:
- streaming (chunked output)
- cancel (AbortController)
- safety/blocked/timeout/offline handling
- token budgeting (przycinanie kontekstu)

## Prompt governance
- Rejestr promptów/person: wersjonowany (np. `promptRegistry.ts`)
- Changelog promptów: opis zmian i intencji
- Negatywne ograniczenia: zakaz PII, zakaz danych wrażliwych, zakaz jailbreak
- Format odpowiedzi zależny od trybu:
  - markdown dla UI
  - JSON w sytuacjach wymagających struktury (bez parsowania częściowego JSON w stream)

## Kontekst i budżet tokenów
- Utrzymuj kolejność tur: system → developer → user → model
- Budżet:
  - skracaj stare wiadomości
  - rób podsumowanie historii po przekroczeniu limitu
- Możliwość resetu sesji

## Streaming
- Buforuj chunki i składaj w tekst (nie zakładaj, że chunk to kompletna jednostka)
- Nie parsuj częściowego JSON
- Używaj `AbortController`:
  - cancel w UI
  - abort w unmount (np. zamknięcie drawer)
- Obsługa:
  - timeout
  - offline/network error
  - safety block

## Bezpieczeństwo i compliance
- Oznacz odpowiedzi: “Odpowiedzi generowane przez AI”
- Mapuj reason/finish:
  - STOP → normalne zakończenie
  - SAFETY → komunikat blokady (bez ujawniania szczegółów filtrów)
  - ERROR/TIMEOUT → komunikat błędu i opcja retry
- Filtruj i nie loguj wrażliwych danych:
  - brak kluczy API w promptach
  - brak danych szczególnych (RODO)
- UI powinno informować o probabilistycznym charakterze odpowiedzi (patrz `docs/legal/ai-disclaimer.md`)

## Zachowanie bez klucza API
- Jeśli brak `GEMINI_API_KEY`:
  - Drawer działa (UI), ale wysyłka pokazuje “AI unavailable”
  - żadnych requestów do zewnętrznych usług

## Testowalność
- Tryb mock AI:
  - strumień “udawany” (timer + dopisywanie chunków)
  - test cancel i stany UI
- Testy nie porównują exact-match, tylko kluczowe informacje i stany
