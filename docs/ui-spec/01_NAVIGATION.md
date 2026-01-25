# Navigation

## Routes (React Router + HashRouter)
Źródła: [apps/web/App.tsx](apps/web/App.tsx), [apps/web/index.tsx](apps/web/index.tsx)

Uwaga: routing działa przez `HashRouter`, więc URL-e mają postać `/#/route`
(np. `/#/dashboard/overview`). `ensureHashRouterPath` przekierowuje `/foo` -> `/#/foo`.

### Landing
- / → LandingPage
- /features → LandingPage (scroll do #features)
- /pricing → LandingPage (scroll do #pricing)
- /integrations → LandingPage (scroll do #integrations)
- /faq → LandingPage (scroll do #faq)
- /security → LandingPage (scroll do #security)

### Legal
- /legal/terms → LegalDocPage (terms-of-service.md)
- /legal/privacy → LegalDocPage (privacy-policy.md)
- /legal/cookies → LegalDocPage (cookies-policy.md)
- /legal/dpa → LegalDocPage (dpa.md)
- /legal/subprocessors → LegalDocPage (privacy-and-data.md)
- /legal/ai → LegalDocPage (ai-disclaimer.md)
- /legal/accessibility → LegalDocPage (accessibility-statement.md)

### Billing callbacks
- /billing/success → CheckoutSuccess
- /billing/cancel → CheckoutCancel

### App alias
- /app → redirect do /dashboard/overview
- /app/:view → redirect do /dashboard/:view
- /app/integrations/callback/:provider → IntegrationCallback

### Health
- /health → JSON health response

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
- CTA „DEMO” (header) → /dashboard?mode=demo (parametr używany w telemetry, nie przełącza UI)
- CTA „Zaloguj” → modal auth (login)

Reguły query params:
- `mode` używany tylko w telemetry (useApi); UI tryb DEMO zależy od `/api/health`.
- `plan` nie jest obsługiwany przez UI.

## Redirect rules
- /dashboard → /dashboard/overview
- /dashboard/settings → /dashboard/settings/workspace
- /app → /dashboard/overview
- /app/:view → /dashboard/:view
- unknown route → /

Nawigacja z footeru:
- `cookie_settings` → event `open-cookie-settings`.
