# Regulamin świadczenia usług (ToS) — Production Template (B2B)

> Dokument jest szablonem do uzupełnienia. Skonsultuj wersję produkcyjną z prawnikiem.

Powiązane:

- SLA: `../operations/sla.md`
- DPA: `dpa.md`
- Privacy policy: `privacy-policy.md`
- Cookies policy: `cookies-policy.md`
- AI disclaimer: `ai-disclaimer.md`

---

## 1. Dane operatora

- Operator: **PapaData Intelligence Sp. z o.o.**
- Adres: ul. Prosta 51, 00-838 Warszawa, Polska
- KRS: 0000759747 / NIP: 5252781906 / REGON: 390501170
- Kontakt: support@papadata.pl, legal@papadata.pl, tel. +48 22 123 45 67

## 2. Definicje

- Usługa: PapaData Intelligence
- Klient: podmiot B2B
- Konto: dostęp do panelu
- Public DEMO: publiczny dashboard bez logowania
- AI: moduł oparty o Gemini/Vertex (probabilistyczny)

## 3. Zakres usługi

- dostarczamy wielowarstwowy dashboard PapaData Intelligence (Overview, Ads, Customers, Products, Guardian, Puls, itd.) z dostępem do metryk, wykresów, alertów i rekomendacji AI,
- zarządzamy integracjami (Shopify, Allegro, Meta, GA4, e‑commerce API) w zależności od wykupionego planu oraz zapewniamy ciągłość ETL/BigQuery + synchronizację danych,
- udostępniamy workspace do operacji i ustawień (RBAC, retencja, polityki subskrypcji) z możliwością eksportu danych i raportów (PDF, CSV) przez role z odpowiednimi uprawnieniami,
- publiczny DEMO (open link bez logowania) jest trybem demonstracyjnym — działa na danych syntetycznych, nie objęty SLA, a każde wykorzystanie naruszeń (boty, scraping) może zostać ograniczone.

## 4. Konto i dostęp

- konto zakładane jest przez administratora klienta po kontakcie z zespołem PapaData; weryfikujemy adres e-mail oraz powiązanie z subskrypcją, po czym klient otrzymuje link aktywacyjny i może dodać członków zespołu,
- odpowiadający za konto klient ponosi odpowiedzialność za poufność danych logowania oraz za konfigurację dostępu (zaproszenia, usuwanie użytkowników, aktywacja 2FA i polityk SSO), w szczególności za przypisywanie ról takich jak owner, admin, member,
- w ramach RBAC udostępniamy zestaw domyślnych ról (owner, admin, analyst) i pozwalamy tworzyć role niestandardowe z ograniczonym dostępem do konkretnych modułów (np. tylko przegląd danych lub tylko konfiguracja integracji).

## 5. Warunki korzystania (AUP)

Zakazane:

- treści nielegalne, malware, spam,
- próby omijania filtrów bezpieczeństwa (w tym AI),
- reverse engineering,
- wykorzystywanie usługi do trenowania konkurencyjnych modeli (jeśli dotyczy polityki),
- nadużycia public DEMO (boty, scraping, generowanie kosztów).

## 6. AI i odpowiedzialność

- AI jest probabilistyczne; możliwe błędy/halucynacje,
- rekomendacje są pomocnicze; decyzje biznesowe wymagają weryfikacji,
- odpowiedzi AI muszą być oznaczone w UI,
- DEMO nie powinno przyjmować danych wrażliwych.

Szczegóły: `ai-disclaimer.md`.

## 7. Płatności i faktury

- dostępne plany: Starter (najmniejsze sklepy), Scale (średnia skala) oraz Enterprise (dedykowane SLA i wsparcie). Szczegóły limitów, integracji i wsparcia opisane są w `../operations/sla.md` oraz na stronie ofertowej.
- rozliczenia cykliczne: automatyczne obciążenia karty (lub SEPA/Przelew) realizowane w cyklu miesięcznym/liczonym od daty aktywacji. Klient otrzymuje przypomnienie 7 dni przed odnowieniem; zmianę planu można zgłosić przez portal subskrypcji.
- faktury VAT wysyłamy e-mailem na adres billingowy klienta w ciągu 3 dni roboczych od pobrania opłaty; dokument zawiera numer konta, dane zarejestrowanego odbiorcy oraz informację o okresie rozliczeniowym.
- PapaData wspiera KSeF od momentu obowiązku (2026) – klient może wskazać ogólny numer, a faktury są publikowane na platformie KSeF z zachowaniem cyfrowego podpisu.

## 8. SLA

- szczegóły SLA (poziomy dostępności, response time, eskalacje) opisane w `../operations/sla.md`; obowiązuje pomiar availability w stosunku 99,5% (Starter) / 99,9% (Scale/Enterprise) w warstwie API + dashboard,
- rekompensaty realizujemy w formie service credits: każda przerwa klasy „Total outage” redukuje miesięczną opłatę (w tym 2 godziny darmowego wglądu lub 10% miesiąca). Warunkiem jest zgłoszenie incydentu w Jira `CMP-INCIDENTS` i potwierdzenie przez Security Lead.

## 9. Data Act — interoperacyjność i migracja

- klienci mogą pobierać własne dane (raporty PDF/CSV, zestawy kampanii, dane BigQuery) z poziomu panelu lub zgłaszając eksport Data Act przez support@papadata.pl; standardowe pliki dostarczamy w formacie CSV/JSON wraz z metadanymi (czas, typ danych, źródło), a dla większych zestawów aktywujemy dedykowany eksport BigQuery,
- migracja danych i zamknięcie środowiska odbywa się po zamknięciu subskrypcji: klient otrzymuje 14-dniowy okres retencji, w tym czasie support przygotowuje kopię (jeśli klient zażąda) i przekazuje dostęp do zasobów (GCP, BigQuery, Storage) lub exportu do wskazanego konta.

## 10. Własność intelektualna

- PapaData Intelligence pozostaje właścicielem platformy, brandu, dokumentacji, kodu źródłowego i wszelkich znaków towarowych; klient otrzymuje ograniczoną, niewyłączną licencję (do czasu wygaśnięcia subskrypcji) na korzystanie z aplikacji w celach wewnętrznych,
- wszelkie materiały (dashboardy, raporty, rekomendacje) generowane przez usługę (w tym AI) są udostępniane klientowi wraz z prawem do użytkowania i archiwizacji; PapaData może korzystać z agregowanych, zanonimizowanych danych do celów rozwoju produktu, o ile nie identyfikują osób ani firm,
- zabronione jest kopiowanie kodu, próby reverse engineering lub udostępnianie zewnętrznym firmom bez pisemnej zgody.

## 11. Odpowiedzialność i ograniczenia

- usługa dostarczana jest w modelu „best effort” – nie gwarantujemy poprawności rekomendacji AI, a decyzje biznesowe podejmowane są wyłącznie przez klienta,
- PapaData nie ponosi odpowiedzialności za straty pośrednie, utratę przychodów czy zysków pochodzących z wykorzystania danych; maksymalna odpowiedzialność ograniczona jest do równowartości miesięcznej opłaty za plan, w którym wystąpiła szkoda,
- wyłączenia odpowiedzialności dotyczą również błędów integracji stron trzecich, nieautoryzowanego dostępu przez osoby trzecie (np. wyciek danych logowania) oraz sytuacji siły wyższej opisanych w `../operations/incident-response.md`.

## 12. Reklamacje i kontakt

- wszystkie reklamacje i zgłoszenia kierujemy na support@papadata.pl lub poprzez portal klienta (incydenty klasyfikowane w Jira `CMP-INCIDENTS`), a zespół Support/OPS potwierdza odbiór w ciągu 2 godzin roboczych,
- dla incydentów bezpieczeństwa kontaktujemy Security Lead + DPO + Legal (lista kontaktów w `../operations/incident-response.md`), dla zapytań DSAR wykorzystujemy privacy@papadata.pl, a dla spraw rozliczeniowych – billing@papadata.pl,
- czasy reakcji i eskalacje opisane są w `../operations/sla.md`; SLA definiuje czasy na potwierdzenie, analizę i rozwiązanie zależnie od priorytetu (P1–P4).

## 13. Prawa osób i incydenty

- wszystkie prośby DSAR kierowane są na privacy@papadata.pl; dokumentujemy je w `docs/compliance/dsar-log.md`, weryfikujemy tożsamość (email + numer klienta, czasem krótki kontakt video) i odpowiadamy w ciągu 30 dni (lub 60 dni po uzasadnionym przedłużeniu),
- naruszenia danych klasyfikujemy i eskalujemy zgodnie z `../operations/incident-response.md` (sekcja „Data Breach”) oraz wpisujemy komunikację do `docs/compliance/breach-communications.md`; decyzje o notyfikacji UODO/osób podejmowane są w ciągu 72 godzin,
- incydenty bezpieczeństwa o priorytecie P1/P2 są niezwłocznie przekazywane Security Leadowi, DPO i Legalowi, a klient/projekt otrzymuje status przez portal statusowy lub e-mail w ciągu 24 godzin od potwierdzenia incydentu.

## 14. Prawo właściwe

- umowa podlega prawu polskiemu; wszelkie spory rozstrzygane są przez sąd właściwy dla siedziby PapaData Intelligence Sp. z o.o. w Warszawie, chyba że strony uzgodnią alternatywny tryb (mediacja/arbiter).
