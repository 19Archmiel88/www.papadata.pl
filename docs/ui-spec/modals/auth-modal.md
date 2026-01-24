# Auth Modal — auth-modal

## Cel i kontekst
- Modal logowania/rejestracji (magic link + rejestracja z NIP).

## Wejścia / Preconditions
- Otwierany przez `openModal('auth', { isRegistered })`.
- API: `api.authMagicLink`, `api.authLogin`, `api.authRegister`.

## Układ (Figma-ready)
- Header z logo + tabs Login/Register.
- Formularz email/password/NIP + firmowe dane.
- CTA submit + pomocnicze linki.

## Stany UI
- Default: login lub register (zależnie od `isRegistered`).
- Loading: spinner w CTA.
- Error: `submitError` banner.
- Success: po autoryzacji zamknięcie modala.
- Disabled: podczas submit.
- Focus/Keyboard: tab switch i pola dostępne z klawiatury.

## Interakcje
- Switch mode → reset form.
- Magic link → `authMagicLink` (sets `codeSent`).
- Login → `authLogin` (session stored).
- Register → `authRegister` (session stored).

## Walidacje i komunikaty
- Email regex.
- Password: min 8, uppercase, special.
- NIP: 10 cyfr + checksum.
- Min długości pól (name >= 2, message >= 10).
- Komunikaty z `t.auth.*` i `t.common.error_desc`.

## Dane i integracje
- LocalStorage: `papadata_auth_token`, `papadata_user_id`, `papadata_user_roles`.

## A11y
- `aria-busy`, `aria-label` na modal.
- Focus trap obsługuje ModalContainer.

## Testy
- Spec: [tests/modals/auth-modal.spec.md](../tests/modals/auth-modal.spec.md)
- Dodatkowe: test magic-link flow + resend.
