# Product — Roadmap

Roadmapa dotyczy przejścia z demo/POC do wersji produkcyjnej.

## 0) Demo/POC (obecnie)
- Landing + dashboard demo
- Mock dane
- AI drawer scaffold
- i18n PL/EN
- Legal/compliance templates

## 1) MVP (pierwsze wdrożenie)
- Minimalny backend:
  - persystencja użytkownika i ustawień
  - przechowywanie konfiguracji integracji
- Auth:
  - e-mail/password lub SSO (w zależności od segmentu)
- Integracje “read-only” (pierwsze 1–2 źródła):
  - np. GA4 + Meta Ads (lub Shopify)
- Eksport danych (Data Act) dla admina
- Obsługa pełnych stanów empty/error/offline w całym UI

## 2) Growth
- RBAC (role: owner/admin/analyst/viewer)
- Audyt logów i zdarzeń (minimalna observability)
- Wersjonowanie raportów i harmonogramy
- Rozszerzenie integracji

## 3) Enterprise
- SSO (SAML/OIDC)
- SLA + procedury incident response
- Polityki retencji i backupy
- Uzgodnienia prawne (DPA, subprocessor list)
- Hardening bezpieczeństwa (CSP, org policies)

## Ryzyka/Dependencies
- Zmiany regulacyjne (AI Act/DSA/Data Act interpretacje)
- Dostępność konektorów i koszty API
- Jakość danych i modelowanie (BigQuery)
