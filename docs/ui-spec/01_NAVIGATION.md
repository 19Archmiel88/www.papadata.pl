# Navigation

## Routes (React Router)
Źródło: [apps/web/App.tsx](apps/web/App.tsx)

### Landing
- / → LandingPage
- /features → LandingPage (scroll do #features)
- /pricing → LandingPage (scroll do #pricing)
- /integrations → LandingPage (scroll do #integrations)
- /faq → LandingPage (scroll do #faq)

### Legal
- /legal/terms → LegalDocPage (terms-of-service.md)
- /legal/privacy → LegalDocPage (privacy-policy.md)
- /legal/cookies → LegalDocPage (cookies-policy.md)
- /legal/dpa → LegalDocPage (dpa.md)
- /legal/subprocessors → LegalDocPage (privacy-and-data.md)
- /legal/ai → LegalDocPage (ai-disclaimer.md)
- /legal/accessibility → LegalDocPage (accessibility-statement.md)

### Dashboard (nested under /dashboard)
- /dashboard → redirect do /dashboard/overview
- /dashboard/overview
- /dashboard/ads
- /dashboard/growth
- /dashboard/pandl
- /dashboard/reports
- /dashboard/customers
- /dashboard/products
- /dashboard/pipeline
- /dashboard/guardian
- /dashboard/alerts
- /dashboard/integrations
- /dashboard/knowledge
- /dashboard/settings → redirect do /dashboard/settings/workspace
- /dashboard/settings/workspace
- /dashboard/settings/org

### Fallback
- * → redirect do /

## In-page anchors
Źródło: [apps/web/MainLayout.tsx](apps/web/MainLayout.tsx), [apps/web/LandingPage.tsx](apps/web/LandingPage.tsx)

- #features
- #pricing
- #integrations
- #faq
- #security
- #roi

## Primary navigation actions
- Header nav i footer links → scroll do sekcji lub route’y legal.
- CTA „DEMO” (header) → /dashboard?mode=demo
- CTA „Zaloguj” → modal auth (login)

Reguły query params:
- `mode=demo` aktywuje DEMO UI (mockowane write-actions).
- `plan` może sterować pre-selekcją planu w DEMO.

## Redirect rules
- /dashboard → /dashboard/overview
- /dashboard/settings → /dashboard/settings/workspace
- unknown route → /

Nawigacja z footeru:
- `cookie_settings` → event `open-cookie-settings`.
