# Dashboard — Settings Workspace — dashboard-settings-workspace

## Cel i kontekst
- Ustawienia workspace: retencja, kanały alertów, harmonogramy raportów.

## Wejścia / Preconditions
- Route: /dashboard/settings/workspace
- Dane: `fetchSettingsWorkspace()` + local demo state (retentionDays, maskingEnabled, region).

## Układ (Figma-ready)
- Sekcje ustawień, toggles, selects.

## Stany UI
- Loading: skeleton.
- Error: empty/error state.
- Disabled: read-only w braku aktywnej subskrypcji.
- Focus/Keyboard: wszystkie inputy obsługują focus-visible.

## Interakcje
- Zmiana retencji, toggli (DEMO zapis lokalny).

## Dane i integracje
- API: `/api/settings/workspace`.

## A11y
- Inputs z aria-label.

## Testy
- Spec: [tests/screens/dashboard-settings-workspace.spec.md](../tests/screens/dashboard-settings-workspace.spec.md)
- Dodatkowe: test read-only blokuje zapisy.
