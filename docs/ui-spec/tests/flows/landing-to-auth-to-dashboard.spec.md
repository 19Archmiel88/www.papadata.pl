# Flow: Landing → Auth → Dashboard

## Diagram kroków (tekstowo)
Landing (Hero CTA) → Auth modal (login/register) → Dashboard overview

## Warianty
- DEMO: przejście bez loginu (/dashboard?mode=demo).
- PROD: login lub register.

## Gherkin (BDD)
Scenario: Trial signup to dashboard
  Given I am on landing
  When I click hero CTA and complete registration
  Then I am authenticated and see dashboard overview

## Test cases (manual)
- [ ] Hero CTA opens auth.
- [ ] Successful register stores token.
- [ ] Redirect to /dashboard/overview.
- [ ] Logout clears token (if available in UI).

## Asercje UI
- Dashboard layout visible (sidebar + topbar).
- Mode badge shows correct status.

## Dane testowe
- Valid email, password, NIP.

## Ryzyka i regresje
- Auth API failures.
