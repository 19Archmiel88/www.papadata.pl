# Video Modal — Test Spec

## Zakres

- Video iframe modal.

## Test cases (manual checklist)

- [ ] Modal opens from landing.
- [ ] Close button closes modal.
- [ ] ESC closes modal.

## Gherkin (BDD)

Scenario: Close video modal
Given video modal is open
When I click close
Then modal is closed

Scenario: Close by ESC
Given video modal is open
When I press Escape
Then modal is closed

## Asercje UI

- Iframe visible.

## Dane testowe

- Default src.

## Ryzyka i regresje

- Autoplay blocked by browser.
