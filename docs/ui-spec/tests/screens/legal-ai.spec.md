# Legal AI — Test Spec

## Zakres
- Strona AI disclaimer.

## Test cases (manual checklist)
- [ ] Treść dokumentu widoczna.
- [ ] Back to home.
- [ ] Fallback gdy fetch 404.

## Gherkin (BDD)
Scenario: View AI document
  Given I open /legal/ai
  Then the legal page renders a title and body

Scenario: Fallback on error
  Given the document fetch fails
  Then the fallback error text is shown

## Asercje UI
- Title i content widoczne.

## Dane testowe
- Mock response: ai-disclaimer.md.

## Ryzyka i regresje
- Fallback na błąd fetch.
