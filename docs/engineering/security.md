# Engineering — Security (MVP)

## Dane wrażliwe i PII
- Nie wprowadzaj do promptów:
  - haseł, kluczy API, tokenów
  - danych szczególnych (RODO)
- W demo: nie loguj danych użytkownika w konsoli

## Klucze i sekrety
- Klucze API tylko w `.env.local` (nie commitować)
- Repo powinno zawierać przykład `.env.example` bez sekretów

## CSP / headers (future)
- Dla hostingu produkcyjnego rozważ:
  - Content-Security-Policy
  - HSTS
  - X-Content-Type-Options
  - Referrer-Policy

## RBAC/SSO (future)
- MVP nie implementuje auth
- W roadmap: role, uprawnienia, SSO
