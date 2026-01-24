# Legal — Terms of Service — legal-terms

## Cel i kontekst
- Wyświetla dokument prawny Terms of Service jako markdown.
- Użytkownicy: wszyscy.

## Wejścia / Preconditions
- Route: /legal/terms
- Źródło treści: fetch z `/legal/terms-of-service.md` lub `VITE_LEGAL_DOCS_BASE_URL/terms-of-service.md`.

## Układ (Figma-ready)
### Struktura
- Header z logo + title + CTA „Back to home”.
- Body: karta z tytułem (H1) + treść markdown (pre).

### Komponenty
- `LegalDocPage` + `InteractiveButton`.

### Copy (teksty UI)
- Tytuł i treść z pliku md.
- Fallback: `t.common.coming_soon_desc` lub `t.common.error_desc`.

### RWD
- Jedna kolumna, responsywne paddingi.

## Stany UI
- Default: treść dokumentu.
- Loading: brak jawnego loadera (content pusty do czasu fetch → fallback).
- Empty: fallback „coming soon”.
- Error: fallback „error” w treści.
- Success: render treści.
- Focus/Keyboard: przycisk „Back to home” focusable.

## Interakcje (klik po kliku)
### Akcja: Back to home
- Trigger: przycisk w header.
- Efekt: nawigacja do /.

## Walidacje i komunikaty
- Brak formularzy.

## Dane i integracje
- Fetch `docUrl` z App.tsx.
- Błędy: `response.ok === false` → error fallback.

## A11y
- Header button opisany tekstem.
- Treść w `pre` z czytelnym kontrastem.

## Testy
- Spec: [tests/screens/legal-terms.spec.md](../tests/screens/legal-terms.spec.md)
- Dodatkowe: sprawdź dostępność klawiaturą + kontrast nagłówka.
