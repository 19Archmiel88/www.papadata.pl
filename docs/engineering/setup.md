# Setup developerski

## Wymagania
- Node.js 18+ (zalecane 20+)
- npm

## Instalacja
```bash
npm install
npm run dev
npm run build
npm run preview

---

# 12) `docs/engineering/architecture.md`

```markdown
# Architektura aplikacji (Demo/POC)

## Warstwy
- UI: komponenty landing/dashboard
- Domain: modele widoków i KPI (demo)
- Data: mocki + generatory danych
- AI: geminiService + sesje + streaming
- i18n/theme: provider + storage

## Routing (SPA)
- Landing jako strona główna
- Dashboard jako osobny route (możliwy lazy-load)

## Dane w demo
- generator danych (np. faker)
- statyczne mocki do tabel i wykresów
- brak persystencji (local state)

## Standard stanu aplikacji
- error boundaries na poziomie widoków
- unified toast/notification
- network/offline handling (jeśli dotyczy)

## Security (frontend)
- nie logować sekretów
- nie wysyłać PII do AI
- sanitize output w UI (renderowanie treści)
