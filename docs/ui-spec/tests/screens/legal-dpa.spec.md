# Legal DPA — Test Spec

## Zakres
- Strona dokumentu DPA.

## Test cases (manual checklist)
- [ ] Treść dokumentu widoczna.
- [ ] Back to home.
- [ ] Fallback gdy fetch 404.

## Gherkin (BDD)
Scenario: View DPA document
  Given I open /legal/dpa
  Then the legal page renders a title and body

Scenario: Fallback on error
  Given the document fetch fails
  Then the fallback error text is shown

## Asercje UI
- Title i content widoczne.

## Dane testowe
- Mock response: dpa.md.

## Ryzyka i regresje
- Fallback na błąd fetch.
