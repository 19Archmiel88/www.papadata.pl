# Dashboard — Settings Workspace — dashboard-settings-workspace

## Cel i kontekst
- Ustawienia workspace: dane i prywatność, modele atrybucji, alerty i konfiguracja AI.

## Wejścia / Preconditions
- Route: /dashboard/settings/workspace
- Dane: `fetchSettingsWorkspace()` (retentionDays/options, connectors, regions, maskingEnabled, attributionModels).
- Context: `retentionDays`, `maskingEnabled`, `region` z `DashboardContext`, `isDemo`, `isReadOnly`.
- Fallback: i18n `t.dashboard.settings_workspace_v2.*`.

## Układ (Figma-ready)
- Header z badge + Explain AI.
- Data & Privacy: retention select, masking toggle, region (read-only).
- Attribution models: radio list.
- Active integrations summary.
- Alerts & notifications: checklist + kanały + harmonogramy + eksport.
- AI model settings grid.
- Footer action bar (secondary/primary CTA).

## Stany UI
- Loading: `WidgetSkeleton` (fetch settings).
- Offline: `WidgetOfflineState` + retry.
- Error: `WidgetErrorState` + retry.
- DEMO/read-only: inputy i akcje disabled + tooltipy.
- Focus/Keyboard: wszystkie inputy obsługują focus-visible.

## Interakcje
- Zmiana retencji, toggli i checkboxów → zapis lokalny (bez API update).
- Export format actions → `setAiDraft` + `setContextLabel`.
- Explain AI w sekcjach.

## Dane i integracje
- API: `/api/settings/workspace`.
- Fallback: i18n `t.dashboard.settings_workspace_v2.*`.

## A11y
- Toggle `aria-pressed`, inputs focusable.

## Testy
- Spec: [tests/screens/dashboard-settings-workspace.spec.md](../tests/screens/dashboard-settings-workspace.spec.md)
- Dodatkowe: offline/error, read-only/DEMO locks, API data applies to retention/region.
