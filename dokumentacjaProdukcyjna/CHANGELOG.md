# Changelog

Wszystkie istotne zmiany w projekcie dokumentujemy w tym pliku.

Standard: **Keep a Changelog** + **SemVer** (w miarę rozwoju).  
Status repo: **demo/POC**.

## Jak aktualizować
- Każdy PR, który zmienia zachowanie UI/UX, integracje, AI lub dokumenty prawne/compliance powinien dodać wpis do **[Unreleased]**.
- Przy wydaniu wersji:
  1) przenieś wpisy z **[Unreleased]** do nowej wersji (np. `0.2.0`)  
  2) ustaw datę w formacie `YYYY-MM-DD`  
  3) wyczyść sekcję **[Unreleased]** (zostaw nagłówki)

---

## [Unreleased]
### Added
- API inventory + response safety audits (docs/audits)
- Runbooks: local verify, STG verify, STG release API
- Backend stubs: company lookup, tenant status, integrations OAuth, billing status/checkout, export download
- Tests: API e2e (AI JSON + SSE), web unit (api client), Playwright smoke

### Changed
- SSE /api/ai/chat: heartbeat + headers for streaming reliability
- Web api client base path fix for P&L

### Deprecated
- None

### Removed
- None

### Fixed
- Playwright smoke selectors for kontakt + API readiness polling

### Security
- SSE buffering disabled (X-Accel-Buffering: no)

## [0.1.0] - 2026-01-12
### Added
- Inicjalny scaffold Vite React TS
- Dokumentacja produktu/UX/engineering/compliance/legal (szablony)
