# Testy

## Poziomy
- Unit: utils, kalkulatory (np. ROI), formatowanie KPI
- Integration: komponenty widoków z mockami
- Contract: JSON/OpenAPI schemas → mock generator
- E2E (docelowo): krytyczne ścieżki (landing → demo → dashboard)

## Stany wymagane do testów UI
- loading / empty / error / offline
- brak klucza AI
- safety block
- timeout / retry

## CI (docelowo)
- lint + typecheck
- testy unit/integration
- contract gates
