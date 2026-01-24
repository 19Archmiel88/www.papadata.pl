# Dashboard — Settings Organization — dashboard-settings-org

## Cel i kontekst
- Ustawienia organizacji: plan/billing, bezpieczeństwo, faktury.

## Wejścia / Preconditions
- Route: /dashboard/settings/org
- Dane: `fetchSettingsOrg()`.

## Układ (Figma-ready)
- Sekcje: plan, billing, security, invoices.

## Stany UI
- Loading: skeleton.
- Error: empty/error state.
- Disabled: read-only dla nieaktywnych kont.
- Focus/Keyboard: CTA i sekcje dostępne z klawiatury.

## Interakcje
- Manage subscription → billing portal lub pricing modal.

## Dane i integracje
- API: `/api/settings/org`.

## A11y
- Buttons focusable.

## Testy
- Spec: [tests/screens/dashboard-settings-org.spec.md](../tests/screens/dashboard-settings-org.spec.md)
- Dodatkowe: test fallback do pricing modal.
