# Contact Modal — contact-modal

## Cel i kontekst

- Formularz kontaktowy (support).

## Wejścia / Preconditions

- `openModal('contact')`.
- API: `api.supportContact`.

## Układ

- Header + opis + form (name, email, message) + CTA.

## Stany UI

- Default: form.
- Loading: CTA disabled.
- Error: banner.
- Success: success panel + auto-close (1.5s).
- Focus/Keyboard: tab order fields → CTA.

## Walidacje

- Name >= 2, email regex, message >= 10.

## Dane i integracje

- API payload: name, email, message, source=contact_modal.

## A11y

- `aria-invalid` on inputs.

## Testy

- Spec: [tests/modals/contact-modal.spec.md](../tests/modals/contact-modal.spec.md)
- Dodatkowe: test server error mapping (normalizeApiError).
