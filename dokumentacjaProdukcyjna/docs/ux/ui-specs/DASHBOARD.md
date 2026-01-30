# PapaData Dashboard — Command Center (v2)

> Aktualizacja v2: zgodne z nowym kierunkiem (100% GCP, region `europe-central2`, logowanie Google/Microsoft + firmowy e-mail z weryfikacją, Papa AI Chat + Papa Guardian, plany Starter/Professional/Enterprise, eksport PDF/CSV/JSON).

## Cel dokumentu

Ten dokument opisuje wymagania UX/UI oraz minimalny kontrakt techniczny dla **Dashboardu PapaData** w dwóch trybach:

- **Publiczny DEMO (bez logowania)** — pokazowy, z danymi syntetycznymi/mock.
- **Produkcja (po logowaniu)** — z danymi klienta i realnymi uprawnieniami.

Wersja produkcyjna udostępnia DEMO jako element sprzedażowy. Wymaganie: **DEMO = PROD 1:1** (ten sam układ, interakcje, komponenty), różnice wyłącznie w źródle danych, dostępie/auth i zachowaniu operacji „write”).

## Odbiorcy

- **Product / UX**: definicja zachowań i priorytetów v1.
- **Dev**: kontrakt „DEMO = PROD 1:1”, zasady providerów danych i bezpieczne zachowania.
- **QA**: kryteria akceptacji i testy regresji (DEMO vs PROD).

## Powiązane dokumenty

- UI (wygląd): `WYGLAD.md`
- Interakcje: `INTERAKCJE.md`
- Integracje: `../../engineering/INTEGRACJE.md` (oraz katalog integracji)
- i18n (copy): `../content-i18n.md`
- Definicje KPI (kontrakt): `../../engineering/kpi-definitions.md`
- UI spec (source of truth, implementation): `../../../../docs/ui-spec/00_INDEX.md`

---

## 0) Tryby: Demo i Produkcja (kontrakt DEMO 1:1)

Wersja produkcyjna zawiera **Dashboard DEMO** dla użytkownika niezalogowanego, różniący się wyłącznie źródłem danych i ograniczeniami bezpieczeństwa.

- **Demo (bez logowania):** widok pokazowy dla potencjalnego klienta. Te same widoki i komponenty co w produkcji, ale:
  - dane są **mockowane/syntetyczne**,
  - integracje są **symulowane**,
  - akcje mutujące są **zablokowane albo symulowane**.
- **Produkcja (po logowaniu):** te same widoki, zasilane danymi klienta + realnymi stanami integracji oraz rzeczywistymi uprawnieniami.

### 0.1 Zasada “1:1” (nie robimy osobnego dashboardu)

- Ten sam routing `/dashboard/*`, ta sama nawigacja, te same komponenty, te same stany UI (loading/empty/error/offline).
- Różni się wyłącznie:
  - **Data Provider** (demo vs produkcja),
  - **Auth/RBAC** (demo = gość),
  - oraz zachowanie **akcji zapisu** (write).

### 0.2 Co w DEMO jest inne (konkret)

- **Dane:**
  - wyłącznie syntetyczne / mock (bez PII i bez danych realnych klientów),
  - spójne z logiką KPI (np. ROAS, MER, marża, zwroty) i z “historią” w czasie (trend 30–90 dni),
  - preferowany stały seed (powtarzalność na demo).

- **Tożsamość:**
  - Produkcja: logowanie tylko przez **Google** / **Microsoft** lub **firmowy e-mail** z obowiązkową weryfikacją (brak klasycznego hasła w UI).
  - DEMO: brak sesji (gość), brak dostępu do danych klienta.

- **Plany + Trial (14 dni):**
  - Po rejestracji każdy tenant dostaje **14 dni trial** z pełnymi możliwościami **Professional**.
  - Po trialu: jeśli brak płatności → funkcje produkcyjne są wstrzymane (czytelny banner + CTA do płatności), dane i konfiguracje pozostają nienaruszone.

- **Integracje:**
  - UI pokazuje statusy i katalog integracji, ale `Connect/Disconnect` to stan lokalny (bez OAuth, bez prawdziwych API).
- **Akcje mutujące (write):**
  - wszystkie akcje mogące zmienić stan serwera (np. “Zapisz”, “Zmień budżet”, “Usuń segment”, “Zaproś członka zespołu”) są:
    - `disabled` z tooltipem **albo**
    - “symulowane” (modal/ toast z komunikatem “To jest DEMO”),
  - DEMO nie wysyła requestów typu write (POST/PUT/PATCH/DELETE) do prawdziwych usług.
- **AI (Papa AI):**
  - **Papa AI Chat** (panel/drawer): odpowiedzi w tym samym kontrakcie UI co produkcja (streaming, cancel, safety block, retry, error).
  - **Papa Guardian**: wykrywa anomalie, spadki, odchylenia (ROAS/MER/CPA, sprzedaż, zwroty, marża) i tworzy alerty + rekomendacje; w produkcji wysyła też powiadomienia e-mail.
  - DEMO: odpowiedzi i alerty są **mockowane** (bez wysyłek e-mail, bez trwałego zapisu).
  - Produkcja: AI działa na danych tenant-a, **bez PII** (AI i dashboard czytają wyłącznie warstwę `*_marts`).
  - Limity AI i harmonogram Guardiana zależą od planu (Starter/Professional/Enterprise) oraz stanu trial/płatności.

### 0.3 Minimalny kontrakt techniczny (dla dev)

> Cel: utrzymać 1:1 poprzez podmianę providerów, a nie kopiowanie widoków.

- Interfejs **read-only** (przykład): `getKpis()`, `getTimeseries()`, `getTable()`, `getFreshness()`, `getInsights()`.
- Implementacje:
  - `DemoDataProvider` — dane mock + symulowane opóźnienia/błędy (do testów empty/error/offline),
  - `ProdDataProvider` — integracja z API/backendem (docelowo).
- “Write” actions wyłącznie przez warstwę `MutationService`/`CommandService`; w DEMO zwraca `NotSupported` lub `Simulated`.
- Tryb aplikacji: **DEMO vs PROD rozpoznajemy po sesji** (DEMO = brak sesji, PROD = poprawny JWT). `APP_MODE`/flag może istnieć wyłącznie jako kontrola środowiska (np. wyłączenie DEMO) — nie jest granicą bezpieczeństwa.

### 0.4 Kryteria akceptacji DEMO (QA)

- Widoki DEMO i produkcyjne są porównywalne ekran-po-ekranie (layout, copy, a11y, empty/error/offline).
- DEMO nie ujawnia sekretów/kluczy i nie wykonuje bezpośrednich requestów do zewnętrznych usług.
- Wszystkie CTA “zapisz/eksportuj/zmień” w DEMO są bezpieczne i nie zmieniają nic poza lokalnym UI.

---

## 1) Założenia UX: Insight First

Dashboard ma prowadzić użytkownika “od informacji do decyzji”. Nie zaczynamy od wykresów, tylko od:

1. **Alertów i ryzyk (EXEC_CORE_ALERTS)**  
   Co wymaga reakcji teraz?
2. **Performance (ADS_CORE_SYNC)**  
   Jak działają kampanie i kanały?
3. **Fundamenty (SKU_ANALYTICS + LTV_COHORT)**  
   Co z produktem, marżą, zwrotami i jakością klientów?

Kluczowy wymóg: **każda sekcja musi wspierać decyzję**, a nie tylko wizualizować dane.

---

## 2) Layout globalny

### 2.1 Topbar (globalny)

- Zakres dat (1 / 7 / 30)
- Data Freshness badge (globalny)
- Badge trybu: `DEMO` / `TRIAL` / `PROD`
- Badge planu: `Starter / Professional / Enterprise` + (jeśli trial) “Trial: X dni”

### 2.2 Sidebar (nawigacja)

**AI & Action**

- Overview (Start)
- Analytics (Ads + Growth Engine)
- Reports
- Customers
- Products
- Integrations
- Support
- Settings

**System Trust (Data)**

- Data Freshness / Strażnik danych (globalny)
- Alerty (globalne)
- Evidence / Źródła (dla AI)

### 2.3 Papa AI Panel (Chat) (globalny)

- Otwierany jako drawer/panel po prawej (z dowolnego widoku).
- Kontekst:
  - aktualny ekran,
  - filtry globalne,
  - selekcja (np. kampania / SKU),
  - definicje KPI (tooltip/definicje).
- Must-have:
  - streaming + cancel
  - safety block
  - “Dowody” (link do widgetu/tabeli)
  - CTA: `Ustaw alert` / `Dodaj do raportu`

---

## 3) Overview (Start) — Executive Command Center

### 3.1 Alert Bar (EXEC_CORE_ALERTS)

- Najważniejsze alerty/anomalie (3–6):
  - Revenue drop
  - ROAS/MER/CPA odchylenia
  - marża spadła
  - wzrost zwrotów
- Każdy alert ma:
  - krótką diagnozę
  - wpływ (np. estymacja straty)
  - CTA: “Wyjaśnij w AI” + “Otwórz detal”

### 3.2 KPI Grid (core)

- 6–8 KPI:
  - Revenue
  - Gross Margin / Profit
  - ROAS
  - MER (Marketing Efficiency Ratio)
  - CAC
  - Conversion rate
  - Refund rate
- Każdy KPI ma:
  - trend vs poprzedni okres
  - tooltip “definicja”
  - badge “freshness” jeśli dane nieświeże

### 3.3 Executive Insights (AI)

- 3–5 insightów “co jest ważne dziś”:
  - “Największy spadek ROAS w kampanii X”
  - “Zwroty rosną w SKU Y”
- Klik → otwiera Papa AI Panel (Chat) z kontekstem.

---

## 4) Analytics — Ads Performance (Core)

### 4.1 Widok kanałów (Google Ads / Meta Ads / TikTok Ads)

- Tabela kanałów:
  - spend
  - revenue attributed
  - ROAS
  - MER
  - CPA/CAC
- Klik w kanał → drill-down do kampanii.

### 4.2 Drill-down

- Ads: `Kanał → Kampanie → Adsety → Kreacje`
- Drill-down MUST zachować filtry globalne (daty, atrybucja).

### 4.3 Insight Layer

- Każdy wykres/tabela ma CTA:
  - `Wyjaśnij w AI`
  - `Ustaw alert`

---

## 5) Growth Engine — Conversions & Funnel

- AI:
  - “co najbardziej ogranicza konwersję?”
  - “jak zmienił się funnel vs poprzedni okres?”

---

## 6) Products — SKU Intelligence

- Lista SKU:
  - revenue
  - margin / profit (po rabatach i zwrotach)
  - returns
  - inventory signal (jeśli dotyczy)
- Klik SKU → detal:
  - trend 30–90 dni
  - wpływ rabatów i zwrotów
  - powiązanie z kampaniami (atrybucja)
- AI:
  - “które SKU tracą marżę i dlaczego?”
  - “czy promocje zwiększają zysk czy tylko wolumen?”

---

## 7) Customers — LTV & Cohorts

- Cohort table (miesiąc pozyskania → powroty / LTV)
- Segmenty:
  - high LTV
  - churn risk
- AI:
  - “dlaczego spada retencja?”
  - “jakie kampanie dają najlepszych klientów?”

---

## 8) Reports

- Karty raportów:
  - “Weekly Summary”
  - “Monthly Board Report”
- Funkcje:
  - Generate now
  - harmonogram wysyłki
  - język raportu
  - auto-diff “co się zmieniło?”
  - eksport raportu: **PDF / CSV / JSON**
  - pobierz natychmiast (signed URL) + historia eksportów
  - wysyłka e-mail wg planu (Starter: tygodniowo, Professional: codziennie, Enterprise: real-time/konfigurowalne)

W DEMO:

- Generowanie jest symulowane (bez wysyłek e-mail i bez trwałego zapisu).

---

## 9) Strażnik danych / Data Pipeline (wgląd i naprawy) — (w ramach Papa Guardian)

### 9.1 Źródła i statusy

**Widok:**

- Lista źródeł danych (API/CSV/DB) w standardzie kart integracji:
  - status: `OK / Opóźnienie / Błąd`
  - `Last sync`
  - opóźnienie (np. `+3h`)
  - retry count / ostatni błąd
  - (opcjonalnie) SLA per źródło

**Interakcje:**

- Klik w kartę → szczegóły integracji + naprawy (retry, reconnect, test).
- CTA: `Napraw` / `Retry`.

### 9.2 Transformacje i normalizacja (Model danych)

- Kroki:
  - `Extract`
  - `Normalize`
  - `Aggregate`
  - `Compute KPIs`
- Dla każdego kroku:
  - status
  - last run
  - error message (jeśli błąd)
  - CTA: retry / zobacz log

### 9.3 Indeksowanie / RAG (warstwa wektorowa)

**Cel:** transparentność “na czym AI pracuje”.

Zawartość:

- lista źródeł kontekstu (tabele, definicje KPI, alerty, raporty)
- status indeksowania + last update
- scope (co jest indeksowane)

**Interakcje:**

- CTA: **Odbuduj indeks** (z potwierdzeniem)
- Klik w zakres → lista tabel/kolumn w indeksie + wyszukiwarka
- Klik w błąd → log indeksowania + rekomendacje naprawy

**Bezpieczeństwo i tryb DEMO:**

- `Odbuduj indeks` to **write action** — w **DEMO** MUST być `disabled` (tooltip „To jest DEMO”) lub symulowane bez efektu trwałego.
- W **PROD** dostęp MUST być ograniczony (RBAC, np. admin) i zabezpieczony (potwierdzenie, rate limit, audyt).

---

### 9.4 Ustrukturyzowany wynik w BigQuery (read-only)

**Cel:** pokazać wynikowy model danych oraz lineage KPI.

Zawartość:

- Lista dostępnych datasetów i tabel (read-only):
  - `t_<tenantId>_raw` (surowe / źródła)
  - `t_<tenantId>_stg` (normalizacja / walidacje)
  - `t_<tenantId>_marts` (metryki / modele do dashboardu i AI)
  - (admin) `platform_meta`, `platform_ops`, `platform_demo`
- Dla każdej tabeli:
  - opis (co zawiera)
  - kluczowe kolumny
  - freshness (last updated)
- Definicje KPI (link do dokumentu kontraktu) + skrócony opis.

**Uprawnienia (RBAC) i tryb DEMO:**

- Link „Otwórz w BigQuery” oraz podgląd SQL MUST być dostępny tylko dla ról z uprawnieniem do wglądu w model/transformacje.
- W **DEMO** te elementy MUST być ukryte albo zastąpione statycznym opisem (bez linków do systemów klienta).

---

## 10) Definicje KPI i “Trust UX” (MUST)

- Każdy KPI ma:
  - definicję (tooltip)
  - wzór (jeśli to ma sens)
  - źródło (które tabele / jakie założenia)
- Przykłady:
  - ROAS = revenue_attributed / ad_spend
  - MER = revenue_total / ad_spend (Marketing Efficiency Ratio)
  - Profit = revenue - COGS - refunds - shipping - payment_fees - ad_spend (jeśli model tak definiuje)
- Dla KPI pokazuj:
  - model atrybucji
  - zakres dat
  - świeżość danych (last update)

---

## 11) Funkcje UI obowiązkowe (v2)

Poniższe funkcje są warunkiem “gotowości produkcyjnej” dashboardu:

1. **Filtrowanie globalne**
   - filtry wpływają na wszystkie widgety (KPI, wykresy, tabele)
   - chipy aktywnych filtrów z możliwością szybkiego usunięcia
   - empty state, gdy filtry eliminują dane (`Wyczyść filtry`)

2. **Przełącznik atrybucji**
   - globalny (w topbarze lub global settings)
   - natychmiast przelicza ROAS/revenue (i inne metryki zależne)
   - widoczny “diff” po przełączeniu (badge przy KPI i na wykresach)
   - możliwość cofnięcia (undo)

3. **Drill-down (Ads i SKU)**
   - Ads: `Kanał → Kampanie → Adsety → Kreacje`
   - SKU: klik w SKU otwiera detal (drawer/ekran) z trendami i powiązaniami
   - drill-down zachowuje kontekst (daty, filtry, model atrybucji)

4. **Plan/Trial gating**
   - banner “Trial: X dni” w trialu
   - po trialu bez płatności: jasny banner + CTA do aktywacji subskrypcji
   - feature locked: tooltip/modale z powodem i CTA upgrade

5. **Eksport (PDF/CSV/JSON)**
   - z modułu Reports i z kontekstu (tam gdzie ma sens)
   - signed URL (krótki TTL) + historia eksportów

6. **AI (transparentność i bezpieczeństwo)**
   - dowody + link do widgetu
   - safety block + retry
   - AI tylko na `*_marts` (bez PII)

---

## 12) Minimalny zestaw widgetów (MVP)

### 12.1 Overview — MVP

- KPI Grid
- Alerts list (3–6)
- Executive Insights (AI)

### 12.2 Ads — MVP

- Tabela kanałów (Google/Meta/TikTok)
- Drilldown do kampanii

### 12.3 Products — MVP

- Lista SKU + margin/profit (po rabatach i zwrotach) + returns
- Detal SKU

### 12.4 Customers — MVP

- Cohorts / LTV (podstawowe)
- Segmenty

### 12.5 Integrations — MVP

- Lista integracji + status
- CTA do podłączenia (w DEMO: modal “To jest DEMO”)

### 12.6 Reports — MVP

- **Last report** (ostatni wygenerowany) + podgląd
- **Generate now** (manual trigger)
- **Eksport**: PDF/CSV/JSON

### 12.7 Data Freshness — MVP (globalnie)

- **Last sync per źródło** + status: `OK / Opóźnienie / Błąd`
- Klik prowadzi do **Strażnika danych / Data Pipeline**

---

## 13) Kryterium sukcesu dashboardu

- Użytkownik w 20–60 sekund potrafi wskazać: “co się dzieje”, “dlaczego” i “co zrobić”.
- Dashboard ma stany loading/empty/error/offline na poziomie widgetów (nie blokuje całego ekranu).
- AI jest transparentne: oznaczenia, dowody, safety, retry.
