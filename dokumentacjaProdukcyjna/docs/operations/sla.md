# Operations — SLA (Production)

> SLA dotyczy środowiska **PROD** dla płatnych planów.
> Publiczny tryb **DEMO 1:1** jest „best effort” i **nie jest objęty SLA**, o ile nie zostanie osobno uzgodniony.

Powiązane (źródła prawdy):
- Incident Response: `incident-response.md`
- Runbook: `runbook.md`
- Observability: `../engineering/observability.md`
- Backups & retention: `backups-and-retention.md`

---

## 0) Zakres SLA (Scope)

### 0.1 Co obejmuje SLA (PROD)
SLA obejmuje dostępność kluczowych funkcji usługi w środowisku PROD, w szczególności:
- możliwość załadowania aplikacji (SPA) i kluczowego widoku dashboardu (np. `/dashboard/overview`),
- krytyczne funkcje aplikacji po zalogowaniu (jeśli logowanie dotyczy produktu),
- krytyczne endpointy API `/api/*`.

Lista krytycznych ścieżek i endpointów (minimum):
- UI: `/dashboard/overview`, `/dashboard/roi`, `/dashboard/integrations`
- API: `/api/health`, `/api/auth/*`, `/api/ai/chat`, `/api/integrations/*`

### 0.2 Czego SLA nie obejmuje
- publicznego trybu **DEMO** (best effort),
- stron marketingowych/landing (o ile nie uzgodniono inaczej),
- przestojów wynikających z wyłączeń opisanych w sekcji 7,
- problemów z usługami stron trzecich poza kontrolą Dostawcy (o ile umowa nie stanowi inaczej),
- błędów wynikających z konfiguracji lub danych po stronie Klienta.

### 0.3 Definicja “Usługi”
Usługa: **PapaData Intelligence**, świadczona przez **PapaData Intelligence Sp. z o.o.**

---

## 1) Definicje

- **Uptime / Dostępność:** procent czasu, w którym Usługa jest dostępna.
- **Okno pomiaru:** miesiąc kalendarzowy (UTC).
- **Niedostępność (Downtime):** sytuacja, w której spełniony jest warunek z sekcji 2.2 (warunek „down”).
- **Degradacja:** usługa działa, ale z istotnie ograniczoną funkcjonalnością (może być traktowana jak downtime tylko, jeśli spełnia definicję „kluczowych funkcji”).
- **Okno serwisowe:** planowane prace, wyłączone z pomiaru, jeśli spełniają warunki sekcji 6.
- **Incident:** zdarzenie obsługiwane procesem `incident-response.md`.

---

## 2) Dostępność (SLA) — poziomy

| Plan | SLA dostępności (miesięcznie) | Zakres | Uwagi |
|---|---:|---|---|
| Starter | 99.5% | PROD App | standardowy monitoring |
| Scale | 99.9% | PROD App | rozszerzony monitoring |
| Enterprise | 99.95% | PROD App + rozszerzenia | priorytetowa eskalacja, 24/7 dla P1 |

---

## 3) Jak mierzymy dostępność (metodologia)

### 3.1 Źródła pomiaru
- monitoring syntetyczny (z zewnątrz),
- metryki backendu / health check (jeśli backend istnieje),
- error tracking i logi (pomocniczo),
- status page (komunikacyjnie; nie zawsze jest źródłem pomiaru).

Narzędzia:
- Cloud Monitoring (uptime checks `/` i `/api/health`),
- Sentry (error tracking frontend + backend),
- Cloud Logging (logi backendu).

### 3.2 Regiony i punkty pomiaru
- pomiar z regionów UE: europe-central2 (Warszawa) i europe-west1 (Belgia).

### 3.3 Warunek „UP” (zalecany minimalny kontrakt)
Usługa jest uznana za dostępną, jeśli:
- (A) kluczowa ścieżka UI (np. `/dashboard/overview`) może zostać załadowana i zwraca 2xx/3xx, oraz
- (B) (jeśli dotyczy) health endpoint backendu odpowiada 2xx.

Test syntetyczny (minimum):
- GET `/dashboard/overview` w czasie < 10 s i kod 2xx/3xx,
- GET `/api/health` w czasie < 5 s i kod 2xx.

### 3.4 Warunek „DOWN” (zalecany)
Downtime liczymy, gdy:
- test syntetyczny warunku „UP” nie przechodzi przez 3 kolejne próby w oknie 5 minut,
- i problem nie wynika z wyłączeń (sekcja 7).

### 3.5 Wzór na dostępność
**Availability % = (Total Minutes − Downtime Minutes) / Total Minutes × 100**

- `Total Minutes` liczony w oknie pomiaru (miesiąc UTC),
- `Downtime Minutes` sumowane z okresów uznanych za „DOWN”,
- `Okna serwisowe` wyłączone zgodnie z sekcją 6.

---

## 4) Support — priorytety i czasy reakcji

> Definicja „czas reakcji”: czas do pierwszej odpowiedzi ze strony zespołu wsparcia (nie czas rozwiązania).

### 4.1 Priorytety zgłoszeń (P1–P4)
- **P1 (Critical):** niedostępność kluczowych funkcji w PROD lub incydent bezpieczeństwa.
- **P2 (High):** istotna degradacja dla wielu użytkowników / brak obejścia.
- **P3 (Medium):** problem nieblokujący, obejście istnieje.
- **P4 (Low):** pytania, prośby, kosmetyka.

Kluczowe funkcje dla P1: logowanie, dashboard Overview/ROI/Integrations, krytyczne endpointy `/api/health`, `/api/auth/*`, `/api/ai/chat`.

### 4.2 Czasy reakcji i kanały

| Plan | Kanały | P1 | P2 | P3 | P4 | Godziny wsparcia |
|---|---|---:|---:|---:|---:|---|
| Starter | email | 4h | 8h | 2 dni robocze | 5 dni roboczych | Pn–Pt 09:00–17:00 CET/CEST |
| Scale | email/chat | 2h | 6h | 1 dzień roboczy | 3 dni robocze | Pn–Pt 09:00–17:00 CET/CEST |
| Enterprise | email/chat/telefon | 1h | 4h | 1 dzień roboczy | 2 dni robocze | 24/7 dla P1, Pn–Pt 09:00–17:00 CET/CEST dla P2–P4 |

### 4.3 Eskalacja (zalecane)
- P1 uruchamia proces incident (IC/war room) zgodnie z `incident-response.md`.
- Dla Enterprise: dedykowana ścieżka eskalacji (telefon + kanał priorytetowy wskazany w umowie).

---

## 5) Komunikacja w incydentach (zależna od SEV)

Zasady i szablony komunikacji znajdują się w `incident-response.md`.

Zalecenie:
- dla SEV0/SEV1: status update na status page oraz regularne update’y wg `incident-response.md`,
- dla SEV2/SEV3: komunikacja wg potrzeb (np. support ticket), chyba że umowa stanowi inaczej.

Status page jest publiczny: https://status.papadata.pl

---

## 6) Okna serwisowe

- Planowane prace: niedziele 02:00–04:00 CET/CEST
- Komunikacja: status page + email do klientów Enterprise z 72h wyprzedzeniem
- Warunki wyłączenia z pomiaru:
  - prace zapowiedziane,
  - w określonym oknie,
  - dot. utrzymania lub bezpieczeństwa.

**Emergency maintenance**
- Dopuszczalne przy krytycznych poprawkach bezpieczeństwa.
- Komunikacja “as soon as practicable”: status page + email do klientów Enterprise.

---

## 7) Wyłączenia (typowe)

SLA nie obejmuje m.in.:
- siły wyższej,
- awarii dostawców poza kontrolą (cloud/CDN/płatności), chyba że umowa stanowi inaczej,
- problemów wynikających z działań/konfiguracji Klienta,
- niedostępności w trakcie uzgodnionych okien serwisowych,
- działań nadużyciowych (abuse) i mitigacji dla public DEMO (jeśli DEMO wyłączone z SLA),
- incydentów spowodowanych naruszeniem warunków korzystania (np. przekroczenia limitów, automatyzacje/boty).

---

## 8) Kredyty SLA (Service Credits)

### 8.1 Zasady ogólne
- Kredyty dotyczą wyłącznie opłat za Usługę w danym okresie rozliczeniowym.
- Kredyty są rozliczane na kolejnej fakturze.
- Maksymalny kredyt w miesiącu: 50% opłaty miesięcznej.
- Kredyty nie łączą się z innymi formami rekompensaty, jeśli umowa nie stanowi inaczej.

### 8.2 Progi i wysokość kredytu
| Miesięczna dostępność | Kredyt |
|---:|---:|
| >= SLA% i < 99.0% | 10% |
| >= 98.0% i < 99.0% | 25% |
| < 98.0% | 50% |

### 8.3 Zgłoszenie roszczenia (claim)
- Okno zgłoszenia: w ciągu 30 dni od zakończenia okresu pomiaru.
- Kontakt: support@papadata.pl
- Wymagane dane:
  - identyfikator organizacji/tenant/workspace (bez PII),
  - przybliżone czasy i objawy,
  - (opcjonalnie) screeny/logi — bez danych osobowych.

### 8.4 Kwalifikacja
Kredyt przysługuje, jeśli:
- downtime spełnia definicję z sekcji 3,
- nie zachodzą wyłączenia z sekcji 7,
- roszczenie zostało zgłoszone w terminie.

---

## 9) Powiązania operacyjne (spójność)

- Definicje SEV i proces zarządzania incydentem: `incident-response.md`.
- Procedury deploy/rollback i smoke tests: `runbook.md`.
- Monitoring i alerty: `../engineering/observability.md`.
- Backup/restore i retencja: `backups-and-retention.md`.

---
