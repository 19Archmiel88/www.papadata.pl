# Legal Subprocessors — Test Spec

## Zakres
- Strona subprocessors.

## Test cases (manual checklist)
- [ ] Treść dokumentu widoczna.
- [ ] Back to home.
- [ ] Fallback gdy fetch 404.

## Gherkin (BDD)
Scenario: View subprocessors document
  Given I open /legal/subprocessors
  Then the legal page renders a title and body

Scenario: Fallback on error
  Given the document fetch fails
  Then the fallback error text is shown

## Asercje UI
- Title i content widoczne.

## Dane testowe
- Mock response: privacy-and-data.md.

## Ryzyka i regresje
- Fallback na błąd fetch.
