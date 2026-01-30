# Contributing

Dziękujemy za wkład. Repo to komercyjny SaaS z publicznym demo, więc trzymamy standardy jak dla produkcji.

## Zasady ogólne

- Dokumentacja jest kontraktem: jeśli czegoś brakuje — dopisz **założenia, ograniczenia i ryzyka**.
- Brak sekretów w repo. Używaj `.env.local` oraz (jeśli istnieje) `.env.example` bez sekretów.
- Zero hard-coded tekstów UI — wszystko przez i18n.
- UI musi mieć minimalne stany: loading/empty/error/offline.
- Dostępność: focus/klawiatura/ARIA dla elementów interaktywnych.
- Bez PII i wrażliwych danych w logach oraz promptach AI.

## Workflow

1. Branch z `main`:
   - `feat/...`, `fix/...`, `chore/...`, `docs/...`
2. Commity:
   - Preferowany styl: Conventional Commits (`feat|fix|chore|docs|refactor|test`).
3. Pull Request:
   - Opis: **co**, **dlaczego**, **jak przetestować**
   - Link do sekcji dokumentacji, której dotyczy zmiana (jeśli dotyczy)

## Wymagane aktualizacje dokumentów

Jeśli PR zmienia:

- zachowanie UI/UX → zaktualizuj odpowiedni dokument (np. `DASHBOARD.md`, `INTERAKCJE.md`, `WYGLAD.md`)
- integracje / autoryzacje → zaktualizuj `INTEGRACJE.md`
- AI prompting/streaming/safety → zaktualizuj `ai-integration.md`
- procesy bezpieczeństwa → zaktualizuj `SECURITY.md`
- cokolwiek istotnego w funkcjonalności → dodaj wpis do `CHANGELOG.md`

## Standardy kodu

- TypeScript strict (docelowo)
- Unikaj sprzęgania komponentów (czyste propsy, minimalne zależności)
- Brak ciężkich zależności bez uzasadnienia

## Testowanie (minimum)

Uruchom lokalnie i przeklikaj krytyczne ścieżki (zgodnie z dostępnymi skryptami w `package.json`):

- start dev (np. `pnpm run dev`)
- build (np. `pnpm run build`)

Manual smoke test:

- `/` (landing)
- `/dashboard/overview`
- modale/drawer: ESC, focus trap, nawigacja klawiaturą
- brak błędów w konsoli

## PR checklist

- [ ] Nie dodałem/am sekretów do repo (tokeny/klucze/PII)
- [ ] UI ma stany loading/empty/error/offline tam, gdzie dotyczy
- [ ] Teksty UI są w i18n (brak hard-coded strings)
- [ ] Sprawdziłem/am dostępność klawiaturą (Tab/Shift+Tab/Enter/Esc)
- [ ] Zaktualizowałem/am docs i `CHANGELOG.md` (jeśli dotyczy)

## Bezpieczeństwo

- Wrażliwe dane i PII nie mogą trafiać do logów ani promptów AI.
- Zgłoszenia podatności: patrz `SECURITY.md`.
