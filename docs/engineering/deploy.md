# Engineering — Deploy

## Build
```bash
npm run build
Wynik: dist/ (statyczne pliki).

Hosting

Statyczny hosting + CDN

Wymagane SPA rewrite:

wszystkie ścieżki aplikacji (np. /dashboard/...) powinny serwować index.html

Cache

assets hashed (vite) -> długi cache

index.html -> krótki cache / no-cache

Bezpieczeństwo (production)

HTTPS

rozważ CSP i podstawowe nagłówki bezpieczeństwa

Rollback

przechowuj wersje artefaktów (dist) lub użyj platformy z wersjonowaniem release

---

## `docs/compliance/compliance-overview.md`

```md
# Compliance — Overview

Ten dokument opisuje wymagania prawne i operacyjne dla SaaS w kontekście demo/POC. Nie stanowi porady prawnej — to lista wymagań do wdrożenia.

## Prywatność / GDPR
- Rozdzielone zgody:
  - ToS/DPA (wymagane)
  - Privacy policy (wymagane)
  - Marketing (opcjonalne, domyślnie odznaczone)
- Możliwość wycofania zgody cookies
- Minimalizacja danych

## AI compliance
- Oznaczenie: “Odpowiedzi generowane przez AI”
- Obsługa SAFETY (blokada odpowiedzi) z czytelnym komunikatem
- Zakaz omijania filtrów (AUP)

## Wymogi prawne 2025+
- Data Act (12.09.2025): interoperacyjność/migracja + eksport danych (CSV/JSON)
- European Accessibility Act (28.06.2025): WCAG 2.1 AA + deklaracja dostępności
- Omnibus: weryfikacja opinii + najniższa cena z 30 dni przy promocjach
- DSA: punkt kontaktowy do zgłoszeń treści nielegalnych
- KSeF (2026): gotowość do e-faktur (informacja w ToS)

## Checklist “zero risk” (MVP)
- Data Act: ToS + przycisk eksportu danych w UI (admin)
- Accessibility: focus/klawiatura/kontrast + link do deklaracji dostępności
- Omnibus: adnotacja w social proof + reguły cen promocyjnych
- AI: label + safety komunikaty + zakaz PII
- DSA: kontakt legal@[PLACEHOLDER]
