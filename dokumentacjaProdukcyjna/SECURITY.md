# Security Policy

## Zgłaszanie podatności

Jeśli znalazłeś podatność bezpieczeństwa, nie publikuj jej publicznie.

Wyślij zgłoszenie na:

- security@papadata.pl

W tytule maila:

- `[SECURITY] PapaData Intelligence`

Alternatywny kanał: brak — przyjmujemy zgłoszenia wyłącznie przez email.

## Co dołączyć w zgłoszeniu

- Opis problemu i potencjalny wpływ (na poufność / integralność / dostępność)
- Kroki reprodukcji (proof-of-concept) lub opis warunków
- Środowisko (OS/przeglądarka/node)
- Logi/screeny — **bez danych wrażliwych**
- Propozycja naprawy (jeśli masz)

## Czego nie wysyłać

- Kluczy API, tokenów, haseł
- Danych osobowych (PII) lub danych szczególnych (RODO)
- Całych dumpów baz / eksportów danych klienta

## Zakres (In scope)

- Kod i konfiguracja repozytorium
- Mechanizmy integracji AI (prompting/streaming) i obsługa błędów
- Zależności (supply chain)
- Konfiguracje deploymentu, jeśli są częścią repo (np. nagłówki, CSP, rewrites)

## Poza zakresem (Out of scope)

- Problemy „design/UX” bez implikacji bezpieczeństwa
- Zgłoszenia typu „brak funkcji”
- Ataki wymagające fizycznego dostępu do urządzenia użytkownika

## SLA odpowiedzi (target)

- Potwierdzenie otrzymania: do 48h
- Wstępna ocena: do 5 dni roboczych
- Fix: wg priorytetu i złożoności

## Zasady

- Brak kluczy API w repo
- Nie logujemy wrażliwych danych ani promptów zawierających PII
- Jeśli podatność dotyczy AI: opisz, czy problem to np. data leakage, prompt injection, brak safety handling

## Szyfrowanie

Aktualnie nie udostępniamy klucza PGP. Wysyłaj zgłoszenia wyłącznie na adres security@papadata.pl.
