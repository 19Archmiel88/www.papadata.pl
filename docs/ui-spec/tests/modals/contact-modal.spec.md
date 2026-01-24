# Contact Modal — Test Spec

## Zakres
- Contact form validation and submit.

## Test cases (manual checklist)
- [ ] Invalid email shows error.
- [ ] Submit disabled when invalid.
- [ ] Success state auto-closes.
- [ ] API error shows error banner.

## Gherkin (BDD)
Scenario: Submit contact form
  Given contact modal is open
  When I submit valid fields
  Then success message is shown and modal closes

Scenario: API error
  Given the API returns error
  Then error banner is visible

## Asercje UI
- Error banner on failure.

## Dane testowe
- name="Anna", email="anna@example.com", message length >= 10.

## Ryzyka i regresje
- Auto-close timing.
