# Integrations Modal — integrations-modal

## Cel i kontekst

- Katalog integracji z filtrem i wyszukiwaniem.

## Wejścia / Preconditions

- `openModal('integrations', { category })`.

## Układ

- Header + search + tabs.
- Grid integracji + status badges.

## Stany UI

- Default.
- Empty: brak wyników (pusta lista).
- Focus/Keyboard: search input focusable.

## Interakcje

- Search/filter tabs.
- Click integration → callback `onSelectIntegration`.

## Dane

- `integrations` data + `t.integrations`.

## A11y

- `role=document`, focusable buttons.

## Testy

- Spec: [tests/modals/integrations-modal.spec.md](../tests/modals/integrations-modal.spec.md)
- Dodatkowe: test empty list przy braku wyników.
