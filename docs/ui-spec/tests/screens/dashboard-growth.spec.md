# Dashboard Growth — Test Spec

## Zakres
- Widok growth (mock data).

## Test cases (manual checklist)
- [ ] Sekcje i metryki widoczne.
- [ ] CTA do AI ustawia draft.

## Gherkin (BDD)
Scenario: Render growth view
  Given I open /dashboard/growth
  Then I see growth sections

Scenario: Explain in AI
  When I click Explain in AI
  Then the AI draft is prefilled

## Asercje UI
- Nagłówki i karty widoczne.

## Dane testowe
- i18n mock.

## Ryzyka i regresje
- Spójność copy w i18n.
