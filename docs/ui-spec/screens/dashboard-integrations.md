# Dashboard — Integrations — dashboard-integrations

## Cel i kontekst
- Lista integracji, status, podłączanie.

## Wejścia / Preconditions
- Route: /dashboard/integrations
- Dane: `fetchIntegrations()`.

## Układ (Figma-ready)
- Tabela integracji + status + CTA connect.

## Stany UI
- Loading: skeleton.
- Error/Empty: empty state.
- Focus/Keyboard: CTA connect dostępne z klawiatury.

## Interakcje
- Connect → `integration_connect` modal (PROD), DEMO → demo_notice, read-only → pricing.

## Dane i integracje
- API: `/api/integrations`.

## A11y
- Buttons z aria-label.

## Testy
- Spec: [tests/screens/dashboard-integrations.spec.md](../tests/screens/dashboard-integrations.spec.md)
- Dodatkowe: test read-only → pricing modal.
