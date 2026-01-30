# UX — Information Architecture

## Warstwa globalna

- Motywy: dark/light
- Dostępność: WCAG (minimum: focus, klawiatura, aria dla komponentów interaktywnych)
- Responsive: Desktop / Tablet / Mobile
- Globalne elementy:
  - Header (landing) lub Topbar (dashboard)
  - Footer (na wszystkich podstronach, także w dashboard)
  - Stałe linki do dokumentów prawnych (ToS/Privacy/Cookies/DPA/AI Disclaimer/Accessibility)
  - Cookie banner + panel ustawień cookies (Consent Mode v2)

## Landing page (kolejność sekcji)

1. **Header**
   - Logo
   - Mega-menu funkcji (Features)
   - Linki: Pricing (/pricing) / Integrations (/integrations) / Resources (/faq)
   - CTA: Log in / See Demo
   - Toggler języka (PL/EN)
   - Toggler motywu (dark/light)
   - Mobile menu

2. **Hero + Vertex Player**
   - Claim + podtytuł
   - CTA: trial / demo
   - Trust marker (np. “Google Cloud Partner” — demo copy)
   - “Vertex Player” z tabami:
     - AI Chat
     - Data Pipeline
     - Exec View
   - Na mobile: skalowalny player lub fallback statyczny

3. **Features**
   - 6 kart (np. centralizacja, AI guardian, realtime KPI, security, onboarding itd.)
   - Krótkie opisy i ikony

4. **Pipeline**
   - 4 kroki: źródła danych → PapaData Pipeline → BigQuery → Papa AI Agent

5. **Integrations**
   - Filtry kategorii
   - Karty integracji (statusy live/beta/soon)
   - Modal katalogu integracji (3 taby)
   - “Request integration” CTA

6. **Social Proof**
   - 3 karty opinii
   - Badge “Verified customer”
   - Adnotacja Omnibus: “Opinie są zweryfikowane …”

7. **ROI Calculator**
   - Slidery/wejścia: analitycy, godziny/tydzień, stawka godzinowa
   - Wyniki: tradycyjny koszt vs PapaData + oszczędność
   - Disclaimer: wyniki symulacyjne

8. **Security**
   - 6 kafelków Q&A dot. bezpieczeństwa

9. **Pricing**
   - Toggle: miesięcznie/rocznie
   - 3 plany + wyróżnienie planu rekomendowanego
   - Modal Enterprise (formularz zapytania)
   - Omnibus: jeśli promocje -> najniższa cena z 30 dni

10. **FAQ**

- Akordeon

11. **Final CTA**

- Karta gradientowa z podwójnym CTA

12. **Footer**

- Brand/short description + social
- Kolumny: Product / Resources / Company
- Status systemu
- Linki prawne
- Modale treści (opcjonalne w demo)
- Deklaracja dostępności

## Dashboard (demo)

### Wejście

- Z landing: przycisk “See Demo” / “Start Trial” prowadzi do dashboard (w demo: bez auth)

### Layout

- Sidebar + Topbar
- Topbar:
  - badge “Demo mode”
  - zakres dat: preset `1d/7d/30d/90d/mtd/qtd/ytd` + custom
  - przycisk AI Assistant
  - powiadomienia: ikona widoczna, w DEMO bez realnych alertów
  - avatar/menu: “Guest” w DEMO, role i konto w PROD

### Widoki

- **Overview**: KPI + area/pie
- **Analytics**: insight AI + bar/line
- **Reports**: karty pobrania / download
- **Customers / Products**: tabele
- **Integrations**: siatka z toggle Connected/Disconnected (stan lokalny)
- **Support**: tickety + kontakt
- **Settings**: profile/company/notifications/team/billing
- **AI Assistant Drawer**: kontekstowy chat

### Walidacje/mocki

- Dane: `generateData` / `MOCK_*` (tablice statyczne + losowe generowanie)
- Formularze: HTML `required`, sukces symuluje timeout
- AI: createChatSession; bez klucza API brak odpowiedzi i czytelny komunikat

### Braki do uzupełnienia w implementacji

- puste stany (empty)
- error states
- offline states
- kontrola uprawnień (RBAC) — future
