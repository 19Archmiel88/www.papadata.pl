# UX — Content & i18n (PL/EN)

## Hard rule

Wszystkie teksty UI muszą pochodzić z i18n (zero hard-coded stringów w komponentach).

## Języki

- PL (domyślny)
- EN

## Struktura kluczy (zalecana)

- `common.*`
- `nav.*`
- `landing.*`
  - `landing.hero.*`
  - `landing.player.*`
  - `landing.features.*`
  - `landing.pipeline.*`
  - `landing.integrations.*`
  - `landing.socialProof.*`
  - `landing.roi.*`
  - `landing.security.*`
  - `landing.pricing.*`
  - `landing.faq.*`
  - `landing.finalCta.*`
  - `landing.footer.*`
- `dashboard.*`
  - `dashboard.sidebar.*`
  - `dashboard.topbar.*`
  - `dashboard.overview.*`
  - `dashboard.analytics.*`
  - `dashboard.reports.*`
  - `dashboard.integrations.*`
  - `dashboard.support.*`
  - `dashboard.settings.*`
  - `dashboard.ai.*`
- `legal.*`
- `states.*` (loading/empty/error/offline/noAccess)

## Teksty PL/EN wg sekcji

Poniżej lista treści do implementacji w `src/i18n/pl.ts` i `src/i18n/en.ts`. (Możesz je przenieść 1:1 do słownika.)

### Nawigacja / Header

- Label sekcji: PL "Funkcje", EN "Features".
- Pozycje funkcji:
  - "Papa Guardian" (PL "Twój osobisty analityk AI pracujący 24/7.", EN "Your personal AI analyst on call 24/7.")
  - "Rekomendacje wzrostu" / "Growth recommendations"
  - "Wyniki kampanii" / "Campaign performance"
  - "Raporty miesięczne" / "Monthly reports"
  - "Produkty" / "Products"
  - "Ścieżka konwersji" / "Conversion path"
- Mega-menu:
  - "Dokumentacja API" / "API Docs"
  - "Changelog" / "Changelog"
  - "Status systemu: Operacyjny" / "System status: Operational"
- CTA:
  - "Cennik" / "Pricing"
  - "Integracje" / "Integrations"
  - "Baza wiedzy" / "Knowledge Base"
  - "O nas" / "About"
  - "Zaloguj się" / "Log in"
  - "Zobacz Demo" / "See Demo"
- Modal szczegółu funkcji:
  - "Podgląd na żywo" / "Live preview"
  - "Kluczowa korzyść" / "Key benefit"
  - "Wydajność" / "Performance"
  - "Zamknij" / "Close"
  - "Wypróbuj w Demo" / "Try in Demo"

### Hero

- Tytuł:
  - PL "[AI], która nie tylko analizuje, ale [rekomenduje]. Zobacz, skąd naprawdę pochodzi Twój [zysk]."
  - EN "[AI] that not only analyzes, but [recommends]. See where your [profit] really comes from."
- Podtytuł:
  - PL "Zintegruj sklep, reklamy i analitykę w jednym miejscu. PapaData codziennie dostarcza gotowe raporty."
  - EN "Unify store, ads, and analytics. PapaData wakes up daily with ready reports."
- CTA:
  - "Rozpocznij 14-dniowy trial" / "Start 14-day trial"
  - "Zobacz Demo" / "See Demo"
- Trust marker:
  - "PARTNER GOOGLE CLOUD" / "GOOGLE CLOUD PARTNER"
- Pills:
  - PL "Bez karty kredytowej", "14 dni za darmo"
  - EN "No credit card", "14 days free"

### Vertex Player (Hero)

- Badge: PL "SYMULACJA NA ŻYWO", EN "LIVE SIMULATION".
- Taby:
  - PL: "PAPA CHAT", "DATA PIPELINE", "WIDOK ZARZĄDU"
  - EN: "PAPA CHAT", "DATA PIPELINE", "EXEC VIEW"
- Tekst domyślny pola czatu:
  - PL "Zapytaj o swoje kampanie..."
  - EN "Ask about your campaigns..."
- Scenariusz pytania:
  - PL "Dlaczego spadł ROAS?"
  - EN "Why did ROAS drop?"
- Status:
  - PL "Analizuję dane z ostatnich kampanii..."
  - EN "Analyzing last campaigns..."
- Chips:
  - PL "Dlaczego spadł ROAS?", "Pokaż rosnące produkty", "Cashflow 30 dni"
  - EN analogicznie
- Pipeline statusy (symulacja):
  - PL "Połączenie z Shopify (OK)", "Połączenie z Meta Ads (OK)", "Pobieranie zamówień (90 dni)...", "Łączenie zdarzeń GA4 z zamówieniami...", "Przygotowywanie fact_orders..."
  - EN odpowiednio
- Exec KPI:
  - PL "Przychód (30d) 524 tys. zł", "Marża netto 19.2%", "CAC vs LTV 1:4.2"
  - EN "Revenue (30d) 524k PLN", "Net margin 19.2%", "CAC vs LTV 1:4.2"
- Briefing: PL/EN o wzroście przychodu/marży/spadku CAC

### Features

- Badge: PL "Możliwości systemu", EN "Platform capabilities".
- Tytuł:
  - PL "Możliwości platformy"
  - EN "Enterprise-grade tech for your e-commerce."
- Podtytuł:
  - PL "Technologia klasy Enterprise dla e-commerce."
  - EN "From ingestion to recommendations in minutes."
- Karty:
  - "Centralizacja danych" / "Data centralization"
  - "Papa Guardian" / "Papa Guardian"
  - "Real-time KPI" / "Real-time KPI"
  - "Bezpieczeństwo" / "Security"
  - "Szybkie wdrożenie" / "Fast onboarding"
  - - opisy PL/EN

### Pipeline

- Badge: PL "Architektura danych", EN "Data architecture".
- Step label: PL "Krok", EN "Step".
- Tytuł:
  - PL "Infrastruktura danych bez zespołu inżynierów."
  - EN "Your own data stack. No engineers needed."
- Kroki:
  - "Źródła danych" / "Data sources"
  - "PapaData Pipeline" / "PapaData Pipeline"
  - "Twój BigQuery" / "Your BigQuery"
  - "Papa AI Agent" / "Papa AI Agent"

### Integrations

- Tytuł: PL "Integracje", EN "Integrations".
- Podtytuł:
  - PL "Połącz PapaData ze swoim stosem."
  - EN "Connect PapaData with your stack."
- Kategorie:
  - PL "Wszystkie, E-commerce, Bazy Danych, Marketing, Komunikacja"
  - EN "All, E-commerce, Databases, Marketing, Communication"
- Pozycje (statusy):
  - BigQuery, Google Ads, Meta Ads, GA4, Shopify, WooCommerce, Magento, BaseLinker
  - PL statusy: "Aktywna" / "Beta" / "Wkrótce"
  - EN statusy: "Live" / "Beta" / "Soon"
- Modal katalogu:
  - sidebar: "Ekosystem" / "Ecosystem"
  - CTA: "Zgłoś integrację" / "Request integration"
  - opis: PL/EN “Connect your data in one click…”

### Social Proof

- Badge: PL "Opinie klientów", EN "Customer voices".
- Tytuł: PL "Zaufali liderzy", EN "Trusted by leaders".
- Badge kart:
  - PL "Zweryfikowany klient"
  - EN "Verified customer"
- Cytaty (PL/EN):
  - PL "PapaData skróciła czas raportowania o 90%."
  - PL "Papa Guardian znajduje anomalie zanim staną się kosztowne."
  - PL "Najlepszy zwrot z inwestycji w analytics."
  - EN odpowiedniki
- Omnibus adnotacja: PL/EN “Opinie są zweryfikowane…”

### ROI Calculator

- Tytuł: PL "Kalkulator ROI", EN "ROI calculator".
- Opis: PL/EN “Compare spreadsheet analysis with PapaData.”
- Slidery:
  - PL "Liczba analityków", "Godziny raportowania (tygodniowo)", "Stawka godzinowa (PLN)"
  - EN "Number of analysts", "Reporting hours (weekly)", "Hourly rate (PLN/USD)"
- Wyniki:
  - PL "Roczny koszt (tradycyjny)", "Roczny koszt (PapaData)", "Twoje oszczędności"
  - EN odpowiedniki
- Label: PL "Silnik Symulacji v2.4", EN "Simulation Engine v2.4"

### Security

- Badge: PL "Bezpieczeństwo", EN "Security".
- Tytuł:
  - PL "Twoje dane są bezpieczne — standardy bankowe i RODO"
  - EN "Your data is safe — bank-grade security & GDPR"
- Pozycje (PL/EN):
  - Szyfrowanie end-to-end
  - Kontrola dostępu (RBAC/SSO)
  - Kopie zapasowe
  - Zgodność RODO/GDPR
  - Usuwanie danych
  - Monitoring 24/7

### Pricing

- Tytuł:
  - PL "Prosty cennik dla zespołów data-driven"
  - EN "Simple pricing for data-driven teams"
- Banner:
  - PL "15% rabatu przy rozliczeniu rocznym"
  - EN "15% off with annual billing"
- Toggle:
  - "Miesięcznie" / "Monthly"
  - "Rocznie" / "Yearly"
  - "Oszczędzasz" / "You save"
- Tiers:
  - Starter: 159/199 PLN
  - Professional: 399/499 PLN
  - Enterprise: custom
- Modal Enterprise (PL/EN):
  - pola: Full Name, Work Email, Requirements
  - CTA: Send Request
  - info: response time 2h
- Omnibus: jeśli promo -> “najniższa cena z 30 dni”

### FAQ

- Tytuł: PL "Częste pytania", EN "Frequently asked questions".
- Pytania/odpowiedzi: potrzeba programisty, trial, rezygnacja, integracje, bezpieczeństwo (PL/EN)

### Final CTA

- Tytuł: PL "Gotowy na rewolucję?", EN "Ready for a change?"
- Podtytuł: PL/EN
- Przyciski: Trial / Demo

### Chat (widget i kontekst)

- Tytuł: PL "Papa AI", EN "Papa AI"
- Tekst domyślny: PL "Zapytaj o wyniki sprzedaży...", EN "Ask about sales performance..."
- Welcome: PL "Cześć! W czym mogę pomóc?", EN "Hi! How can I help?"
- Błąd: PL/EN “AI unavailable”
- Label: “Odpowiedzi generowane przez AI” (AI Act)
- SAFETY: komunikat “Odpowiedź zablokowana…”

### Footer

- Opis: PL/EN
- Kolumny: Product / Company / Resources
- Dolne linki: Terms / Privacy / Cookies / DPA / AI Disclaimer / Accessibility
- Tagline: PL/EN “Powered by Google Cloud”
- Status: PL/EN “System operational”
- Modal kontaktu: pola PL/EN “Imię i nazwisko / Full name”, “E‑mail / Email”, “Wiadomość / Message”, kontakt: support@papadata.pl

### Dashboard

- Sidebar: PL/EN nazwy widoków
- Badge: demo mode
- Alert demo: PL/EN
- KPI labels: PL/EN
- Wykresy: PL/EN
- Insights: PL/EN
- Tabele: nagłówki PL/EN
- Settings tabs: PL/EN + pola
- Assistant drawer: PL/EN
