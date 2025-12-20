# Compliance — Privacy & Data

## Role
- Dostawca: Administrator danych konta i rozliczeń
- Dostawca: Procesor danych końcowych klienta (integracje) na podstawie DPA

## Podstawy prawne (przykładowo)
- Umowa (art. 6(1)(b))
- Obowiązki prawne (art. 6(1)(c)) — księgowość
- Uzasadniony interes (art. 6(1)(f)) — analityka UX/bezpieczeństwo

## Dane i retencja
- Minimalizacja danych
- Retencja:
  - dane konta: wg wymogów prawnych (faktury)
  - dane integracji: wg DPA, usunięcie po zakończeniu usługi (np. do 30 dni)
- Eksport danych (Data Act): konfiguracje i raporty (CSV/JSON)

## Cookies / Consent Mode v2
- Panel cookies:
  - odrzuc wszystkie
  - akceptuj wybrane
  - akceptuj wszystkie
- Kategorie:
  - niezbędne
  - analityczne
  - marketingowe
- Zgodność: brak domyślnych zgód marketingowych

## Region i bezpieczeństwo
- Hosting danych: UE (np. GCP europe-central2) — zależnie od wdrożenia
- Szyfrowanie at-rest i in-transit (TLS)
