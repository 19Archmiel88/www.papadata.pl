# Legal Terms — Test Spec

## Zakres
- Strona dokumentu Terms of Service.

## Test cases (manual checklist)
- [ ] Ładowanie dokumentu md.
- [ ] Back to home wraca do /.
- [ ] Fallback gdy fetch 404.
- [ ] Render tytułu z markdown (# ...).

## Gherkin (BDD)
Scenario: View terms document
  Given I open /legal/terms
  Then the legal page renders a title and body

Scenario: Back to home
  When I click Back to home
  Then I am redirected to /

Scenario: Markdown title
  Given the document starts with "# Title"
  Then the page title equals "Title"

## Asercje UI
- Logo + title widoczne.
- Treść w bloku `pre`.

## Dane testowe
- Mock response: terms-of-service.md.

## Ryzyka i regresje
- Brak loadera — fallback powinien być czytelny.
