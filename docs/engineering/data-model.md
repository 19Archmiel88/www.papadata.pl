# Model danych (docelowy – high-level)

## Cel
Spójne KPI przez jeden model danych.

## Przykładowe fakty i wymiary
### Fakty
- fact_orders
- fact_order_items
- fact_ad_spend
- fact_sessions (GA4)
- fact_refunds

### Wymiary
- dim_date
- dim_product
- dim_customer
- dim_channel
- dim_campaign

## KPI (przykłady)
- Revenue, Gross Margin, Net Margin
- ROAS, CAC, LTV
- Refund rate
- Conversion rate

## Governance
- definicje KPI w jednym miejscu
- lineage: źródło → transformacja → metryka → dashboard
- testy jakości: freshness, completeness, anomalies
