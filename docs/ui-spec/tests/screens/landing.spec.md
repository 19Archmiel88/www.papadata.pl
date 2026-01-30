# Landing — Test Spec

## Zakres

- Landing page: hero, CTA, sekcje, promo, cookie banner, integracje.

## Test cases (manual checklist)

- [ ] Hero CTA primary otwiera auth modal.
- [ ] Hero CTA secondary otwiera video modal.
- [ ] Scroll do sekcji z /features, /pricing, /integrations, /faq.
- [ ] Pricing toggle zmienia ceny (monthly/yearly).
- [ ] Pricing compare otwiera pricing modal.
- [ ] Integrations CTA otwiera integrations modal.
- [ ] Integrations tile otwiera integration connect modal.
- [ ] Cookie banner: accept/reject/save zapisuje consent.
- [ ] Promo modal pojawia się po 30s od consent i można go zamknąć.
- [ ] Mobile menu otwiera/zamyka się poprawnie.

## Gherkin (BDD)

Scenario: Open auth from hero CTA
Given I am on the landing page
When I click the primary hero CTA
Then the auth modal is visible

Scenario: Promo modal after consent
Given no cookie consent stored
When I accept all cookies
And 30 seconds pass
Then the promo modal is visible

Scenario: Pricing compare
Given I am on the pricing section
When I click compare
Then the pricing modal is visible

Scenario: Mobile menu
Given I am on the landing page on mobile viewport
When I open the mobile menu
Then navigation links are visible

## Asercje UI

- Hero title and CTA visible.
- Pricing cards show 3 plans.
- Cookie banner overlay blocks background.
- Promo teaser button appears after closing promo.
- Header progress bar visible on scroll.

## Dane testowe

- localStorage without `cookie_consent`.
- default language: pl/en.

## Ryzyka i regresje

- Scroll-to-section timing.
- Lazy sections loading skeleton.
- Promo timer depending on consent.
