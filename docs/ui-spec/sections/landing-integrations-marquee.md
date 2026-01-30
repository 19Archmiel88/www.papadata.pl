# Landing Integrations Marquee — landing-integrations-marquee

## Cel i kontekst

- Marquee z nazwami integracji.

## Wejścia / Preconditions

- `IntegrationsMarquee`.

## Układ

- Płynna lista nazw.

## Interakcje

- Brak (tylko hover style).
- Animacja: ciągły scroll (CSS animation).

## Dane

- `t.integrations.marquee_items`.

## A11y

- `aria-label` i role=region.

## Testy

- Spec: [tests/screens/landing.spec.md](../tests/screens/landing.spec.md)
- Dodatkowe: test płynności animacji.
