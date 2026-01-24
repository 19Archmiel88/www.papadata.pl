# Compliance — Overview (Production)

## Cel
Zapewnić „SaaS readiness” dla produktu Data/AI/Analytics: prywatność, dostępność, przejrzystość AI oraz procesy operacyjne.

## Zakres obszarów
- Prywatność i ochrona danych (RODO/GDPR)
- Dostępność (WCAG 2.1 AA / EAA)
- Transparentność AI (oznaczenia, safety, disclaimer)
- Prawa użytkownika (eksport danych, przenoszalność / Data Act)
- Zgody marketing/cookies (jeśli dotyczy)
- Operacje: incident response, retencja, backupy, SLA

## Artefakty (w repo)

### Legal
- ToS: `../legal/terms-of-service.md`
- Privacy Policy: `../legal/privacy-policy.md`
- Cookies Policy: `../legal/cookies-policy.md`
- DPA: `../legal/dpa.md`
- AI disclaimer: `../legal/ai-disclaimer.md`
- Accessibility statement: `../legal/accessibility-statement.md`

### Compliance / Ops
- Privacy & data: `privacy-and-data.md`
- Accessibility (EAA): `accessibility-eaa.md`
- Incident response: `../operations/incident-response.md`
- Backups & retention: `../operations/backups-and-retention.md`
- SLA: `../operations/sla.md`

## Procesy (minimum produkcyjne)

### DSAR (prawa osób)
- kanał zgłoszeń: privacy@papadata.pl (automatyczne ticketowanie w dziale Privacy & Compliance)
- weryfikacja tożsamości: sprawdzenie adresu email powiązanego z kontem, weryfikacja numeru klienta oraz (jeśli prośba wymaga dostępu do wrażliwych danych) krótkie potwierdzenie przez videorozmowę / udostępnienie fragmentu dokumentu tożsamości przez klienta
- terminy realizacji: standardowo 30 dni od otrzymania kompletnych informacji, wydłużenie do 60 dni tylko po powiadomieniu zgłaszającego i oznaczeniu sprawy jako „DSAR – rozszerzenie” w arkuszu `docs/compliance/dsar-log.md`
- rejestr działań (audit trail): każde zgłoszenie dokumentowane w `docs/compliance/dsar-log.md` (data, osoba kontaktowa, zakres danych, wynik/odpowiedź) i asystowane przez DPO/Privacy Lead

### Naruszenia danych (breach)
- triage i dokumentacja incydentu: zgodnie z procedurą z `../operations/incident-response.md` (sekcja „Data Breach”) – Security Lead natychmiast informuje DPO/Legal i tworzy kartę incydentu w Jira (`CMP-INCIDENTS`)
- decyzja o notyfikacji: w ciągu 24 godzin po potwierdzeniu incydentu Security Lead i Legal oceniają ryzyko dla osób, a DPO decyduje o notyfikacji organu nadzorczego (RODO 72h) i/lub osób, jeśli ryzyko wysokie
- komunikacja i dokumentacja: każda decyzja notyfikacyjna dokumentowana w `incident-response.md` + kopia korespondencji w `docs/compliance/breach-communications.md`

### Subprocessors
- lista podwykonawców i aktualizacje: publikujemy zestawienie w `docs/compliance/subprocessors.md`; zmiany ogłaszamy klientom min. 15 dni przed wdrożeniem nowego subprocessora (newsletter + strona help center)
- zasada: wszystkie umowy podpowierzenia spełniają wymagania DPA i zawierają standardowe klauzule UE (SCC) oraz zobowiązanie do lokalizacji danych na terenie UE/EOG lub adekwatnego transferu

| Subprocessor | Zakres przetwarzania | Lokalizacja | Uzasadnienie |
|--------------|----------------------|-------------|--------------|
| Google Cloud Platform | Infrastruktura (Compute Engine, BigQuery, Cloud Storage), Vertex AI | europe-central2 (Warszawa), europe-west1 | Podstawowa platforma hostująca dane i pipeline |
| Firebase / Google Identity | Autoryzacja, tokeny ID, obserwowalność AI | europe-west1 | Usługi autoryzacyjne i Identity + menadżer sesji |
| Stripe | Rozliczenia i subskrypcje | EU (Amsterdam) + USA (gdzie wymagane) | Przetwarzanie płatności i portal subskrypcji |
| Sentry | Observability i error tracking | EU (Frankfurt) | Zbieranie błędów, telemetry, anonimizacja IP |
| Meta (Meta Pixel / Meta Ads) | Marketing (tylko po zgodzie) | EU + USA (wg consent) | Pomaga mierzyć kampanie; tylko dane anonymized / z consent |
| Google Analytics 4 | Telemetria front-end | EU (Holland) | Monitoring użytkowania (anonimizowane) |

### Public DEMO 1:1 — compliance notes
- DEMO nie używa danych klientów (brak PII i brak danych z integracji).
- Telemetria DEMO musi respektować consent/cookies (jeśli dotyczy).
- AI w DEMO nie może przetwarzać PII/sekretów i wymaga zabezpieczeń anty-abuse.

## Status i dalsze prace
- dane operatora i kontakty ujęto w `docs/legal/terms-of-service.md` (sekcja 1) oraz w niniejszym opracowaniu,
- lista podwykonawców i ich lokalizacje utrzymywana jest w `docs/compliance/subprocessors.md` (aktualizacja minimum 15 dni przed zmianą),
- metodologia pomiaru SLA i status page opisana w `../operations/sla.md`; statusy i eskalacje są publikowane w portalu statusowym oraz zrzeszone w Jira `CMP-INCIDENTS`,
- DPIA: nie stwierdzono ryzyka podlegającego obowiązkowi DPIA na obecnym etapie (ocena przeprowadzona przez Privacy Lead),
- rejestr czynności przetwarzania (ROPA) utrzymujemy w zakładce Privacy & Compliance (opis w `privacy-and-data.md`),
- proces eksportu danych zgodnie z Data Act opisany w `docs/legal/terms-of-service.md` (sekcja 9) oraz obsługiwany przez privacy@papadata.pl.
