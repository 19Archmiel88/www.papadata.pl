# PapaData Intelligence — Gemini Project Instructions

## Project type
- Vite SPA, React, TypeScript
- Demo/POC: mock data, no real OAuth/API, no persistence
- Goal: landing + dashboard demo + AI drawer (Gemini)

## Source of truth (docs)
Always follow these documents (in order):
1) docs/product/vision.md
2) docs/ux/information-architecture.md
3) docs/engineering/architecture.md
4) docs/engineering/ai-integration.md
5) docs/compliance/compliance-overview.md
6) docs/legal/* (templates, links in app)

## Hard rules
1) Documentation is a contract. If something is missing: state assumptions and propose minimal safe defaults.
2) Generate production-grade code: consistent structure, a11y basics, predictable state handling.
3) Never mix concerns: UX → Engineering → Compliance.
4) When writing code files: output full file content (no snippets).
5) No marketing fluff. Clear technical language.
6) No secrets in repo. Use .env.local for GEMINI_API_KEY.
7) Every view must support: loading / empty / error (at least skeleton + placeholder for demo).

## Required features (MVP demo)
- Landing with: Hero + Vertex Player (AI Chat / Data Pipeline / Exec View), Pipeline, Integrations catalog, ROI calculator, Pricing, FAQ, Footer (legal links)
- Dashboard demo with: Overview, Analytics, Reports, Integrations, Settings, Support
- AI Assistant Drawer: streaming, cancel, safety messages, token budgeting strategy (basic)

## Non-goals now
- real ingestion/BigQuery connectors
- real auth/RBAC (only UI placeholders)
- full legal content in-app (use docs/legal templates + links)

## Output discipline
Work in steps:
1) propose a plan + file tree + acceptance criteria
2) implement in small batches
3) self-review against acceptance criteria after each batch
