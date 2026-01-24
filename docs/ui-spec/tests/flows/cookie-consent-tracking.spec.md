# Flow: Cookie Consent → Preferences → Tracking

## Diagram kroków (tekstowo)
No consent → Cookie banner → Accept/Reject/Settings → Consent stored → Tracking enabled/disabled

## Warianty
- Accept all
- Reject optional
- Custom settings

## Gherkin (BDD)
Scenario: Reject optional
  Given cookie banner is visible
  When I reject optional
  Then consent is stored and analytics_storage=denied

## Test cases (manual)
- [ ] Consent saved in localStorage.
- [ ] `open-cookie-settings` opens settings.
- [ ] Consent changes update analytics_storage flag.

## Asercje UI
- Banner overlay closes after decision.
- Settings toggles reflect stored consent.

## Dane testowe
- Empty localStorage.

## Ryzyka i regresje
- Consent update not applied to scripts.
