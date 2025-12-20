# PapaData Intelligence — Vision

## Cel produktu

PapaData Intelligence to demo/POC platformy analitycznej nowej generacji dla e-commerce, która:
- scala rozproszone dane (sklep, reklamy, analityka) w jeden spójny obraz,
- pokazuje wyniki w dashboardzie (KPI, wykresy, raporty),
- wspiera analizę przez kontekstowego asystenta AI (Gemini/Vertex).

Projekt w repo to **Vite SPA (React + TypeScript)** z **mockami**. Celem jest dostarczenie kompletnego demo UX/IA + architektury frontendu i warstwy AI, bez backendu produkcyjnego.

## Zakres funkcjonalny (Demo)

### Landing page (marketing + demo UX)
Landing prezentuje możliwości platformy poprzez:
- hero z “Vertex Player” (symulacja AI Chat / Data Pipeline / Exec View),
- przegląd funkcji,
- wizualizację pipeline’u danych,
- katalog integracji (statusy live/beta/soon),
- ROI calculator,
- pricing + trial/demo flow,
- sekcje zaufania i bezpieczeństwa,
- FAQ, final CTA i stopkę z linkami prawnymi.

### Dashboard (widok demo)
Dashboard działa jako “produkt” w trybie demo:
- layout: sidebar + topbar,
- widoki: Overview, Analytics, Reports, Customers, Products, Integrations, Support, Settings,
- mocki i walidacje formularzy (bez persystencji),
- AI Assistant Drawer (UI + integracja strumieniowania, cancel, safety handling).

## Status i ograniczenia

- Status: Demo/POC
- Brak persystencji: odświeżenie strony resetuje stan
- Brak realnych integracji i ingestion: integracje to UI + stan lokalny
- Brak auth/RBAC w MVP: tylko placeholdery i przyszła roadmapa
- AI działa wyłącznie po podaniu klucza (np. `GEMINI_API_KEY` w `.env.local`); bez klucza UI ma tryb “AI unavailable”

## Kryteria jakości (Demo)
- Spójna architektura projektu (routing, layouty, komponenty, mocki)
- Dostępność (minimum WCAG: focus, aria, klawiatura)
- Jasne stany UI: loading / empty / error / offline
- Brak “hard-coded” tekstów w komponentach (wszystko przez i18n)
