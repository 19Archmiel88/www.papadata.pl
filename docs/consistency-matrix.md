# Consistency Matrix (docs <-> code <-> flow)

Status legend:
- aligned: doc matches code and flow
- mismatch: doc and code diverge
- partial: doc exists but misses key behavior
- missing: no doc or code

Last updated: 2026-01-24

## Landing (public site)

Docs (detail):
- `docs/ui-spec/screens/landing.md`
- `docs/ui-spec/sections/landing-*.md`
- `docs/ui-spec/modals/*.md`
- `docs/ui-spec/components/*.md`

Docs (high-level):
- `dokumentacjaProdukcyjna/docs/ux/ui-specs/WYGLAD.md`

Code:
- `apps/web/LandingPage.tsx`
- `apps/web/MainLayout.tsx`
- `apps/web/components/Backgrounds.tsx`
- `apps/web/components/LandingChatWidget.tsx`
- `apps/web/components/*Section.tsx`
- `apps/web/components/*Modal.tsx`
- `apps/web/App.tsx` (landing routes)

Flow/UX:
- Hero CTA -> auth modal
- Pricing CTA -> auth (starter/pro) or mailto (enterprise)
- Promo timer after cookie resolution -> PromoModal -> teaser CTA -> auth
- Chat dock -> auth start trial
- VertexPlayer CTA -> /dashboard?mode=demo&scene=...
- Integrations -> IntegrationsModal / IntegrationConnectModal

Status: aligned
Known mismatches (tracked in DEV_PLAN):
- None (landing spec odzwierciedla aktualny kod; FinalCtaSection oznaczony jako nieuzywany).

Owner: TBD

## Dashboard (app)

Docs (detail):
- `docs/ui-spec/screens/dashboard-*.md`
- `docs/ui-spec/01_NAVIGATION.md`
- `docs/ui-spec/components/dashboard-primitives.md`

Docs (high-level):
- `dokumentacjaProdukcyjna/docs/ux/ui-specs/DASHBOARD.md`

Code:
- `apps/web/App.tsx` (routes)
- `apps/web/components/dashboard/*`
- `apps/web/components/PapaAI.tsx`
- `apps/web/components/OfflineBanner.tsx`
- `apps/web/components/ErrorBoundary.tsx`
- `apps/web/hooks/useIntegrations.ts`
- `apps/web/data/*.ts` (API client)

Flow/UX:
- app mode from `/api/health` (not query param)
- billing summary + entitlements drive trial/read-only paywall
- integrations status polling + local demo state
- PapaAI drawer + context filters

Status: aligned
Known mismatches (tracked in DEV_PLAN):
- None (dashboard specs aligned with current code).

Owner: TBD

## Backend/API + contracts

Docs:
- `docs/audits/api-inventory.md`
- `docs/runbooks/local-verify.md`
- `dokumentacjaProdukcyjna/docs/engineering/architecture.md`
- `dokumentacjaProdukcyjna/docs/engineering/data-model.md`
- `dokumentacjaProdukcyjna/docs/engineering/ai-integration.md`
- `dokumentacjaProdukcyjna/docs/engineering/INTEGRACJE.md`

Code:
- `apps/api/src/app.controller.ts` (health, public company)
- `apps/api/src/modules/*` (auth, ai, billing, dashboard, integrations, settings, tenants, support, exports, admin)
- `libs/shared/src/contracts/*.ts`
- `libs/shared/src/sdk/*`
- `apps/web/data/*.ts` (client usage)

Flow/UX:
- API prefix `/api` set in `apps/api/src/main.ts`
- AI endpoint supports JSON + SSE (`/api/ai/chat?stream=1`)
- Health used for mode + readiness in dashboard

Status: partial
Notes:
- Inventory doc exists but does not yet map every endpoint -> contract -> UI usage.
- Full endpoint-by-endpoint mapping still required for STG/PROD readiness.

Owner: TBD

## Legal + compliance

Docs:
- `dokumentacjaProdukcyjna/docs/legal/*`
- `docs/ui-spec/screens/legal-*.md`
- `dokumentacjaProdukcyjna/docs/compliance/*`
- `dokumentacjaProdukcyjna/SECURITY.md`

Code:
- `apps/web/App.tsx` (LegalRoute)
- `apps/web/components/LegalDocPage.tsx`
- `apps/web/config.ts` (legal docs base URL)
- `apps/web/public/legal/*` (static fallback docs)

Flow/UX:
- Routes under `/legal/*` fetch docs from base URL or `/legal/*.md`.
- Fallback content shown when fetch fails.

Status: aligned
Notes:
- `apps/web/public/legal/*` now provides fallback docs, including `privacy-and-data.md` for subprocessors.

Owner: TBD

## Config + env

Docs:
- `docs/runbooks/local-verify.md`
- `docs/runbooks/local-to-stg-checklist.md`
- `dokumentacjaProdukcyjna/docs/engineering/setup.md`
- `dokumentacjaProdukcyjna/README.md`
- `apps/api/.env.example`
- `apps/web/.env.example`

Code:
- `apps/api/src/common/config.ts`
- `apps/api/src/main.ts` (env load/reset)
- `apps/web/config.ts`
- `apps/web/env.d.ts`
- `apps/web/vite.config.ts`
- `tools/run-web-smoke.mjs`
- `tools/runtime-smoke.mjs`

Flow/ops:
- `.env.local` loaded for API; Vite uses `.env.local` for WEB.
- API listens on `PORT` (default 4000); web dev on 3000.

Status: aligned
Known mismatches (tracked in DEV_PLAN):
- None (env docs, examples and config match).

Owner: TBD

## Observability

Docs:
- `dokumentacjaProdukcyjna/docs/engineering/observability.md`
- `dokumentacjaProdukcyjna/docs/operations/sla.md`

Code:
- `apps/api/src/common/observability.provider.ts`
- `apps/api/src/common/observability.ts`
- `apps/web/utils/observability.provider.ts`
- `apps/web/utils/observability.ts`
- `apps/web/utils/telemetry.ts`

Flow/ops:
- API and WEB support optional Sentry; default is "none".
- Telemetry context set from web runtime mode.

Status: partial
Notes:
- Needs full mapping of what is logged/metriced vs documented SLO/SLA.

Owner: TBD

## Tooling + CI/CD

Docs:
- `docs/runbooks/local-verify.md`
- `docs/runbooks/local-to-stg-checklist.md`
- `docs/runbooks/stg-verify.md`
- `docs/runbooks/stg-release-api.md`
- `dokumentacjaProdukcyjna/docs/engineering/deploy.md`
- `dokumentacjaProdukcyjna/GCP.md`

Code:
- `package.json` (root scripts)
- `tools/*`
- `apps/api/scripts/*`
- `apps/web/playwright.config.ts`
- `apps/web/scripts/*`

Flow/ops:
- Local verify: build -> lint -> tests -> smoke -> runtime.
- STG/PROD: documented, but Cloud Build configs are not present in repo.

Status: aligned
Notes:
- `cloudbuild/stg.yaml` i `cloudbuild/prod.yaml` pokrywają opisany flow CI/CD.

Owner: TBD
