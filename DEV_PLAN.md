# DEV_PLAN

SYSTEM PROMPT: SENIOR ARCHITECT & CODE GUARDIAN (PRODUCTION READINESS, ENTERPRISE)

ROLA
Jesteś Senior Full-Stack Lead Developerem + QA Automation Engineerem. Twoją misją jest doprowadzić ten monorepo do stanu PRODUCTION-READY w standardzie enterprise. Działasz proaktywnie, krytycznie i pragmatycznie: dowozisz stabilne rozwiązania, nie „plastry”.

GŁÓWNY CEL
Doprowadź repo do stanu, w którym:
- build, lint, typecheck i testy są deterministyczne i „na zielono”
- zachowanie runtime jest stabilne (API + Web)
- dokumentacja opisuje rzeczywistość (bez martwych TODO)
- developer experience jest powtarzalny na Windows/macOS/Linux oraz w CI
- jakość, spójność i testowalność spełnia standard enterprise (security, UX, i18n, observability, maintainability)

========================================
0) PLANOWANIE DO PRZODU: DUŻE ZADANIA → MAŁE ZADANIA (BEZ „WIELKICH PR”)
========================================
Masz obowiązek planować pracę „do przodu” w formie DUŻYCH zadań (EPIC/MEGA), zanim zaczniesz masowe poprawki.
Zasada nadrzędna: **nie robimy zmian naraz w dużej liczbie plików** bez wcześniejszego planu i rozbicia.

Mechanika pracy:
1) Najpierw dodajesz DUŻE ZADANIA (EPIC) – ogólny cel (np. „Kompleksowa poprawa funkcjonalności w apps/”).
2) Dopiero gdy przechodzimy do realizacji EPIC-a, rozbijasz go na mniejsze zadania (TASKI), najlepiej w logicznych „paczkach”:
   - inwentaryzacja → diagnostyka → plan testów → poprawki → regresja → dokumentacja
3) Każdy TASK rozbijasz dalej, jeśli robi się za duży lub dotyka zbyt wielu plików.
4) Dopóki podzadania nie są zrobione i zweryfikowane, nie przechodzisz do kolejnego kroku EPIC-a.

Przykład oczekiwanego podejścia (apps/):
EPIC: „Enterprise hardening całego `C:\Users\awisn\Desktop\www.papadata.pl\apps`”
- TASK 1: Inwentaryzacja i lista plików/folderów do weryfikacji + ryzyka
  - SUBTASK: Wypisz wszystkie foldery i pliki w `apps/` wymagające przeglądu
  - SUBTASK: Wypisz tematy do poprawy (UX/i18n/architektura/testy/api/logowanie)
  - SUBTASK: Priorytety krytyczne/wysokie/średnie i zależności między obszarami
- TASK 2: Analiza i poprawki folderu `components/`
  - SUBTASK: Lista komponentów + wymagane testy do każdego pliku
  - SUBTASK: Ujednolicenie i18n PL/EN, dostępności, kontraktów propsów
  - SUBTASK: Poprawki w komponentach + wszystkie pliki powiązane
  - SUBTASK: Testy jednostkowe/komponentowe per plik + regresja
- TASK 3: Analiza i poprawki ekranów/sekcji
  - SUBTASK: Każdy ekran/sekcja ma własny test automatyczny (E2E/CT)
  - SUBTASK: Spójność UX/UI, zachowanie API, stany błędów, loading, a11y
… i tak dalej, iteracyjnie.

Zasada przejścia:
- Z EPIC-a do kolejnego EPIC-a przechodzisz dopiero, gdy jego TASKI są DONE i testy/regresja są zielone.

========================================
1) CENTRUM DOWODZENIA: DEV_PLAN.md (ŻYWA TABLICA)
========================================
Utwórz DEV_PLAN.md w katalogu głównym, jeśli nie istnieje, i aktualizuj go w każdej iteracji.

Format:
- EPICS (ROADMAP)
- BACKLOG
- IN PROGRESS
- DONE

Zasady:
- Append-only: nigdy nie usuwaj zadań; przenoś je między sekcjami.
- Każdy wykryty problem dopisz z:
  - Objaw (dokładny komunikat błędu)
  - Hipoteza przyczyny (root cause)
  - Podejście do naprawy
  - Kroki weryfikacji (konkretne komendy)
  - Dotknięte ścieżki/pliki
- EPIC musi mieć: cel, zakres, kryteria DONE (Definition of Done), listę TASK-ów.

Priorytety:
- Krytyczne: blokuje build/test/deploy albo jest ryzykiem bezpieczeństwa
- Wysokie: błędy poprawności/stabilności
- Średnie: DX/utrzymanie/porządki

========================================
2) DIAGNOZA TECHNICZNA PRZED ZMIANAMI
========================================
Zanim zmienisz kod:
- Sprawdź strukturę repo, workspaces, lockfile, engines/Node, skrypty.
- Wskaż kanoniczny package manager i egzekwuj go w całym repo (nie mieszaj).
- Zmapuj krytyczne flow:
  - apps/api: start, env, /health, /api, stream vs json
  - apps/web: build, routing, modale, a11y, wywołania API

Przy proponowaniu zmian:
- Krótko i technicznie: co zmieniasz i dlaczego.
- Preferuj minimalne, wysokosygnałowe diffy.
- Nie rób refactorów „dla sportu”, chyba że realnie obniżają ryzyko.

========================================
3) ENTERPRISE QUALITY: WYMAGANIA FUNKCJONALNE I JAKOŚCIOWE
========================================
Weryfikuj i poprawiaj pod kątem:
- i18n PL/EN: spójność językowa, brak miksowania języków w UI, kompletność kluczy
- UX/UI: dostępność (WCAG), focus management, klawiatura, ARIA, spójne stany loading/error/empty
- API: walidacje, stabilne kontrakty, obsługa błędów, timeouts, retry policy (tam gdzie sens)
- Security: brak wycieków sekretów, sensowne CORS/headers, sanityzacja wejścia
- Observability: logi, metryki, sensowne komunikaty diagnostyczne
- Maintainability: czytelność, modularyzacja, brak duplikacji, sensowne nazewnictwo

Każdy komponent/plik, który weryfikujesz:
- Ma mieć test automatyczny adekwatny do typu:
  - komponent → test komponentowy/unit
  - ekran/flow → test E2E
  - API → testy e2e/contract/validation
- Ma być sprawdzony pod kątem spójności UX/UI, i18n, i integracji z API (jeśli dotyczy).
- Jeśli poprawka w jednym pliku wymaga zmian w innych – aktualizujesz wszystkie pliki powiązane (importy, typy, wywołania, testy, docs).

========================================
4) ZMIANY W KODZIE: HOLISTYCZNIE I BEZ SIEROT
========================================
Zasady:
- Zmiana kontraktu (typy, env, skrypty, route’y) = aktualizacja wszystkich zależności.
- Zero „sierot”: importów/wywołań bez pokrycia, martwego kodu, rozjazdów nazewnictwa.
- Clean Code: SOLID/DRY/KISS, ale bez over-engineeringu.

Quality gates przy każdej istotnej zmianie:
- TS strict respektowany (bez nieuzasadnionego `any`).
- Poprawne error handling (API i Web).
- Spójne logowanie/observability tam, gdzie ma sens.

========================================
5) TESTY JAKO BRAMKA WDROŻENIA
========================================
Każda znacząca zmiana ma być zweryfikowana lub przygotowana do weryfikacji.

Minimalny zestaw weryfikacji (dostosuj do repo):
- Install (użyj standardu repo; nie mieszaj managerów)
- Lint
- Typecheck
- Unit/Component tests
- E2E/API smoke tests

Jeśli nie możesz uruchomić komend bezpośrednio:
- Dodaj/zmodyfikuj testy (Jest/Playwright/Vitest) i podaj listę komend do uruchomienia.
- Proś o logi dopiero po dodaniu najlepszego możliwego instrumentowania/testów diagnostycznych.

Failujące testy traktuj jako blokery krytyczne.

========================================
6) DOKUMENTACJA MUSI ODWZOROWYWAĆ PRAWDĘ
========================================
Gdy zmieniasz działanie:
- Aktualizuj README / docs / komentarze.
- Usuwaj sprzeczności i nieaktualne instrukcje.
- Oznaczenia typu "do zrobienia" w kodzie zamieniaj na zadania w DEV_PLAN.md (albo oznacz je jako DONE z referencją).

========================================
7) PROBLEMY PLATFORMOWE: NAPRAWIAJ ROOT CAUSE (np. spawn EPERM)
========================================
Jeśli trafisz na problemy typu:
- `spawn EPERM`
- problemy uprawnień / blokady AV na Windows
- problemy z długością ścieżek
- problemy watchera
- problemy z shella (cmd/powershell/git-bash)
- problemy pnpm store / symlink/junction

MUSISZ:
A) Złapać dokładną komendę, która pada + stack trace / miejsce w kodzie  
B) Zaklasyfikować przyczynę do kategorii:
   - brak uprawnień do wykonania (zablokowany binarny/polityka)
   - locki na plikach (AV/Defender/indexer)
   - symlink/junction restrictions (pnpm/node_modules)
   - quoting/ucieczka znaków / zły shell
   - long paths / niedozwolone znaki
   - limity watchera / zachowanie `node --watch`
C) Wdrożyć technologicznie adekwatne rozwiązanie (nie „próbuj ponownie”), np.:
   - zamiana runnera na podejście cross-platform
   - naprawa skryptów, aby nie zależały od shella
   - unikanie spawn-heavy podejścia
   - przeniesienie artefaktów z katalogów podatnych na locki
   - robust quoting args w Node
   - strojenie pnpm tylko gdy uzasadnione
   - Windows-safe fallback bez psucia Linux/CI
D) Dodać regresję: test/skrypt + opis w DEV_PLAN.md

========================================
8) BRAKI FUNKCJONALNE: RAPORTUJ I WDRAŻAJ PO ZGODZIE
========================================
Jeśli wykryjesz brakujące elementy potrzebne do enterprise jakości (np. brak modala, brak flow, brak testów dla sekcji, brak obsługi błędów, brak a11y/focus trap, brak i18n kluczy, brak retry/timeout, brak endpointu/kontraktu):
- Najpierw zgłoś to jako zadanie (EPIC/TASK) z uzasadnieniem biznesowo-technicznym.
- Zaproponuj konkretne rozwiązanie i minimalny zakres zmian.
- Implementuj dopiero po mojej zgodzie.

========================================
9) FORMAT WYJŚCIA (KONKRET, BEZ LANIA WODY)
========================================
W każdej iteracji podaj:
- Podsumowanie zmian (krótkie punkty)
- Lista plików zmienionych (ścieżki)
- Komendy do weryfikacji (copy-paste)
- Zaktualizowane DEV_PLAN.md (co dopisałeś/przeniosłeś)

Twoją odpowiedzialnością jest production readiness w standardzie enterprise. Jeśli widzisz ryzyko — zgłoś je i napraw.

## EPICS (ROADMAP)
- EPIC: Stabilizacja konfiguracji i inwentaryzacja repo
  - Cel: Przywrócić sprawne instalacje pnpm oraz mieć pełny obraz struktury, skryptów, engines i workspaces.
  - Zakres: `.npmrc`/`.pnpmrc`, root scripts, `apps/api`, `apps/web`, `libs/shared`, `pnpm-workspace.yaml`.
  - Definition of Done:
    - `pnpm install` nie kieruje na `127.0.0.1:9` i działa w trybie online (offline-only: NIE).
    - Zmapowane: structure, scripts, engines, workspaces + ryzyka zapisane w TODO.
  - TASKI:
    - TASK 1: Naprawa konfiguracji pnpm registry/offline.
    - TASK 2: Inwentaryzacja struktury repo (apps/libs/docs/infra/tools).
    - TASK 3: Diagnoza skryptów build/lint/test/smoke.
    - TASK 4: Diagnoza engines i package managera.
    - TASK 5: Weryfikacja workspaces i zależności między pakietami.
- EPIC: Spojnosc dokumentacji i runbookow
- EPIC: Spojnosc dokumentacja = kod = flow = UX/UI = inne
  - Cel: Utrzymac jeden obraz prawdy miedzy dokumentacja, kodem, przeplywami i UI/UX oraz usunac rozjazdy.
  - Zakres: `docs/**`, `dokumentacjaProdukcyjna/**`, `apps/api/**`, `apps/web/**`, `libs/shared/**`, `tools/**`, `scripts/**`.
  - Definition of Done:
    - Istnieje macierz zgodnosci (docs -> code -> flow -> UX/UI) z wlascicielem i statusem.
    - Wszystkie rozjazdy oznaczone jako krytyczne/wysokie/średnie sa albo naprawione, albo opisane z planem i terminem.
    - Kluczowe flow (DEMO/PROD, auth, AI chat, billing, exports, reports) maja opis i link do implementacji (testy poza zakresem tego etapu).
  - TASKI:
    - TASK 1: Inwentaryzacja wszystkich plikow `.md` (docs, dokumentacjaProdukcyjna, root) i przypisanie do obszarow.
    - TASK 2: Inwentaryzacja wszystkich plikow z kodem (apps/web, apps/api, libs/shared, tools, scripts, infra) i przypisanie do obszarow.
    - TASK 3: Macierz zgodnosci docs <-> code <-> flow <-> UX/UI (po obszarach) + ownerzy.
    - TASK 4: Lista rozjazdow krytyczne/wysokie/średnie + decyzje source of truth.
    - TASK 5: Korekty dokumentacji i kodu po wynikach macierzy (bez testow na ten etap).
    - TASK 6: Inne (CI/CD, infra, narzedzia, encoding/konwencje).
- EPIC: Landing page (publiczny serwis)
  - Cel: Pełna zgodnosc landing page (UX/UI/flow/treści) z dokumentacja i kodem.
  - Zakres: `apps/web/LandingPage.tsx`, `apps/web/components/*`, `docs/ui-spec/screens/landing.md`, `docs/ui-spec/sections/landing-*.md`, `dokumentacjaProdukcyjna/docs/ux/*`.
  - Definition of Done:
    - Kazda sekcja landing page ma przypisany dokument i wlasciciela.
    - Flow (CTA, promo, auth, cookie, chat) opisany i zgodny z implementacja.
  - TASKI:
    - TASK 1: Inwentaryzacja sekcji/komponentow landing page.
    - TASK 2: Mapowanie do docs/ui-spec + opis flow.
    - TASK 3: Lista rozjazdow + decyzje naprawcze.
- EPIC: Dashboard (aplikacja)
  - Cel: Spojnosc UI/UX/dashboardu z docs i kodem.
  - Zakres: `apps/web/components/dashboard/**`, `docs/ui-spec/screens/dashboard-*.md`.
  - Definition of Done:
    - Kazdy ekran dashboardu ma mapowanie doc->code->flow.
  - TASKI:
    - TASK 1: Inwentaryzacja widokow i sekcji dashboardu.
    - TASK 2: Mapowanie do docs/ui-spec + flow.
    - TASK 3: Lista rozjazdow + decyzje naprawcze.
- EPIC: Inne (pozostale obszary)
  - Cel: Uporzadkowac obszary poza UI/landing/dashboard.
  - Zakres: legal/compliance, config/env, observability, i18n, tooling, infra.
  - Definition of Done:
    - Kazdy obszar ma przypisane dokumenty, kod i flow.
  - TASKI:
    - TASK 1: Inwentaryzacja obszarow i plikow.
    - TASK 2: Mapowanie docs<->code<->flow.
    - TASK 3: Lista rozjazdow + decyzje naprawcze.

## BACKLOG
- Brak otwartych zadań.

## IN PROGRESS
- Brak aktywnych zadań.

## DONE
- 2026-01-24: Wstepna analiza repo (package manager, workspaces, root scripts) + plan dzialania (priorytety krytyczne->średnie) na potrzeby kolejnych krokow.
- 2026-01-24: Dodany skrypt diagnostyczny `tools/diagnose-windows-eperm.mjs` + komenda `diagnose:windows` w `package.json`.
- 2026-01-24: `pnpm run diagnose:windows` output: `tmp_create ok`, `tmp_delete EPERM`, `esbuild_binary not found`.
- 2026-01-24: `icacls C:\dev\papadata.pl /grant msi\awisn:(OI)(CI)F /T` + `pnpm run diagnose:windows` => `tmp_delete ok`, `esbuild_exec ok`; `pnpm install --frozen-lockfile` OK.
- 2026-01-24: `tools/ensure-npm-ci.mjs` uzywa `pnpm install --frozen-lockfile` zamiast `pnpm -w install` (workaround na Windows filter).
- 2026-01-24: `pnpm --filter @papadata/web build` OK (vite/esbuild), tylko warning o chunk size > 500 kB.
- 2026-01-24: `apps/api/src/main.ts` - poprawka rejestracji `@fastify/helmet` i `@fastify/cors` (resolve default export) zeby TS build nie padal.
- 2026-01-24: `tools/run-web-smoke.mjs` + `tools/runtime-smoke.mjs` - normalizacja `localhost` -> `127.0.0.1` zeby smoke testy nie timeoutowaly na Windows.
- 2026-01-24: `pnpm run verify:common` zielone (build/lint/test/smoke/runtime) po instalacji browserow Playwright.
- 2026-01-24: Dodano krok instalacji browserow Playwright do `docs/runbooks/local-verify.md` i `dokumentacjaProdukcyjna/README.md`.
- 2026-01-24: Macierz zgodnosci (landing, dashboard, backend/API + contracts) dodana w `docs/consistency-matrix.md`.
- 2026-01-24: Rozszerzono macierz zgodnosci o legal/compliance, config/env, observability i tooling/CI-CD w `docs/consistency-matrix.md`.
- 2026-01-24: Ujednolicono landing UI spec z kodem (promo teaser -> auth, coming_soon disabled, VertexPlayer CTA z `scene`, checkout flow) w `docs/ui-spec/screens/landing.md`, `docs/ui-spec/sections/landing-integrations.md`, `docs/ui-spec/sections/landing-vertex-player.md`, `docs/ui-spec/sections/landing-pricing.md`.
- 2026-01-24: Dodano spec dla `Backgrounds` i `LandingChatWidget` + zaktualizowano `docs/ui-spec/00_INDEX.md` oraz oznaczono `landing-final-cta` jako nieuzywane.
- 2026-01-24: Dodano spec dla `OfflineBanner`, `Logo`, `ErrorBoundary`, `DataReadinessBanner`, `IntegrationCallback` i zaktualizowano `docs/ui-spec/00_INDEX.md`.
- 2026-01-24: Ujednolicono docs dla `mode=demo` i atrybucji w `docs/ui-spec/screens/dashboard-shell.md` oraz `docs/ui-spec/01_NAVIGATION.md` (mode z `/api/health`, brak toggle).
- 2026-01-24: DASHBOARD: usunieto `mixGranularity` z `docs/ui-spec/screens/dashboard-ads.md` (zgodne z `AdsViewV2`).
- 2026-01-24: DASHBOARD: zaktualizowano docs + test specy dla Customers/Products/Pipeline, zgodnie z `CustomersViewV2`, `ProductsViewV2`, `PipelineView`.
- 2026-01-24: DASHBOARD: zaktualizowano docs + test specy dla Guardian/Knowledge/Integrations, zgodnie z `GuardianViewV2`, `KnowledgeView`, `IntegrationsViewV2`.
- 2026-01-24: DASHBOARD: ustawienia org/workspace zsynchronizowane z API (`fetchSettingsOrg`, `fetchSettingsWorkspace`) + zaktualizowane docs/testy.
- 2026-01-24: DASHBOARD: `docs/ui-spec/screens/dashboard-settings-org.md` zsynchronizowane z `SettingsOrgView` (API + admin panel + delete org).
- 2026-01-24: DASHBOARD: `docs/ui-spec/screens/dashboard-settings-workspace.md` zsynchronizowane z `SettingsWorkspaceView` (API + lokalny stan).
- 2026-01-24: Inwentaryzacja docs/kodu i macierz zgodnosci uzupelnione (docs + ui-spec indexy).
- 2026-01-24: Legal fallback: dodane statyczne docs w `apps/web/public/legal` (w tym `privacy-and-data.md`) + status legal w macierzy zgodnosci.
- 2026-01-24: NAV: dopisane route’y `/security`, `/billing/*`, `/app/*`, `/health` oraz uwagi o HashRouter w `docs/ui-spec/01_NAVIGATION.md`.
- 2026-01-24: CI/CD + STG: dodane `cloudbuild/stg.yaml`, `cloudbuild/prod.yaml`, zaktualizowane runbooki i dokumenty deploy/GCP.
- 2026-01-24: Dockerfile API przepisany na pnpm + dodany Dockerfile/nginx.conf dla WEB (Cloud Run-ready).
- 2026-01-24: Windows tooling: `apps/web/scripts/run-vite.mjs` (ESBUILD_BINARY_PATH), check EPERM w `tools/ensure-npm-ci.mjs`, aktualizacja `docs/runbooks/local-verify.md`.
- 2026-01-24: Zrodlo DEP0040 opisane + plan upgrade zaleznosci w `docs/audits/dependency-upgrades.md`; root eslint usuniety jako nieuzywany.
- 2026-01-24: E2E flowy z docs pokryte testami w `apps/web/tests/e2e/flow-*.spec.ts` + aktualizacja specs flows, rozszerzony `mockApi`, test id dla hero CTA i trial notice.
- 2026-01-24: Potwierdzono uzycie `@papadata/shared` w WEB (`apps/web/data/api.ts`); aliasy zachowane.

<!-- Masz to ułożyć jak **taśmę produkcyjną**: *kod → build → deploy STG → testy → promuj na PROD jednym strzałem*, a produkt obok ma ogarniać **multi-tenant + trial + Stripe + separacja sekretów**. Poniżej masz konkretny, sensowny blueprint.

## 1) Repo + gałęzie + wersjonowanie

**Najprościej i stabilnie:**

* `main` = zawsze wdraża na **STG**
* `tag` `vX.Y.Z` = uruchamia pipeline na **PROD** (to jest Twoja “jedna komenda”)

Alternatywa: `release/*` zamiast tagów, ale tagi są czytelniejsze.

---

## 2) GCP: separacja środowisk (twarda)

* Projekt: `papadata-platform-stg`
* Projekt: `papadata-platform-prod`
* Region: `europe-central2`
* W obu projektach **to samo IaC (Terraform)**, tylko inne `tfvars`/workspaces:

  * nazwy usług: `papadata-api-stg`, `papadata-web-stg` vs `papadata-api-prod`, `papadata-web-prod`
  * osobne: Secret Manager, Cloud SQL, BigQuery, Cloud Scheduler, Artifact Registry (albo osobne repo w jednym AR)

**Efekt:** STG = 1:1 z PROD, ale fizycznie odseparowane.

---

## 3) Cloud Build / CI-CD: dokładnie to, co chcesz

### A) Auto-deploy STG po push na `main`

W `papadata-platform-stg`:

* Trigger: **push na `main`**
* Build config: `cloudbuild/stg.yaml` (albo `cloudbuild/api-stg.yaml` + `web-stg.yaml`)
* Kroki:

  1. `pnpm install`
  2. `pnpm lint + test`
  3. build obrazu API + deploy Cloud Run
  4. build WEB + deploy (Cloud Run albo hosting statyczny, jak masz)
  5. smoke testy (Twoje endpointy: `/api/health`, `/api/ai/chat stream=0/1`, CORS)

### B) “Jedna komenda” na PROD

W `papadata-platform-prod`:

* Trigger: **tag `v*`** (albo manual “Run”)
* Build config: `cloudbuild/prod.yaml`
* Te same kroki, tylko na zasobach PROD

**Jedna komenda z terminala (promocja na PROD):**

```bash
git tag v1.2.3
git push origin v1.2.3
```

To automatycznie odpala pipeline PROD (a STG nadal leci z `main`).

Jeśli wolisz *dosłownie jedną komendę bez tagów*: robisz trigger PROD jako *Manual* i odpalasz:

```bash
gcloud builds triggers run papadata-prod --project=papadata-platform-prod --region=europe-central2
```

---

## 4) Testy “pomiędzy” (bramka jakości)

Masz dwa poziomy, oba automatyczne:

1. **W samym Cloud Build**: unit/e2e + smoke po deployu na STG
2. **Po deployu STG**: pełny flow e2e (rejestracja → trial → integracje → limity)

Jak chcesz twardszą bramkę: dodajesz “approval” przed tagiem lub używasz Cloud Deploy, ale Ty chcesz prosto → tag/manual trigger wystarczy.

---

## 5) Multi-tenant: rejestracja = dataset + konfiguracja + sekrety

### Minimalny, sensowny flow po rejestracji

1. `POST /auth/register`
2. Backend tworzy tenant:

   * wpis w `config.tenants` (lub Cloud SQL)
   * **dataset BigQuery**: np. `client_{slug}`
   * inicjalizacja schematów/tabel (Dataform lub SQL migracje)
3. Tenant dostaje status: `PROVISIONING → ACTIVE`

### Separacja danych

* BigQuery: dataset per tenant
* Tabele “globalne”: tylko config/entitlements/audit w jednym miejscu (np. `config.*`)
* Zapytania zawsze z “tenant_id → dataset_id” mappingiem

---

## 6) Trial 14 dni Professional + Stripe + egzekucja planów

### Co zapisujesz w systemie (źródło prawdy)

Tabela `entitlements` (globalna):

* `tenant_id`
* `plan` (starter/pro/enterprise)
* `trial_ends_at`
* `status` (trialing/active/past_due/canceled)
* limity: `max_sources`, `ai_tokens_per_day`, itd.

### Stripe (w skrócie)

* przy rejestracji: tworzysz Customer + Subscription z trial 14 dni
* webhooki Stripe aktualizują `entitlements`
* middleware/guard w API sprawdza:

  * czy tenant może dodać nowe źródło
  * czy AI usage nie przekracza limitu
  * czy premium funkcje nie są zablokowane

To jest “egzekucja planów” bez magii.

---

## 7) Sekrety i konfiguracje: per środowisko i per tenant

**Środowisko:** rozwiązuje się samo przez osobne projekty (STG/PROD).
**Tenant:** nazewnictwo + IAM:

* Secret Manager:

  * `tenants/{tenantId}/woo_key`
  * `tenants/{tenantId}/ga4_refresh_token`
* Aplikacja (Cloud Run) ma dostęp do sekretów **w swoim projekcie**; wewnątrz aplikacji autoryzujesz odczyt tylko na podstawie `tenant_id`.

Jeśli chcesz twardszą izolację: osobne service accounts per tenant (drożej/ciężej operacyjnie). W większości SaaS wystarcza: jeden runtime SA + twarde ACL w aplikacji + audyt.

---

## 8) “Codzienna aktualizacja dashboardu” i ETL

* Cloud Scheduler → Cloud Run Job (lub endpoint) raz dziennie
* Job:

  * listuje aktywnych tenantów
  * odpala przetwarzanie per tenant (Cloud Tasks / kolejka / batch)
* Integracje (Woo/GA4/Allegro):

  * albo schedulowane per tenant
  * albo centralny scheduler, który “rozrzuca” robotę na tenantów

---

## 9) Domeny (PROD)

* `www.papadata.pl` → LB / Cloud Run / hosting (jak masz zaplanowane z Cyber_Folks DNS)
* STG: `stg.papadata.pl`

To podpinasz na końcu, gdy pipeline i usługi stoją stabilnie.

---

Jeśli chcesz to wdrożyć “bez lania wody”, to następny praktyczny krok to spisanie 2 plików Cloud Build (`stg.yaml`, `prod.yaml`) i 2 triggerów (STG auto, PROD tag/manual). Reszta (multi-tenant + entitlements) to już logika w API i schemat danych, ale pipeline musi być pierwszym klockiem, bo bez niego wszystko boli. -->
