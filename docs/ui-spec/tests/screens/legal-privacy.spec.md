# Legal Privacy — Test Spec

## Zakres

- Strona dokumentu Privacy Policy.

## Test cases (manual checklist)

- [ ] Treść dokumentu widoczna.
- [ ] Back to home.
- [ ] Fallback gdy fetch 404.

## Gherkin (BDD)

Scenario: View privacy document
Given I open /legal/privacy
Then the legal page renders a title and body

Scenario: Fallback on error
Given the document fetch fails
Then the fallback error text is shown

## Asercje UI

- Title i content widoczne.

## Dane testowe

- Mock response: privacy-policy.md.

## Ryzyka i regresje

- Fallback na błędny fetch.
