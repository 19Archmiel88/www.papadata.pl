# Promo Modal — Test Spec

## Zakres
- Promo modal main/intercept.

## Test cases (manual checklist)
- [ ] Main mode shows two plan cards.
- [ ] Clicking starter moves to intercept.
- [ ] CTA demo triggers onDemo.
- [ ] Close shows teaser button on landing.

## Gherkin (BDD)
Scenario: Intercept mode
  Given promo modal is open in main mode
  When I click starter CTA
  Then intercept mode is shown

## Asercje UI
- Title/subhead visible.

## Dane testowe
- i18n promo copy.

## Ryzyka i regresje
- ESC closes modal.
