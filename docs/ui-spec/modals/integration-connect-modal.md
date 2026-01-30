# Integration Connect Modal — integration-connect-modal

## Cel i kontekst

- Podłączenie integracji (kroki + CTA connect).

## Wejścia / Preconditions

- `openModal('integration_connect', { integration, onConnect })`.

## Układ

- Header z nazwą integracji + meta.
- Lista kroków + security box.
- CTA connect + close.

## Stany UI

- Default.
- Brak danych: auto-close.
- Focus/Keyboard: CTA connect i close focusable.

## Interakcje

- Connect → `onConnect(integration)` + close.
- Close.

## Dane

- `IntegrationItem` + `t.integrations`.

## A11y

- `aria-labelledby`, `aria-describedby`.

## Testy

- Spec: [tests/modals/integration-connect-modal.spec.md](../tests/modals/integration-connect-modal.spec.md)
- Dodatkowe: test callback `onConnect`.
