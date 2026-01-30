# Data Readiness Banner — data-readiness-banner

## Cel i kontekst

- Informuje o stanie danych i synchronizacji na dashboardzie.

## Wejscia / Preconditions

- Props: `status`, `loading`, `error`.

## Stany UI

- Loading: spinner + komunikat.
- Error: komunikat bledu.
- Live: znacznik LIVE + lastSync.
- Processing: status + spinner.
- Empty: CTA do integracji.
- Demo: CTA do integracji.

## Interakcje

- CTA (empty/demo) -> `/app/integrations`.

## A11y

- Czytelne komunikaty tekstowe.

## Testy

- Spec: [tests/screens/dashboard-shell.spec.md](../tests/screens/dashboard-shell.spec.md)
