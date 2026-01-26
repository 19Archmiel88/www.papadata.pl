# UTM Taxonomy (source/medium/campaign/content/term)

## Zasady ogolne
- Wszystkie pola sa normalizowane do lowercase i `snake_case`.
- Puste lub niepoprawne pola sa ustawiane na `undefined`.
- `channel_group` jest wyliczany na podstawie `source` i `medium`.

## Pola
- `utm_source` -> `source`
- `utm_medium` -> `medium`
- `utm_campaign` -> `campaign`
- `utm_content` -> `content`
- `utm_term` -> `term`

## Channel groups (przyklad)
- `paid_search` (source: google, bing; medium: cpc, ppc, paid_search)
- `paid_social` (source: meta, facebook, instagram; medium: paid_social, cpm, cpc)
- `organic_social` (source: facebook, instagram, tiktok; medium: social, organic_social)
- `email` (medium: email, newsletter)
- `referral` (medium: referral)
- `direct` (source: direct, medium: none)
- `affiliate` (medium: affiliate)
- `display` (medium: display, banner)

## Walidacja
- `source` i `medium` sa wymagane do wyliczenia `channel_group`.
- Brak `source` lub `medium` -> `channel_group = unknown`.
