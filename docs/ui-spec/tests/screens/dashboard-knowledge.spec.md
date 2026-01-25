# Dashboard Knowledge — Test Spec

## Zakres
- Knowledge view (list + detail + booking).

## Test cases (manual checklist)
- [ ] Offline state + retry.
- [ ] Error → retry.
- [ ] Search/filter ogranicza listę.
- [ ] Klik itemu pokazuje detail view.
- [ ] Context menu na karcie.
- [ ] Booking modal otwiera się i zamyka (ESC).
- [ ] DEMO: booking/share/bookmark disabled.

## Gherkin (BDD)
Scenario: Load knowledge items
  Given API returns knowledge data
  Then list is visible

Scenario: Open item
  When I click a knowledge item
  Then I see simulated content

Scenario: Filter results
  When I filter by category
  Then the list updates accordingly

## Asercje UI
- Articles list visible.
- Detail panel visible.

## Dane testowe
- Mock API `/api/dashboard/knowledge`.
- i18n labels `dashboard.knowledge_v2.*`.

## Ryzyka i regresje
- Empty state content.
- apiAvailable=false should use fallback resources.
