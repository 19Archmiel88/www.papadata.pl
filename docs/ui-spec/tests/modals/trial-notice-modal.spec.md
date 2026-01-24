# Trial Notice Modal — Test Spec

## Zakres
- Trial reminder modal.

## Test cases (manual checklist)
- [ ] Shows different copy for 7/3/1 days.
- [ ] Primary CTA only when canManageSubscription.
- [ ] Member hint displayed when no CTA.

## Gherkin (BDD)
Scenario: Trial 3 days left
  Given trialDays=3
  When modal opens
  Then title/desc correspond to 3-day copy

Scenario: Member hint
  Given canManageSubscription=false
  Then member hint text is visible

## Asercje UI
- Tag and CTA visible when allowed.

## Dane testowe
- daysLeft=7/3/1.

## Ryzyka i regresje
- LocalStorage suppression key.
