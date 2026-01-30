# Billing Backfill — jednorazowe naprawy

## Kiedy uruchamiać

- Po imporcie danych lub migracji planów.
- Po wykryciu niespójności: `active` bez Stripe, `trialing` bez `trial_ends_at`, brak `plan`.

## Skrypt

- Plik: `apps/api/src/jobs/backfill-billing.ts`
- Domyślnie **dry-run** (nie modyfikuje DB).

### Parametry (ENV)

- `DATABASE_URL` — wymagane.
- `BACKFILL_TRIAL_DAYS` — ile dni ma trwać nadany trial (domyślnie 14).
- `BACKFILL_APPLY=1` — tryb zapisu (bez tego jest raport).

### Uruchomienie

```bash
# Dry-run (zalecane)
pnpm --filter @papadata/api exec ts-node ./src/jobs/backfill-billing.ts

# Apply (zapis)
BACKFILL_APPLY=1 pnpm --filter @papadata/api exec ts-node ./src/jobs/backfill-billing.ts
```

### Raport

- JSON na stdout: liczba korekt + lista akcji (`tenantId`, `reason`, `update`).
- Przechowaj raport w ticketcie/Confluence po apply.

## Zakres korekt

- Ustawia `plan=starter` gdy plan spoza enum.
- Dodaje `trial_ends_at` gdy `trialing` i brak daty.
- Ustawia `billing_status=trial_expired` gdy trial minął.
- Konwertuje `active` bez Stripe IDs na `trialing` + nowy trial.

## Rollback

- W razie błędu: przywrócić z backupu DB (Cloud SQL backup/PITR).
- Logiczny rollback: ponowne uruchomienie z prawidłowymi danymi Stripe (webhook/retry job uzupełni plan/status).
