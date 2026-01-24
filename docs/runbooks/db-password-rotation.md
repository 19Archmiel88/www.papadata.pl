# Rotacja hasła DB — Cloud SQL (wpięcie w workflow LOKAL → STG → PROD)

## Cel
Automatyczna rotacja hasła użytkownika DB w Cloud SQL + zapis nowego hasła w Secret Manager.

---

## 0) Gdzie to siedzi w workflow
- **LOKAL (kod):** trzymasz i rozwijasz job w repo, commit/push do Git.
- **STG (wdrożenie + test):** job działa jako **Cloud Run Job** w `papadata-platform-stg`, wywoływany przez **Cloud Scheduler**.
- **PROD (wdrożenie + produkcja):** identycznie jak STG, tylko w `papadata-platform-prod`.

---

## 1) Wymagania (GCP)
### Uprawnienia dla joba (Service Account Cloud Run Job)
- `roles/cloudsql.client`
- `roles/secretmanager.secretVersionAdder`

### Sieć
- Dostęp sieciowy do Cloud SQL:
  - **Private IP + VPC connector**

---

## 2) Job (kod w repo)
- Plik: `apps/api/src/jobs/rotate-db-password.ts`
- Uruchomienie (Cloud Run Job):
  - Command: `node dist/jobs/rotate-db-password.js`

### Wymagane ENV dla joba
- `GOOGLE_CLOUD_PROJECT` lub `GCP_PROJECT_ID`
- `DB_PASSWORD_SECRET_NAME` (np. `CLOUD_SQL_PASSWORD`)
- `DB_ROTATE_USER` (np. `papadata`)
- `DATABASE_ADMIN_URL` lub `DATABASE_URL`
- `DATABASE_SSL_ENABLED` (true/false)
- `DATABASE_SSL_REJECT_UNAUTHORIZED` (true/false)

---

## 3) Harmonogram (GCP)
- **Cloud Scheduler:** np. raz na 30 dni
- Target: **Cloud Run Job**

---

## 4) Kontrakt po rotacji (runtime)
- Job zapisuje nowe hasło jako **nową wersję** w **Secret Manager**.
- Aplikacja pobiera hasło z **Secret Manager** (mapowanie secret→ENV).
- `DATABASE_URL` w Cloud Run korzysta z **Secret Manager**.
