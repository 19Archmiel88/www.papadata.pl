# Integration Callback — integration-callback

## Cel i kontekst

- Obsluguje redirect OAuth po laczeniu integracji.

## Wejscia / Preconditions

- Route: `/app/integrations/callback/:provider`.
- Query: `code`, `state`, `error`.
- Wymaga auth; inaczej wymusza login i zapamietuje redirect.

## Stany UI

- Auth required: otwiera modal auth i pokazuje komunikat.
- Loading: finalizuje polaczenie i odswieza status.
- Success: pokazuje komunikat i auto-redirect po 2s.
- Error: pokazuje blad i CTA do integracji.

## Interakcje

- CTA w error/success -> `/app/integrations`.

## A11y

- Standardowy layout strony; komunikaty tekstowe.

## Testy

- Spec: [tests/screens/dashboard-integrations.spec.md](../tests/screens/dashboard-integrations.spec.md)
