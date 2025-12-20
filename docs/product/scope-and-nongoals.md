# Product — Scope & Non-goals

## Zakres (Scope) — Demo/POC
Ten projekt implementuje demo UX + frontendową architekturę dla PapaData Intelligence.

### W scope
- Landing page z sekcjami opisanymi w `ux/information-architecture.md`
- Dashboard demo:
  - routing `/dashboard/*`
  - strony: Overview, Analytics, Reports, Customers, Products, Integrations, Support, Settings
  - mock dane (`MOCK_*`, generator)
  - stany UI: loading/empty/error/offline
- AI Assistant Drawer:
  - UI, streaming (docelowo), cancel, safety/blocked, “no key”
  - brak renderowania HTML z odpowiedzi
  - oznaczenia “Odpowiedzi generowane przez AI”
- i18n PL/EN:
  - pełne pokrycie tekstów UI
  - brak hard-coded strings
- Dark/Light theme przez tokeny w `theme.css`
- Strony prawne (template):
  - ToS/Privacy/Cookies/DPA/AI disclaimer/Accessibility statement
- Cookie banner + panel ustawień cookies (MVP)

## Poza zakresem (Non-goals) — na teraz
- Realny ingestion danych i konektory (Shopify/GA4/Meta/BigQuery)
- Backend i persystencja (DB)
- OAuth / logowanie produkcyjne
- RBAC/SSO (poza placeholderami UI)
- Audyty zgodności prawnej jako porada prawna (tu tylko checklisty i szablony)
- Pełna observability produkcyjna (tracing/metrics) — w demo tylko podstawy

## Definicja “done” dla demo
- Aplikacja uruchamia się i nawigacja działa bez błędów
- Landing ma wszystkie sekcje (nawet jako placeholdery) + spójny styl
- Dashboard ma wszystkie widoki (minimum placeholdery) + stany UI
- AI drawer działa w trybie demo i poprawnie komunikuje brak klucza / safety / error
- Linki prawne działają, cookie banner jest widoczny i sterowalny
