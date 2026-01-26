# PapaData Intelligence — GCP v2.x — STATUS + CHECKLIST (PROD / Warszawa / EU-only / AI-first)

> Cel: czytelnie pokazać, co jest DONE vs DO UZUPEŁNIENIA, bez duplikatów.  
> Workflow docelowy (ustalony): **LOKAL → Git → auto STG deploy → testy E2E/smoke → jednokomendowy PROD deploy**.

**Legenda checklisty:**
- [x] = ✅ DONE
- [ ] = ⏳ do uzupełnienia (albo „częściowo” – opis w nawiasie)

---

## 0) Workflow wydaniowy (SOURCE OF TRUTH)

- [x] Rozwój i przygotowanie zmian lokalnie (kod + Terraform/SQL/runbooki w repo).
- [x] Push do Git → **automatyczny deploy na STG** (`papadata-platform-stg`), infrastruktura **1:1 z PROD**.
- [x] Testy E2E na STG: rejestracja, płatności, integracje, limity planów.
- [x] Po pozytywnych testach: **jednokomendowy deploy na PROD** (`papadata-platform-prod`) pod domeną `www.papadata.pl`.
- [x] Multi-tenant: przy rejestracji klienta tworzony osobny dataset; trial 14 dni (Professional); po braku płatności blokady premium; po płatności limity wg planu; sekrety i konfiguracje odseparowane per env/tenant.
- [x] CI/CD: pipeline zdefiniowany w repo (`cloudbuild/stg.yaml`, `cloudbuild/prod.yaml`); triggery do ustawienia w GCP.

---

## 1) PROD — stan aktualny (FULL STACK ACTIVE)

### Do zrobienia
- [x] CI/CD w repo: `cloudbuild/stg.yaml` + `cloudbuild/prod.yaml` (triggery do utworzenia w GCP).
- [ ] DNS switch dla apex `papadata.pl` → Load Balancer / redirect na `www`.
- [ ] (Post-launch) Zawęzić Org Policy `iam.allowedPolicyMemberDomains` po stabilizacji publicznego API.
- [ ] Monitoring operacyjny: SLO/alerty 5xx/latency/job failures (poza budżetem).

### Checklist
- [x] Region / rezydencja: zasoby w `europe-central2` (Warszawa).
- [x] Identity Platform (IdP): auth włączone (Email / Google / Microsoft).
- [x] Cloud Armor (WAF): polityka `papadata-security-policy` aktywna + podpięta pod backend.
- [x] Cloud Run – API: `papadata-api-v2` (NestJS) – public + auth.
- [x] Cloud Run – Frontend: `papadata-frontend-v2` (React/Vite + Nginx) – public.
- [x] Global HTTPS LB + NEG: LB (HTTPS) → Backend Service → NEG → Cloud Run (`papadata-api-v2`).
- [x] Managed Certificate: cert dla `www.papadata.pl` ACTIVE.
- [x] Cloud DNS: rekord `A www.papadata.pl` → IP LB.
- [x] Storage (exports): bucket `papadata-exports-prod` istnieje.
- [x] BigQuery: izolacja per-tenant (datasety per klient).
- [x] Pub/Sub + Scheduler: `etl-topic` i `etl-daily` (attempt_deadline=320s wg notatek).
- [x] Cloud Run – Jobs: ETL/Dataform/Guardian uruchamiane jako joby.
- [x] FinOps: budżet 500 PLN + alerty (50% / 90% / 100%).
- [ ] DNS (apex): `papadata.pl` → LB / redirect na `www`.
- [x] CI/CD: pipeline build/test → deploy (STG auto + PROD one-command) opisany w `cloudbuild/*`.

---

## 2) CI/CD — standard v2 (STG auto + PROD one-command)

### Do zrobienia
- [x] Pipeline zdefiniowany w repo (cloudbuild) jako standard; drift do wyczyszczenia w GCP/IaC.
- [ ] Bramki jakości (lint/test/smoke) jako etap przed release.
- [ ] Audit “kto/co wdrożył” jako część procesu.

### Checklist
- [x] STG: automatyczny deploy po push do Git (Cloud Run + infra 1:1 z PROD).
- [x] Testy na STG: rejestracja, płatności, integracje, limity AI/źródeł.
- [x] PROD: jednokomendowy deploy po pozytywnej walidacji STG.
- [ ] Backfill klikanych zmian do Terraform (żeby Terraform był source of truth i nie było driftu).

---

## 3) Terraform / IaC — porządek, drift, cleanup legacy

### Do zrobienia
- [ ] Backfill zmian do Terraform (żeby nie było driftu).
- [ ] Identity Platform w Terraform jako konfiguracja wprost (żeby nie było „klikane”).

### Checklist
- [x] Legacy Cloud Run services (`ai-v2`, `notifier-v2`) — usunięte z runtime (potwierdzone listą usług).
- [x] Runbook „unprotect & destroy legacy” istnieje.
- [ ] Terraform jako „source of truth” dla elementów klikanych.

---

## 4) Plany / trial / limity (runtime)

### Do zrobienia
- [ ] Domknąć źródło prawdy entitlementów (status planu/trial/limity) jako trwałe dane (a nie tylko ENV).
- [ ] Egzekucja: AI limity + cadence raportów + limit źródeł wg planu (Starter/Professional/Trial).

### Checklist
- [x] Trial 14 dni = pełny Professional/premium; po braku płatności blokady premium; po płatności limity wg planu.
- [x] Multi-tenant: per-tenant dataset; separacja sekretów i konfiguracji per env/tenant.
- [x] Runbooky: Billing+Entitlements (Stripe webhooks, Cloud SQL, limity) oraz rotacja hasła DB w repo.
- [ ] Pełne spięcie billing → entitlements → runtime enforcement + UI.

---

## 5) Domeny i routing (Cyber_Folks + Cloud DNS + edge w GCP)

### Do zrobienia
- [ ] Dopięcie apex `papadata.pl` (redirect na `www` lub hosting na LB).
- [ ] Wymuszenie hosta kanonicznego (np. `www`).

### Checklist
- [x] Rejestrator domeny: Cyber_Folks.
- [x] DNS: Cloud DNS + rekord `www` → LB.
- [x] Edge: Global HTTPS LB + Managed Certificate + Cloud Armor.
- [ ] Apex `papadata.pl` przepięty / redirect.

---

## 6) Runtime (Cloud Run) — usługi i joby

### Do zrobienia
- [ ] Ujednolicić nazewnictwo serwisów jako standard.
- [ ] (Opcjonalnie) wydzielenie `ai/notifier/exporter` jako osobne serwisy — tylko jeśli faktycznie potrzebne.

### Checklist
- [ ] Cloud Run services (PROD):
- [ ] Cloud Run jobs: ETL/Dataform/Guardian działają jako joby.
- [ ] Orkiestracja: Scheduler → Pub/Sub → Joby (zgodnie z wdrożonymi zasobami w notatkach).

---

## 7) Multi-tenant i BigQuery (dataset per klient)

### Do zrobienia
- [ ] Dodać kolejne tenanty wg wzorca (datasety + SA + uprawnienia).

### Checklist
- [x] Wzorzec datasetów per-tenant: `t_<tenantId>_raw`, `t_<tenantId>_stg`, `t_<tenantId>_marts`.
- [x] Izolacja: brak cross-tenant.
- [x] Broker/impersonacja SA per-tenant.
- [x] Kontrakt: dashboard/AI czyta tylko `*_marts`.

---

## 8) IAM — izolacja i least privilege

### Do zrobienia
- [ ] Dostęp ludzi do danych (prod): brak stałego dostępu; tryb „break-glass” (czasowy + audyt).
- [ ] Org Policy: zawężenie domen członków IAM (post-launch).

### Checklist
- [x] SA brokerów: `sa-api-broker`, `sa-ai-broker`.
- [x] SA per tenant + minimalne role (read marts / write raw itd.).

---

## 9) Sekrety i rotacja DB

### Do zrobienia
- [ ] Rotacja secretów jako regularny proces (poza DB).
- [ ] Ujednolicenie mapowania sekretów w Cloud Run (ENV/Secret Manager) jako standard.

### Checklist
- [x] Sekrety: tylko Secret Manager (zero w FE/repo).
- [x] Rotacja DB: Cloud Run Job `apps/api/src/jobs/rotate-db-password.ts` + Scheduler (np. co 30 dni).
- [x] Role joba: `roles/cloudsql.client`, `roles/secretmanager.secretVersionAdder`.

---

## 10) Runbooki operacyjne (w repo)

### Checklist
- [x] Local Verification Runbook (API+WEB): start, lint/test, smoke (JSON+SSE).
- [x] STG Release Runbook — API: build/test/deploy + smoke.
- [x] STG Verification Runbook: smoke + CORS + logi.
- [x] STG Release/Verification: bazowe URL i expected outputy ustalone.

---

## 11) Dockerfile / lokalne narzędzia

### Fakty (ustalone)
- [x] Frontend: dedykowany `Dockerfile` (multi-stage: Node build → Nginx Alpine) do uruchomienia na Cloud Run.
- [x] API: deploy na Cloud Run (w repo i runbookach używany tryb `gcloud run deploy ... --source ./apps/api` dla STG API).
- [x] Rozszerzenie VS Code “Container Tools” od Microsoft dla Docker language: można zainstalować (to tylko wsparcie edytora).

---
