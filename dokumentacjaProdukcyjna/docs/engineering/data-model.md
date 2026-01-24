# Engineering — Data model (KPI contract + Demo dataset) — Production

## Cel
Spójne KPI przez jeden model danych, wykorzystywany w:
- dashboardzie produkcyjnym (dane klienta),
- dashboardzie demo (dane syntetyczne/mock) w trybie 1:1.

Powiązane:
- UX dashboard (high-level): `../ux/ui-specs/DASHBOARD.md`
- UI spec (source of truth): `../../../docs/ui-spec/00_INDEX.md`
- Integracje: `INTEGRACJE.md`
- Privacy & data: `../compliance/privacy-and-data.md`

---

## Przykładowe fakty i wymiary (high-level)

### Fakty (facts)
- `fact_orders`
- `fact_order_items`
- `fact_ad_spend`
- `fact_sessions` (GA4)
- `fact_refunds`

### Wymiary (dimensions)
- `dim_date`
- `dim_product`
- `dim_customer`
- `dim_channel`
- `dim_campaign`

Minimalne pola (standard):
- `fact_orders`: `order_id`, `date`, `currency`, `gross_revenue`, `net_revenue`, `channel`, `campaign_id`, `customer_id`
- `fact_order_items`: `order_id`, `product_id`, `quantity`, `gross_revenue`, `cogs`
- `fact_ad_spend`: `date`, `channel`, `campaign_id`, `spend`, `clicks`, `impressions`
- `fact_sessions`: `date`, `source`, `channel`, `sessions`
- `fact_refunds`: `order_id`, `date`, `refund_amount`, `reason`
- `dim_date`: `date`, `week`, `month`, `quarter`, `year`
- `dim_product`: `product_id`, `sku`, `product_name`, `category`
- `dim_customer`: `customer_id`, `segment`, `country`
- `dim_channel`: `channel`, `source`, `medium`
- `dim_campaign`: `campaign_id`, `campaign_name`, `platform`

---

## KPI contract (minimum)
Definicje KPI musza byc w jednym miejscu i miec wersjonowanie.

Zrodlo prawdy dla definicji KPI:
- `kpi-definitions.md`

Zrodlo prawdy dla kontraktow API (ksztalty odpowiedzi):
- `libs/shared/src/contracts/*`

Dla kazdej metryki wymagane:
- definicja (wzor),
- jednostka/waluta,
- okno czasowe (jesli dotyczy),
- zaleznosc od modelu atrybucji (jesli dotyczy),
- zrodla danych (facts/dimensions),
- zasady brakow danych (np. brak COGS -> jak liczyc marze).

---

## Atrybucja i porównania
- Dostępne modele atrybucji: `last_click` oraz `data_driven` (kontrakt w [libs/shared/src/contracts/analytics.ts](../../libs/shared/src/contracts/analytics.ts#L17-L28)).
- `last_click`: cały przychód przypisywany do ostatniego kanału/kampanii.
- `data_driven`: przychód rozkładany proporcjonalnie do wpływu kanałów (model statystyczny po stronie data layer).
- Porównania okresów: `previous_period` i `yoy` na poziomie UI (zgodnie z `DateRange.compare`).

---

## Governance i jakość danych
- definicje KPI w jednym miejscu,
- lineage: źródło → transformacja → metryka → dashboard,
- testy jakości:
  - **freshness** (opóźnienia źródeł),
  - **completeness/coverage** (np. COGS coverage),
  - **anomalies** (spike/drop, duplikaty, braki),
  - **consistency** (sumy w raportach vs detail).

Freshness/coverage w UI:
- Widok Guardian i Pipeline prezentują tabelę świeżości oraz coverage (źródła, status, last sync, opóźnienie) — [apps/web/components/dashboard/GuardianViewV2.tsx](../../apps/web/components/dashboard/GuardianViewV2.tsx#L341-L433) i [apps/web/components/dashboard/PipelineView.tsx](../../apps/web/components/dashboard/PipelineView.tsx#L382-L494)

---

## Demo dataset (wymog dla DEMO 1:1)
DEMO musi używać danych:
- syntetycznych lub przykładowych (**bez PII** i bez danych klienta),
- spójnych w całej aplikacji (ten sam zestaw danych dla wszystkich widoków),
- realistycznych (wartości i relacje „mają sens”),
- deterministycznych (zalecany seed), aby:
  - AI rekomendacje były powtarzalne,
  - QA i demo script były stabilne.

Zalecenia:
- zakres czasu: 90 dni z trendami i 2-3 anomaliami (spike/spadek),
- kilka kanalow + kilka kampanii + miks produktow,
- segmenty klientow bez danych identyfikowalnych.

### Aktualne miejsca danych DEMO (kod)
- `apps/web/components/dashboard/OverviewViewV2.tsx` — generator wykresow i tabel (seeded).
- `apps/web/translations.ts` — probki nazw kampanii i SKU w tabelach.

Generator DEMO jest lokalny dla widoków i nie jest współdzielony między FE/BE (stan obecny). Jeśli wymagane scentralizowanie, należy utworzyć wspólny moduł w `libs/shared`.
