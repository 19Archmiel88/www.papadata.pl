# Engineering — KPI definitions (Production + Public Demo 1:1)

Ten dokument definiuje KPI jako kontrakt dla dashboardu, AI i API.
Wszystkie definicje musza byc spojne miedzy DEMO i PROD.

---

## Konwencje

- Okno czasu: zgodne z filtrem UI (`timeRange` / `dateStart`-`dateEnd`).
- Waluta: spojnosc z `workspace.currency` (przeliczenia w warstwie danych).
- Atrybucja: domyslnie `last_click` (chyba ze widok wskazuje inaczej).
- Definicje KPI nie moga zalezec od zrodla danych (GA4 vs Shopify) - mapowanie do wspolnego modelu odbywa sie w `*_stg`.

---

## KPI (minimum)

### Revenue (Gross)

- Definicja: suma `order_gross_revenue` w oknie czasu.
- Jednostka: waluta.
- Zrodla: `fact_orders`, `fact_order_items`.
- Uwagi: refundy liczone osobno; dla netto uzyj `net_revenue` (jesli dodane).

### Orders

- Definicja: `count(distinct order_id)` w oknie czasu.
- Jednostka: liczba.
- Zrodla: `fact_orders`.

### AOV

- Definicja: `Revenue / Orders`.
- Jednostka: waluta.
- Zrodla: `fact_orders`.

### Ad Spend

- Definicja: suma kosztow reklamowych.
- Jednostka: waluta.
- Zrodla: `fact_ad_spend`.

### ROAS

- Definicja: `Revenue_attributed / Ad Spend`.
- Jednostka: ratio (x).
- Zrodla: `fact_orders` + `fact_ad_spend` + model atrybucji.
- Uwagi: jesli brak spend -> `null` + flaga brakow.

### CPA

- Definicja: `Ad Spend / Conversions`.
- Jednostka: waluta.
- Zrodla: `fact_ad_spend`, `fact_orders` (konwersja = zamowienie).

### Conversion Rate

- Definicja: `Orders / Sessions`.
- Jednostka: %.
- Zrodla: `fact_orders`, `fact_sessions`.
- Uwagi: sesje z GA4 musza byc zmapowane do tego samego okna czasu.

### Refund Rate

- Definicja: `Refund Amount / Revenue`.
- Jednostka: %.
- Zrodla: `fact_refunds`, `fact_orders`.

### Gross Margin

- Definicja: `(Revenue - COGS) / Revenue`.
- Jednostka: %.
- Zrodla: `fact_orders`, `fact_order_items` (COGS).
- Uwagi: jesli brak COGS -> `null` + coverage flag.

### Net Margin

- Definicja: `(Revenue - COGS - Ad Spend - Fees) / Revenue`.
- Jednostka: %.
- Zrodla: `fact_orders`, `fact_ad_spend`, dodatkowe koszty w `*_marts`.
- Uwagi: koszty stale tylko jesli zdefiniowane w modelu danych.

### CAC

- Definicja: `Sales + Marketing Spend / New Customers`.
- Jednostka: waluta.
- Zrodla: `fact_ad_spend`, `fact_orders`, `dim_customer`.
- Definicja nowego klienta: pierwsze zamowienie w okresie.

### LTV (30d)

- Definicja: przychod od nowych klientow w 30 dni / liczba nowych klientow.
- Jednostka: waluta.
- Zrodla: `fact_orders`, `dim_customer`.
- Uwagi: kohorty wg daty pierwszego zakupu.

---

## Zasady brakow danych

- Brak COGS -> `gross_margin` i `net_margin` = `null`, flag `coverage=false`.
- Brak GA4 sessions -> `conversion_rate` = `null`.
- Brak ad spend -> `roas` i `cpa` = `null`.
- W UI i AI: sygnalizuj brak danych zamiast zastepowac 0.
