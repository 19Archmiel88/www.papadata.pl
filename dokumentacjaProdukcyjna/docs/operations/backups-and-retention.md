# Operations — Backups & Retention (Production)

Ten dokument definiuje zasady kopii zapasowych i retencji danych dla środowiska produkcyjnego (PROD) oraz zasady dla DEMO.

Powiązane dokumenty:
- Privacy & data: `../compliance/privacy-and-data.md`
- DPA: `../legal/dpa.md`
- Incident response: `incident-response.md`
- Runbook: `runbook.md`
- SLA: `sla.md`

---

## 1) Cel
- Zapewnić możliwość odtworzenia danych i konfiguracji po awarii, błędzie wdrożenia lub incydencie (np. ransomware).
- Ustalić retencję danych zgodną z umowami (DPA/ToS), prywatnością (GDPR) i potrzebami operacyjnymi.
- Zdefiniować zasady eksportu i usuwania danych (Data Act / GDPR), w tym wpływ backupów.

---

## 2) Definicje
- **Backup**: kopia danych umożliwiająca odtworzenie (restore).
- **Snapshot**: migawka stanu (często na poziomie bazy/volume).
- **RPO (Recovery Point Objective)**: maksymalna akceptowalna utrata danych (czas).
- **RTO (Recovery Time Objective)**: maksymalny czas przywrócenia usługi.
- **Legal hold**: wstrzymanie usunięcia danych z powodu obowiązku prawnego/sporu.
- **DEMO**: tryb publiczny z danymi mock/syntetycznymi (bez danych klientów).

---

## 3) Zakres i środowiska

### 3.1 Środowiska
- **PROD**: podlega pełnym zasadom backup/retencja.
- **STAGING**: dane testowe; backup opcjonalny (preferowane: brak danych produkcyjnych).
- **DEV**: brak backupów (odtwarzanie z kodu).
- **DEMO**: brak persystencji danych klientów. Utrwalamy wyłącznie telemetrię i logi techniczne (Cloud Logging/Sentry) z retencją 13 miesięcy; backupy danych klientów nie są wymagane.

### 3.2 Co obejmujemy backupem w PROD (minimum)
Backup MUST obejmować:
1) **Konfiguracje integracji** (bez sekretów w plaintext)
- rekordy konfiguracji, mapowania, zakresy synchronizacji
- identyfikatory połączeń
- tokeny/sekrety: tylko jeśli są przechowywane po stronie serwera w bezpiecznym magazynie (backup zgodny z polityką secreta)

2) **Konfigurację aplikacji/tenant**
- ustawienia workspace (retencja, atrybucja, definicje KPI)
- alerty, harmonogramy raportów, listy odbiorców (bez PII, jeśli to możliwe — lub z redakcją)

3) **Dane operacyjne produktu**
- raporty generowane (artefakty) oraz metadane raportów
- ustawienia dashboardu (np. zapisane widoki, segmenty)

4) **Audit log / zdarzenia bezpieczeństwa** (jeśli wdrożone)
- zdarzenia RBAC, zmiany konfiguracji, krytyczne akcje

5) **Metadane i indeksy AI/RAG** (jeśli utrwalane)
- status indeksowania, metadane (niekoniecznie wektory, zależnie od architektury)
- możliwość odbudowy z danych źródłowych (preferowane)

Systemy składowania w PROD:
- BigQuery (hurtownia/analityka),
- Cloud Storage (raporty, eksporty, artefakty),
- Cloud Logging (logi techniczne i bezpieczeństwa),
- Secret Manager (sekrety),
- Sentry (błędy aplikacji).
Kontenery Cloud Run są stateless i nie przechowują danych trwałych.

---

## 4) Strategia backupów (PROD)

### 4.1 Typy danych i podejście
- **Baza danych (primary DB)**:
  - snapshoty + (opcjonalnie) backup ciągły / WAL/PITR (jeśli wspierane)
- **Object storage** (raporty, eksporty, załączniki):
  - wersjonowanie + lifecycle policy
- **Konfiguracje infrastruktury**:
  - IaC w repo (git) jest “backupem” konfiguracji, ale nie zastępuje backupu danych
- **Sekrety**:
  - przechowywane w secrets manager; backup wg polityki dostawcy i konfiguracji (preferowane: managed + versioning)

Implementacja: GCP (Cloud Run + BigQuery + Cloud Storage + Secret Manager). W razie użycia relacyjnego storage standardem jest Cloud SQL z PITR.

### 4.2 Częstotliwość
- Backup DB:
  - pełny: 1×/dobę
  - przyrostowy/PITR: ciągły (punkt co 15 min)
- Object storage:
  - wersjonowanie: włączone
  - lifecycle: 90 dni
- Audit log:
  - backup/archiwizacja: dzienny eksport do Cloud Storage/BigQuery

### 4.3 Przechowywanie i separacja
- Backupy MUST być przechowywane:
  - w oddzielnym projekcie/buckecie GCP z separacją IAM
  - z szyfrowaniem at-rest
- Preferowane:
  - immutable/WORM (tam gdzie dostępne) dla kluczowych kopii

---

## 5) Retencja danych (PROD)

> Zasada: retencja musi być spójna z `../compliance/privacy-and-data.md` oraz umowami (DPA/ToS).

### 5.1 Kategorie retencji
- Dane konta i rozliczeń:
  - retencja: 5 lat (wymogi księgowe)
- Dane operacyjne produktu (ustawienia, raporty, alerty):
  - retencja: 24 miesiące od zakończenia umowy
- Dane z integracji (dane klienta jako procesor):
  - retencja: zgodnie z DPA
  - usunięcie po zakończeniu usługi: do 30 dni
- Logi techniczne i bezpieczeństwa:
  - retencja: 30 dni (z redakcją PII, jeśli dotyczy)
- Telemetria DEMO:
  - retencja: 13 miesięcy

### 5.2 Retencja backupów (oddzielnie od retencji danych)
- Backupy (DB snapshoty, archiwa) mają własną retencję:
  - kopie dzienne: 30 dni
  - kopie tygodniowe: 12 tygodni
  - kopie miesięczne: 12 miesięcy
- Zasada GDPR: dane usunięte w systemie “primary” mogą istnieć w backupach do czasu ich naturalnego wygaśnięcia, o ile:
  - backupy są odseparowane,
  - nie są używane do “normalnego przetwarzania”,
  - a restore z backupu uruchamia procedurę ponownego usunięcia (sekcja 7).

---

## 6) RPO/RTO i Disaster Recovery

### 6.1 Cele
- **RPO**: 1 godzina
- **RTO**: 8 godzin

Cele są spójne z [dokumentem SLA](sla.md).

### 6.2 Scenariusze odtwarzania (minimum)
- przypadkowe usunięcie danych (operator error)
- błędny deploy/migracja
- awaria dostawcy / regionu
- incident bezpieczeństwa (np. ransomware)

---

## 7) Testy restore i procedura odtwarzania

### 7.1 Test restore (wymagane)
- Częstotliwość: raz na kwartał
- Zakres testu MUST obejmować:
  - odtworzenie DB do środowiska testowego
  - weryfikację spójności kluczowych tabel/konfiguracji
  - smoke test aplikacji (logowanie, dashboard, raporty) — zgodnie z `runbook.md`
- Wynik testu:
  - zapisany raport (data, zakres, czas, problemy, action items)

### 7.2 Restore workflow (high-level)
1) Deklaracja incydentu lub request (IC/ops) — zgodnie z `incident-response.md`
2) Wybór punktu odtwarzania (RPO) + zakresu (tenant/workspace, a gdy brak izolacji — pełne środowisko)
3) Odtworzenie danych do środowiska izolowanego
4) Walidacja (integracje, KPI, raporty)
5) Przywrócenie do PROD (jeśli wymagane)
6) Po restore: wykonanie “post-restore DSAR replay”:
  - ponowne uruchomienie usunięć na podstawie rejestru DSAR (lista tenant/workspace z ticketów DSAR) i weryfikacja w logach audytowych

---

## 8) Bezpieczeństwo backupów (baseline)

- Szyfrowanie at-rest: **MUST** (GCP managed encryption; opcjonalnie CMEK)
- Szyfrowanie in-transit: **MUST** (TLS)
- Dostęp:
  - zasada najmniejszych uprawnień (least privilege)
  - tylko role ops/security
  - dostęp audytowany (audit log)
- Separacja:
  - oddzielny projekt/konto/bucket dla backupów (preferowane)
- Ochrona przed usunięciem:
  - wersjonowanie + retention lock (GCS Object Lock, jeśli dostępne)
- Monitoring:
  - alerty na nieudane backupy
  - alerty na brak backupów w oknie czasu
  - alerty na nietypowe masowe usunięcia

---

## 9) Usuwanie danych i eksport (Data Act / GDPR)

### 9.1 Eksport danych (Data Act)
- Format: CSV/JSON (minimum) — zgodnie z `../compliance/privacy-and-data.md`
- Kanał: privacy@papadata.pl lub support@papadata.pl
- Bezpieczne przekazanie: time‑limited signed URL z Cloud Storage lub szyfrowane archiwum (hasło osobnym kanałem)
- Rejestr zdarzeń (audit): ticket DSAR w systemie wsparcia (label `dsar`)

### 9.2 Procedura usunięcia (GDPR/umowa)
- Trigger:
  - DSAR “prawo do usunięcia” lub
  - zakończenie umowy / zamknięcie workspace
- Kroki:
  1) weryfikacja uprawnień i zakresu (tenant/workspace)
  2) usunięcie danych w systemie primary
  3) czyszczenie danych pochodnych (cache, indeksy, raporty)
  4) zapis w rejestrze (audit trail)
  5) komunikacja do klienta

### 9.3 Dane w backupach a usunięcie
- Dane usunięte w primary mogą pozostać w backupach do wygaśnięcia retencji backupów.
- Backupy nie są używane do normalnego przetwarzania.
- Po restore z backupu uruchamiamy “replay usunięć” (sekcja 7.2).

Mechanizm “replay usunięć”: lista DSAR w ticketach (tenant/workspace + data usunięcia) i manualne uruchomienie procedury usunięcia po restore.

---

## 10) Ownership i checklist (go-live)

### 10.1 Odpowiedzialności
- Owner polityki backup/retencja: Ops/Platform
- Wykonanie backupów/monitoringu: Ops/Platform
- DSAR/usunięcia: Support + Security/Legal
- Akceptacja prawna (DPA/ToS): Security/Legal

### 10.2 Checklist przed produkcją
- [ ] Zdefiniowane RPO/RTO i spójne z `sla.md`
- [ ] Skonfigurowane backupy DB + alerty na failure
- [ ] Skonfigurowane lifecycle/retencje backupów i storage
- [ ] Szyfrowanie at-rest/in-transit potwierdzone
- [ ] Test restore wykonany i udokumentowany
- [ ] Procedura usuwania + “replay po restore” zdefiniowana
- [ ] DEMO potwierdzone jako brak persystencji danych klientów
