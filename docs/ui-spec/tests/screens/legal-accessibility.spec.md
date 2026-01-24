# Legal Accessibility — Test Spec

## Zakres
- Strona accessibility statement.

## Test cases (manual checklist)
- [ ] Treść dokumentu widoczna.
- [ ] Back to home.
- [ ] Fallback gdy fetch 404.

## Gherkin (BDD)
Scenario: View accessibility document
  Given I open /legal/accessibility
  Then the legal page renders a title and body

Scenario: Fallback on error
  Given the document fetch fails
  Then the fallback error text is shown

## Asercje UI
- Title i content widoczne.

## Dane testowe
- Mock response: accessibility-statement.md.

## Ryzyka i regresje
- Fallback na błąd fetch.
