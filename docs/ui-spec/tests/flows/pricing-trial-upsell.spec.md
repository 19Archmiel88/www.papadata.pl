# Flow: Pricing → Trial → Upsell

## Diagram kroków (tekstowo)
Landing Pricing → Auth modal (trial) → Dashboard (trial badge) → Trial notice modal → Pricing modal/portal

## Warianty
- user with billing permissions
- member without billing permissions

## Gherkin (BDD)
Scenario: Trial notice with owner permissions
  Given trialDays=3 and canManageSubscription=true
  When I open dashboard
  Then trial notice modal shows primary CTA

## Test cases (manual)
- [ ] Pricing CTA opens auth.
- [ ] Trial badge visible in topbar.
- [ ] Trial notice modal appears for 7/3/1 days.
- [ ] CTA routes to billing portal when available.

## Automatyzacja
- E2E: `apps/web/tests/e2e/flow-pricing-trial-upsell.spec.ts`

## Asercje UI
- Badge shows TRIAL and plan label.
- Trial modal copy matches daysLeft.

## Dane testowe
- Billing summary fixture.

## Ryzyka i regresje
- LocalStorage suppression key.
