# Umowa powierzenia przetwarzania danych (DPA) — Production

Dokument obowiązuje relację B2B: Klient jako Administrator, Dostawca jako Procesor (w zakresie danych z integracji).

Powiązane:

- Privacy & data (procesy/DSAR/retencja): `../compliance/privacy-and-data.md`
- Incident response: `../operations/incident-response.md`
- Backups & retention: `../operations/backups-and-retention.md`
- Security baseline: `../engineering/security.md`

---

## 1. Strony

- Administrator: Klient
- Procesor: **PapaData Intelligence Sp. z o.o.**, ul. Prosta 51, 00-838 Warszawa, Polska

## 2. Przedmiot i czas trwania

- Przedmiot: przetwarzanie danych w ramach świadczenia usług analitycznych PapaData Intelligence.
- Czas: przez okres aktywnej subskrypcji + okresy retencji/usunięcia (sekcja 9).

## 3. Charakter i cel przetwarzania

- ingestion danych z integracji klienta,
- modelowanie/analiza KPI i raportowanie,
- udostępnienie dashboardu i rekomendacji (w tym AI, jeśli włączone).

## 4. Kategorie danych i osób

### Kategorie danych (przykłady)

- zamówienia, produkty, kampanie, koszty reklamowe,
- identyfikatory techniczne (IP/cookie id) — zależnie od integracji i ustawień.

### Kategorie osób

- klienci klienta (end customers),
- użytkownicy konta B2B (pracownicy klienta).

## 5. Obowiązki procesora

- przetwarzanie wyłącznie na udokumentowane polecenie Administratora,
- zapewnienie poufności personelu,
- wdrożenie odpowiednich środków bezpieczeństwa,
- pomoc Administratorowi w realizacji praw osób (DSAR),
- zgłaszanie naruszeń bez zbędnej zwłoki — w ciągu 48h od potwierdzenia,
- udostępnienie informacji potrzebnych do audytu (w uzgodnionym zakresie).

## 6. Środki bezpieczeństwa (minimum)

- TLS 1.2+ (in-transit),
- szyfrowanie at-rest (AES-256, GCP managed encryption),
- kontrola dostępu (RBAC w GCP i aplikacji),
- segmentacja środowisk (staging/prod),
- logowanie zdarzeń bezpieczeństwa bez PII (lub z redakcją),
- backup/DR zgodnie z `../operations/backups-and-retention.md`.

## 7. Podwykonawcy (Subprocessors)

- zgoda ogólna + informowanie o zmianach z wyprzedzeniem 15 dni,
- lista podwykonawców: `../compliance/subprocessors.md`,
- wymóg: umowy podpowierzenia w standardzie co najmniej równoważnym temu DPA.

## 8. Transfery poza EOG

Transfery poza EOG nie występują w standardowej konfiguracji. Jeżeli włączone są narzędzia marketingowe, transfery mogą wystąpić na podstawie SCC.

## 9. Usuwanie / zwrot danych po zakończeniu

- Dane usuwane do 30 dni po zakończeniu usługi, chyba że prawo wymaga dłużej.
- Na żądanie: eksport danych w formacie CSV/JSON.

## 10. Audyty

- Zakres audytu: raz w roku, 30 dni uprzedzenia, forma: zdalny audyt + ankieta.
- Warunki: poufność, ograniczenie do danych Administratora, koszty po stronie Administratora.

## Załącznik A — Opis przetwarzania

- Kategorie danych: dane transakcyjne, produkty, kampanie, koszty reklamowe, identyfikatory techniczne
- Kategorie osób: klienci końcowi i pracownicy klienta
- Operacje: pobieranie, przechowywanie, analiza, raportowanie
- Czas retencji: do 30 dni po zakończeniu usługi

## Załącznik B — Środki techniczne i organizacyjne (TOMs) — minimum

- kontrola dostępu i przeglądy uprawnień,
- szyfrowanie in-transit/at-rest,
- monitoring i alerty bezpieczeństwa,
- procedury reagowania na incydenty,
- kopie zapasowe i testy odtwarzania.

TOMs są dopasowane do infrastruktury GCP (Cloud Run + BigQuery + Cloud Logging).
