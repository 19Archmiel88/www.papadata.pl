# Engineering — Testing & Contracts (Production + Demo 1:1)

## Cel
Zapewnić, że dashboard DEMO jest **1:1** z PROD (różnice tylko w providerach danych/AI/persystencji) oraz że produkt spełnia minimalne kryteria jakości w produkcji.

## 1) Kontrakty danych (DEMO i PROD)
- Dane mock powinny mieć spójne typy TS.
- Źródło typów: `libs/shared/src/contracts/*` (publikowane przez workspace `@papadata/shared`).
- Zgodność w CI: `pnpm run test:api:e2e` + `pnpm run test:web:unit` + `pnpm run test:smoke` w pipeline release.

## 2) Poziomy testów
### Unit (frontend)
- logika formatowania KPI, selektory filtrów, utilsy
- walidacje i mappers

### Integration (frontend)
- mockowanie API (MSW/Mirage) — opcjonalnie, ale zalecane dla krytycznych flow
- testy komponentów (render + interakcje)

### E2E (minimum produkcyjne)
- landing → przejście do demo dashboard
- nawigacja po kluczowych widokach
- AI drawer: send / cancel / timeout / safety block / offline
- legal pages + cookie banner (jeśli dotyczy)

Narzędzie: Playwright (apps/web).

Uruchomienie:
```bash
pnpm run test:smoke
```

Logi z testów:
- `dokumentacjaProdukcyjna/docs/engineering/test-log.md`

Raport HTML:
- `apps/web/playwright-report/index.html`

## 3) Test matrix: DEMO vs PROD (1:1)
Wymaganie: te same testy UI powinny przechodzić w obu trybach, poza:
- źródłem danych (DemoDataProvider vs ProdDataProvider),
- persystencją (symulowana vs real),
- integracjami (symulowane vs real).

## 4) Edge cases (must-have)
- loading states
- empty states
- error states
- offline states
- AI safety block
- AI timeout
- brak dostępu do backendu AI (fallback)

## 5) Pact / consumer-provider (docelowo)
- gate w CI: zgodność konsumenta z kontraktem
- broker (opcjonalnie)

## 6) Quality gate (minimum)
- brak błędów w konsoli
- brak hard-coded stringów w UI
- dostępność klawiaturą (Tab/Shift+Tab/Enter/Esc) + fokus widoczny
- podstawowe testy manualne dla kluczowych flow (landing → dashboard, modale, drawer)
