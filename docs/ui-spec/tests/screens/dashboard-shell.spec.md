# Dashboard Shell — Test Spec

## Zakres
- Layout, sidebar, topbar, filters, AI drawer, trial/demo notices.

## Test cases (manual checklist)
- [ ] Sidebar menu naviguje do każdej zakładki.
- [ ] Time range zmienia dane w widokach.
- [ ] Attribution toggle działa.
- [ ] AI drawer otwiera się i zamyka (ESC).
- [ ] Trial notice pojawia się dla 7/3/1 dni.
- [ ] Demo notice pojawia się po write-action w DEMO.

## Gherkin (BDD)
Scenario: Open AI drawer
  Given I am on /dashboard/overview
  When I open Papa AI
  Then the drawer is visible and focused

Scenario: Trial notice
  Given my billing summary indicates trialDays=3
  When I open dashboard
  Then trial notice modal is shown once per day

Scenario: Demo notice
  Given I am in DEMO
  When I try to export a report
  Then demo notice modal is shown

## Asercje UI
- Sidebar active state matches route.
- Mode badge shows DEMO/TRIAL/PROD.

## Dane testowe
- Mock health: mode=demo/prod.
- Mock billing summary.

## Ryzyka i regresje
- Read-only gating write actions.
- Drawer focus trap.
