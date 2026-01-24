# Engineering — AI integration (Gemini/Vertex) — Production + Public Demo 1:1

## Cel
Zapewnić UI + warstwę techniczną do rozmowy z modelem (Gemini/Vertex) w trybie:
- streaming (chunked output),
- cancel (AbortController),
- safety/blocked/timeout/offline handling,
- token budgeting (przycinanie kontekstu),
- spójne zachowanie w **PROD** i **publicznym DEMO 1:1**.

Powiązane:
- Architektura (mode selection, provider-y): `architecture.md`
- Disclaimer AI (transparentność): `../legal/ai-disclaimer.md`
- Security baseline: `security.md`

---

## Tryby produktu: PROD vs DEMO
- **PROD (zalogowany):** AI odpowiada na podstawie danych klienta i kontekstu dashboardu (z poszanowaniem RBAC / tenant isolation).
- **DEMO (publiczny):** AI odpowiada wyłącznie na podstawie danych demo:
  - dopuszczalne są predefiniowane pytania (Suggested Prompts) i/lub predefiniowane odpowiedzi,
  - odpowiedzi muszą wyglądać jak produkcyjne (Trust UX), ale bez ryzyka wycieku danych,
  - wymagane są zabezpieczenia anty-abuse (rate limiting, kill switch) — szczegóły w `security.md`.

---

## Architektura backendowa (wymóg bezpieczeństwa)
- Wszystkie wywołania do dostawcy AI muszą przechodzić przez dedykowany backend (AI Proxy).
- Klucz `GEMINI_API_KEY` (lub równoważny) jest sekretem i NIGDY nie może być widoczny w kodzie front-endowym ani w bundlu.
- Frontend wywołuje wewnętrzny endpoint **`POST /api/ai/chat`** (backend: [apps/api/src/modules/ai/ai.controller.ts](apps/api/src/modules/ai/ai.controller.ts#L27)), który:
  - waliduje wejście,
  - egzekwuje uprawnienia (w PROD),
  - egzekwuje rate limiting (szczególnie DEMO),
  - dopiero potem wywołuje API dostawcy AI z sekretów serwera.

Hosting backendu (PROD/STG): Cloud Run, zgodnie z [docs/engineering/deploy.md](docs/engineering/deploy.md).

---

## Kontekst i kontrakt danych (Context Contract)
AI powinno dostawać **minimalny** kontekst potrzebny do odpowiedzi:
- aktywny widok (np. Overview / Ads Performance),
- aktywne filtry (zakres dat, kanały, kampanie),
- agregaty KPI i/lub fragmenty tabel (w granicach budżetu tokenów),
- stan jakości danych (freshness/coverage) jako krótkie flagi.

Zasady:
- **PROD:** kontekst pochodzi z danych tenant-scoped (po RBAC).
- **DEMO:** kontekst pochodzi wyłącznie z datasetu demo (bez PII).

Nie wysyłamy:
- sekretów, tokenów, kluczy,
- danych szczególnych (RODO),
- pełnych rekordów, jeśli nie są potrzebne (preferuj agregaty).

Format “context payload” (zgodny z [libs/shared/src/contracts/ai.ts](libs/shared/src/contracts/ai.ts#L1-L43)):
```json
{
  "prompt": "Dlaczego spadł ROAS?",
  "mode": "demo",
  "messages": [
    { "role": "user", "content": "Pokaż przyczyny spadku" }
  ],
  "context": {
    "view": "Overview",
    "dateRange": { "start": "2026-01-01", "end": "2026-01-20", "preset": "30d" },
    "filters": { "channel": "all", "country": "all" },
    "attribution": "data_driven",
    "kpis": [],
    "tables": [],
    "dataQuality": { "freshnessHours": 12, "coverage": 0.98 }
  }
}
```

---

## Prompt governance
- Rejestr promptów/person: systemowa instrukcja i zasady promptu są zdefiniowane w backendzie:
  - `SYSTEM_INSTRUCTION` w [apps/api/src/modules/ai/ai.service.ts](apps/api/src/modules/ai/ai.service.ts#L14-L46)
  - odpowiedzi DEMO: [apps/api/src/modules/ai/demo-responses.ts](apps/api/src/modules/ai/demo-responses.ts)
- Changelog promptów: opis zmian i intencji.
- Negatywne ograniczenia:
  - zakaz PII i danych wrażliwych,
  - zakaz jailbreak/prompt injection,
  - zakaz ujawniania wewnętrznych instrukcji/system prompt.
- Format odpowiedzi zależny od use case:
  - markdown dla UI,
  - JSON w sytuacjach wymagających struktury (ale **nie parsuj częściowego JSON w stream**).

Zmiany promptu wymagają aktualizacji `SYSTEM_INSTRUCTION` oraz review przez Security/Legal.

---

## Token budgeting
- Utrzymuj kolejność tur: system → developer → user → model.
- Budżet:
  - skracaj stare wiadomości,
  - rób podsumowanie historii po przekroczeniu limitu,
  - preferuj agregaty KPI zamiast surowych danych.
- Możliwość resetu sesji (UI: “Reset conversation”).

---

## Streaming i cancel
- Buforuj chunki i składaj w tekst (nie zakładaj, że chunk to kompletna jednostka).
- Używaj `AbortController`:
  - cancel w UI,
  - abort w unmount (np. zamknięcie drawer).
- Obsługa błędów:
  - timeout,
  - offline/network error,
  - safety block,
  - 429 / rate limit.

Transport stream: **SSE** (text/event-stream) po stronie backendu i **Fetch ReadableStream** po stronie frontendowej.
Implementacje:
- Backend: [apps/api/src/modules/ai/ai.controller.ts](apps/api/src/modules/ai/ai.controller.ts#L69-L135)
- Frontend: [apps/web/data/ai.ts](apps/web/data/ai.ts#L31-L149)

---

## Bezpieczeństwo i compliance (AI UX)
- Oznacz odpowiedzi: “Odpowiedzi generowane przez AI”.
- Mapuj finish reason:
  - STOP → normalne zakończenie,
  - SAFETY → komunikat blokady (bez ujawniania szczegółów filtrów),
  - ERROR/TIMEOUT → komunikat błędu + opcja retry.
- UI powinno informować o probabilistycznym charakterze odpowiedzi (patrz `../legal/ai-disclaimer.md`).

---

## Logowanie i prywatność
- Nie loguj promptów i odpowiedzi w sposób umożliwiający identyfikację osoby. Aktualna implementacja loguje tylko metadane:
  - `requestId`, `mode`, `durationMs`, `finishReason` w [apps/api/src/modules/ai/ai.controller.ts](apps/api/src/modules/ai/ai.controller.ts#L45-L63)
- Logi techniczne mogą zawierać:
  - request id,
  - latency,
  - status (OK/ERROR/SAFETY),
  - `mode=demo|prod`,
  - bez treści wiadomości (lub z redakcją).
- W DEMO: traktuj ruch jak publiczny (większe ryzyko abuse).

---

## Zachowanie bez dostępu do backendu
Jeśli endpoint AI nie jest dostępny lub zwraca błąd:
- Drawer AI działa (UI), ale próba wysłania promptu pokazuje komunikat “Funkcja AI jest niedostępna”.
- Aplikacja nie wykonuje żadnych bezpośrednich requestów do zewnętrznych usług AI.

---

## Testowalność
- Tryb mock AI:
  - strumień “udawany” (timer + dopisywanie chunków),
  - test cancel i stany UI.
- Testy nie porównują exact-match, tylko kluczowe informacje i stany.

---

## Production hardening (stan wdrożenia)
- Rate limiting: NestJS Throttler na `/api/ai/chat` (TTL i limit z env) — [apps/api/src/modules/ai/ai.controller.ts](apps/api/src/modules/ai/ai.controller.ts#L18-L25)
- Abuse protection: WAF na Cloud Armor (policy `papadata-security-policy`) zgodnie z [dokumentacjaProdukcyjna/GCP.md](../..//GCP.md)
- Redaction/validation DEMO: blokada danych wrażliwych w DEMO (regexy na PII/sekrety) — [apps/api/src/modules/ai/ai.service.ts](apps/api/src/modules/ai/ai.service.ts#L74-L126)
- Kill switch: `AI_ENABLED`, `AI_ENABLED_DEMO`, `AI_ENABLED_PROD` — [apps/api/.env.example](apps/api/.env.example)
- Limity kosztów: budżet GCP + alerty (500 PLN) — [dokumentacjaProdukcyjna/GCP.md](../..//GCP.md)
