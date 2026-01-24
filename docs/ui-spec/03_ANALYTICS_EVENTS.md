# Analytics / Telemetry Events

Źródła:
- [apps/web/utils/telemetry.ts](apps/web/utils/telemetry.ts)
- [apps/web/hooks/useApi.ts](apps/web/hooks/useApi.ts)
- [apps/web/utils/consent-mode.ts](apps/web/utils/consent-mode.ts)

## API telemetry (Sentry)
| Event | When | Payload | Where |
| --- | --- | --- | --- |
| api.response | każda udana odpowiedź API | method, url, status, requestId?, durationMs, env, mode | useApi → instrumentedFetch |
| api.error | błąd sieci/API | method, url, requestId?, durationMs, env, mode, error | useApi → instrumentedFetch |

## Consent Mode / tracking scripts
- Consent categories: necessary, analytical, marketing, functional.
- `updateConsentMode()` ustawia `analytics_storage` i ładuje skrypty (GTM/Meta) gdy granted.
- Event `open-cookie-settings` służy do otwarcia panelu preferencji z footera.

## UI events (manual)
Brak jawnego systemu eventów UI poza telemetry API i consent-mode w kodzie. Jeśli wymagane, mapować eventy manualnie w QA (np. klik CTA, otwarcie modala).

Rekomendowane eventy do QA (manual):
- `ui.cta.click` (hero/pricing/final-cta)
- `ui.modal.open` (auth/pricing/video)
- `ui.nav.navigate` (header/footer)
