# Legal Cookies — Test Spec

## Zakres

- Strona dokumentu Cookies Policy.

## Test cases (manual checklist)

- [ ] Treść dokumentu widoczna.
- [ ] Back to home.
- [ ] Fallback gdy fetch 404.

## Gherkin (BDD)

Scenario: View cookies document
Given I open /legal/cookies
Then the legal page renders a title and body

Scenario: Fallback on error
Given the document fetch fails
Then the fallback error text is shown

## Asercje UI

- Title i content widoczne.

## Dane testowe

- Mock response: cookies-policy.md.

## Ryzyka i regresje

- Fallback na błąd fetch.
