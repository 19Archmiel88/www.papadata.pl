# Cookie Banner — Test Spec

## Zakres
- Consent banner + settings.

## Test cases (manual checklist)
- [ ] Banner appears when no consent.
- [ ] Accept all sets consent + closes.
- [ ] Reject optional sets consent + closes.
- [ ] Settings save persists choices.
- [ ] ESC closes settings or rejects.
- [ ] Event `open-cookie-settings` opens settings view.

## Gherkin (BDD)
Scenario: Accept all cookies
  Given cookie banner is visible
  When I click Accept all
  Then consent is stored and banner closes

Scenario: Open settings from footer
  Given consent exists
  When the open-cookie-settings event is dispatched
  Then settings view is opened

## Asercje UI
- Overlay blocks background.

## Dane testowe
- Empty localStorage.

## Ryzyka i regresje
- Consent mode scripts gating.
