# Cookie Banner — cookie-banner

## Cel i kontekst
- Consent mode v2 + preferencje cookies.

## Wejścia / Preconditions
- Pokazuje się jeśli brak `cookie_consent` w localStorage.

## Układ
- Banner z opisem + CTA Accept/Reject/Settings.
- Panel settings z togglami (analytical/marketing/functional).

## Stany UI
- Default (banner).
- Settings open.
- Focus/Keyboard: focus trap + ESC.

## Interakcje
- Accept all → zapis + updateConsentMode + initObservability.
- Reject optional → zapis + updateConsentMode.
- Save settings → zapis + updateConsentMode.
- ESC: zamyka settings lub reject.

## Dane i integracje
- LocalStorage `cookie_consent`.
- `updateConsentMode` + `initObservability`.

## A11y
- Focus trap, `role=dialog`, `aria-labelledby`.

## Testy
- Spec: [tests/modals/cookie-banner.spec.md](../tests/modals/cookie-banner.spec.md)
- Dodatkowe: test `open-cookie-settings` event.
