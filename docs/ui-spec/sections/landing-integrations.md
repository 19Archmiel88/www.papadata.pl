# Landing Integrations — landing-integrations

## Cel i kontekst
- Prezentuje integracje i prowadzi do katalogu lub connect.

## Wejścia / Preconditions
- `IntegrationsSection`.

## Układ
- Header + CTA „All integrations”.
- Grid featured integrations (8).

## Interakcje
- CTA → `IntegrationsModal`.
- Click tile → `IntegrationConnectModal`.
- Status `coming_soon`: kafelki disabled, brak przejścia do connect.
- Hover tile: highlight + ping trace.

## Dane
- `integrations` list + `t.integrations.*`.

## A11y
- Tiles jako button.

## Testy
- Spec: [tests/screens/landing.spec.md](../tests/screens/landing.spec.md)
- Dodatkowe: test disabled integracji (coming soon).
