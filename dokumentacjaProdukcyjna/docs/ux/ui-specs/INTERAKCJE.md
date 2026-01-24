# Interakcje UI/UX — Dashboard (v2)

> Aktualizacja v2: logowanie Google/Microsoft + firmowy e-mail z weryfikacją, Papa AI Chat + Papa Guardian (alerty e-mail), plany Starter/Professional/Enterprise + trial 14 dni (trial = Professional).

Ten dokument opisuje standard interakcji (hover/click/selection) dla dashboardu PapaData: zachowania komponentów, feedback dla użytkownika (AI-spinka, empty states, data quality, a11y, performance).

## Cel dokumentu
Ustalić spójne reguły interakcji, które obowiązują w:
- **Publicznym DEMO** (bez logowania),
- **Produkcji** (po logowaniu),
przy założeniu, że **DEMO = PROD 1:1** (różnice wyłącznie w danych, uprawnieniach i write-actions).

## Odbiorcy
- UX/Product: standardy interakcji, mikrocopy i priorytety.
- Dev: kontrakty zachowań dla komponentów, overlay i stanów UI.
- QA: checklisty regresji i kryteria akceptacji.

## Powiązane dokumenty
- Spec funkcjonalna: `DASHBOARD.md`
- Wygląd i layout: `WYGLAD.md`
- Integracje (katalog + OAuth): `INTEGRACJE.md`

## Słownik
- **Widget**: KPI card / chart / table.
- **Write-action**: akcja mutująca stan po stronie serwera.
- **DEMO**: tryb gościa z danymi mock i blokadą write-actions.
- **Trial**: 14 dni po rejestracji z uprawnieniami jak Professional.
- **Overlay**: tooltip/popover/dropdown/modal/drawer.

## Normatywne słowa
- **MUST** — wymagane w v1.
- **SHOULD** — zalecane.
- **MAY** — opcjonalne.

---

## 0) Tryby: Demo i Produkcja (kontrakt interakcji 1:1)

Dashboard DEMO (dla użytkownika niezalogowanego) musi być **1:1** z dashboardem produkcyjnym pod względem:
- układu,
- zachowań hover/click/selection,
- dostępności i obsługi klawiaturą,
- stanów UI (loading/empty/error/offline),
- copy i mikrocopy.

Różnice DEMO mogą dotyczyć tylko:
- źródła danych (mock/syntetyczne),
- braku auth/RBAC i braku dostępu do danych klienta,
- blokady write-actions (disabled/symulacja).

---

## 1) Zasady globalne interakcji

### 1.1 Hover (najazd myszką)
- Hover MUST dawać kontekst: highlight, tooltip, podpowiedź.
- Tooltip MUST znikać po `ESC` i mieć aria-label.
- Hover SHOULD nie zmieniać układu (brak reflow).

### 1.2 Click (klik)
- Klik MUST mieć jedną, przewidywalną akcję:
  - otwarcie detalu,
  - drill-down,
  - selekcja,
  - uruchomienie overlay.
- Klik w CTA MUST zawsze dawać feedback (toast/modal/loading).

### 1.3 Selection (zaznaczenie zakresu)
- Zaznaczenie na wykresie MUST aktualizować kontekst (np. zakres dat) albo otwierać panel filtrów.
- Selection MUST być czytelne (highlight + chip w topbarze).
- Selection MUST mieć “reset” (x / Clear selection).

### 1.4 Reset i cofanie
- Reset filtrów MUST być dostępny globalnie.
- “Undo” SHOULD istnieć dla przełącznika atrybucji i kluczowych zmian ustawień.

### 1.5 Gating funkcji: DEMO / Trial / Plan (MUST)
- **DEMO (gość):** brak write-actions; CTA prowadzą do modala “To jest DEMO” + `Rozpocznij trial`.
- **Trial (14 dni, jak Professional):** wszystkie funkcje Professional dostępne; UI pokazuje licznik dni + CTA do aktywacji płatności.
- **Po trialu bez płatności:** funkcje produkcyjne są zablokowane (banner + “Aktywuj subskrypcję”), dane i konfiguracje pozostają nienaruszone.
- **Plan Starter vs Professional vs Enterprise:** UI musi respektować limity (liczba źródeł, częstotliwość raportów, priorytet AI) i pokazywać jasny powód blokady (feature locked).
- **Wzorzec blokady:** preferuj `Disabled + tooltip` dla pojedynczej akcji oraz `Banner + CTA` dla całego modułu.

---

## 2) Zachowania per typ widgetu / wykresu

- KPI cards:
  - hover: tooltip definicji KPI + freshness
  - click: drill-down do detalu KPI
- Tables:
  - sortowanie po kolumnach
  - paginacja/lazy-load
  - row actions: `…` (w DEMO write-action zablokowany)
- Charts:
  - tooltip na hover
  - selection (range) + clear
  - click w serię → filtr (jeśli ma sens)

---

## 3) Integracja z AI — “spinka” całego produktu

### 3.1 “Wyjaśnij w AI” w każdym komponencie
- Każdy widget MUST mieć CTA: “Wyjaśnij w AI”.
- Klik wysyła kontekst: widok, filtry, selection.

### 3.2 “Cytowanie danych” (Trust UX)
- AI SHOULD pokazywać “dowody”: link do wykresu/tabeli.
- UI SHOULD pozwalać przejść do źródła (drilldown).
- Jeśli dane są nieświeże/niepełne, AI MUST pokazać ostrzeżenie freshness (krótko) i CTA do “Strażnika danych”.

### 3.3 Stany AI (UI kontrakt)
- **Streaming:** tekst dopisuje się płynnie; UI pokazuje “generowanie…”.
- **Cancel:** user może przerwać generowanie; UI zostawia częściową odpowiedź z etykietą “Przerwano”.
- **Safety block:** UI pokazuje komunikat blokady (bez ujawniania reguł) + propozycję przeformułowania.
- **Timeout/offline:** UI pokazuje błąd + `Spróbuj ponownie`.

### 3.4 Papa AI Chat (panel) — zasady dostępu i kosztów (MUST)
- Chat działa **tylko po logowaniu** (DEMO: mock).
- Kontekst zapytania to zawsze: widok + filtry + selection + definicje metryk.
- AI odpowiada na podstawie warstwy `*_marts` (bez PII).
- UI pokazuje limity (np. “Pozostało X zapytań / dzień” lub “Limit w tym okresie”), zgodnie z planem.

### 3.5 Papa Guardian — alerty i rekomendacje (MUST)
- Alerty/anomalie pojawiają się w UI jako karta + wpływ + CTA: `Wyjaśnij w AI` / `Otwórz detal`.
- Guardian może wysyłać e-mail: UI pozwala ustawić odbiorców i częstotliwość (Starter: tygodniowo, Professional: codziennie, Enterprise: konfigurowalne).
- Każdy alert ma status: `Nowy / Potwierdzony / Odrzucony` + komentarz (audytowalne).

---

## 4) Stany UI (Loading / Empty / Partial / Error / Offline)

### 4.1 Loading
- Loading MUST być na poziomie widgetu, nie blokować całego ekranu.
- Skeleton SHOULD odpowiadać finalnemu układowi.

### 4.2 Empty
- Empty MUST mieć wyjaśnienie (brak danych / filtry eliminują dane / brak integracji).
- Empty MUST mieć CTA: `Wyczyść filtry` / `Podłącz integracje`.

### 4.3 Partial
- Jeśli część danych jest dostępna, UI MUST pokazać to, co jest, i ostrzec o brakach.

### 4.4 Error
- Error MUST być czytelny + mieć CTA:
  - `Spróbuj ponownie`,
  - jeśli błąd dotyczy źródła: CTA `Przejdź do Integracji` / `Strażnika danych`.
W DEMO:
- błędy mogą być celowo symulowane (dla pokazania jakości UX), tylko jeśli to nie psuje 1:1 (preferuj naturalny UX bez dopisków).

### 4.5 Offline
- Globalny banner “Brak połączenia”.
- Widgety:
  - pokazują ostatnie dane z cache (jeśli są) z badge “offline” **lub**
  - pokazują czytelny empty/error.
- CTA: `Ponów`.

---

## 5) Wzorce overlay i feedback (tooltip/popover/menu/modal/drawer/toast/alerts)

- Tooltip: krótki, informacyjny.
- Popover: dodatkowe szczegóły, definicje, krótkie instrukcje.
- Modal: potwierdzenie akcji, onboarding, weryfikacje.
- Drawer: kontekstowy detal (np. kampania, SKU, AI panel).
- Toast: szybki feedback “zrobione / błąd / symulowane w DEMO”.

### 5.X Eksport raportów (PDF / CSV / JSON) — wzorzec (MUST)
- Eksport uruchamiany z modułu **Reports** lub z kontekstu tabeli (tam gdzie ma sens).
- UI pokazuje wybór formatu: `PDF`, `CSV`, `JSON` + zakres (np. widok/filtry) + język (PL/EN).
- Po wygenerowaniu: link do pobrania (signed URL, krótki TTL) + wpis w historii eksportów.
- DEMO: eksport zwraca przykładowy plik (bez danych klienta) albo symuluje generowanie (toast).

---

## 6) Formatowanie liczb i lokalizacja (PL/EU)
- Separatory: spacje w tysiącach, przecinek dziesiętny.
- Waluta: PLN (format PL).
- Daty: `DD.MM.YYYY`.
- Strefa czasowa: Europe/Warsaw.

---

## 7) Dostępność (a11y) i klawiatura
- Focus trap w modalach/drawerach.
- `ESC` zamyka overlay.
- Tab order logiczny.
- Kontrast i aria-label w CTA.

---

## 8) Performance UX (nie blokuj ekranu)
- Lazy-load ciężkich tabel.
- Cache i “stale-while-revalidate”.
- Paginacja i limity.

---

## 9) Definicja standardu: Hover → Click → Action

- **Hover** = kontekst
- **Click** = kontrola / selekcja
- **Action** = decyzja (alert/raport/eksport)

### 9.1 Kryterium “dashboard gotowy”
- Wszystkie kluczowe akcje mają feedback.
- DEMO nie robi write, ale pokazuje flow.
- AI jest spójne (streaming/cancel/safety).
