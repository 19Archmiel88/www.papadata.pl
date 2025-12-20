# Contributing

Dziękujemy za wkład. Repo to demo/POC, ale trzymamy standardy jak dla produkcji.

## Zasady ogólne
- Dokumentacja w `docs/` jest kontraktem. Jeśli czegoś brakuje — opisz założenia i ryzyko.
- Brak sekretów w repo. Używaj `.env.local` / `.env.example`.
- Zero hard-coded tekstów UI — wszystko przez i18n.
- UI musi mieć minimalne stany: loading/empty/error/offline.
- Dostępność: focus/klawiatura/aria dla elementów interaktywnych.

## Workflow
1. Fork / branch z `main`:
   - `feat/...`, `fix/...`, `chore/...`, `docs/...`
2. Commity:
   - Preferowany styl: Conventional Commits (feat/fix/chore/docs/refactor/test).
3. PR:
   - Opis: co, dlaczego, jak przetestować
   - Link do sekcji dokumentacji, której dotyczy zmiana (jeśli dotyczy)

## Standardy kodu
- TypeScript strict (docelowo)
- Unikaj “sprzęgania” komponentów (czyste propsy, minimalne zależności)
- Brak ciężkich zależności bez uzasadnienia

## Testowanie (minimum)
- `npm run dev` i przeklikanie:
  - `/` (landing)
  - `/dashboard/overview`
  - modale/drawer (ESC, focus)
- Brak błędów w konsoli

## Bezpieczeństwo
- Wrażliwe dane i PII nie mogą trafiać do logów ani promptów AI.
- Zgłoszenia podatności: patrz `SECURITY.md`.
