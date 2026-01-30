# Integracje — produkcja + DEMO 1:1

Ten dokument opisuje integracje w produkcyjnej wersji PapaData oraz zasady ich symulacji w **Public Demo 1:1**.

## Zasada #1 (bezpieczeństwo)

- **Nigdy nie trzymaj tokenów/sekretów w kliencie (frontend).**
- Wszystkie: `client_secret`, `refresh_token`, `api_key`, `signing_secret` → **backend + szyfrowanie (np. KMS/Secret Manager)**.
- Webhooki: zawsze **weryfikuj podpis** i rób **idempotencję** (żeby event nie “naliczył się” 2×).

## Public Demo 1:1 — jak pokazujemy integracje bez ryzyka

W DEMO UI integracji ma być 1:1 z produkcją, ale:

- „Połącz” i „Rozłącz” są **symulowane** (brak realnych redirectów OAuth, brak realnych tokenów),
- statusy (Connected/Needs reauth/Disconnected) są mockowane,
- wszystkie miejsca, gdzie w produkcji pojawia się realne konto (np. `ad_account_id`), używają wartości przykładowych,
- UI musi jasno oznaczać „tryb demo” i nie może tworzyć trwałych side-effectów.

DEMO używa stanu lokalnego w UI (React state) oraz stubów backendowych `/api/integrations/*` do symulacji flow OAuth.

---

## Zasada #1 (bezpieczeństwo)

- **Nigdy nie trzymaj tokenów/sekretów w kliencie (frontend).**
- Wszystkie: `client_secret`, `refresh_token`, `api_key`, `signing_secret` → **backend + szyfrowanie (np. KMS/Secret Manager)**.
- Webhooki: zawsze **weryfikuj podpis** i rób **idempotencję** (żeby event nie “naliczył się” 2×).

---

## 0) 3 najczęstsze sposoby integracji (w 90% przypadków to wystarczy)

### A) OAuth2 (Authorization Code + refresh)

**Jak działa:**

1. Użytkownik klika „Połącz” → przekierowanie do dostawcy (consent).
2. Dostawca wraca na `redirect_uri` z parametrem `code`.
3. Backend wymienia `code` na `access_token` (+ często `refresh_token`).
4. Backend cyklicznie odświeża `access_token` używając `refresh_token`.

**Co musisz mieć:**

- `client_id`, `client_secret`, `redirect_uri`, `scopes`
- endpointy `authorize_url` i `token_url`
- storage na tokeny (per tenant / per user / per konto reklamowe)

### B) API key / Personal Access Token

**Jak działa:**

- Użytkownik generuje klucz w panelu dostawcy i wkleja go w Twoim UI.
- Backend używa klucza w nagłówku (`Authorization: Bearer ...` albo `X-API-Key: ...`).

**Co musisz mieć:**

- `api_key` / `pat` (+ czasem region/datacenter)

### C) Webhook

**Jak działa:**

- Ty wystawiasz URL.
- Dostawca wysyła eventy do Ciebie.
- Ty weryfikujesz podpis, zapisujesz eventy i ewentualnie dociągasz szczegóły przez API.

**Co musisz mieć:**

- `webhook_url`, `signing_secret` / HMAC secret
- retry handling + deduplikacja

---

# 1) Integracje – katalog + sposób podłączenia

## 1.1 Google (GA4 / GSC / Google Ads / GTM / Firebase)

### GA4 (Google Analytics Data API)

**STATUS** DEMO stub (UI + backend stub, bez realnych tokenów)
**Auth:** OAuth2 (logowanie kontem Google)  
**Wymagane:** `client_id`, `client_secret`, `redirect_uri`, scope (np. `analytics.readonly`), oraz **GA4 `property_id`**  
**Gdzie wziąć:** Google Cloud Console → OAuth consent screen + Credentials (OAuth Client)  
**Uwaga:** tokeny tylko backend; pobierasz raporty przez Data API  
**Docs:**

- https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart
- https://developers.google.com/identity/protocols/oauth2/web-server

### Google Search Console

**STATUS** DEMO stub (UI + backend stub, bez realnych tokenów)
**Auth:** OAuth2 (Google)  
**Wymagane:** OAuth client + scope dla Search Console, oraz lista „properties” (witryn)  
**Gdzie wziąć:** Google Cloud Console → włącz Search Console API + OAuth client  
**Docs:**

- https://developers.google.com/webmaster-tools/v1/how-tos/authorizing
- https://developers.google.com/identity/protocols/oauth2/web-server

### Google Ads API

**STATUS** DEMO stub (UI + backend stub, bez realnych tokenów)
**Auth:** OAuth2 (Google) + **Developer Token**  
**Wymagane:** OAuth client, `refresh_token`, `developer_token`, często `login-customer-id` (MCC)  
**Gdzie wziąć:** Google Cloud Console (OAuth) + konto Google Ads (developer token)  
**Docs:**

- https://developers.google.com/google-ads/api/docs/oauth/overview

### Google Tag Manager (GTM)

**STATUS** DEMO stub (UI + backend stub, bez realnych tokenów)
**Auth:** OAuth2 (Google)  
**Wymagane:** OAuth client + GTM scope, potem `accountId/containerId/workspaceId`  
**Docs:**

- https://developers.google.com/tag-platform/tag-manager/api/v2/

### Firebase / GA for Firebase

**STATUS** DEMO stub (UI + backend stub, bez realnych tokenów)
**Auth:** OAuth2 lub Service Account (serwer-serwer) zależnie od API/zakresu  
**Wymagane:** projekt GCP/Firebase, odpowiednie role i credentiale  
**Docs:**

- https://developers.google.com/identity/protocols/oauth2
- https://developers.google.com/identity/protocols/oauth2/service-account

---

## 1.2 Meta Ads (Facebook / Instagram)

**STATUS** DEMO stub (UI + backend stub, bez realnych tokenów)
**Auth (2 podejścia):**

1. OAuth2 (user login) – proste wdrożeniowo
2. System User Token (Business Manager) – stabilniejsze dla agency/enterprise

**Wymagane:** Meta App (`app_id`, `app_secret`), uprawnienia, tokeny (user/system)  
**Gdzie wziąć:** Meta for Developers + Business Settings (System Users)  
**Docs:**

- https://developers.facebook.com/docs/marketing-api/get-started/authorization/
- https://developers.facebook.com/docs/business-management-apis/system-users/create-retrieve-update/

---

## 1.3 TikTok Ads / TikTok API

**STATUS** DEMO stub (UI + backend stub, bez realnych tokenów)
**Auth:** OAuth2 (user access token) + czasem `client_credentials` (client token) zależnie od produktu API  
**Wymagane:** `client_key`, `client_secret`, `redirect_uri`, scopes, `access_token` (+ refresh jeśli dostępny)  
**Gdzie wziąć:** TikTok for Developers / portal danego API  
**Docs:**

- https://developers.tiktok.com/doc/oauth-user-access-token-management
- https://developers.tiktok.com/doc/client-access-token-management

---

## 1.4 Microsoft Advertising (Bing Ads)

**STATUS** DEMO stub (UI + backend stub, bez realnych tokenów)
**Auth:** OAuth2 przez Microsoft identity platform + **Developer Token**  
**Wymagane:** Azure App Registration (`client_id`, `client_secret`, `redirect_uri`), refresh token, developer token  
**Gdzie wziąć:** Azure Portal (App registration) + Microsoft Advertising (developer token)  
**Docs:**

- https://learn.microsoft.com/en-us/advertising/guides/authentication-oauth?view=bingads-13

---

## 1.5 LinkedIn Ads (Marketing APIs)

**STATUS** DEMO stub (UI + backend stub, bez realnych tokenów)
**Auth:** OAuth2  
**Wymagane:** app (`client_id`, `client_secret`, `redirect_uri`, scopes)  
**Uwaga:** dostęp do Advertising/Marketing API zwykle wymaga **formularza / review**  
**Docs:**

- https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication
- https://www.linkedin.com/help/linkedin/answer/a527289
- https://developer.linkedin.com/product-catalog/marketing/advertising-api

---

## 1.6 Pozostałe paid social (Pinterest / Snapchat / X)

**Auth:** najczęściej OAuth2  
**Wymagane:** app credentials + scopes + tokeny  
**Docsy (startowe):**

- Pinterest Developers: https://developers.pinterest.com/
- Snap Kit / Ads: https://developers.snap.com/
- X Developer Platform: https://developer.x.com/

---

## 1.7 DSP / programmatic (The Trade Desk / DV360 / Adform / Xandr / Yahoo DSP / RTB House)

**Auth:** zwykle OAuth2 lub tokeny partnera, często proces partnerski  
**Wymagane:** zależne od DSP; często: app + whitelisting + kontrakt/partnerstwo  
**Start:**

- DV360 (Google Marketing Platform): https://developers.google.com/display-video/
- Adform: https://developers.adform.com/
- The Trade Desk: https://api.thetradedesk.com/
- Xandr: https://learn.microsoft.com/en-us/xandr/
- Yahoo DSP: https://developer.yahoo.com/

---

## 1.8 Retail media / marketplace ads (Amazon Ads / Allegro Ads / Zalando ZMS)

**STATUS** DEMO stub (UI + backend stub, bez realnych tokenów)

### Amazon Ads

**Auth:** Login with Amazon (LwA) + autoryzacja użytkownika na dostęp do konta reklamowego  
**Wymagane:** LwA app (`client_id`, `client_secret`, redirect URLs) + tokeny  
**Docs:**

- https://advertising.amazon.com/API/docs/en-us/guides/account-management/authorization/overview
- https://advertising.amazon.com/API/docs/en-us/guides/get-started/overview

### Allegro (sprzedaż + reklamy, zależnie od endpointów)

**Auth:** OAuth2 (Authorization Code / Device flow itd.)  
**Wymagane:** `client_id`, `client_secret`, `redirect_uri`, tokeny Bearer  
**Docs:**

- https://developer.allegro.pl/tutorials/uwierzytelnianie-i-autoryzacja-zlq9e75GdIR

### Zalando ZMS

**Auth:** zwykle partner/contract + token/OAuth (zależnie od programu)  
**Start:** https://partnerportal.zalando.com/

---

## 1.9 E-commerce (Shopify / WooCommerce / PrestaShop / Magento / BigCommerce / PL: Shoper, IdoSell…)

**STATUS** DEMO stub (UI + backend stub, bez realnych tokenów)

### Shopify

**Auth:** OAuth (public app) lub token z Custom App  
**Wymagane:** app, scopes, `redirect_uri`, token (Admin API)  
**Webhook:** HMAC verification  
**Docs:**

- https://shopify.dev/docs/api/usage/authentication
- https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/authorization-code-grant

### WooCommerce

**Auth:** Consumer Key + Consumer Secret (najczęściej Basic Auth po HTTPS)  
**Wymagane:** `site_url`, `consumer_key`, `consumer_secret`  
**Gdzie wziąć:** WooCommerce → Advanced → REST API → Generate keys  
**Docs:**

- https://woocommerce.com/document/woocommerce-rest-api/
- https://developer.woocommerce.com/docs/apis/rest-api/

### PrestaShop

**Auth:** Webservice API key  
**Wymagane:** `api_key` + włączone Webservice + uprawnienia zasobów  
**Docs:** https://devdocs.prestashop-project.org/

### Magento / Adobe Commerce

**Auth:** Integration tokens (OAuth1) lub Bearer token (Admin) zależnie od wersji/trybu  
**Docs:** https://developer.adobe.com/commerce/

### BigCommerce

**Auth:** OAuth2 (app) + store hash + tokeny  
**Docs:** https://developer.bigcommerce.com/

### Polska: Shoper / IdoSell / Comarch e-Sklep / Shopware

**STATUS** DEMO stub (UI + backend stub, bez realnych tokenów)
**Auth:** najczęściej API key / OAuth zależnie od platformy + moduły integracyjne  
**Start:**

- Shoper: https://developers.shoper.pl/
- IdoSell: https://www.idosell.com/developers/
- Shopware: https://developer.shopware.com/
- Comarch: (zależne od produktu; zwykle dokumentacja partnerska)

---

## 1.10 Marketplace (Amazon Seller / Allegro / eBay / Etsy) + integratory (BaseLinker / ChannelEngine)

**STATUS** DEMO stub (UI + backend stub, bez realnych tokenów)
**Auth:** w większości OAuth2 + whitelisting/partnerstwo (szczególnie Amazon/eBay)  
**Start:**

- Amazon Selling Partner API: https://developer-docs.amazon.com/sp-api/
- eBay Developers: https://developer.ebay.com/
- Etsy Developers: https://developers.etsy.com/
- BaseLinker: https://baselinker.com/
- ChannelEngine: https://developers.channelengine.net/

---

## 1.11 CRM i sprzedaż (HubSpot / Salesforce / Pipedrive / Zoho / Freshsales / PL: Livespace)

### HubSpot

**Auth:** OAuth2 (dla wielu kont) albo Private App Token (dla jednego konta)  
**Wymagane:** app credentials / token, scopes, refresh token  
**Docs:**

- https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/oauth/oauth-quickstart-guide
- https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/overview

### Salesforce

**Auth:** Connected App + OAuth2  
**Wymagane:** `client_id` (consumer key), `client_secret`, `redirect_uri`, scopes, refresh token  
**Docs:**

- https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_oauth_and_connected_apps.htm

### Pipedrive

**Auth:** OAuth2  
**Wymagane:** app credentials, `redirect_uri`, tokeny z `oauth.pipedrive.com`  
**Docs:**

- https://pipedrive.readme.io/docs/marketplace-oauth-authorization

### Zoho CRM / Freshsales / Livespace / Bitrix24

**Auth:** zwykle OAuth2 / API token zależnie od produktu  
**Start:**

- Zoho: https://www.zoho.com/crm/developer/
- Freshworks: https://developers.freshworks.com/
- Bitrix24: https://training.bitrix24.com/rest_help/

---

## 1.12 Marketing automation / Email / SMS / Push (Klaviyo / Mailchimp / GetResponse / SALESmanago / Braze / OneSignal…)

### Klaviyo

**Auth:** Private API key (prosto) lub OAuth (dla marketplace/multi-tenant)  
**Wymagane:** `api_key` lub OAuth app credentials + tokeny  
**Docs:**

- https://developers.klaviyo.com/en/docs/authenticate_
- https://developers.klaviyo.com/en/docs/set_up_oauth

### Mailchimp

**Auth:** OAuth2 (dla integracji z kontami klientów) lub API key (dla “single account”)  
**Docs:**

- https://mailchimp.com/developer/marketing/guides/access-user-data-oauth-2/
- https://mailchimp.com/developer/marketing/docs/fundamentals/

### GetResponse / SALESmanago / Braze / Iterable / Customer.io

**Auth:** API key lub OAuth (zależnie od produktu)  
**Start:**

- GetResponse: https://apidocs.getresponse.com/
- Braze: https://www.braze.com/docs/api/
- Iterable: https://api.iterable.com/
- Customer.io: https://customer.io/docs/api/

### SMS: Twilio / SMSAPI / SerwerSMS

**Auth:** API key / Account SID + Auth Token (Twilio)  
**Start:**

- Twilio: https://www.twilio.com/docs/usage/api
- SMSAPI: https://www.smsapi.pl/
- SerwerSMS: https://serwersms.pl/

### Push: OneSignal / PushPushGo

**Auth:** API key / app id + REST key  
**Start:**

- OneSignal: https://documentation.onesignal.com/
- PushPushGo: https://pushpushgo.com/

---

## 1.13 Support / Chat (Zendesk / Intercom / Freshdesk / Help Scout / LiveChat)

### Zendesk

**Auth:** OAuth2 lub API token  
**Docs:**

- https://developer.zendesk.com/documentation/api-basics/authentication/creating-and-using-oauth-tokens-with-the-api/
- https://developer.zendesk.com/documentation/api-basics/authentication/oauth-vs-api-tokens/

### Intercom

**Auth:** Access Token (private app) lub OAuth (public app)  
**Docs:**

- https://developers.intercom.com/docs/build-an-integration/learn-more/authentication

### Freshdesk / Help Scout / LiveChat / Tawk.to

**Auth:** API key / OAuth (zależnie od produktu)  
**Start:**

- Freshdesk: https://developers.freshdesk.com/
- Help Scout: https://developer.helpscout.com/
- LiveChat: https://developers.livechat.com/

---

## 1.14 Płatności i subskrypcje (Stripe / PayPal / Adyen / Braintree / PL pay-by-link)

**STATUS** DEMO stub (UI + backend stub, bez realnych tokenów)

### Stripe

**Auth:** Secret API key (backend) + webhook signing secret  
**Wymagane:** `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` (frontend), `STRIPE_WEBHOOK_SECRET`  
**Docs:**

- https://docs.stripe.com/keys
- https://docs.stripe.com/webhooks

### PayPal

**Auth:** OAuth2 – wymiana `client_id` + `client_secret` na `access_token`  
**Docs:**

- https://developer.paypal.com/reference/get-an-access-token/
- https://developer.paypal.com/api/rest/

### Adyen / Braintree

**Auth:** API key + merchant account + webhooks  
**Start:**

- Adyen: https://docs.adyen.com/
- Braintree: https://developer.paypal.com/braintree/docs

### PL: Przelewy24 / PayU / Tpay

**Auth:** merchant credentials + podpisy + webhooks (zależnie od operatora)  
**Start:**

- Przelewy24: https://developers.przelewy24.pl/
- PayU: https://developers.payu.com/
- Tpay: https://tpay.com/developers

### Subskrypcje: Chargebee / Recurly

**Auth:** API key + webhooks  
**Start:**

- Chargebee: https://apidocs.chargebee.com/
- Recurly: https://developers.recurly.com/

---

## 1.15 Finanse / księgowość / ERP (QuickBooks / Xero / NetSuite / SAP / Dynamics + PL ERP)

**Auth:** zwykle OAuth2 (QuickBooks/Xero) lub tokeny/partnerstwo (ERP enterprise)  
**Start:**

- QuickBooks: https://developer.intuit.com/
- Xero: https://developer.xero.com/
- Dynamics 365: https://learn.microsoft.com/en-us/dynamics365/

PL (zależnie od produktu i licencji): enova365 / Comarch / Subiekt / WFirma / Fakturownia  
**Auth:** API key / token / integracje partnerskie  
**Start:**

- WFirma: https://wfirma.pl/
- Fakturownia: https://fakturownia.pl/

---

## 1.16 Logistyka / dostawy / zwroty (InPost / DPD / DHL / UPS / FedEx / GLS + Returnly/Loop)

**STATUS** DEMO stub (brak wdrożonej integracji w MVP)
**Auth:** API key / login+token, często whitelisting IP, często osobne środowiska testowe  
**Start (ogólne):**

- InPost: https://inpost.pl/
- DHL Developer: https://developer.dhl.com/
- UPS Developer: https://developer.ups.com/
- FedEx Developer: https://developer.fedex.com/

Zwroty:

- Loop Returns: https://www.loopreturns.com/
- Returnly (w zależności od produktu/marki): https://www.returnly.com/

---

## 1.17 Consent / privacy / tracking governance (OneTrust / Cookiebot / Didomi / GTM server-side / Stape)

**Auth:** zwykle API key / token + konfiguracja domen i kont  
**Start:**

- OneTrust: https://my.onetrust.com/s/
- Cookiebot: https://support.cookiebot.com/
- Didomi: https://developers.didomi.io/
- GTM Server-Side: https://developers.google.com/tag-platform/tag-manager/server-side
- Stape: https://stape.io/

---

## 1.18 Dane / BI / ETL / Reverse ETL / CDP

### Hurtownie

- BigQuery: **Service Account / OAuth2** (zależnie od trybu)  
  Start: https://cloud.google.com/bigquery/docs
- Snowflake: tokeny/keys (zależnie od integracji)  
  Start: https://docs.snowflake.com/
- Redshift: IAM/keys  
  Start: https://docs.aws.amazon.com/redshift/
- Databricks: PAT / OAuth (zależnie od workspace)  
  Start: https://docs.databricks.com/

### BI

- Looker Studio: konektory + Google auth  
  Start: https://support.google.com/looker-studio/
- Power BI: Azure AD OAuth2  
  Start: https://learn.microsoft.com/power-bi/
- Tableau: tokeny/OAuth zależnie od Tableau Cloud/Server  
  Start: https://help.tableau.com/

### ETL/ELT i Reverse ETL

- Fivetran / Airbyte / Stitch / Rivery / Hevo: zwykle token/API key + konektory
- Hightouch / Census: OAuth + warehouse creds  
  Start:
- Airbyte: https://docs.airbyte.com/
- Fivetran: https://fivetran.com/docs
- Hightouch: https://hightouch.com/docs
- Census: https://docs.getcensus.com/

### CDP

- Segment: tokens + sources/destinations  
  Start: https://segment.com/docs/
- mParticle: https://docs.mparticle.com/
- Tealium: https://docs.tealium.com/

---

## 1.19 Affiliate / native

**Auth:** API key / OAuth2 zależnie od sieci  
Start:

- Awin: https://developer.awin.com/
- TradeTracker: https://tradetracker.com/
- Admitad: https://developers.admitad.com/
- Taboola: https://developers.taboola.com/
- Outbrain: https://www.outbrain.com/help/advertisers/
- MGID: https://mgid.com/

---

## 1.20 “Ostatnia mila” (Sheets/Excel/Slack/Teams/Zapier/Make)

- Google Sheets: OAuth2 (Google) lub service account  
  Start: https://developers.google.com/sheets/api
- Excel/Graph: OAuth2 (Microsoft)  
  Start: https://learn.microsoft.com/graph/
- Slack: OAuth2 + bot tokens  
  Start: https://api.slack.com/
- Microsoft Teams: Graph/OAuth2  
  Start: https://learn.microsoft.com/microsoftteams/platform/
- Zapier / Make: webhooks + API keys  
  Start:
  - Zapier: https://platform.zapier.com/
  - Make: https://www.make.com/en/help

---

# 2) Minimalny „kontrakt” konfiguracji integracji (praktyczne pod PapaData)

Dla każdej integracji trzymaj (per tenant + per connection):

- `provider` (np. ga4, meta_ads, shopify)
- `auth_type` (oauth2 | api_key | webhook | service_account)
- `account_identifiers` (np. `ga4_property_id`, `ad_account_id`, `shop_domain`)
- `scopes`
- `credentials_ref` (referencja do sekretu w Secret Manager/KMS)
- `token_expires_at` (jeśli dotyczy)
- `status` (connected | needs_reauth | revoked)
- `created_at`, `updated_at`

Reautoryzacja:

- OAuth: gdy refresh padnie albo user cofnie uprawnienia → status `needs_reauth`
- API key: test-call + status `invalid_credentials`
- Webhook: test event + weryfikacja podpisu + status `webhook_verified`

---

# 3) Szybka checklista UI (co użytkownik ma zobaczyć przy “Połącz”)

- OAuth2: przycisk „Zaloguj i autoryzuj” + wybór konta (np. ad account) + zapis połączenia
- API key: pola (key/secret) + przycisk „Testuj połączenie”
- Webhook: pokaż `webhook_url` + instrukcję „wklej w panelu” + status „zweryfikowany/nie”
