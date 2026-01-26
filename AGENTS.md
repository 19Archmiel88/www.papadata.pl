# Plan działań — priorytety wdrożeniowe (papadata.pl)
**Ostatnia aktualizacja:** 2026-01-26  
**Zakres:** repo (apps/web, apps/api, libs/*) + GCP (papadata-platform-stg) + proces release

> Zasada pracy w tym repo: najpierw opis zmian (bez kodu), wdrożenie pełnych plików dopiero po „AKCEPTUJĘ”; pliki dostarczane w całości (bez ellipsis).

---

## Definicje
- **P0 / MUST** — blokuje poprawny model biznesowy lub bezpieczne domyślne działanie.
- **P1 / SHOULD** — domyka produkt i usuwa tech-debt, ale nie blokuje krytycznej ścieżki „money-path”.
- **P2** — production-grade / operacyjne dopracowanie.

---

## P0 / MUST — Model biznesowy i bezpieczeństwo domyślne (aplikacja)

### [BILL-000] Kontrakt „Billing Source of Truth” + model stanów (start od tego)
**Cel:** jednoznaczne reguły skąd bierzemy prawdę o planie, trialu i dostępie.

- [ ] Ustalić **source of truth**:
  - DB vs Stripe vs ENV (ENV tylko jako fallback DEMO; nigdy jako „premium aktywne” bez dowodu płatności).
- [ ] Zdefiniować i opisać **state machine** (statusy + przejścia), np.:
  - `trialing` → `active` → `past_due`/`canceled` → `blocked`
- [ ] Zdefiniować **kontrakt danych**: minimalny zestaw pól wymaganych do wyliczania entitlements (np. `plan`, `billingStatus`, `trialEndsAt`, `currentPeriodEnd`, `paymentProviderCustomerId`, itp.).
- [ ] Ustalić **reguły fail-closed**: brak danych o płatności/trialu = brak premium.
- [ ] Udokumentować to w repo (docs) jako „jedyna prawda” dla zespołu.

**DoD:**
- Jednoznaczna dokumentacja decyzji + diagram stanów.
- Brak niejawnych ścieżek typu „puste ENV ⇒ pro+active”.

---

### [BILL-010] Bezpieczne domyślne entitlements (naprawa obecnego ryzyka)
**Cel:** koniec z sytuacją: “puste ENV ⇒ plan=professional i billingStatus=active”.

- [ ] Przejrzeć i uporządkować `apps/api/src/common/entitlements.service.ts`:
  - usunąć/zmienić domyślne mapowanie na `professional + active`.
- [ ] Ustalić bezpieczny default gdy brak Stripe/DB:
  - opcja A: `trialing` z `trialEndsAt = now + 14 dni`,
  - opcja B: `starter/demo` z ograniczeniami (jeśli trial wymaga Stripe).
- [ ] Ujednolicić odpowiedzi API dla braku uprawnień premium (kody + komunikaty).

**DoD:**
- Uruchomienie API z `.env.example` (puste wartości) nie daje premium.
- Premium funkcje są niedostępne bez trial/płatności.

---

### [BILL-020] Automatyczny start trialu po rejestracji
**Cel:** „fresh user” automatycznie dostaje trial 14 dni (`trialEndsAt`).

- [ ] Na zdarzeniu rejestracji (signup) zapisać `trialEndsAt` i status `trialing` (zgodnie z kontraktem).
- [ ] Zdefiniować politykę: czy trial startuje zawsze, czy tylko w trybie DEMO / wybranych tenantach.
- [ ] Dodać logowanie audytowe: kiedy trial został utworzony i kiedy wygasł.

**DoD:**
- Nowy użytkownik/tenant zawsze ma spójny stan trial (status + trialEndsAt).

---

### [BILL-030] Egzekucja blokad premium po trialu bez płatności
**Cel:** twarde odcięcie premium po `trialEndsAt` bez aktywnej płatności.

- [ ] Wprowadzić mechanizm enforcement:
  - guard/middleware na endpointach premium (np. `dashboard/*` lub funkcje premium),
  - centralny check „czy feature jest dozwolony” (nie rozproszony po kodzie).
- [ ] Dodać mapę limitów/feature flags dla planów (Starter/Pro/Enterprise).
- [ ] Ustalić zachowanie po wygaśnięciu:
  - blokada tylko premium vs pełna blokada działania aplikacji.
- [ ] Zdefiniować czy jest „grace period” (opcjonalnie) i jak jest liczony.

**DoD:**
- Po trialu bez płatności premium endpointy są blokowane deterministycznie.

---

### [BILL-040] Stripe jako źródło zdarzeń płatniczych (jeśli płatności mają działać realnie)
**Cel:** płatność → natychmiastowa aktualizacja dostępu, bez ręcznej interwencji.

- [ ] Zaimplementować webhooki Stripe:
  - wybór minimalnego zestawu eventów zgodnie z flow,
  - aktualizacja DB / stanu billing.
- [ ] Zapewnić idempotencję (deduplikacja po `event.id`) + odporność na retry.
- [ ] Zapewnić bezpieczną weryfikację podpisu webhooków.
- [ ] Zmapować plany Stripe ↔ plany aplikacji.

**DoD:**
- Po udanej płatności stan w aplikacji przechodzi na `active` wg planu.
- Webhooki są idempotentne i nie powodują „podwójnych” zmian.

---

### [BILL-050] Backfill / migracja istniejących kont z błędnym stanem
**Cel:** uniknąć „wiecznego premium” albo przypadkowego odcięcia istniejących tenantów.

- [ ] Zidentyfikować konta z:
  - `billingStatus=active` bez dowodu płatności,
  - `trialEndsAt=null` przy trialing,
  - innymi niespójnościami.
- [ ] Przygotować skrypt naprawczy (jednorazowy) i raport:
  - ilu tenantów dotyczy,
  - jakie akcje wykonano.
- [ ] Dodać zabezpieczenie w kodzie przed tworzeniem takich niespójności w przyszłości.

**DoD:**
- Dane billing są spójne dla wszystkich istniejących tenantów.

---

### [BILL-060] Testy E2E dla ścieżki trial → expiry → payment
**Cel:** chronić model biznesowy testami.

- [ ] Dodać abstrakcję czasu (np. `NowProvider`) aby testować „po 14 dniach” bez flakiness.
- [ ] Testy e2e scenariuszy:
  - fresh user → trialing + trialEndsAt,
  - po 14 dniach → blokada premium,
  - po płatności → aktywacja wg planu,
  - brak Stripe/DB/ENV → fail-closed (brak premium).
- [ ] Wpiąć testy do pipeline (lokalnie i CI).

**DoD:**
- Testy przechodzą deterministycznie lokalnie i w CI.

---

## P0 / MUST — DB: migracje / schema bootstrap (żeby nie robić ręcznego SQL jako jedynej drogi)

### [DB-010] Mechanizm migracji lub „init schema” jako canonical path
**Cel:** STG/PROD da się postawić powtarzalnie.

- [ ] Wybrać 1 podejście jako standard:
  - migracje (preferowane) **albo**
  - Cloud Run Job `db:init` / `db:migrate` odpalany z CI.
- [ ] Zapewnić minimalny schema bootstrap obejmujący:
  - tabele/kolumny billing/trial,
  - indeksy,
  - ewentualne dane referencyjne.
- [ ] Zaktualizować runbooki:
  - usunąć zależność od ręcznego wykonywania `cloudsql-schema.sql` jako jedynej opcji.

**DoD:**
- Nowe środowisko STG można zainicjalizować z pipeline/job bez ręcznych kroków.

---

## P0 / MUST — GCP STG: automatyczne i przewidywalne wdrożenia

### [GCP-010] Cloud Build Triggery (push → build/test/deploy/smoke)
**Cel:** STG działa automatycznie po pushu.

- [ ] Utworzyć trigger w `papadata-platform-stg` dla `cloudbuild/stg.yaml`:
  - build API/WEB, testy, deploy, smoke (`tools/verify-stg.mjs`).
- [ ] Ustalić promotion do PROD:
  - osobny trigger / ręczne wywołanie `cloudbuild/prod.yaml` (zgodnie z procesem i `pnpm run promote:prod`).
- [ ] Wymusić spójne tagowanie obrazów (commit SHA / release tag).

**DoD:**
- Push na main (lub dedykowany branch) automatycznie aktualizuje STG i przechodzi smoke.

---

### [GCP-020] Artifact Registry (europe-central2) + IAM dla Cloud Build
**Cel:** pipeline ma gdzie pushować obrazy i ma uprawnienia.

- [ ] Zapewnić repozytorium Artifact Registry `papadata-platform` w `europe-central2`.
- [ ] Nadać Cloud Build uprawnienia push/pull.
- [ ] Zweryfikować, że `cloudbuild/stg.yaml` publikuje i deployuje poprawne obrazy.

**DoD:**
- Build nie wywala się na push/pull obrazów, deploy wskazuje na właściwe tagi.

---

### [GCP-030] Cloud Run STG — pełne ENV + polityki dostępu
**Cel:** STG nie działa w trybie „okrojonym”, tylko jak realna aplikacja.

- [ ] Ustawić komplet ENV wymaganych przez runbooki i aplikację:
  - `APP_MODE=demo`, `PORT`, `NODE_ENV`,
  - `CORS_ALLOWED_ORIGINS=https://stg.papadata.pl`,
  - `VERTEX_PROJECT_ID=papadata-platform-stg`, `VERTEX_LOCATION=europe-central2`, `VERTEX_MODEL=gemini-2.5-flash-lite`,
  - pozostałe `AI_*` wg potrzeb.
- [ ] Ustawić polityki dostępu:
  - `allow-unauthenticated` tylko tam, gdzie to świadome,
  - ingress zgodnie z architekturą (LB / direct).

**DoD:**
- Po deployu runbook `stg-verify.md` przechodzi 1:1.

---

### [GCP-040] Secret Manager + mapowanie sekretów do Cloud Run
**Cel:** brak ręcznego wklejania sekretów do ENV; runtime ma minimalne uprawnienia.

- [ ] Utworzyć sekrety: `JWT_SECRET`, `STRIPE_SECRET_KEY`, Firebase, DB itd. (zgodnie z decyzją).
- [ ] Nadać runtime SA rolę `secretAccessor` tylko do wymaganych sekretów.
- [ ] Zmapować sekrety do usług Cloud Run jako env/volumes.

**DoD:**
- Aplikacja startuje bez wrażliwych wartości w plain ENV, sekrety są wersjonowane.

---

### [GCP-050] Smoke/observability jako DoD po każdym deployu
**Cel:** każda rewizja jest automatycznie zweryfikowana.

- [ ] W pipeline wymusić uruchomienie `tools/verify-stg.mjs` po deployu.
- [ ] Zdefiniować minimalne log queries w Cloud Logging dla Cloud Run revision.
- [ ] (Jeśli używane) Sentry: potwierdzić integrację i brak krytycznych errorów po deployu.

**DoD:**
- `/api/health` 200, `/api/ai/chat?stream=0` 200, `/api/ai/chat?stream=1` SSE kończy `[DONE]`, CORS poprawny.

---

## P1 / SHOULD — domknięcie spójności produktu i redukcja tech-debt

### [ETL-010] ETL: dodać szkielet albo usunąć obietnicę
- [ ] Decyzja: ETL istnieje czy nie.
- Jeśli TAK:
  - [ ] Dodać `apps/etl/*` minimalny szkielet + README (może być „no-op”).
- Jeśli NIE:
  - [ ] Usunąć wzmianki z docs/marketing/roadmap.

**DoD:** repo nie obiecuje nieistniejącej części systemu.

---

### [UI-010] Standard komponentów: shadcn/ui vs własny system
- [ ] Decyzja: wdrażamy shadcn/ui jako standard czy nie.
- [ ] Jeśli NIE: usunąć z roadmapy i konsekwentnie utrzymywać własny UI.
- [ ] Jeśli TAK: dodać podstawowy zestaw komponentów + konwencje.

**DoD:** spójny standard, brak „pół na pół”.

---

### [UI-020] Martwe zależności: framer-motion / recharts
- [ ] Jeśli mają być używane: dodać konkretne komponenty/wykresy/animacje.
- [ ] Jeśli nie: usunąć zależności i ich ślady z projektu.

**DoD:** brak „martwego ciężaru” w deps.

---

### [UI-030] Neon-dark / gradient tokens wprost
- [ ] Zdefiniować tokeny kolorów i gradienty w Tailwind config.
- [ ] Ujednolicić styl LandingPage/MainLayout.

**DoD:** repo „od razu pokazuje” docelowy kierunek wizualny.

---

### [DATA-010] UTM: taksonomia + lista kanałów/platform + normalizer
- [ ] Dodać docs: `source/medium/campaign/content/term` + `channel_group`.
- [ ] Dodać config w repo (np. JSON/TS) z listą kanałów/platform.
- [ ] Dodać util: walidator/normalizer UTM.

**DoD:** mniej „śmieci” w danych i spójne raportowanie.

---

### [CI-010] CI w repo: dopięcie parametrów pod realne STG
- [ ] Zaktualizować `cloudbuild/stg.yaml`, by nie deployował „okrojonego” API bez kluczowych ENV/secrets (konwencja: wymagane vs opcjonalne).
- [ ] Jeśli rotacja DB ma działać: potwierdzić, że obraz zawiera job i jest uruchamialny jako Cloud Run Job.

**DoD:** pipeline STG jest „realny”, nie „demo-only”.

---

## P2 — Production-grade / operacyjne dopracowanie

### [DB-020] Cloud SQL (jeśli potrzebne): HA, backupy, maintenance, sieć
- [ ] Decyzja: Cloud SQL tak/nie.
- [ ] Jeśli tak: HA/backupy, private IP + VPC connector, minimalne role dostępu.

---

### [OPS-010] Rotacja hasła DB jako Cloud Run Job + Scheduler
- [ ] Zdefiniować Cloud Run Job dla `apps/api/src/jobs/rotate-db-password.ts`.
- [ ] Cloud Scheduler (np. co 30 dni), IAM, sieć (jeśli DB prywatna).
- [ ] Integracja z Secret Manager (app zawsze czyta aktualną wersję).

---

### [SEC-010] Security / koszty / ochrona publicznych endpointów
- [ ] Budżety + alerty kosztów.
- [ ] Ograniczenie uprawnień SA do minimum.
- [ ] Cloud Armor / rate limiting (jeśli endpointy publiczne).
- [ ] Audit logging / podstawowe alerty.

---

## Minimalna kolejność wykonania (rekomendowana)
1. **BILL-000 → BILL-010 → BILL-020 → BILL-030**
2. (Jeśli Stripe) **BILL-040**
3. **BILL-050 → BILL-060**
4. **DB-010**
5. **GCP-010 → GCP-020 → GCP-030 → GCP-040 → GCP-050**
6. P1: ETL/UI/UTM/CI porządki
7. P2: Cloud SQL/rotacje/hardening

---
