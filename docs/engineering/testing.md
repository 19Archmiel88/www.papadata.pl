# Engineering — Testing & Contracts

## Kontrakty danych (demo)
- Dane mock powinny mieć spójne typy TS
- Preferowane:
  - JSON Schema / OpenAPI -> generowanie typów TS (future)
  - wspólny pakiet typów (future)

## Mockowanie
- Poziomy:
  - dev: statyczne `MOCK_*` + generator
  - integration: MSW/Mirage (opcjonalnie)
  - edge cases: faker/dynamic data (opcjonalnie)

## Edge cases
- loading states
- empty states
- error states
- offline states
- AI safety block
- AI timeout
- brak klucza API

## Pact / consumer-provider (future)
- Gate w CI: zgodność konsumenta z kontraktem
- Broker (opcjonalnie)

## Quality gate (MVP)
- brak błędów w konsoli
- brak hard-coded stringów w UI
- podstawowe testy manualne dla kluczowych flow (landing → dashboard, modale, drawer)
