# Dashboard — Reports — dashboard-reports

## Cel i kontekst
- Zarządzanie raportami: ostatni raport, historia, generowanie.

## Wejścia / Preconditions
- Route: /dashboard/reports
- Dane: i18n `t.dashboard.reports_v2.*`.
- DEMO: akcje write disabled.

## Układ (Figma-ready)
- Header + CTA Generate.
- Last report card + eksport formaty.
- Lista historii.

## Stany UI
- Default: listy z i18n.
- Disabled: przyciski disabled w DEMO (tooltip).
- Focus/Keyboard: przyciski i menu dostępne z klawiatury.

## Interakcje
- Context menu (drill/explain/report/export/alert).
- Generate/Export/Resend (disabled in DEMO).

## Dane i integracje
- Brak fetch; actions są mock (AI draft).

## A11y
- Context menu ESC.

## Testy
- Spec: [tests/screens/dashboard-reports.spec.md](../tests/screens/dashboard-reports.spec.md)
- Dodatkowe: test tooltipów w DEMO.
