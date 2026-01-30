# Checklist po refaktorze (Repo + [GCP]) — papadata.pl

**Ostatnia aktualizacja:** 2026-01-26  
**Legenda:**

- [x] zrobione
- [ ] do zrobienia
- [-] N/A (nie dotyczy po podjęciu decyzji)
- **[GCP]** krok wymagający konfiguracji w Google Cloud (poza repo)

> Wskazówka: przy punktach warunkowych (ETL / shadcn / deps / Cloud SQL) używaj `[-] N/A` dla gałęzi, która nie obowiązuje po decyzji.

---

## 0) Decyzje, które usuwają niejasności (zaznacz jedną opcję)

### ETL

- [x] ETL **TAK** (utrzymujemy w produkcie)

### Standard UI

- [x] shadcn/ui **TAK** (wdrażamy jako standard)

### Martwe zależności (dla każdej wybierz „UŻYWAMY” albo „USUWAMY”)

- [x] framer-motion **UŻYWAMY**
- [x] recharts **UŻYWAMY**

### Cloud SQL

- [x] Cloud SQL **TAK** (docelowa baza na GCP)

---

## P0 / MUST — Model biznesowy i bezpieczeństwo domyślne (aplikacja / repo)

### [BILL-000] Billing Source of Truth + state machine + kontrakt danych

- [x] Źródło prawdy: **DB autorytatywne**, Stripe = event source, ENV = demo fallback (bez premium-by-default)
- [x] State machine opisana (trialing/active/past_due/canceled/trial_expired + „blocked” jako access-state)
- [x] Kontrakt danych billing (tenant_id, plan, billing_status, trial_ends_at, current_period_end, stripe ids, timestamps)
- [x] Reguły fail-closed (brak danych o płatności/trialu = brak premium)
- [x] Dokumentacja w repo jako „single truth”

**Doprecyzowanie (co ma się znaleźć w projekcie):**

- Dokument ma zawierać: (1) diagram przejść, (2) „source precedence” DB→Stripe→ENV, (3) tabelę: status → dostęp → UI/komunikaty, (4) scenariusze brzegowe (brak DB, Stripe off, błędne ENV).

---

### [BILL-010] Bezpieczne domyślne entitlements (koniec premium-by-default)

- [x] Refactor `entitlements.service.ts` (brak mapowania pustych ENV do pro+active)
- [x] Safe default bez Stripe/DB: **trialing z końcem trialu** albo **starter/demo z ograniczeniami** (zgodnie z decyzją)
- [x] Spójne kody i komunikaty API dla braku uprawnień

**Doprecyzowanie:**

- W projekcie musi istnieć jeden centralny „wynik” entitlements z polami typu: `isPremiumAllowed`, `plan`, `billingStatus`, `trialEndsAt`, `reason` (do logów/UI).

---

### [BILL-020] Automatyczny start trialu po rejestracji

- [x] Signup zapisuje rekord billing w DB (trialEndsAt=now+14d, status=trialing, plan=professional)
- [x] Polityka kiedy trial startuje (np. demo-only vs zawsze) opisana i wdrożona
- [x] Audit log: utworzenie trialu i moment expiry (przynajmniej w logach)

**Doprecyzowanie:**

- Rejestracja ma być idempotentna: ponowny register / retry nie powinien tworzyć duplikatów ani „resetować” trialu bez intencji.

---

### [BILL-030] Egzekucja blokad premium po trialu bez płatności

- [x] Jeden gate (EntitlementsGuard + dekorator) jako jedyna bramka
- [x] Guard na **dashboard**, **integrations**, **exports**, **AI** (zgodnie z polityką premium)
- [x] Brak demo-bypass (demo działa przez trial/stan, nie obejście)
- [x] Mapa limitów/feature flags per plan
- [x] Jasne zachowanie po expiry (które moduły blokujemy i jakim kodem)

**Doprecyzowanie:**

- W repo ma być lista „co jest premium” (endpointy + funkcje) oraz jedno miejsce w kodzie, które to mapuje (żeby nie rozjechało się w przyszłości).

---

### [BILL-040] Stripe jako źródło zdarzeń płatniczych (webhook + idempotencja)

- [x] Webhook działa z raw-body (Fastify/Nest)
- [x] Idempotencja eventów (dedupe po `event.id`) + odporność na retry
- [x] Weryfikacja podpisu Stripe
- [x] Mapowanie Stripe plans ↔ app plans
- [x] Retry job ponownie aplikuje business logic (nie tylko „odhacza”)

**Doprecyzowanie (projekt):**

- Musi być tabela/logika „event ledger”:
  - status eventu: received/processed/failed
  - powód błędu (dla retry)
- W docs: lista eventów Stripe obsługiwanych + co aktualizują w DB.

---

### [BILL-050] Backfill istniejących kont (jednorazowa naprawa)

- [x] Identyfikacja niespójności (active bez dowodu, trialEndsAt null itd.)
- [x] Skrypt backfill + raport (liczniki + przykłady)
- [x] Zabezpieczenie przed tworzeniem takich stanów w przyszłości

**Doprecyzowanie:**

- W repo musi być runbook: kiedy uruchamiać backfill, jak odwrócić skutki (jeśli potrzebne), gdzie sprawdzić raport.

---

### [BILL-060] Testy E2E trial → expiry → payment + testowalny czas

- [x] TimeProvider/Clock (wstrzykiwalny czas) bez flaky testów
- [x] E2E: fresh user → trial; po 14 dniach → blokada; payment → odblokowanie; brak Stripe/DB/ENV → fail-closed
- [x] Wpięte do CI w repo

**Doprecyzowanie:**

- Minimalnie: testy muszą weryfikować **co najmniej 1 endpoint premium** (np. dashboard/exports/integrations) oraz 1 nie-premium (health), aby nie było false-positive.

---

## P0 / MUST — DB migracje / schema bootstrap (repo)

### [DB-010] Canonical migracje (SQL runner) zamiast ręcznego SQL jako jedynej drogi

- [x] Runner migracji + tabela `schema_migrations`
- [x] Migracje tworzą/uzupełniają: billing/trial + tabela idempotencji Stripe eventów + indeksy
- [x] Runbooki zaktualizowane: migracje jako canonical, `cloudsql-schema.sql` jako referencja

**Doprecyzowanie:**

- `db:migrate` ma być:
  - idempotentne (można odpalić wiele razy),
  - deterministyczne (ta sama kolejność, checksum),
  - łatwe do uruchomienia w CI i lokalnie.

---

## P0 / MUST — GCP STG: automatyczne i przewidywalne wdrożenia (repo + [GCP])

> **Uwaga:** tu często są dwa etapy: (1) przygotowanie w repo, (2) realna konfiguracja na GCP.

### [GCP-010] Cloud Build Triggery (push → build/test/deploy/smoke)

- [x] (repo) `cloudbuild/stg.yaml` gotowy pod build+test+deploy+smoke
- [ ] **[GCP]** Utworzyć trigger w `papadata-platform-stg` wskazujący `cloudbuild/stg.yaml`
- [x] (repo) mechanizm promotion do prod (`cloudbuild/prod.yaml`, `pnpm run promote:prod`) opisany
- [ ] **[GCP]** Utworzyć mechanizm promotion (trigger/manual) dla `cloudbuild/prod.yaml`
- [ ] **[GCP]** Ustawić politykę tagowania (commit SHA / release tag) w procesie release (konwencja + egzekucja)

**Doprecyzowanie ([GCP]):**

- Trigger powinien odpalać się na konkretny branch (np. main) i mieć SA z uprawnieniami do Artifact Registry + Cloud Run.

---

### [GCP-020] Artifact Registry (europe-central2) + IAM

- [x] (repo) pipeline publikuje obrazy zgodnie z konwencją
- [ ] **[GCP]** Utworzyć Artifact Registry `papadata-platform` w `europe-central2`
- [ ] **[GCP]** Nadać Cloud Build SA role do push/pull (Artifact Registry)
- [ ] **[GCP]** Zweryfikować retencję/tag cleanup (opcjonalnie) i politykę dostępu

**Doprecyzowanie ([GCP]):**

- Upewnić się, że Cloud Run runtime SA ma pull (jeśli wymagane) oraz że obrazy są w tym samym regionie.

---

### [GCP-030] Cloud Run STG — pełne ENV + polityki dostępu

- [x] (repo) lista wymaganych ENV + runbooki doprecyzowane
- [ ] **[GCP]** Skonfigurować ENV w Cloud Run (APP_MODE, CORS, Vertex/AI, itd.)
- [ ] **[GCP]** Polityki dostępu: ingress, allow-unauthenticated (świadomie), ewentualny LB
- [ ] **[GCP]** Zweryfikować, że dashboard/AI działa w STG (zgodnie z trial/billing)

**Doprecyzowanie ([GCP]):**

- Kluczowe: `CORS_ALLOWED_ORIGINS=https://stg.papadata.pl` oraz komplet ustawień Vertex/AI wymaganych przez `/api/ai/chat`.

---

### [GCP-040] Secret Manager + mapowanie sekretów do Cloud Run

- [x] (repo) dokumentacja i wymagania sekretów spójne z kodem
- [ ] **[GCP]** Utworzyć sekrety (JWT, Stripe, Firebase, DB) w Secret Manager
- [ ] **[GCP]** Nadać runtime SA `secretAccessor` tylko do wymaganych sekretów
- [ ] **[GCP]** Zmapować sekrety do Cloud Run jako env/volumes (bez plaintext)

**Doprecyzowanie ([GCP]):**

- Wymuś zasadę: żadnych sekretów w `--set-env-vars` plaintext w pipeline.

---

### [GCP-050] Smoke/observability jako DoD po każdym deployu

- [x] (repo) `tools/verify-stg.mjs` + runbook `stg-verify.md`
- [ ] **[GCP]** Ustawić minimalne log queries / dashboard w Cloud Logging (operacyjne)
- [ ] **[GCP]** Alerty minimum: nieudany deploy / 5xx / brak odpowiedzi health (opcjonalnie, ale zalecane)

**Doprecyzowanie ([GCP]):**

- Jeśli używacie Sentry: runtime ENV + DSN, i alert na wzrost error rate po deployu.

---

## P1 / SHOULD — spójność produktu i redukcja tech-debt (repo)

### [ETL-010] ETL: szkielet albo usunięcie obietnic (doprecyzowane)

- [x] ETL **TAK**:
  - [x] Dodać `apps/etl/*` (minimalny szkielet, no-op dopuszczalny)
  - [x] README w `apps/etl` musi zawierać:
    - cel ETL w produkcie,
    - jak uruchomić lokalnie,
    - jak będzie wdrażane (docelowo: job/scheduler),
    - granice (czego jeszcze nie robi).

---

### [UI-010] Standard komponentów: shadcn/ui vs własny system (doprecyzowane)

- [-] shadcn/ui **NIE**:
  - [-] W docs/roadmap jasno: „własny UI, bez shadcn”
  - [-] Usunąć wzmianki o planie shadcn z repo (docs / TODO)
  - [-] Dopisać minimalne zasady własnych komponentów (foldery, naming, tokens)
- [x] shadcn/ui **TAK**:
  - [x] Zainstalować i skonfigurować shadcn/ui wg standardu projektu
  - [x] Dodać minimalny zestaw komponentów (np. Button, Input, Dialog, Card)
  - [x] Dodać konwencję: gdzie trzymamy komponenty, jak wersjonujemy i stylujemy

> Po wyborze decyzji ustaw drugą gałąź na `[-] N/A`.

---

### [UI-020] Martwe zależności: framer-motion / recharts (doprecyzowane)

#### framer-motion

- [-] framer-motion **USUWAMY** (rekomendacja, jeśli brak realnego użycia):
  - [-] Usuń zależność z `apps/web/package.json` (lub root, jeśli tam jest)
  - [-] Usuń importy/ślad w kodzie (global search)
  - [-] `pnpm install` aktualizuje lockfile
  - [-] `pnpm run build` + testy przechodzą
  - [-] (opcjonalnie) docs: usuń wzmianki o animacjach jeśli były
- [x] framer-motion **UŻYWAMY** (jeśli ma zostać):
  - [x] Wprowadź min. 1 realny komponent używający framer-motion w UI marketingowym:
    - np. animowany hero / CTA / modal (LandingPage/PromoModal)
  - [x] Zadbaj o preferencje `prefers-reduced-motion`
  - [x] Dopisz w docs „gdzie używamy i po co”

#### recharts

- [-] recharts **USUWAMY** (jeśli nie ma wykresów):
  - [-] Usuń zależność + upewnij się, że dashboard nie ma pustych placeholderów
  - [-] Build/test bez regressions
- [x] recharts **UŻYWAMY**:
  - [x] Wprowadź min. 1 wykres w UI (tam gdzie realnie ma sens):
    - np. prosty wykres trendu w sekcji dashboard/overview (jeśli UI istnieje),
    - albo przykładowy wykres w landing („jak wygląda insight”)
  - [x] Ustal format danych i fallback (gdy brak danych)
  - [x] Dodaj test snapshot/DOM (minimalny), żeby nie zniknął przy refaktorze

> Po wyborze decyzji ustaw pozostałe gałęzie na `[-] N/A`.

---

### [UI-030] Neon-dark / gradient tokens

- [x] Tokeny i gradienty w Tailwind config
- [x] Spójne style w LandingPage/MainLayout

---

### [DATA-010] UTM: taksonomia + lista kanałów/platform + normalizer

- [x] Docs UTM + `channel_group`
- [x] Config kanałów/platform w repo
- [x] Util normalizer/validator

---

### [CI-010] CI w repo: dopięcie parametrów pod realne STG

- [x] `cloudbuild/stg.yaml` nie deployuje „okrojonego” API bez kluczowych ustawień
- [x] Jeśli rotacja DB ma działać: obraz zawiera job i da się uruchomić jako job

---

## P2 — Production-grade / operacyjne dopracowanie ([GCP] + trochę repo)

### [DB-020] Cloud SQL: HA, backupy, maintenance, sieć

- [x] Decyzja Cloud SQL: TAK/NIE (patrz sekcja 0)
- [ ] **[GCP]** Jeśli TAK:
  - [ ] Instancja + region/zone (zgodnie z architekturą)
  - [ ] Automated backups + PITR (jeśli dostępne) + retencja
  - [ ] Maintenance window (kontrolowane okno)
  - [ ] HA (jeśli wymagane) + polityka failover
  - [ ] Private IP + VPC connector (jeśli prywatne połączenie)
  - [ ] IAM/role minimalne (cloudsql.client tylko gdzie trzeba)
- [x] (repo) Jeśli TAK:
  - [x] Runbook: jak łączy się Cloud Run do Cloud SQL (metoda, env, SSL)
  - [x] Wymagane sekrety/ENV doprecyzowane i spójne z kodem

---

### [OPS-010] Rotacja hasła DB jako Cloud Run Job + Scheduler

- [ ] **[GCP]** Cloud Run Job uruchamiający `rotate-db-password`:
  - [ ] Konfiguracja env: `DB_PASSWORD_SECRET_NAME`, `DB_ROTATE_USER`, `DATABASE_URL`/`DATABASE_ADMIN_URL`, SSL flags
  - [ ] IAM: `roles/cloudsql.client`, `roles/secretmanager.secretVersionAdder` (minimalnie)
  - [ ] VPC connector (jeśli DB prywatna)
- [ ] **[GCP]** Cloud Scheduler:
  - [ ] harmonogram
  - [ ] uprawnienia do uruchamiania joba
- [x] (repo) Runbook:
  - [x] Jak przetestować rotację manualnie
  - [x] Jak zweryfikować, że aplikacja czyta najnowszą wersję sekretu

---

### [SEC-010] Security / koszty / ochrona publicznych endpointów

- [ ] **[GCP]** Budżety + alerty kosztów (billing alerts)
- [ ] **[GCP]** Ograniczenia IAM (least privilege) dla Cloud Build i runtime SA
- [ ] **[GCP]** Cloud Armor / rate limiting (jeśli endpointy publiczne)
- [ ] **[GCP]** Audit logging / podstawowe alerty (5xx, spike error rate, brak health)
- [x] (repo) Krótki runbook „Security baseline”:
  - [x] jakie role są wymagane i dlaczego,
  - [x] jakie alerty są obowiązkowe na STG/PROD,
  - [x] checklista przed PROD promotion.

---

## Minimalna kolejność (po refaktorze)

1. P0 repo: **BILL-000 → BILL-010 → BILL-020 → BILL-030 → BILL-040 → BILL-050 → BILL-060**
2. P0 repo: **DB-010**
3. P0 GCP: **[GCP-010..050]** (realna konfiguracja w papadata-platform-stg)
4. P1 repo: ETL/UI-010/UI-020/UTM (wg decyzji)
5. P2: Cloud SQL / rotacje / hardening **[GCP]**

---
