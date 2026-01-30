# Dokumentacja — Index (Production + Demo 1:1)

To jest punkt startowy do dokumentacji komercyjnej wersji PapaData Intelligence.

## Public Demo (dla klienta niezalogowanego)

- Demo to tryb produktu: **DEMO = PROD 1:1** (UI/UX i funkcje), różni się tylko danymi/persystencją/integracjami/AI.
- Kontrakt i zasady: `product/scope-and-nongoals.md` oraz `engineering/architecture.md`.

## Repo policy (root)

- [Security Policy](../SECURITY.md)
- [Contributing](../CONTRIBUTING.md)
- [Changelog](../CHANGELOG.md)

---

## Rekomendowana kolejność czytania

1. Product → wizja, zakres, persony, roadmap
2. UX → IA, design system, i18n, dostępność, specy UI
3. Engineering → setup, architektura, AI, model danych, testy, observability, security, deploy
4. Operations
5. Compliance & Legal

---

## Product

- [Vision](product/vision.md)
- [Scope & non-goals](product/scope-and-nongoals.md)
- [Personas & use cases](product/personas-and-usecases.md)
- [Roadmap](product/roadmap.md)

## UX

- [Information architecture](ux/information-architecture.md)
- [Design system](ux/design-system.md)
- [Content & i18n](ux/content-i18n.md)
- [Accessibility](ux/accessibility.md)

### UX — UI specs

- [Dashboard](ux/ui-specs/DASHBOARD.md)
- [Interakcje](ux/ui-specs/INTERAKCJE.md)
- [Wygląd](ux/ui-specs/WYGLAD.md)

Source of truth (UI as implemented in repo): `../../docs/ui-spec/00_INDEX.md`.

## Engineering

- [Setup](engineering/setup.md)
- [Architecture](engineering/architecture.md)
- [AI integration](engineering/ai-integration.md)
- [Data model](engineering/data-model.md)
- [KPI definitions](engineering/kpi-definitions.md)
- [Testing](engineering/testing.md)
- [Test log](engineering/test-log.md)
- [Observability](engineering/observability.md)
- [Security baseline / controls](engineering/security.md)
- [Deploy](engineering/deploy.md)
- [Integracje (opis techniczny)](engineering/INTEGRACJE.md)

## Operations

- [Runbook](operations/runbook.md)
- [Incident response](operations/incident-response.md)
- [Backups & retention](operations/backups-and-retention.md)
- [SLA](operations/sla.md)

## Compliance

- [Compliance overview](compliance/compliance-overview.md)
- [Privacy & data](compliance/privacy-and-data.md)
- [Accessibility (EAA)](compliance/accessibility-eaa.md)

## Legal

- [Terms of service](legal/terms-of-service.md)
- [Privacy policy](legal/privacy-policy.md)
- [Cookies policy](legal/cookies-policy.md)
- [DPA](legal/dpa.md)
- [AI disclaimer](legal/ai-disclaimer.md)
- [Accessibility statement](legal/accessibility-statement.md)

---

## Konwencje

- Jeśli czegoś nie da się potwierdzić z dokumentów/kodu — wprowadź jawny standard domyślny i opisz go jednoznacznie.
- Nie umieszczaj sekretów ani PII w repo oraz w przykładach promptów AI.
- DEMO jest częścią produktu — obowiązują te same standardy jakości (a11y, security, observability).
