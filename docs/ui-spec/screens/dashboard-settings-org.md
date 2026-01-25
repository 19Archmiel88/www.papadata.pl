# Dashboard — Settings Organization — dashboard-settings-org

## Cel i kontekst
- Ustawienia organizacji: dane firmy, zespół, billing, bezpieczeństwo i compliance.

## Wejścia / Preconditions
- Route: /dashboard/settings/org
- Dane: `fetchSettingsOrg()` (company/users/billing) + i18n `t.dashboard.settings_org_v2.mock`.
- Admin (owner/admin): `fetchAdminAiUsage`, `fetchAdminSources`, `fetchAdminBilling`.
- Akcje: `deleteOrganization` (`/api/settings/org/delete`).
- Context: `isDemo`, `isReadOnly`, `canManageSubscription`, `onManageSubscription`, `onUpgrade`.

## Układ (Figma-ready)
- Header z badge + Explain AI.
- Company identity cards.
- Users list + invite CTA.
- Billing: status card, payer/cycle, plans, invoices, CTA.
- Security & audit log.
- Admin panel (hash `#admin`) + tenant filter.
- Compliance actions + delete org.
- Global save footer.

## Stany UI
- Loading: `WidgetSkeleton` (fetch org).
- Offline: `WidgetOfflineState` + retry.
- Error: `WidgetErrorState` + retry.
- DEMO/read-only: akcje disabled, tooltipy, AI context z powodem blokady.
- Focus/Keyboard: CTA i sekcje dostępne z klawiatury.

## Interakcje
- Manage subscription → `onManageSubscription` (portal) albo `onUpgrade` (pricing).
- Invite/billing/security/compliance akcje → `setAiDraft` + `setContextLabel`.
- Delete org: prompt "DELETE" → `/settings/org/delete`.
- Admin panel: refresh danych per tenant.

## Dane i integracje
- API: `/api/settings/org`, `/api/settings/org/delete`, `/api/admin/*`.
- Fallback: i18n `t.dashboard.settings_org_v2.mock`.

## A11y
- Buttons focusable + aria-label dla akcji AI.

## Testy
- Spec: [tests/screens/dashboard-settings-org.spec.md](../tests/screens/dashboard-settings-org.spec.md)
- Dodatkowe: offline/error, read-only/DEMO locks, admin panel refresh.
