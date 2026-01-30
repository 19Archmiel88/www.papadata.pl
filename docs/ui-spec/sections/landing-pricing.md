# Landing Pricing — landing-pricing

## Cel i kontekst

- Cennik 3 planów z billing toggle i compare.

## Wejścia / Preconditions

- `PricingSection`.

## Układ

- Billing toggle (monthly/yearly).
- 3 karty planów + CTA.
- Compare link.

## Interakcje

- Toggle billing cycle.
- CTA planu (starter/pro):
  - niezalogowany: auth modal + zapis planu do localStorage.
  - zalogowany: `createCheckoutSession({ tenantId, planId })` + redirect na `url`.
  - brak tenantId: komunikat błędu + CTA do `/app/settings/workspace`.
- CTA planu enterprise → mailto.
- Compare → `PricingModal`.
- Recommended plan wyróżniony wizualnie.

## Dane

- `t.pricing.*`.

## A11y

- `aria-pressed` na toggle.

## Testy

- Spec: [tests/screens/landing.spec.md](../tests/screens/landing.spec.md)
- Dodatkowe: test ceny roczne vs miesięczne.
