# ETL (scheduler-ready skeleton)

## Cel w produkcie

- Przetwarzanie wsadowe (backfill/raporty) poza API.
- Docelowo uruchamiane jako Cloud Run Job (manualnie lub z Cloud Scheduler).

## Jak uruchomić lokalnie

```bash
pnpm --filter @papadata/etl start
```

- Skrypt `src/index.mjs` jest no-op (loguje start), gotowy do zamiany na realne kroki ETL.
- Wymagane ENV (gdy dodamy logikę DB/API): `DATABASE_URL` / `API_BASE_URL` (w zależności od zadania).

## Jak będzie wdrażane

- Build image razem z resztą monorepo (Dockerfile można dodać per job w tym katalogu).
- Uruchomienie w GCP: Cloud Run Job + opcjonalnie Cloud Scheduler.
- Job powinien przyjmować parametry przez ENV (np. okno dat, tryb dry-run).

## Granice (co jeszcze NIE działa)

- Brak realnych kroków ETL (pipeline jest pusty).
- Brak podłączenia do DB/API — do dodania per konkretny job.
