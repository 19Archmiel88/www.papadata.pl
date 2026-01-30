# Pricing Modal — pricing-modal

## Cel i kontekst

- Porównanie planów (tabela + highlights).

## Wejścia / Preconditions

- `openModal('pricing')`.

## Układ

- Header + tabela porównawcza + highlights + footer.

## Stany UI

- Default.
- Focus/Keyboard: tabela przewijalna na małych ekranach.

## Interakcje

- Close button.

## Dane

- `t.pricing.*`.

## A11y

- `aria-labelledby`.

## Testy

- Spec: [tests/modals/pricing-modal.spec.md](../tests/modals/pricing-modal.spec.md)
- Dodatkowe: test scroll w tabeli.
