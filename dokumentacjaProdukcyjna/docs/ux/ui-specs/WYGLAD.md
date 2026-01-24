# Wygląd UI — Dashboard (v2)

> Aktualizacja v2: region `europe-central2` (Warszawa), logowanie Google/Microsoft + firmowy e-mail z weryfikacją, Papa AI Chat + Papa Guardian (alerty), plany Starter/Professional/Enterprise z trial 14 dni (trial = Professional).

Ten dokument opisuje **layout, komponenty globalne i wygląd ekranów** dashboardu PapaData — w formie specyfikacji, którą można bezpośrednio implementować.

## Cel dokumentu
- Ustalić **spójny wygląd i strukturę ekranów** (Sidebar/Topbar/Bannery/Screen patterns).
- Zapewnić **DEMO = PROD 1:1** na poziomie UI (różnice wyłącznie w danych, auth/RBAC i write-actions).
- Dać QA listę elementów do weryfikacji (np. stany, copy, badge, nawigacja).

## Odbiorcy
- UX/Product
- Frontend/Design System
- QA

## Powiązane dokumenty
- Spec funkcjonalna dashboardu: `DASHBOARD.md`
- Interakcje (hover/click/selection, overlay): `INTERAKCJE.md`
- Integracje i katalog: `INTEGRACJE.md`

## Normatywne słowa
- **MUST** — wymagane w MVP.
- **SHOULD** — zalecane.
- **MAY** — opcjonalne.

---

## 0) Tryby: Demo i Produkcja (kontrakt wyglądu 1:1)

Produkt udostępnia publiczny tryb DEMO (dla niezalogowanego użytkownika) oraz dashboard produkcyjny (po logowaniu). Wymóg: **DEMO = PROD 1:1** na poziomie:
- layoutu (Sidebar/Topbar, spacing, komponenty),
- stanów UI (loading/empty/error/offline),
- copy i mikrocopy,
- a11y (focus, kontrast, semantyka).

Różnice DEMO mogą dotyczyć wyłącznie:
- źródła danych (mock/syntetyczne),
- braku dostępu do danych klienta (RBAC/auth),
- blokady write-actions,
- CTA do rejestracji/uruchomienia triala.

---

## 1) Globalny layout aplikacji

### 1.1 Sidebar (lewy)
- Logo + nazwa produktu + klikniecię przechodzi na stronę główną
- Sekcje:
  - Overview
  - Analytics
  - Reports
  - Customers
  - Products
  - Integrations
  - Support
  - Settings
- Active item: highlight + lewy border.
- Collapsed mode (MAY): ikony + tooltip.

### 1.2 Topbar (zawsze widoczny)
Topbar jest “centrum sterowania” dla całej aplikacji: stan danych, tryb pracy, globalne filtry, szybkie akcje i skróty.

#### Lewa strona
- Chip statusu sesji:
  - `Sesja: gotowa`
  - `Przetwarzanie…`
  - `Błąd integracji`
- Freshness:
  - `Last update: 12:40`
  - badge “Data stale” gdy >X godzin.

#### Środek
- Zakres dat (preset + custom)

#### Prawa strona
- Badge trybu: `DEMO` / `TRIAL` / `PROD`
- Badge planu: `Starter / Professional / Enterprise` + (trial) “Trial: X dni”
- Ikona AI (otwiera Papa AI Panel)
- User menu

---

## 2) Warstwa AI (Papa AI Panel)

- Drawer/panel po prawej (z dowolnego widoku).
- Sekcje:
  - Chat (streaming)
  - “Dowody” (link do widgetów)
  - “Dodaj do raportu”
  - “Ustaw alert”
- Ostrzeżenia:
  - freshness
  - brak danych
  - feature locked (plan/trial)

---

## 3) Widok Overview (Start)

### 3.1 Alerty (Papa Guardian)
- Lista 3–6 alertów:
  - spadek sprzedaży
  - odchylenia ROAS/MER/CPA
  - wzrost zwrotów
  - spadek marży
- Każdy alert:
  - tytuł + krótka diagnoza
  - wpływ (np. estymacja straty)
  - CTA: `Wyjaśnij w AI` / `Otwórz`

### 3.2 KPI Grid
- 6–8 kart KPI z tooltip definicji i trendem.

---

## 4) Widok Analytics (Ads)

- Widok kanałów: Google Ads / Meta / TikTok.
- ROAS/MER/CPA w jednym układzie.
- Drilldown: kanał → kampania → grupa → kreacja.

---

## 5) Widok Products (SKU)

- Lista SKU: revenue, profit/margin (po rabatach i zwrotach), returns.
- Detal SKU: trend, rabaty, zwroty, powiązane kampanie.

---

## 6) Widok Customers

- Kohorty LTV
- Segmenty: VIP, churn risk

---

## 7) Widok Reports

- Karty raportów:
  - Weekly Summary
  - Monthly Report
- CTA:
  - Generate now
  - Harmonogram wysyłki
  - Eksport: PDF/CSV/JSON
- Historia raportów i eksportów

---

## 8) Integrations

- Lista integracji + statusy
- CTA do podłączenia (DEMO: modal “To jest DEMO”)

---

## 9) Ustawienia przestrzeni roboczej (Workspace/Tenant) — zawartość

### 9.1 Dane i przetwarzanie
### Retencja danych a Trial i plany

- Trial: **14 dni** (okres testu funkcji), domyślna retencja w trialu: **30 dni**.
- Plan Starter: retencja danych operacyjnych **24 miesiące od zakończenia umowy**.
- Plan Professional: retencja danych operacyjnych **24 miesiące od zakończenia umowy**.
- Plan Enterprise: retencja **konfigurowalna** (zgodnie z DPA/umową).

**Zasady zmiany retencji:**
- Upgrade (30 → 60): natychmiastowo, dane zostają.
- Downgrade (60 → 30): UI pokazuje ostrzeżenie i umożliwia **eksport** danych przed obcięciem.
- Po zakończeniu triala bez płatności: funkcje wstrzymane, usunięcie danych do **30 dni**.

### 9.4 Atrybucja i metryki
- Domyślny model atrybucji (globalny dla workspace)
- Definicje KPI (ROAS/MER/CPA/Profit/LTV)
- Słowniki i mapowania (UTM/channel_group, kampanie, SKU, koszty, COGS/marża)

### 9.5 AI i RAG
- Zakres indeksu (jakie tabele/kolumny)
- Status indeksowania + last update
- Reguły odpowiedzi (np. “zawsze pokazuj dowód + źródła”)

### 9.6 Alerty i raporty
- Kanały powiadomień: **e-mail** (MUST) — wysyłane przez Papa Guardian wg planu.
- Harmonogram raportów (MUST): Starter: **tygodniowo**, Professional: **codziennie**, Enterprise: **real-time/konfigurowalne**.
- Eksport raportów (MUST): **PDF / CSV / JSON** + historia eksportów + signed URL (krótki TTL).
- Preferencje alertów: progi, odbiorcy, “quiet hours”, kanał (email).

**CTA na dole:**
- Primary: **Wdróż w trybie produkcyjnym**
- Secondary: **Zapisz zmiany**

---

## 10) Ustawienia organizacji (Organization/Account) — zawartość

Ustawienia organizacji dotyczą **płatności, planu, użytkowników, bezpieczeństwa** oraz zgodności i bezpieczeństwa na poziomie organizacji. Są wspólne dla wszystkich przestrzeni roboczych w organizacji.

### 10.1 Ogólne (firma)
- **Nazwa organizacji**
- **Dane do faktury**:
  - NIP / VAT UE
  - adres

### 10.2 Użytkownicy i dostęp (RBAC)
- **Lista użytkowników**:
  - imię/nazwa, e-mail, rola, status (aktywny/zaproszony)
  - ostatnie logowanie (opcjonalnie)
- **Zapraszanie użytkowników**:
  - **Uwaga:** zaproszenie jest wysyłane e-mailem, ale logowanie odbywa się przez Google/Microsoft lub firmowy e-mail z weryfikacją (bez hasła w UI).
  - e-mail + wybór roli

### 10.3 Plan i rozliczenia (Billing)
- **Aktualny plan** + CTA: `Zmień plan`
- **Okres rozliczeniowy** (np. miesięczny)
- **Płatność kartą** (miejsce do wprowadzenia płatnośći)

**Plany (MUST, v2):**
- **Starter**: 159 PLN/mies. (subskrypcja roczna, płatne co miesiąc) lub 199 PLN/mies. (miesięcznie); do **3 źródeł**, **raport tygodniowy**, wsparcie e-mail, podstawowe wglądy AI.
- **Professional**: 399 PLN/mies. (subskrypcja roczna, płatne co miesiąc) lub 499 PLN/mies. (miesięcznie); do **15 źródeł**, **raport dzienny**, priorytetowe wsparcie, priorytetowe AI.
- **Enterprise**: wycena indywidualna; nielimitowane źródła, raporty w czasie rzeczywistym, dedykowany opiekun, pełny dostęp AI.

**Trial (MUST):**
- Po rejestracji: **14 dni trial** z pełnymi funkcjami **Professional**.
- Po trialu bez płatności: UI pokazuje banner “Trial zakończony” + CTA do płatności; funkcje produkcyjne są wstrzymane (bez utraty konfiguracji).

- **Status płatności**:
  - aktywna / wstrzymana / błąd
  - CTA naprawy
- **Historia faktur**:
  - lista faktur + status
  - pobierz PDF

**UX wymagany:**
- Informacja “kto jest płatnikiem” (Owner/Finance).
- Komunikaty błędów płatności z jednym CTA naprawy.

### 10.5 Bezpieczeństwo
- **Logowanie (MUST):**
  - Google
  - Microsoft
  - Firmowy e-mail z weryfikacją (bez klasycznego hasła w UI; link weryfikacyjny/OTP).

- **MFA**:
  - zalecane (default)
  - możliwość wymuszenia (dla Owner/Admin)
  - MFA jest egzekwowane na poziomie dostawcy tożsamości (Identity Platform / provider).
- **Sesje urządzeń**:
  - lista aktywnych sesji
  - akcja: `Wyloguj wszędzie`
- (Enterprise, roadmap) **SAML/SCIM** — dopiero gdy będzie wymagane przez klientów (nie w MVP v2).
  - (roadmap) konfiguracja dostawcy
  - (roadmap) automatyczne provisioning/deprovisioning użytkowników

**UX wymagany:**
- Widoczne “last security change” (opcjonalnie).

### 10.6 Audyt i zgodność
- Log zdarzeń:
  - zmiany ustawień organizacji
  - zmiany integracji (kluczowe zdarzenia)
  - zmiany uprawnień i ról
  - zdarzenia billing (zmiana planu, płatności)
- Dokumenty i zgody:
  - DPA
  - polityki retencji
  - potwierdzenia (akceptacje)

---

## 11) Stopka (public + produkt)

Stopka jest widoczna:
- na ekranach publicznych (DEMO),
- po zalogowaniu (opcjonalnie, w panelu info).

### 11.1 Linki prawne (MUST)
- Terms
- Privacy Policy
- Cookies
- DPA
- Subprocessors

---

## 12) Checklist QA (wygląd)

- DEMO vs PROD: ten sam layout, te same komponenty.
- Badge trybu i planu w topbarze.
- Feature locked: spójne bannery i tooltipy.
- Kontrast i focus states.
- Spójne stany loading/empty/error/offline na poziomie widgetów.
