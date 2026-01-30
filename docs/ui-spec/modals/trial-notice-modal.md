# Trial Notice Modal — trial-notice-modal

## Cel i kontekst

- Przypomnienie o kończącym się trialu.

## Wejścia / Preconditions

- `openModal('trial_notice', { daysLeft, canManageSubscription, onPrimary })`.

## Układ

- Ikona + tag + title/desc (zależne od daysLeft) + CTA.

## Stany UI

- Default.
- Member-only: brak CTA (informacja).
- Focus/Keyboard: CTA focusable.

## Interakcje

- Primary → billing portal/pricing.
- Close.

## Dane

- `t.dashboard.billing.*`.

## A11y

- `aria-labelledby`, `aria-describedby`.

## Testy

- Spec: [tests/modals/trial-notice-modal.spec.md](../tests/modals/trial-notice-modal.spec.md)
- Dodatkowe: test copy dla 1 dnia.
