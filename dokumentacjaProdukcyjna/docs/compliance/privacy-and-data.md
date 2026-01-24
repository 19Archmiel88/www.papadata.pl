# Polityka prywatności (B2B SaaS)

> Dotyczy serwisu i usługi PapaData (landing + aplikacja), w tym trybu DEMO.
> W przypadku danych przetwarzanych w imieniu Klienta (integracje) zastosowanie ma również DPA.

Powiązane:
- Umowa powierzenia (DPA): `dpa.md`
- Polityka cookies: `cookies-policy.md`
- Zasady AI (disclaimer): `ai-disclaimer.md`
- Wewnętrzne procesy (operacyjne, niepubliczne): `../compliance/privacy-and-data.md`

---

## 1. Administrator danych (Controller)

Administratorem danych (w zakresie opisanym w tej polityce jako „Administrator”) jest:
- **PapaData Intelligence Sp. z o.o.**, ul. Prosta 51, 00-838 Warszawa, Polska
- KRS: 0000759747 / NIP: 5252781906 / REGON: 390501170
- Kontakt w sprawach prywatności: **privacy@papadata.pl**
- Kontakt ogólny / wsparcie: **support@papadata.pl**

---

## 2. Zakres i role (B2B: Administrator vs Procesor)

W zależności od rodzaju danych możemy działać jako:

### 2.1 Administrator (Controller)
Działamy jako Administrator m.in. dla:
- danych konta użytkownika (B2B) i kontaktu,
- danych rozliczeniowych i fakturowych,
- danych związanych z bezpieczeństwem i utrzymaniem (np. logi zdarzeń, przeciwdziałanie nadużyciom),
- danych marketingowych/analitycznych opartych o zgody cookies (jeśli dotyczy).

### 2.2 Procesor (Processor) — dane z integracji Klienta
Jeżeli Klient podłącza integracje i przekazuje dane (np. zamówienia, produkty, kampanie), przetwarzamy je **w imieniu Klienta** jako Procesor, zgodnie z DPA oraz poleceniami Klienta.

W takiej sytuacji:
- Klient (Twoja organizacja) jest Administratorem danych swoich klientów/kontrahentów,
- my działamy jako Procesor.

> Wnioski osób, których dane pochodzą z integracji Klienta (np. klienci sklepu internetowego), należy kierować przede wszystkim do Klienta jako Administratora. W razie potrzeby wspieramy Klienta zgodnie z DPA.

---

## 3. Jakie dane przetwarzamy

### 3.1 Dane konta i organizacji (B2B)
- imię i nazwisko,
- służbowy e-mail,
- nazwa firmy/organizacji,
- rola/uprawnienia w organizacji,
- dane do faktur (jeśli dotyczy).

### 3.2 Dane techniczne i bezpieczeństwa
- logi zdarzeń aplikacji (np. błędy, zdarzenia bezpieczeństwa),
- identyfikatory sesji / urządzenia (minimalny zakres),
- adres IP (w logach serwera/CDN, jeśli dotyczy),
- zdarzenia administracyjne (np. zmiany konfiguracji, uprawnień) — jeśli wdrożone.

Zasada: nie dążymy do przetwarzania PII w logach; jeśli występuje, stosujemy minimalizację i redakcję (tam gdzie możliwe).

### 3.3 Dane z integracji (w imieniu Klienta)
Zakres zależy od integracji i konfiguracji Klienta. Przykłady:
- zamówienia i pozycje zamówień,
- produkty (SKU),
- kampanie i koszty reklamowe,
- dane analityczne (np. ruch, konwersje).

Szczegóły: `dpa.md`.

### 3.4 Dane w trybie DEMO
Tryb DEMO prezentuje funkcje aplikacji na danych przykładowych/syntetycznych.
Nie powinien zawierać danych rzeczywistych klientów.
Telemetria DEMO (jeśli włączona) obejmuje jedynie metadane techniczne i zdarzenia UX bez PII, realizowana przez Sentry i (opcjonalnie) GA4 po uzyskaniu zgody cookies.

---

## 4. Cele i podstawy prawne przetwarzania (Administrator)

Przetwarzamy dane jako Administrator w następujących celach:

1) **Świadczenie usługi i zarządzanie kontem**
- podstawa: wykonanie umowy (art. 6(1)(b) GDPR)

2) **Rozliczenia i obowiązki księgowe**
- podstawa: obowiązek prawny (art. 6(1)(c) GDPR)

3) **Bezpieczeństwo, zapobieganie nadużyciom, stabilność usługi**
- podstawa: uzasadniony interes (art. 6(1)(f) GDPR)

4) **Analityka produktu / UX (jeśli stosowana)**
- podstawa: uzasadniony interes (art. 6(1)(f) GDPR) oraz/lub zgoda (w zależności od narzędzia i cookies)

5) **Marketing (jeśli stosowany)**
- podstawa: zgoda (cookies) dla działań online; uzasadniony interes dla kontaktu B2B bez cookies.

---

## 5. Odbiorcy danych i podwykonawcy (Subprocessors)

Możemy udostępniać dane podmiotom, które wspierają nas w dostarczaniu usługi (np. hosting, CDN, płatności, narzędzia analityczne, obsługa zgłoszeń).

### 5.1 Kategorie odbiorców
- Hosting/Cloud/CDN: Google Cloud Platform (region EU)
- Płatności i fakturowanie: Stripe
- Obsługa zgłoszeń / support: PapaData (email support@papadata.pl)
- Analityka / error tracking: Sentry, Google Analytics 4 (jeśli włączone)
- Dostawcy AI (jeśli włączone): Google Vertex AI

> W przypadku przetwarzania jako Procesor (integracje Klienta) lista podwykonawców i zasady powierzenia powinny być spójne z DPA.

### 5.2 AI (bez “marketingowych obietnic”)
Jeżeli funkcje AI są włączone, możemy korzystać z zewnętrznych dostawców AI.
Zakres danych przekazywanych do AI oraz zasady ich przetwarzania zależą od konfiguracji produktu, umów oraz wybranego dostawcy.
Szczegóły transparentności AI: `ai-disclaimer.md`.

---

## 6. Transfery danych poza EOG
Domyślnie przetwarzanie odbywa się w EOG (GCP europe-central2). Transfery poza EOG mogą wystąpić wyłącznie w przypadku narzędzi marketingowych (np. Meta Pixel) lub dostawców, którzy przetwarzają dane globalnie — wtedy stosujemy SCC i dodatkowe zabezpieczenia.

Jeśli transfery poza Europejski Obszar Gospodarczy występują, zapewniamy odpowiednie zabezpieczenia prawne (np. standardowe klauzule umowne SCC) oraz dodatkowe środki, jeżeli są wymagane.

---

## 7. Retencja (jak długo przechowujemy dane)

Przechowujemy dane przez okres niezbędny do realizacji celów, a następnie je usuwamy lub anonimizujemy, o ile przepisy nie wymagają dłuższego przechowywania.

### 7.1 Retencja — kategorie
- Dane konta i organizacji: 24 miesiące od zakończenia umowy
- Dane rozliczeniowe/faktury: 5 lat (wymogi księgowe)
- Logi techniczne i bezpieczeństwa: 30 dni
- Telemetria/analityka: 13 miesięcy
- Dane z integracji (jako Procesor): zgodnie z DPA; usunięcie do 30 dni od zakończenia usługi

### 7.2 Backupy
Dane mogą znajdować się w kopiach zapasowych przez okres wynikający z retencji backupów. Backupy nie są wykorzystywane do bieżącego przetwarzania, a po odtworzeniu danych mogą zostać ponownie zastosowane operacje usunięcia zgodnie z procedurami.

---

## 8. Prawa osób, których dane dotyczą (GDPR)

Osobie, której dane dotyczą, przysługują m.in. prawa:
- dostępu do danych,
- sprostowania,
- usunięcia,
- ograniczenia przetwarzania,
- przenoszenia danych,
- sprzeciwu wobec przetwarzania opartego o uzasadniony interes,
- cofnięcia zgody (jeśli przetwarzanie odbywa się na podstawie zgody).

### 8.1 Jak zrealizować prawa
Aby złożyć wniosek: **privacy@papadata.pl**.
Weryfikacja tożsamości: potwierdzenie adresu e‑mail powiązanego z kontem oraz identyfikatora tenant/workspace.

### 8.2 Gdy działamy jako Procesor (dane z integracji Klienta)
Jeżeli dane pochodzą z integracji Klienta (np. dane klientów sklepu), wniosek należy skierować do Klienta jako Administratora danych.
Na żądanie Klienta wspieramy realizację praw zgodnie z DPA.

---

## 9. Bezpieczeństwo danych

Stosujemy środki techniczne i organizacyjne adekwatne do ryzyka, w tym (przykładowo):
- szyfrowanie transmisji (TLS),
- kontrola dostępu (zasada najmniejszych uprawnień),
- separacja środowisk (np. staging/prod),
- monitoring i reagowanie na incydenty.

Szczegóły operacyjne (wewnętrzne): `../compliance/privacy-and-data.md`.

---

## 10. Cookies i podobne technologie

W serwisie mogą być wykorzystywane pliki cookies i podobne technologie:
- niezbędne (działanie serwisu),
- analityczne,
- marketingowe (jeśli dotyczy).

Użytkownik może zarządzać zgodami (akceptuj/odrzuć/ustawienia) w banerze/panelu cookies oraz w dowolnym momencie w ustawieniach cookies (link „Ustawienia cookies” w stopce).

Szczegóły: `cookies-policy.md`.

---

## 11. Skarga do organu nadzorczego
Jeśli uważasz, że przetwarzanie narusza przepisy, masz prawo złożyć skargę do właściwego organu nadzorczego ds. ochrony danych (w Polsce: Prezes UODO).

---

## 12. Zmiany polityki
Możemy aktualizować tę politykę, aby odzwierciedlała zmiany w usłudze lub przepisach.
Istotne zmiany komunikujemy e‑mailem do właściciela konta oraz w changelogu.
