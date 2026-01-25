# Deklaracja dostępności (WCAG / EAA) — PapaData Intelligence

Niniejsza deklaracja dostępności dotyczy serwisu/aplikacji **PapaData Intelligence**, w tym publicznego trybu **DEMO 1:1** (dashboard dostępny bez logowania).

## 1) Status zgodności
Serwis jest **częściowo zgodny** z wytycznymi **WCAG 2.1 AA**.

## 2) Zakres i standard
- Standard docelowy: **WCAG 2.1 AA** (minimum)
- Zakres: landing, dashboard, UI komponenty (modale/drawer), formularze, nawigacja, treści.

Powiązane: `../compliance/accessibility-eaa.md`

## 3) Udogodnienia dostępności (zakres minimalny)
W ramach dostępności wdrażamy m.in.:
- nawigację klawiaturą,
- widoczny fokus i prawidłowe zarządzanie fokusem (modale/drawer),
- odpowiedni kontrast i czytelność typografii,
- obsługę `prefers-reduced-motion`,
- semantyczne elementy i atrybuty ARIA tam, gdzie to potrzebne.

## 4) Znane ograniczenia
Znane ograniczenia:
- część wykresów posiada tylko skrócone podsumowanie tekstowe; pełna tabela jest dostępna w widokach danych (Overview/Reports),
- komunikaty dynamiczne w niektórych modułach mogą mieć ograniczoną widoczność w czytnikach ekranu.

## 5) Zgłaszanie problemów i kontakt
Jeśli zauważysz problem z dostępnością lub potrzebujesz informacji w alternatywnym formacie, skontaktuj się z nami:

- e-mail: **accessibility@papadata.pl**
- formularz kontaktowy: modal „Kontakt” w stopce aplikacji
- czas odpowiedzi: do 5 dni roboczych

## 6) Procedura rozpatrywania zgłoszeń
1. Zgłoś problem (opis, link do strony, typ przeglądarki/urządzenia, jeśli możliwe — screen).
2. Potwierdzimy przyjęcie zgłoszenia.
3. Zaproponujemy obejście lub plan poprawki (jeśli dotyczy).

## 7) Public DEMO 1:1
Publiczny tryb DEMO jest częścią produktu, dlatego:
- obowiązują w nim te same zasady dostępności co w trybie produkcyjnym (zalogowanym),
- różnice DEMO vs PROD dotyczą wyłącznie danych (mock) i akcji zapisu (symulacje), a nie komponentów UI.

## 8) Przygotowanie deklaracji
- Data sporządzenia: **2026-01-20**
- Metoda przygotowania: samoocena + testy manualne klawiaturą
- Ostatni przegląd: **2026-01-20**

## 9) Organ nadzoru / egzekwowanie (jeśli dotyczy)
Organ nadzoru dla dostępności w Polsce: **PFRON (Państwowy Fundusz Rehabilitacji Osób Niepełnosprawnych)**.
