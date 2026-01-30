# Auth Modal — Test Spec

## Zakres

- Login/register flow + validation.

## Test cases (manual checklist)

- [ ] Switch tabs resets form.
- [ ] Invalid email shows error.
- [ ] Password strength indicators.
- [ ] NIP validation and lookup.
- [ ] Successful login closes modal.
- [ ] Magic link sends email and shows code sent state.

## Gherkin (BDD)

Scenario: Invalid email
Given auth modal is open
When I enter an invalid email
Then an email error is shown

Scenario: Register success
Given register mode
When I submit valid data
Then modal closes and auth token is stored

Scenario: Magic link
Given login mode
When I request a magic link
Then a confirmation state is shown

## Asercje UI

- CTA disabled when invalid.

## Dane testowe

- Valid email: user@example.com
- Valid NIP checksum.

## Ryzyka i regresje

- Async submit state.
