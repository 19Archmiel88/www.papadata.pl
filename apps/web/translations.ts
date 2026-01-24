
import { Translations } from './types';

export const translations: Translations = {
  en: {
    langCode: 'en-US',
    common: {
      open_menu: 'Open menu',
      close_menu: 'Close menu',
      skip_to_content: 'Skip to content',
      scroll_to_top: 'Scroll to top',
      coming_soon_title: 'In preparation',
      coming_soon_desc: 'This feature is in preparation. We are finalizing the last details.',
      close: 'Close',
      toggle_theme_light: 'Switch to light mode',
      toggle_theme_dark: 'Switch to dark mode',
      back_to_home: 'Back to home',
      error_title: 'Something went wrong',
      error_desc: 'An unexpected error occurred. Refresh the page or go back home.',
      error_refresh: 'Refresh page',
      error_home: 'Back to home',
      time_now: 'Just now',
      time_minutes_ago: '{minutes}m ago',
      time_hours_ago: '{hours}h ago',
      main_nav_label: 'Main navigation',
      home_link_label: 'Back to home',
      pin: 'Pin',
      unpin: 'Unpin'
    },
    modals: {
      title: 'Dialog',
      desc: 'Modal window',
      initializingInterface: 'Initializing interface'
    },
    nav: {
      items: [
        {
          key: "features",
          label: "Features",
          dropdown: [
            { label: "Campaign Performance", actionId: "feature_campaign_perf" },
            { label: "AI Marketing Assistant", actionId: "feature_ai_assistant" },
            { label: "Growth Recommendations", actionId: "feature_growth_recs" },
            { label: "Discount Impact", actionId: "feature_discounts" },
            { label: "Product Intelligence", actionId: "feature_products" },
            { label: "Automated Reports", actionId: "feature_reports" },
            { label: "Purchase Funnel", actionId: "feature_funnel" },
            { label: "Conversion Path", actionId: "feature_conv_path" },
            { label: "Customer Analysis", actionId: "feature_customers" }
          ]
        },
        { key: "pricing", label: "Pricing" },
        {
          key: "integrations",
          label: "Integrations",
          dropdown: [
            { label: "E-commerce Platforms", actionId: "integrations_ecommerce" },
            { label: "Advertising Platforms", actionId: "integrations_ads" },
            { label: "Analytics Platforms", actionId: "integrations_analytics" },
            { label: "See All Integrations", actionId: "integrations_all" }
          ]
        },
        { key: "knowledge", label: "Knowledge Base" },
        { key: "about", label: "About Us" }
      ],
      login: "Log In",
      cta: "Demo PRO",
      mobile_dropdown_hint: "Tap for options"
    },
    features: {
      campaign_perf: {
        title: "Campaign Performance",
        tag: "PERFORMANCE",
        desc: "See Google Ads, Meta, and others in one place with unified attribution and results.",
        details: [
          "Multi-channel ROAS/CPA/CR",
          "Campaign and creative efficiency",
          "Drop and deviation alerts",
          "Period comparison"
        ],
        commonUses: [
          "Which channel is underperforming today?",
          "What changed: cost, CVR, or AOV?",
          "Which creatives should be scaled or cut?"
        ],
        requiredData: "Google Ads / Meta Ads / TikTok Ads + Store Sales"
      },
      ai_assistant: {
        title: "AI Marketing Assistant",
        tag: "AI_INSIGHTS",
        desc: "Ask questions: 'what dropped and why?' — get answers with numbers and context.",
        details: [
          "Anomaly detection + root cause",
          "Fast actionable insights"
        ],
        commonUses: [
          "Why did ROAS drop yesterday?",
          "What lowered the margin the most?",
          "Which SKUs have the highest profit at fixed spend?"
        ],
        requiredData: "Ads + Sales + (Optional) GA4"
      },
      growth_recs: {
        title: "Growth Recommendations",
        tag: "SCALE_ENGINE",
        desc: "Get specific instructions: what to change to maintain profitability.",
        details: [
          "Budget allocation tips",
          "Scaling opportunities",
          "Trend and demand forecasting"
        ],
        commonUses: [
          "Where to add budget without killing margin?",
          "Which segments are growing fastest?",
          "What to change in product/ad mix?"
        ],
        requiredData: "Ads + Sales (Costs/Margin recommended)"
      },
      discounts: {
        title: "Discount Impact",
        tag: "MARGIN_SAFE",
        desc: "Calculate if promos drive profit or just volume — and where margin leaks.",
        details: [
          "Promo efficiency (Incrementality vs. Organic Sales)",
          "Net profit impact"
        ],
        commonUses: [
          "Is this promotion actually profitable?",
          "Which SKUs should not be discounted?",
          "Why is revenue up but profit flat?"
        ],
        requiredData: "Sales + Discounts (Optional returns/costs)"
      },
      products: {
        title: "Product Intelligence",
        tag: "SKU_LOGIC",
        desc: "Profit and returns at SKU level: know what drives your bottom line and what ruins it.",
        details: [
          "Loss Leader analysis (Basket drivers)",
          "Return rate analysis",
          "Stockout forecasting"
        ],
        commonUses: [
          "Which SKUs spoil the margin despite sales?",
          "What gives the best profit in the last 14 days?",
          "What will run out of stock soon and cut ads?"
        ],
        requiredData: "Sales + SKU Catalog (Optional returns/costs)"
      },
      reports: {
        title: "Automated Reports",
        tag: "AUTOMATION",
        desc: "Weekly and monthly reports for the team and management.",
        details: [
          "PDF reports + KPI summaries",
          "Automated scheduling and delivery"
        ],
        commonUses: [
          "Single source of truth for team and agency",
          "Quick period comparisons"
        ],
        requiredData: "Sales + Ads (Optional costs/margin/returns)"
      },
      funnel: {
        title: "Purchase Funnel",
        tag: "CONV_OPT",
        desc: "See bottlenecks in the sales process and fix conversion drops.",
        details: [
          "Payment process optimization",
          "Page conversion"
        ],
        commonUses: [
          "Why is CPA rising despite steady traffic?",
          "Which checkout step is failing?",
          "Is the issue mobile-only?"
        ],
        requiredData: "GA4 (or events) + Sales"
      },
      conv_path: {
        title: "Conversion Path",
        tag: "ATTRIBUTION",
        desc: "See the full customer journey — building demand vs closing sales.",
        details: [
          "Device and channel share",
          "Profit-based attribution (where you earn most)",
          "Customer touchpoints"
        ],
        commonUses: [
          "Does Meta build demand while Google closes?",
          "What is undervalued by last click?",
          "How to reallocate budget between channels?"
        ],
        requiredData: "GA4 + Ads + Sales"
      },
      customers: {
        title: "Customer Analysis",
        tag: "LTV_GROWTH",
        desc: "Cohorts, CAC, LTV and VIP segments to scale smarter and build business value.",
        details: [
          "Cohort retention",
          "LTV and CAC tracking",
          "VIP identification"
        ],
        commonUses: [
          "Which channel brings best customers?",
          "Retention after 30/60/90 days?",
          "Who to win back?"
        ],
        requiredData: "Sales + Customers (Optional GA4/CRM)"
      }
    },
    featuresSection: {
      title: "Key Reports Ready For You",
      desc: "Modules run on a single BigQuery data model — providing consistent views of costs, sales, and profit. Control campaigns, detect anomalies, and scale with deep product and customer insights."
    },
    featureModal: {
      capabilities_tag: "WHAT YOU GET",
      module_active_tag: "COMMON USES",
      footer_left: "REQUIRED DATA",
      footer_right: "READY TO DEPLOY"
    },
    hero: {
      pill: "PapaData INTELLIGENCE",
      h1_part1: "Analyzes e-commerce data",
      h1_part2: "and provides growth recommendations - PapaData,",
      h1_part3: "AI built by professional marketers for e-commerce.",
      h2: "",
      desc: "Connect data from your store, marketplaces, and ads into one coherent model in BigQuery. PapaData daily generates reports and alerts, so you don't have to compile them manually. Try the PapaData intelligent marketing platform.",
      primary: "Test 14 days",
      secondary: "Watch Demo",
      badges: ["No card required", "EU Data (Warsaw)", "No coding"],
      meta_pipeline_tag: "PapaData INTELLIGENCE"
    },
    etl: {
      pill: "DATA ENGINE",
      title: "DATA PIPELINE ENGINE",
      desc: "Automated pipelines that turn chaos into ready-to-use data in BigQuery for reports, alerts, and AI.",
      step1_title: "DATA INGESTION",
      step1_desc: "Automatically pulls data from APIs, CSV, and databases — no manual exports.",
      step2_title: "SMART TRANSFORMATION",
      step2_desc: "Cleans, normalizes, and enriches data: SKUs, currencies, timezones, and campaign naming.",
      step3_title: "INDEXING",
      step3_desc: "Builds a contextual index for the AI Assistant to find answers and root causes faster.",
      step4_title: "OUTPUT TO BIGQUERY",
      step4_desc: "Saves ready tables in BigQuery — instantly available for KPIs, dashboards, and alerts.",
      meta_step_router: "",
      meta_active_label: "",
      meta_footer: ""
    },
    integrations: {
      pill: "INTEGRATIONS & CONNECTORS",
      title_part1: "Connect Your",
      title_part2: "Entire Ecosystem",
      desc: "Connect your store, marketplace, and ads to one place. PapaData merges sources into a consistent model in BigQuery, ready for KPIs, P&L, alerts, and AI.",
      proof: "",
      cat1_title: "E-commerce Platforms",
      cat2_title: "Advertising Platforms",
      cat3_title: "Analytics Platforms",
      categories: {
        ecommerce: "STORE",
        marketplace: "MARKETPLACE",
        ads: "ADS",
        analytics: "ANALYTICS",
        payments: "PAYMENTS",
        email: "MARKETING",
        crm: "CRM",
        support: "SUPPORT",
        data: "CUSTOM IMPORT",
        logistics: "LOGISTICS",
        finance: "FINANCE",
        consent: "PRIVACY",
        affiliate: "AFFILIATE",
        productivity: "PRODUCTIVITY"
      },
      btn_more: "More Details",
      btn_all: "CHECK INTEGRATION LIST",
      modal_title: "Integrations & Connectors",
      modal_desc: "Choose data sources — PapaData will combine them into one model in BigQuery and ensure consistency (currencies, time zones, campaigns, SKUs).",
      modal_search: "Search integrations...",
      modal_footer_tag: "Request Integration • Watch Demo",
      tab_all: "All",
      tab_ecommerce: "Store",
      tab_marketplace: "Marketplace",
      tab_ads: "Ads",
      tab_analytics: "Analytics",
      tab_payments: "Payments",
      tab_email: "Marketing",
      tab_crm: "CRM",
      tab_support: "Support",
      tab_data: "Custom",
      tab_logistics: "Logistics",
      tab_finance: "Finance",
      tab_consent: "Privacy",
      tab_affiliate: "Affiliate",
      tab_productivity: "Productivity",
      status_live: "Live",
      status_beta: "Beta",
      status_soon: "Soon",
      empty_state: "No integrations found",
      empty_state_sub: "Try adjusting your search or filters.",
      section_footer_tag: "",
      marquee_label: "Supported integrations",
      marquee_items: ["Allegro", "WooCommerce", "PrestaShop", "BaseLinker", "Meta Ads", "Google Ads", "Google Analytics 4", "TikTok Ads"],
      coming_soon_context: "Connecting with {name}",
      meta_hub_throughput: "",
      meta_api_latency: "",
      meta_status: "",
      meta_connections: "",
      meta_node_prefix: "",
      meta_mode_label: "",
      meta_mode_value: "",
      meta_sla_label: "",
      auth: {
        oauth2: "OAuth 2.0",
        api_key: "API Key",
        webhook: "Webhook",
        service_account: "Service Account",
        partner: "Partner Integration"
      },
      connect: {
        title: "Connect {name}",
        desc: "Authorize PapaData to access your data securely.",
        steps_title: "Connection Steps",
        steps: ["Grant permissions", "Select workspace", "Initialize sync"],
        workspace_label: "Workspace",
        workspace_placeholder: "Select workspace",
        workspace_loading: "Loading workspaces...",
        workspace_empty: "No workspaces available yet.",
        workspace_login_required: "Log in to choose a workspace.",
        workspace_required: "Select a workspace to continue.",
        workspace_retry: "Retry",
        workspace_cta: "Go to workspace settings",
        security_title: "Security first",
        security_desc: "Your data is encrypted and stays in the EU.",
        cta_connect: "Connect now"
      },
      items: {
        shopify: { name: "Shopify", detail: "Store" },
        woocommerce: { name: "WooCommerce", detail: "Store" },
        prestashop: { name: "PrestaShop", detail: "Store" },
        magento: { name: "Magento", detail: "Store" },
        bigcommerce: { name: "BigCommerce", detail: "Store" },
        shoper: { name: "Shoper", detail: "Store" },
        idosell: { name: "IdoSell", detail: "Store" },
        shopware: { name: "Shopware", detail: "Store" },
        comarch_esklep: { name: "Comarch e-Sklep", detail: "Store" },
        amazon_seller: { name: "Amazon Seller Central", detail: "Marketplace" },
        allegro: { name: "Allegro", detail: "Marketplace" },
        ebay: { name: "eBay", detail: "Marketplace" },
        etsy: { name: "Etsy", detail: "Marketplace" },
        baselinker: { name: "BaseLinker", detail: "Marketplace" },
        channelengine: { name: "ChannelEngine", detail: "Marketplace" },
        google_ads: { name: "Google Ads", detail: "Ads" },
        meta_ads: { name: "Meta Ads", detail: "Ads" },
        tiktok_ads: { name: "TikTok Ads", detail: "Ads" },
        microsoft_ads: { name: "Microsoft Advertising", detail: "Ads" },
        linkedin_ads: { name: "LinkedIn Ads", detail: "Ads" },
        amazon_ads: { name: "Amazon Ads", detail: "Ads" },
        allegro_ads: { name: "Allegro Ads", detail: "Ads" },
        zalando_zms: { name: "Zalando ZMS", detail: "Ads" },
        ga4: { name: "Google Analytics 4", detail: "Analytics" },
        gsc: { name: "Google Search Console", detail: "Analytics" },
        gtm: { name: "Google Tag Manager", detail: "Analytics" },
        firebase: { name: "Firebase Analytics", detail: "Analytics" },
        stripe: { name: "Stripe", detail: "Payments" },
        paypal: { name: "PayPal", detail: "Payments" },
        adyen: { name: "Adyen", detail: "Payments" },
        braintree: { name: "Braintree", detail: "Payments" },
        przelewy24: { name: "Przelewy24", detail: "Payments" },
        payu: { name: "PayU", detail: "Payments" },
        klaviyo: { name: "Klaviyo", detail: "Marketing" },
        mailchimp: { name: "Mailchimp", detail: "Marketing" },
        getresponse: { name: "GetResponse", detail: "Marketing" },
        salesmanago: { name: "SALESmanago", detail: "Marketing" },
        customerio: { name: "Customer.io", detail: "Marketing" },
        smsapi: { name: "SMSAPI", detail: "Marketing" },
        gmc: { name: "Google Merchant Center", detail: "Feed" }
      }
    },
    roi: {
      pill: "SAVINGS CALCULATOR",
      title: "Calculate how much you'll gain with PapaData:",
      desc: "Estimate the value of automation and AI in your business.",
      seg_ecommerce: "E-commerce",
      seg_agency: "Agency",
      seg_enterprise: "Enterprise",
      input_analysts: "Employee Hourly Rate (net)",
      input_hours: "Reports per month (1h each)",
      input_analysis_hours: "Hours of manual analysis?",
      hours_suffix: "h",
      month_short: "month",
      calculating_label: "CALCULATING...",
      net_efficiency_label: "NET EFFICIENCY +100%",
      time_savings_label: "TIME SAVED",
      annual_savings_label: "ANNUAL SAVINGS",
      fte_suffix_label: "% FTE",
      reports_suffix: "",
      savings_disclaimer: "Calculations based on your manual input and average efficiency gains.",
      label_manual_cost: "Current Monthly Cost",
      label_recovered_time: "Time spent on analysis",
      label_total_savings: "Estimated Monthly Savings",
      time_suffix: "h",
      currency: "PLN",
      currency_pos: "after",
      cta_btn: "Start saving now",
      rate_eco: 45,
      rate_age: 65,
      rate_ent: 85,
      efficiency_note: "Right decisions based on your business data and PapaData recommendations, showcasing trends and market insights, will increase your business efficiency by much more than what you can save with us just by saving time from the start."
    },
    security: {
      pill: "SECURITY",
      title_p1: "ENTERPRISE GRADE",
      title_p2: "SECURITY STANDARDS",
      title_p3: "DATA PROTECTION",
      title_p4: "BY DESIGN",
      desc: "Security built into the product: access control, isolation, and encryption.",
      card1_tag: "PERMISSIONS",
      card1_title: "GRANULAR ACCESS",
      card1_desc: "Access control ensures only authorized personnel can see specific data and reports.",
      card2_tag: "ISOLATION",
      card2_title: "DATA ISOLATION",
      card2_desc: "Every client environment is isolated at the data level — no data mixing.",
      card3_tag: "MASKING",
      card3_title: "DATA MASKING",
      card3_desc: "PII data is automatically masked before analysis to limit sensitive exposure.",
      card4_tag: "ENCRYPTION",
      card4_title: "SECURE CONNECTIONS",
      card4_desc: "External connections are encrypted, and data is protected in transit and at rest.",
      cta_title: "READY TO SECURE YOUR DATA?",
      cta_desc: "Learn about data isolation protocols and SOC 2 infrastructure standards.",
      cta_btn: "VIEW SECURITY WHITEPAPER"
    },
    pricing: {
      pill: "",
      title: "Simple and transparent pricing",
      desc: "Transparent pricing with no hidden fees",
      per_month: "per month",
      billing_monthly: "Monthly",
      billing_yearly: "Yearly",
      yearly_discount: "-20%",
      net_prices: "All prices are net.",
      compare_btn: "Compare plans",
      modal_title: "Detailed plan comparison",
      modal_highlights: ["Unlimited integrations", "EU Data Residency", "BigQuery Export"],
      modal_minimized_label: "Pricing",
      modal_minimized_title: "View Plans",
      currency: "PLN",
      starter: {
        name: "Starter",
        desc: "For stores just starting their data automation journey.",
        price: "199",
        features: [
          "Up to 3 data sources",
          "Weekly reports",
          "Email support",
          "Basic AI insights"
        ],
        cta: "ROZPOCZNIJ TRIAL"
      },
      professional: {
        name: "Professional",
        desc: "For scaling businesses that need daily insights.",
        price: "499",
        features: [
          "Up to 15 data sources",
          "Daily reports",
          "Priority support",
          "Priority AI"
        ],
        cta: "ROZPOCZNIJ TRIAL"
      },
      enterprise: {
        name: "Enterprise",
        desc: "Enterprise-grade solutions at scale.",
        price: "Custom",
        features: [
          "Unlimited data sources",
          "Real-time reports",
          "Dedicated manager",
          "Full AI access"
        ],
        cta: "SEND INQUIRY"
      },
      plan_meta: {
        starter: { tag: "STABLE", sid: "", infra: "", sla: "" },
        professional: { tag: "POPULAR", sid: "", infra: "", sla: "" },
        enterprise: { tag: "DEDICATED", sid: "", infra: "", sla: "" }
      },
      comparison: {
        feature_matrix_label: "Feature Matrix",
        data_sources_label: "Data Sources / Connectors",
        data_sources_starter: "Up to 3",
        data_sources_pro: "Up to 15",
        report_frequency_label: "Report Frequency",
        report_frequency_weekly: "Weekly",
        report_frequency_daily: "Daily",
        ai_semantic_label: "AI Semantic Analysis (Req/Mo)",
        ai_semantic_starter: "50",
        ai_semantic_pro: "200",
        custom_etl_label: "Custom ETL Pipelines",
        bigquery_export_label: "BigQuery Data Export",
        uptime_sla_label: "Uptime SLA",
        protocol_label: "",
        data_retention: "Data Retention",
        data_retention_unit: "days",
        support_label: "Support Standard",
        support_standard: "Standard",
        support_priority: "Priority",
        support_dedicated: "Dedicated",
        refresh_standard: "Daily",
        refresh_fast: "Hourly",
        alert_standard: "Basic",
        alert_high: "Advanced",
        alert_ultra: "Custom",
        realtime: "Real-time",
        unlimited: "Unlimited",
        swipe_hint: "Swipe to compare",
        header_tag: "",
        footer_system: "Secure Payment",
        footer_ssl: ""
      },
      meta: {
        recommended_label: "Recommended",
        capacity_label: "Capacity",
        provisioning_label: "",
        ready_installation_prefix: "",
        sys_pricing_model: "Subscription",
        tier_strategy: "Volume based",
        billing_cycle_label: "Cycle",
        ref_prefix: "",
        capacity_meter_label: "Usage",
        features_label: "",
        contact_price_label: "Custom pricing",
        contact_desc: "Tailored for large datasets.",
        lowest_30d_note: "Lowest price from the last 30 days",
      },
      errors: {
        tenant_missing: "Cannot determine active tenant. Log in again.",
        tenant_missing_cta: "Select workspace",
        payment_start: "Failed to start payment.",
        payment_generic: "An error occurred during payment initialization."
      },
      actions: {
        processing: "Processing...",
        enterprise_subject: "Enterprise Quote Inquiry"
      }
    },
    faq: {
      pill: "",
      title: "Frequently asked questions",
      items: [
        {
          q: "Is my data safe in PapaData?",
          a: "Yes. We use standard encryption and store data exclusively in European Google Cloud regions. We are GDPR compliant and offer automatic PII masking."
        },
        {
          q: "How long does the integration process take?",
          a: "Most native connectors can be configured in under 5 minutes without writing any code."
        },
        {
          q: "Can I connect my own BigQuery warehouse?",
          a: "Yes. PapaData is built to work with your existing infrastructure. You can link your own GCP project while maintaining full data ownership."
        },
        {
          q: "Do I need an analyst to handle the platform?",
          a: "No. Our AI Assistant acts as your virtual data analyst: it answers questions and detects anomalies in natural language."
        },
        {
          q: "What are the costs after the free trial?",
          a: "After the 14-day trial, you choose a plan that fits your data scale. Prices start at 199 PLN net per month."
        }
      ],
      meta: {
        header_tag: "",
        ref_prefix: "",
        verified_label: "VERIFIED",
        response_label: "",
        footer_line1: "Need more help?",
        footer_line2: "Contact our team."
      }
    },
    techFuture: {
      pill: "VISION",
      title: "The future of e-commerce",
      desc: "Predictive analytics and AI are no longer optional. We deliver enterprise-grade technology for every business.",
      stat1_label: "UPTIME",
      stat1_val: "99.9%",
      stat1_tag: "",
      stat2_label: "PRECISION",
      stat2_val: "99.9%",
      stat2_tag: "",
      stat3_label: "SETUP",
      stat3_val: "<5 min",
      stat3_tag: "",
      card1_title: "PREDICTIVE AI",
      card1_desc: "Know your trends before they happen with Gemini Pro.",
      card1_tag: "",
      card2_title: "AUTOMATIC ETL",
      card2_desc: "Data cleaning and normalization on autopilot.",
      card2_tag: "",
      card3_title: "SYNC REAL-TIME",
      card3_desc: "Always up-to-date data in BigQuery and dashboards.",
      card3_tag: ""
    },
    knowledgeBase: {
      pill: "LEARNING CENTER",
      title: "Knowledge Base",
      desc: "Guides, tutorials, and e-commerce growth strategies.",
      btn_view: "Read guide",
      card1_title: "System Architecture",
      card1_desc: "Learn how we handle your data.",
      card2_title: "Growth Strategies",
      card2_desc: "Scale your ads effectively.",
      card3_title: "AI Playbook",
      card3_desc: "Talk to your data like a pro.",
      cards: [
        { id: "1", tag: "TECH" },
        { id: "2", tag: "MARKETING" },
        { id: "3", tag: "AI" }
      ],
      footer_tag: ""
    },
    socialProof: {
      title: "Trusted by e-commerce leaders",
      subtitle: "Join hundreds of brands using PapaData.",
      verified: "Verified Review",
      omnibus: "Compliant with Omnibus directive",
      reviews: [
        { quote: "PapaData transformed our reporting workflow.", author: "John Doe", role: "CEO at FashionBrand" }
      ]
    },
    vertexPlayer: {
      ariaLabel: "Product Tour Player",
      tabs: {
        ai: { label: "AI Insights" },
        pipeline: { label: "Guardian" },
        exec: { label: "P&L Matrix" }
      },
      content: {
        ai: { title: "Semantic Analysis", desc: "Ask anything about your data in natural language." },
        pipeline: { title: "Anomaly Detection", desc: "Real-time monitoring of performance drops." },
        exec: { title: "P&L View", desc: "Consolidated metrics for leadership." }
      }
    },
    finalCta: {
      title: "Ready to scale?",
      desc: "Start your 14-day free trial today.",
      sub_text: "No credit card required. Cancel anytime.",
      btn_trial: "Start Trial",
      btn_demo: "Book Demo",
      badges: ["SECURE", "EU HOSTED"],
      meta: {
        top_tag: "READY_TO_DEPLOY",
        system_ready_label: "",
        core_objective_label: "",
        deployment_status_label: "",
        bottom_tag: ""
      }
    },
    videoModal: {
      title: "Product Demo",
      close_aria_label: "Close video"
    },
    about: {
      tag: "THE TEAM",
      title: "About PapaData",
      subtitle: "Data intelligence built for scale.",
      body: "We are a team of data engineers and growth marketers dedicated to making enterprise-grade analytics accessible to every e-commerce business. Founded in Warsaw, we scale globally while keeping data residency local.",
      points: ["Built in EU", "Customer Obsessed", "AI-First Vision", "GDPR Ready by Default"],
      footer_left: "Legal info",
      footer_right: "Warsaw, Poland",
      meta_tag: ""
    },
    footer: {
      tagline: "Data that grows with you.",
      hosting: "Powered by Google Cloud",
      status: "System operational",
      col1_title: "Product",
      col1_links: [
        { label: "Features", actionId: "features" },
        { label: "Pricing", actionId: "pricing" },
        { label: "Integrations", actionId: "integrations" }
      ],
      col2_title: "Company",
      col2_links: [
        { label: "About", actionId: "about" },
        { label: "FAQ", actionId: "faq" },
        { label: "Contact", actionId: "contact" }
      ],
      col3_title: "Resources",
      col3_links: [
        { label: "Knowledge Base", actionId: "knowledge" },
        { label: "Security", actionId: "security" }
      ],
      legal_links: [
        { label: "Terms", actionId: "legal_terms" },
        { label: "Privacy", actionId: "legal_privacy" },
        { label: "Cookies", actionId: "legal_cookies" },
        { label: "DPA", actionId: "legal_dpa" },
        { label: "Subprocessors", actionId: "legal_subprocessors" },
        { label: "AI Disclaimer", actionId: "legal_ai" },
        { label: "Accessibility", actionId: "legal_accessibility" }
      ],
      copyright: "© 2024 PapaData",
      region: "Europe (Warsaw)",
      meta: {
        network_status_label: "Status",
        infra_region_label: "Region",
        protocol_level_label: "Protocol",
        protocol_level_value: "HTTP/3",
        resources_title: "Resources",
        resources_desc: "Developer and business guides.",
        resources_links: ["API Docs", "Changelog"],
        sys_log_label: "Log",
        contact_title: "Contact",
        contact_desc: "Send us a request and we will respond within 2 hours on business days.",
        contact_email: "support@papadata.ai",
        contact_name_placeholder: "Full name",
        contact_email_placeholder: "Work email",
        contact_message_placeholder: "How can we help?",
        contact_cta: "Send request",
        contact_success_title: "Request received",
        contact_success_desc: "We will contact you shortly.",
        contact_message_ok: "Looks good",
        contact_message_min: "Min. 10 characters"
      }
    },
    auth: {
      login_tab: "Login",
      register_tab: "Register",
      email_label: "Email",
      email_work_hint: "Work",
      email_invalid: "Enter a valid email address.",
      email_invalid_hint: "Provide a valid email to continue.",
      pass_label: "Password",
      login_btn: "Sign In",
      register_btn: "Create Account",
      forgot_pass: "Forgot password?",
      oauth_google: "Google",
      oauth_ms: "Microsoft",
      oauth_account_suffix: "Account",
      nip_label: "TAX ID (NIP)",
      nip_placeholder: "1234567890",
      nip_invalid: "Invalid Tax ID",
      nip_required_hint: "Provide a valid Tax ID to continue.",
      email_placeholder_login: "your@email.com",
      email_placeholder_register: "work@company.com",
      company_name_label: "Company Name",
      company_name_placeholder: "Enter company name",
      company_address_label: "Address",
      company_street_label: "Street and number",
      company_street_placeholder: "Street, number",
      company_postal_code_label: "Postal code",
      company_postal_code_placeholder: "00-000",
      company_city_label: "City",
      company_city_placeholder: "City",
      company_regon_label: "REGON (optional)",
      company_regon_placeholder: "REGON",
      company_krs_label: "KRS (optional)",
      company_krs_placeholder: "KRS",
      company_not_found: "Not found, please fill in manually",
      company_autofill_badge: "Auto-filled",
      company_autofill_badge_gus_mf: "Auto-filled from GUS/MF",
      nip_searching: "Searching databases...",
      entity_validating: "Validating entity...",
      entity_validated_label: "ENTITY_VALIDATED",
      pass_strength_weak: "Weak",
      pass_strength_fair: "Fair",
      pass_strength_strong: "Strong",
      password_invalid_hint: "Password must meet all requirements.",
      gateway_tag: "",
      oauth_divider: "OR",
      next_protocol: "Continue",
      login_link_sent_title: "Verification link sent",
      login_link_sent_desc: "Check inbox at {email}.",
      verify_session: "Verify session",
      code_label: "Code (6 digits)",
      code_placeholder: "______",
      code_title_login: "Log in with code",
      code_title_register: "Verify email",
      code_desc: "Enter the 6-digit code sent to your email.",
      resend_in: "Resend in",
      resend_code: "Resend code",
      resend_link: "Resend link",
      code_invalid: "Invalid code. Enter 6 digits.",
      send_login_link: "Send login link",
      back: "Back",
      proceed_security: "Proceed",
      entropy_analysis: "Strength",
      password_req_length: "8+ chars",
      password_req_uppercase: "Upper",
      password_req_special: "Special",
      ssl_tag: "",
      back_to_site: "Back to site",
      register_hint: "Don't have an account?",
      create_account_cta: "Create account & start trial",
      mock_company_name: "Mock Corp Sp. z o.o.",
      mock_company_address: "Danych 12, Warsaw"
    },
    papaAI: {
      title: "Papa AI",
      subtitle: "Intelligent Assistant",
      intro: "How can I help you today? I have full context of your data.",
      close_label: "Close assistant",
      toggle_label: "Toggle Papa AI",
      panel_label: "AI Panel",
      placeholder: "Type a message...",
      send: "Send",
      cancel_label: "Cancel",
      thinking: "Thinking...",
      evidence_label: "Evidence",
      add_to_report: "Add to report",
      set_alert: "Set alert",
      warning_stale: "Data may be stale",
      warning_missing: "Missing integration data",
      warning_locked: "Feature locked by plan",
      rate_limit: "Too many requests. Try again in {seconds}s.",
      footer_text: "PapaAI Enterprise v3.5 • Warsaw GCP Node",
      error_generic: "AI connection error. Please try again.",
      suggestions: [
        { label: "🔍 Detect anomalies", prompt: "Analyze view {view} for anomalies in last 24h." },
        { label: "📈 Budget Recs", prompt: "Where should I increase budget to keep margin?" },
        { label: "⚖️ P&L Audit", prompt: "Perform a quick audit of my OpEx." }
      ]
    },
    postAuth: {
      welcome_title: "Welcome!",
      welcome_desc: "Ready to start your data journey?",
      connect_title: "Connect data",
      connect_desc: "Choose your first data source.",
      primary_connect: "Go to Integrations",
      secondary_close: "Explore Dashboard",
      meta_tag: "ONBOARDING"
    },
    dashboard: {
      menu_overview: "Overview",
      menu_analytics: "Analytics",
      menu_growth: "Growth",
      menu_support: "Support",
      status_label: "Session",
      status_ready: "Ready",
      freshness_label: "Last update",
      plan_professional: "Professional",
      trial_days_left: "Trial: {days} days",
      trial_expired_title: "Trial expired",
      trial_expired_desc: "Production features are paused until subscription is activated. Your data and settings stay intact.",
      trial_expired_cta: "Activate subscription",
      workspace_missing_title: "Select a workspace",
      workspace_missing_desc: "Choose an active workspace to load data and enable integrations.",
      workspace_missing_cta: "Go to workspace settings",
      billing: {
        trial_banner_tag: "TRIAL",
        trial_banner_owner: "Trial ends in {days} days. Add a payment method to keep access.",
        trial_banner_member: "Trial ends in {days} days. Ask an owner to add payment.",
        cta_add_payment: "Add payment method",
        cta_activate: "Activate plan",
        manage_link: "Manage subscription",
        read_only_badge: "READ-ONLY",
        read_only_tooltip: "Billing required to unlock actions",
        paywall_title: "Trial ended — read-only access",
        paywall_desc: "Your data is safe. Activate subscription to restore production features.",
        paywall_member_cta: "Ask an owner to activate billing",
        paywall_allowed_title: "Still available",
        paywall_allowed_items: ["View dashboards", "Export reports", "Integrations (read-only)"],
        paywall_blocked_title: "Blocked until activation",
        paywall_blocked_items: ["Live sync", "AI recommendations", "Alerts & automations"],
        trial_modal_tag: "TRIAL",
        trial_modal_title_7: "Your trial ends in 7 days",
        trial_modal_desc_7: "Trial ends in {days} days. Add a payment method to keep continuous access.",
        trial_modal_title_3: "{days} days left in your trial",
        trial_modal_desc_3: "Add payment now to avoid read-only mode when the trial ends.",
        trial_modal_title_1: "Last day of trial",
        trial_modal_desc_1: "Trial ends in {days} day. Activate a plan to avoid read-only mode.",
        trial_modal_cta_primary: "Add payment method",
        trial_modal_cta_secondary: "Remind me later",
        trial_modal_member_hint: "Only an owner can manage billing."
      },
      attribution_label: "Attribution Model",
      prod_pill: "PROD",
      menu_pandl: "P&L",
      menu_ads: "Ads",
      menu_reports: "Reports",
      menu_customers: "Customers",
      menu_products: "Products",
      menu_guardian: "Guardian",
      menu_alerts: "Alerts",
      menu_integrations: "Integrations",
      menu_pipeline: "DATA PIPELINE",
      menu_settings: "Settings",
      menu_end_session: "Log Out",
      demo_pill: "DEMO MODE",
      demo_tooltip: "This is DEMO",
      filter_1d: "24h",
      filter_7d: "7d",
      filter_30d: "30d",
      kpi_revenue: "Revenue",
      kpi_orders: "Orders",
      kpi_roas: "ROAS",
      kpi_cac: "CAC",
      conversion_rate: "CVR",
      net_profit: "Net Profit",
      modal_upgrade_title: "Upgrade to PRO",
      modal_upgrade_desc: "Get unlimited access and real-time data.",
      modal_upgrade_btn: "Go Live",
      modal_upgrade_close: "Later",
      cta_upgrade_live: "Upgrade",
      chart_sales_velocity: "Sales Velocity",
      chart_revenue_split: "Revenue Split",
      chart_ad_performance: "Ad Performance",
      chart_customer_cohorts: "Customer Cohorts",
      guardian_status_scanning: "Scanning...",
      guardian_threat_level: "Safe",
      guardian_log_header: "System Logs",
      guardian_type_warn: "WARN",
      guardian_type_security_alert: "SEC_ALERT",
      guardian_type_info: "INFO",
      guardian_type_alert: "ALERT",
      alert_title_conversions: "Drop in CVR",
      alert_desc_conversions: "CVR dropped by 12% in the last 4 hours.",
      settings_api_label: "API Access",
      settings_webhook_label: "Webhooks",
      integrations_title: "Connect Data",
      integrations_desc: "Sync your store and ads.",
      integrations_connect: "Connect",
      integrations_connecting: "Connecting...",
      integrations_connected: "Connected",
      integrations_cta: "View All",
      integrations_mode_demo: "Demo Mode",
      integrations_mode_live: "Live Sync",
      alerts_policy_demo: "Demo Alerts",
      alerts_policy_live: "Real-time Policy",
      cohort_data_demo: "Sample Cohorts",
      cohort_data_live: "Active Cohorts",
      sidebar_session_ready: "SESSION_ACTIVE",
      footer_peer_id: "NODE",
      footer_session_time: "Session",
      footer_encryption: "E2E",
      overview_stream_label: "Live Stream",
      overview_legend_current: "Current",
      overview_legend_previous: "Previous",
      overview_time_start: "Start",
      overview_time_peak: "Peak",
      overview_time_sync: "Sync",
      overview_source_shopify: "Shopify",
      overview_source_allegro: "Allegro",
      overview_source_other: "Other",
      overview_connectors_title: "Status",
      overview_connectors_status: "Healthy",
      overview_connectors_col_connector: "Source",
      overview_connectors_col_latency: "Latency",
      overview_connectors_col_load: "Load",
      overview_connectors_col_rows: "Rows",
      overview_connectors_col_status: "Status",
      overview_connectors: [{ id: "1", label: "Shopify" }],
      ai_mode_label: "Papa AI",
      ai_mode_on: "On",
      ai_mode_off: "Off",
      context_menu: {
        label: "Options",
        drill: "Drill down",
        explain_ai: "Explain with AI",
        add_report: "Add to report",
        export: "Export CSV",
        set_alert: "Set alert"
      },
      widget: {
        empty_title: "No Data",
        empty_desc_filters: "Try changing filters.",
        cta_clear_filters: "Clear filters",
        partial_badge: "Partial Data",
        partial_desc: "Sync in progress.",
        error_title: "Data Error",
        error_desc: "We couldn't load data. Try again.",
        cta_retry: "Try again",
        offline_title: "Offline",
        offline_desc: "No connection. Data may be outdated."
      },
      overview_v2: {
        alerts: {
          title: "Active Alerts",
          desc: "Critical issues detected.",
          live_label: "Live Guardians Active",
          view_all: "See All",
          action_open: "Fix",
          action_ai: "Explain",
          badge_delay: "Delay",
          badge_quality: "Quality",
          severity_critical: "Critical",
          severity_warning: "Warning",
          severity_info: "Info",
          items: [
            {
              id: "1",
              title: "ROAS anomaly: Meta Ads",
              impact: "-14.2% vs yesterday",
              time: "12m ago",
              severity: "critical",
              context: "Meta Ads",
              target: "ads"
            },
            {
              id: "2",
              title: "Projected stock-out",
              impact: "SKU-742 (3 days)",
              time: "1h ago",
              severity: "warning",
              context: "Logistics",
              target: "products"
            },
            {
              id: "3",
              title: "ETL delay: Google Analytics",
              impact: "Lag: 42 min",
              time: "3h ago",
              severity: "info",
              context: "GA4 Stream",
              target: "guardian"
            }
          ]
        },
        ai: {
          title: "Papa AI",
          desc: "Analyze your data.",
          placeholder: "Ask anything...",
          submit: "Ask",
          shortcut_hint: "⌘K",
          toggle_hint: "CMD + K to toggle",
          suggested_label: "Suggested",
          recent_label: "Recent",
          cached_label: "Last ask",
          disabled_title: "AI Disabled",
          disabled_desc: "Enable AI to start.",
          enable_cta: "Enable",
          suggested: [],
          recent: [],
          prompt_template: "Explain {context}",
          response: {
            title: "AI Insight",
            summary_label: "Summary",
            summary_text: "Analysis completed.",
            evidence_label: "Evidence",
            evidence_points: [],
            sources_label: "Sources",
            sources: [],
            disclaimer: "AI can make mistakes.",
            actions: {
              open_view: "View",
              add_report: "Report",
              set_alert: "Alert"
            }
          }
        },
        insights: {
          items: [
            { id: "ins-1", title: "Largest ROAS drop in Campaign X", impact: "-18% vs week", context: "Campaign X" },
            { id: "ins-2", title: "Returns rising for SKU Y", impact: "+6% in 7d", context: "SKU Y" },
            { id: "ins-3", title: "New VIP segment increases LTV", impact: "+12% in 30d", context: "VIP Segment" }
          ]
        },
        kpis: {
          title: "KPIs",
          cache_label: "Live",
          badge_quality: "99.9%",
          explain_action: "Explain",
          actions_hint: "Right click for more",
          labels: {
            spend: "Spend",
            profit: "Profit",
            aov: "AOV",
            new_returning: "New/Ret",
            ltv_30d: "LTV 30d"
          },
          defs: {
            revenue: "Total sales",
            spend: "Total ad spend",
            roas: "Return on ad spend",
            cpa: "Cost per acquisition",
            profit: "Gross profit",
            aov: "Average order value",
            new_returning: "Ratio",
            ltv_30d: "30 day LTV"
          }
        },
        charts: {
          revenue_spend: { title: "Revenue vs Spend", desc: "Overview", driver: "Meta Ads" },
          roas_cpa: { title: "Efficiency", desc: "ROAS & CPA", driver: "Google Ads" },
          series_labels: { revenue: "Revenue", spend: "Spend", roas: "ROAS", cpa: "CPA" },
          tooltip_delta: "Δ",
          tooltip_driver: "Driver",
          focus_label: "Focus",
          actions: { breakdown: "Breakdown", show_campaigns: "Campaigns", explain: "Explain", clear_focus: "Clear" },
          range: { label: "Range", prompt: "Custom", apply_local: "Apply", apply_global: "Global", clear: "Clear", start_label: "From", end_label: "To" },
          badges: { quality: "Verified", freshness: "Real-time" },
          quality_desc: "High quality data",
          freshness_desc: "Last sync: 2m ago"
        },
        tables: {
          campaigns: {
            title: "Top Campaigns",
            desc: "Performance by campaign",
            context_template: "Campaign: {name}",
            columns: { campaign: "Name", spend: "Spend", revenue: "Revenue", roas: "ROAS", cpa: "CPA", ctr: "CTR", cvr: "Conv", delta: "Δ" },
            metric_defs: { roas: "Return", cpa: "Cost", ctr: "Click", cvr: "Conv" },
            actions: { drill: "View", ai: "Analyze", report: "Report", alert: "Alert", view_all: "View All Ads" }
          },
          skus: {
            title: "Top SKUs",
            desc: "Performance by product",
            context_template: "SKU: {name}",
            columns: { sku: "Name", revenue: "Rev", profit: "Prof", margin: "Marg", returns: "Ret", stock: "Stock", trend: "Trend" },
            metric_defs: { margin: "Gross", return_rate: "Rate", stock_risk: "Risk" },
            tags: { toxic: "Toxic", high_margin: "High", stock_risk: "Risk" },
            stock: { low: "Low", medium: "Med", high: "High" },
            actions: { drill: "View", ai: "Analyze", report: "Report", alert: "Alert", inventory_hub: "Inventory Hub" }
          },
          sample: {
            campaigns: [{ id: "1", name: "Summer Sale" }],
            skus: [{ id: "1", name: "Product A" }]
          }
        },
        actions: {
          title: "Recommended Actions",
          desc: "AI prioritized tasks",
          labels: { impact: "Imp", confidence: "Conf", effort: "Eff", risk: "Risk", priority: "Prio", evidence: "Evidence" },
          status: { new: "New", in_progress: "Doing", done: "Done" },
          values: { low: "Low", medium: "Med", high: "High" },
          ctas: { explain_ai: "Explain", save_task: "Save", evidence: "Proof", add_report: "Report" },
          cards: []
        }
      },
      growth: {
        title: "GROWTH ENGINE", desc: "Scale your sales",
        cards: {
          title: "Recommendation Cards", desc: "Suggested business actions",
          labels: { impact: "IMP", confidence: "CONF", effort: "EFF", risk: "RISK", why_now: "WHY NOW?", evidence: "EVIDENCE", simulation: "SIMULATION", status: "STATUS" },
          ctas: { evidence: "EVIDENCE", explain: "EXPLAIN", save_task: "SAVE", add_report: "REPORT", open_measure: "VIEW" },
          statuses: { new: "NEW", approved: "OK", implemented: "IMPLEMENTED", measured: "SUCCESS", closed: "X" },
          priorities: { low: "LOW", medium: "MEDIUM", high: "HIGH" },
          values: { low: "LOW", medium: "MEDIUM", high: "HIGH" },
          simulation: { before: "BEFORE", after: "AFTER", delta: "Δ" },
          items: []
        },
        budget: {
          title: "Budget", desc: "Allocation optimization", toggle_channels: "Channels", toggle_campaigns: "Campaigns",
          current_label: "Current", suggested_label: "Suggested", aggressiveness_label: "Strategy",
          aggressiveness_steps: ["conservative", "standard", "aggressive"],
          aggressiveness_options: { conservative: "Conservative", standard: "Std", aggressive: "Fast" },
          assumptions_label: "Assumptions", assumptions_text: "Based on historical trends and AI.",
          channels: [], campaigns: []
        }
      },
      ads_v2: {
        title: "PAID ADS", desc: "Multi-channel effectiveness",
        summary: { roas_label: "BLENDED ROAS", roas_status: "STABLE", model_label: "DDA MODEL" },
        media_mix: {
          title: "Media Mix", desc: "Budget allocation", context_template: "Mix: {name}", metric_spend: "Spend", metric_revenue: "Revenue",
          granularity_day: "Day", granularity_week: "Week", badge_freshness: "", badge_quality: "",
          action_breakdown: "View", action_explain: "Analyze", tooltip_share: "Share", tooltip_driver: "Reason"
        },
        efficiency: { title: "Efficiency", desc: "ROAS/CPA", metric_roas: "ROAS", metric_cpa: "CPA", action_show_campaigns: "View", action_explain: "Explain" },
        share: { title: "Market share", desc: "Share of Voice", spend_label: "Spend Share", revenue_label: "Revenue Share", delta_label: "Δ", attention_badge: "ATTENTION" },
        creatives: {
          title: "Ads", desc: "Creative performance", filters_label: "Filters",
          filters: { format: "Format", placement: "Place", campaign: "Camp" },
          metrics: { ctr: "CTR", cvr: "CVR", cpa: "CPA", roas: "ROAS", spend: "Spend", revenue: "Rev" },
          actions: { explain: "Analysis", report: "Report", alert: "Alert", drill: "View" },
          items: []
        },
        drilldown: { level_campaign: "Campaign", level_adset: "Ad set", level_creative: "Creative" },
        ai_prompt: "Explain {name}"
      },
      products_v2: {
        title: "SKU intelligence", desc: "Product and logistics data", ai_prompt: "Analyze {name}",
        items: [
          { id: "sku-01", name: "Premium Wireless Headset V2" },
          { id: "sku-02", name: "Ergonomic Mechanical Keyboard" },
          { id: "sku-03", name: "UltraWide 4K Gaming Monitor" },
          { id: "sku-04", name: "Smart Home Hub Pro" },
          { id: "sku-05", name: "Noise Cancelling Earbuds" },
          { id: "sku-06", name: "Thunderbolt 4 Docking Station" },
          { id: "sku-07", name: "High-Precision Optical Mouse" },
          { id: "sku-08", name: "Portable SSD 2TB Extreme" },
          { id: "sku-09", name: "Webcam 4K HDR Streamer" },
          { id: "sku-10", name: "RGB LED Desk Lamp" }
        ],
        scatter: {
          title: "SKU Matrix", desc: "Margin vs volume analysis", context_template: "Product: {name}", size_label: "Volume", x_label: "Margin %", y_label: "Net profit",
          hint_top_right: "BESTSELLERY", hint_bottom_right: "CASH COWS", hint_top_left: "POTENTIAL", hint_bottom_left: "OGONY",
          tooltip_profit: "Profit", tooltip_margin: "Margin", tooltip_units: "Units", tooltip_returns: "Returns",
          tooltip_stock: "Stock", tooltip_trend: "Trend", tooltip_driver: "Reason",
          tags: { toxic: "TOKSIC", high_margin: "HIGH MARGIN", stock_risk: "STOCK RISK" },
          multi_select_label: "Selected", compare: { cta_ai: "AI", cta_compare: "Compare", cta_clear: "X" }
        },
        details: {
          title: "SKU Detail", empty: "Select a product from the matrix", empty_cta: "Select first",
          labels: { profit: "Net profit", volume: "Volume", returns: "Returns", stock: "Stock" },
          stock: { low: "LOW", medium: "OK", high: "HIGH" },
          actions: { explain: "AI Analysis", alert: "Set alert", report: "To report" }
        },
        movers: {
          title: "SKU Trend", desc: "Top changes", rising_label: "Rising", falling_label: "Falling", cta_alert: "Stock alert", cta_ai: "Explain",
          driver_viral: "Viral social trend",
          driver_search: "Search demand up",
          driver_stock: "Stock issues",
          driver_competition: "High competition",
          rising: [], falling: []
        },
        table: {
          title: "Product List", desc: "Tabular view", filters_label: "Filters", filters: ["TOKSIC", "BESTSELLER"],
          columns: { sku: "SKU CODE", revenue: "REVENUE", profit: "PROFIT", margin: "MARGIN", returns: "RET", stock: "STOCK", trend: "7D" },
          metric_defs: { margin: "Contribution margin", returns: "Return rate", trend: "7-day trend" },
          actions: { label: "ACTIONS", drill: "VIEW", ai: "AI", report: "REPORT", alert: "ALERT" }
        }
      },
      customers_v2: {
        title: "LOYALTY ANALYSIS", desc: "Customer retention and LTV", ai_prompt: "Explain {name}",
        summary: { retention_label: "Avg. Retention", vip_label: "Active VIPs" },
        cohorts: {
          title: "Cohort Retention", desc: "Customer return rate", mode_month: "Monthly", mode_week: "Weekly", row_label: "Purchase date",
          row_prefix: "M", col_prefix: "M", small_sample: "Small sample size", context_label: "Cohort",
          tooltip_retention: "Retention", tooltip_size: "Size", tooltip_period: "Period"
        },
        ltv: { title: "LTV Curve", desc: "Customer lifetime value", def: "30-day LTV", tooltip_month: "Month", tooltip_value: "Value" },
        churn: {
          title: "Churn risk",
          desc: "At-risk segments",
          actions: { explain: "Analysis", alert: "Alert" },
          segments: [],
          labels: {
            one_time_buyers: "One-time Buyers",
            recent_dropoffs: "Recent Dropoffs",
            inactive_vips: "Inactive VIPs"
          }
        },
        vip: {
          title: "VIP Customers",
          desc: "RFM segmentation",
          actions: { report: "Report", alert: "Alert" },
          segments: [],
          labels: {
            top_spenders: "Top 1% Spenders",
            brand_advocates: "Brand Advocates",
            bulk_buyers: "Bulk Buyers"
          }
        },
        month_label: "Month"
      },
      reports_v2: {
        title: "AUTOMATIC REPORTS", desc: "Automated data summaries",
        last_report: {
          title: "Last report", desc: "Latest file", name: "Weekly Summary", range_label: "Period", range_value: "7 days",
          date_label: "Date", date_value: "Today", language_label: "Language", language_value: "EN",
          cta_preview: "Preview", cta_pdf: "Download PDF", cta_resend: "Email"
        },
        list: { title: "Report Archive", items: [], actions: { preview: "View", download: "Download", open: "Link" } },
        generate: { title: "New Report", desc: "Quick generation", cta: "Run Engine", fields: [{ label: "L", value: "V" }], sections: ["Overview", "Revenue", "Profit"] },
        diff: { title: "Key Differences", items: ["ROAS -12%", "Revenue +6%"] },
        export_formats: ["PDF", "CSV", "JSON"],
        export_history: [
          { id: "exp-1", name: "Weekly Summary", format: "PDF", range: "Last 7 days", created: "12:40", urlLabel: "signed-url" },
          { id: "exp-2", name: "Monthly Board Report", format: "CSV", range: "Dec 2024", created: "09:15", urlLabel: "signed-url" },
          { id: "exp-3", name: "Performance Snapshot", format: "JSON", range: "Q1 2025", created: "08:02", urlLabel: "signed-url" }
        ]
      },
      pipeline_v2: {
        title: "DATA PIPELINE", desc: "ETL and sync status", ai_prompt: "Error analysis {name}",
        actions: { open_guardian: "Run Guardian" },
        sources: {
          title: "Data sources", desc: "Raw data ingestion",
          columns: { source: "SOURCE", status: "STATUS", last_sync: "SYNC", delay: "DLY", records: "WRS", action: "ACTION" },
          items: [], actions: { test: "Test", sync: "Sync", explain: "Analyze" }
        },
        transforms: { title: "Transformation", desc: "Cleaning and RAG", items: [], actions: { run: "Run" } },
        rag: { title: "AI Index", desc: "Vector database", cta: "Rebuild", status_label: "Stat", status_value: "OK", last_update_label: "Upd", last_update_value: "1h ago", coverage_label: "Cov", coverage_value: "100%" },
        bigquery: {
          title: "BigQuery Database", desc: "Data warehouse", cta_open: "Open BQ", cta_export: "Exp", lineage_cta: "Lineage",
          columns: { table: "TABLE", desc: "DESCRIPTION", freshness: "FRESHNESS", action: "ACTION" }, items: []
        }
      },
      guardian_v2: {
        title: "DATA GUARDIAN", desc: "Quality and freshness monitoring", ai_prompt: "Issue with {name}",
        badge_label: "Security protocols active",
        health_label: "Data health", health_status: "VERY GOOD",
        uptime_label: "Uptime (30d)",
        uptime_value: "99.98%",
        range_label: "Period analysis", range_options: ["24h", "7d", "30d"], only_issues_label: "Errors only",
        actions: { run_validations: "Validate", rebuild_index: "Index" },
        status_healthy: "HEALTHY",
        status_delayed: "DELAYED",
        delay_under_2_min: "< 2 min",
        delay_na: "n/a",
        severity_critical: "Critical",
        severity_warning: "Warning",
        severity_info: "Info",
        sources: [
          { id: "shopify_raw", name: "Shopify Orders (Webhooks)" },
          { id: "meta_capi", name: "Meta Conversions API" },
          { id: "google_ads_main", name: "Google Ads Performance" },
          { id: "ga4_events", name: "GA4 Event Stream" },
          { id: "allegro_orders", name: "Allegro Marketplace" },
          { id: "warehouse_erp", name: "Internal ERP Stock" }
        ],
        freshness: {
          title: "Data Freshness", desc: "Sync monitor",
          menu_label: "Freshness config",
          columns: { source: "SOURCE", status: "STATUS", last_sync: "SYNC", delay: "DELAY", records: "ROWS", action: "ACTION" },
          items: [], actions: { explain: "Analyze" }
        },
        quality: {
          title: "Quality & Anomalies",
          desc: "Detected inconsistencies",
          empty_state: "No quality incidents",
          items: [
            { id: "q1", title: "Duplicate Orders Detected", impact: "Inconsistency in P&L Revenue", severity: "Critical" },
            { id: "q2", title: "Ad Spend Mismatch", impact: "Meta Ads vs BigQuery Delta > 5%", severity: "Warning" },
            { id: "q3", title: "Missing SKU Metadata", impact: "Empty margin for 12 new items", severity: "Info" },
            { id: "q4", title: "ETL Connection Lag", impact: "Latency increased to 450ms", severity: "Warning" }
          ],
          actions: { view: "View", fix: "Fix" }
        },
        rag: {
          title: "RAG Model",
          desc: "AI Context",
          status_heading: "RAG Model Status",
          index_title: "Vector Index",
          index_subtitle: "Active Semantic Layer",
          explain_context: "RAG Index State",
          cta: "Run",
          status_label: "Status",
          status_value: "OK",
          last_update_label: "Last",
          last_update_value: "1h",
          coverage_label: "Cov",
          coverage_value: "100%"
        }
      },
      integrations_v2: {
        title: "INTEGRATIONS", desc: "Connection management", header_badge: "System Hub Active", search_placeholder: "Search connector...",
        filters: { all: "All", active: "Active", disabled: "Disabled", attention: "Needs attention" },
        sorts: { issues: "Issues", recent: "Recent", name: "Name" },
        status_active: "Active", status_disabled: "Disabled", status_attention: "Issue", status_connecting: "Connecting...", status_connected: "Connected",
        active_connectors_label: "Active Connectors", records_synced_label: "Records Synced", uptime_label: "Uptime (30d)", auth_prefix: "Auth", sync_prefix: "Sync",
        scope_label: "Scope", scope_default: "Full access", auth_label: "Auth", last_sync_label: "Sync",
        last_sync_recent: "Just now", last_sync_delay: "Delay", last_sync_disabled: "Disabled",
        freshness_label: "SLA", freshness_status: "99.9% OK", actions: { test: "Test", details: "Show", refresh: "Sync" },
        security_badge_label: "Encryption Protocol Active",
        security_title: "Secure Centralization",
        security_desc: "All connections are encrypted with AES-256. Your data stays in a dedicated BigQuery environment in the selected EU region.",
        security_cta_keys: "Manage Keys",
        security_cta_sla: "Download SLA Report"
      },
      knowledge_v2: {
        title: "KNOWLEDGE BASE", desc: "Guides and strategies", search_placeholder: "Search...", ai_prompt: "Help: {name}",
        badge_label: "Learning Center Active",
        resources_label: "Resource Library",
        empty_title: "No results",
        empty_desc: "Try adjusting your search filters.",
        clear_filters_label: "Clear filters",
        filters: {
          category: [
            { id: "all", label: "All categories" },
            { id: "STRATEGY", label: "Strategy" },
            { id: "DATA", label: "Data & Engineering" },
            { id: "AI", label: "Artificial Intelligence" }
          ],
          level: [],
          type: [],
          module: []
        },
        card: { cta_open: "Read", cta_ai: "AI Analysis" },
        detail: { title: "Content", empty: "Select guide", cta_apply: "Apply", cta_report: "Report" },
        empty_list: "Select an article from the list to view details",
        booking: {
          title: "Book a consultation",
          subtitle: "Expert Strategic Sync 1:1",
          topic_label: "Session topic",
          topic_placeholder: "e.g. Scaling Meta Ads",
          date_label: "Preferred date",
          budget_label: "Monthly budget",
          budget_options: ["10k - 50k PLN", "50k - 200k PLN", "200k+ PLN"],
          guarantee_title: "Satisfaction guarantee",
          guarantee_desc: "The session will be billed after confirming the date. Refunds if no actionable recommendations are delivered.",
          submit_cta: "Submit request",
          close_cta: "Close"
        },
        expert: {
          pill: "Expert Sync",
          title: "Need support?",
          desc: "Book a 45-minute consultation with a PapaData data architect.",
          cta_label: "Book a slot (349 PLN)",
          ai_context: "Expert consultation"
        },
        actions: { open_article: "Open article", share_team: "Share with team", bookmark: "Save for later" },
        resources: [
          {
            id: "res-1",
            category: "STRATEGY",
            title: "Scaling Meta Ads in 2024",
            desc: "How to manage budget effectively with rising CPM.",
            author: "Adam Wiśniewski, Head of Growth",
            level: "Advanced",
            type: "Article",
            time: "12 min",
            module: "Ads",
            videoId: "meta-scaling-101",
            longContent: "Scaling Meta Ads requires moving from ad set-level optimizations to broad targeting and stronger creative. Learn how Advantage+ changes the rules and why BigQuery retention is key for attribution modeling.\n\nKey topics:\n- Account structure 2.0: Less is more\n- Creative testing framework: Find winners\n- Using CAPI to stabilize results."
          },
          {
            id: "res-2",
            category: "DATA",
            title: "BigQuery architecture for e-commerce",
            desc: "Table structure and query cost optimization.",
            author: "Marta Nowak, Data Engineer",
            level: "Expert",
            type: "Guide",
            time: "25 min",
            module: "Pipeline",
            longContent: "Understanding your BigQuery schema is step one to advanced LTV models. We compare nested vs flat structures and how partitioning impacts operational costs at scale."
          },
          {
            id: "res-3",
            category: "AI",
            title: "Prompt Engineering for Analysts",
            desc: "How to talk to Papa AI to get deep insights.",
            author: "AI Agent Unit-01",
            level: "Intermediate",
            type: "Interactive",
            time: "8 min",
            module: "Overview",
            videoId: "ai-prompts-mastery",
            longContent: "Papa AI is more than a chatbot. It is a data warehouse interface. Learn Chain-of-Thought techniques so the assistant explains correlations between ROAS and abandoned carts across customer segments."
          }
        ]
      },
      settings_workspace_v2: {
        title: "Workspace Settings", desc: "Workspace configuration",
        badge_label: "Workspace Config",
        data: {
          title: "Data",
          desc: "Location and retention",
          retention_label: "Retention",
          retention_options: [
            { value: 30, label: "30 Days (Starter)" },
            { value: 60, label: "60 Days (Professional)" },
            { value: 365, label: "1 Year (Custom / Enterprise)" }
          ],
          retention_help: "Help",
          retention_warning: {
            title: "Retention downgrade warning",
            desc: "When moving from 60 to 30 days, export your data before shortening retention.",
            cta_export: "Export data"
          },
          region_label: "Region",
          region_options: [{ value: "europe-central2", label: "Europe (Warsaw) - GCP Node" }]
        },
        privacy: { masking_label: "PII Masking", masking_desc: "Hide sensitive data" },
        attribution: {
          title: "Attribution",
          desc: "Assignment model",
          models: [
            { id: "dda", label: "Data-Driven AI", desc: "Uses ML to weigh each touchpoint.", default: true },
            { id: "last_click", label: "Last Click Paid", desc: "100% of conversions go to the last paid channel.", default: false },
            { id: "linear", label: "Linear", desc: "Equal credit across all interactions.", default: false },
            { id: "first_click", label: "First Click", desc: "Boosts top-funnel awareness channels.", default: false }
          ]
        },
        integrations: {
          title: "Links",
          desc: "Active connectors",
          items: [
            { id: "shopify", label: "Shopify Storefront", desc: "Token: •••• a92f", status: "Active" },
            { id: "meta", label: "Meta Ads Manager", desc: "Account: 942-011-222", status: "Active" },
            { id: "ga4", label: "Google Analytics 4", desc: "Property: 28419201", status: "Active" }
          ]
        },
        alerts: {
          title: "Notifications",
          desc: "Alert rules",
          items: [
            { id: "roas_drop", label: "ROAS drop > 20% (Daily)", enabled: true },
            { id: "etl_lag", label: "ETL delay > 60 min", enabled: true },
            { id: "stock_risk", label: "Low stock risk < 5 days", enabled: false },
            { id: "margin_anom", label: "Product margin anomaly", enabled: true }
          ]
        },
        notifications: {
          channels_title: "Notification channels",
          email_label: "Email (MUST)",
          schedule_title: "Report schedule",
          schedules: [
            { id: "starter", label: "Starter", value: "Weekly" },
            { id: "pro", label: "Professional", value: "Daily" },
            { id: "enterprise", label: "Enterprise", value: "Real-time / configurable" }
          ],
          recipients_title: "Alert recipients",
          recipients: ["alerts@papadata.ai", "ops@papadata.ai"],
          quiet_hours_label: "Quiet hours",
          quiet_hours_value: "22:00–06:00 (Europe/Warsaw)",
          export_title: "Report exports",
          export_formats: ["PDF", "CSV", "JSON"]
        },
        ai: {
          title: "AI Model",
          desc: "Assistant configuration",
          items: [
            { label: "Model Engine", value: "Gemini 2.5 Pro" },
            { label: "Context Window", value: "1M Tokens" },
            { label: "Temperature", value: "0.4 (Analytical)" }
          ]
        },
        footer_note: "Save required", cta_primary: "Deploy to production", cta_secondary: "Save changes"
      },
      settings_org_v2: {
        title: "Organizations", desc: "Account and billing management",
        company: { title: "Company", fields: [] },
        users: { title: "Users", items: [], cta_invite: "Invite" },
        billing: { title: "Billing", items: [], cta_change: "Change plan" },
        security: { title: "Security", items: [], cta_logout_all: "Logout sessions" },
        audit: { title: "Audit Logs", items: [], cta_export: "Export" },
        privacy: { title: "Privacy Policy", items: [], cta_export: "Download data", cta_delete: "Delete account" },
        badge_label: "Organization Hub",
        license_label: "3 / 15 Licenses",
        mock: {
          company_fields: [
            { label: "Legal Name", value: "PapaData Intelligence Sp. z o.o." },
            { label: "Tax ID", value: "PL5251234567" },
            { label: "Registered Address", value: "Data St 12, 00-001 Warsaw" },
            { label: "Billing Email", value: "billing@papadata.ai" }
          ],
          team_members: [
            { name: "Adam Wiśniewski", email: "adam@papadata.ai", role: "Owner", status: "Online" },
            { name: "Marta Nowak", email: "marta@papadata.ai", role: "Analyst", status: "Away" },
            { name: "Jan Kowalski", email: "jan.k@external.com", role: "Viewer", status: "Offline" }
          ],
          billing_info: [
            { label: "Current Plan", value: "Professional PRO (Active Trial)" },
            { label: "Next Invoice", value: "01.05.2024 (499.00 PLN)" },
            { label: "Payment Method", value: "Google Identity Pay" },
            { label: "Subscription Status", value: "Trial Mode" }
          ],
          billing_plans: [
            { id: "starter", name: "Starter", price: "159 PLN/mo (annual) / 199 PLN/mo", note: "Up to 3 sources, weekly report" },
            { id: "pro", name: "Professional", price: "399 PLN/mo (annual) / 499 PLN/mo", note: "Up to 15 sources, daily report" },
            { id: "enterprise", name: "Enterprise", price: "Custom pricing", note: "Unlimited sources, real-time reports" }
          ],
          invoices: [
            { id: "inv-0424", label: "Invoice 04/2024", status: "Paid", amount: "499.00 PLN" },
            { id: "inv-0324", label: "Invoice 03/2024", status: "Paid", amount: "499.00 PLN" },
            { id: "inv-0224", label: "Invoice 02/2024", status: "Paid", amount: "499.00 PLN" }
          ],
          audit_logs: [
            { label: "Login via Google", value: "Success (IP: 84.10.x.x) - 12:42" },
            { label: "Connector Update", value: "Meta Ads (by Adam W.) - 09:15" },
            { label: "Audit Log Export", value: "Requested - 08:30" }
          ],
          login_methods: ["Google", "Microsoft", "Company email (verification)"],
          sessions: [
            { id: "device-1", label: "MacBook Pro • Warsaw", value: "Active • 12:40" },
            { id: "device-2", label: "Windows • Poznan", value: "Active • 10:05" },
            { id: "device-3", label: "iPhone • Warsaw", value: "Active • 08:12" }
          ],
          status_card: {
            label: "Status",
            value: "Active Trial (Professional)",
            desc: "Expires in 14 days. After that, production features will be paused."
          },
          payer: { label: "Payer", value: "Owner • Adam Wiśniewski" },
          billing_cycle: { label: "Billing cycle", value: "Monthly" },
          payment_status: {
            label: "Payment status",
            ok: "Active",
            error: "Payment issue",
            fix_cta: "Fix payment",
            ok_tooltip: "No payment issues"
          },
          card_payment: {
            label: "Card payment",
            desc: "Add a card or update billing details"
          },
          plans_label: "Plans",
          invoices_label: "Invoice history",
          invoice_pdf_cta: "PDF",
          approve_plan_cta: "Approve subscription plan",
          security_title: "Login & Security",
          login_method_label: "Login method",
          login_method_value: "Google Identity Cloud",
          login_methods_label: "Available methods",
          mfa_label: "MFA",
          mfa_value: "Recommended (default)",
          sessions_label: "Device sessions",
          compliance: {
            title: "Compliance & Data (EEA)",
            desc: "Data processed only in europe-central2 (Warsaw).",
            cta_dpa: "Download DPA",
            cta_retention: "Retention policy",
            cta_confirmations: "Confirmations",
            cta_delete_org: "Delete Organization"
          }
        },
        footer_note: "Changes in organization settings apply to all workspaces in the account.",
        cta_save: "Save changes"
      },
      alerts_v2: {
        title: "Alerts", desc: "System alerts", domain_label: "Domain", domains: ["Ads", "Products"],
        state_label: "State", states: ["Active"],
        actions: { explain_ai: "AI", open_view: "Open", set_alert: "Alert", mute: 'Mute' },
        filters: { all: "All", critical: "Crit", warning: "Warn", info: "Info" },
        context_fallback: "Dashboard",
        prompt_template: "Explain the alert \"{title}\" in the context of {context}. What remediation steps do you recommend?",
        empty_state: "No active alerts for selected filters",
        impact_template: "Impact: {value} vs average",
        mock_alerts: [
          { title: "ROAS anomaly: Meta Ads", context: "Meta Ads Performance", target: "ads", severity: "critical", baseProb: 0.9 },
          { title: "Projected stock-out SKU-42", context: "Inventory Logistics", target: "products", severity: "warning", baseProb: 0.7 },
          { title: "Duplicate orders detected", context: "Data Integrity", target: "guardian", severity: "critical", baseProb: 0.8 },
          { title: "ETL delay: Google Analytics", context: "GA4 Pipeline", target: "guardian", severity: "warning", baseProb: 0.6 },
          { title: "CPA increase: Search Brand", context: "Google Ads Search", target: "ads", severity: "warning", baseProb: 0.5 },
          { title: "New VIP segment identified", context: "Customer Segmentation", target: "customers", severity: "info", baseProb: 0.4 },
          { title: "Margin validation error", context: "P&L Audit", target: "pandl", severity: "critical", baseProb: 0.85 },
          { title: "Shopify API instability", context: "Shopify Connector", target: "integrations", severity: "warning", baseProb: 0.3 },
          { title: "LTV goal reached: Cohort M2", context: "Cohort Retention", target: "customers", severity: "info", baseProb: 0.2 },
          { title: "Bot traffic detected (Referral)", context: "Analytics Quality", target: "guardian", severity: "warning", baseProb: 0.45 }
        ]
      },
      pnl_title: "P&L", pnl_model: "Model", pnl_net_margin_label: "Net Margin",
      pnl_contribution_margin_label: "Contribution Margin",
      pnl_tax_est_label: "Tax (est.)",
      pnl_tab_summary: "Summary",
      pnl_tab_detail: "Details",
      pnl_live_calculation: "Live calculation",
      pnl_status_stable: "Stable",
      pnl_status_high: "High",
      pnl_status_fixed: "Fixed",
      pnl_gross_profit: "Gross Profit", pnl_net_profit: "Net Profit", pnl_after_opex: "After OpEx",
      pnl_waterfall: "Waterfall", pnl_region_label: "Region", pnl_final_state: "Final State",
      pnl_cost_breakdown: "Costs", pnl_dim_category: "Category", pnl_badge_audited: "Audited",
      pnl_revenue: "Revenue", pnl_cogs: "COGS", pnl_fees: "Fees", pnl_refunds: "Refunds",
      pnl_shipping: "Shipping", pnl_ad_spend: "Ad Spend", pnl_payroll: "Payroll",
      pnl_tools: "Tools", pnl_contribution: "Contribution", pnl_export_live: "Export",
      pnl_export_audit_pdf: "Download audit PDF",
      pnl_context_template: "P&L Line: {label} ({value})",
      pnl_ai_prompt_template: "Analyze the P&L line {label}. Is the value {value} optimal for revenue {revenue}?",
      pnl_ebitda_label: "EBITDA",
      pnl_analyze_profitability: "Analyze profitability",
      ads_title: "Ads", ads_attribution: "Attr", ads_total_roas: "ROAS", ads_status_optimal: "Optimal",
      ads_spend_vs_revenue: "S/R", ads_latency: "Lat", ads_label_spend: "Spend", ads_label_revenue: "Rev",
      ads_automations: "Auto", ads_agent: "Agent", ads_auto_bid: "Bid", ads_anomaly_detect: "Anomaly",
      ads_fraud_filter: "Fraud", ads_creative_fatigue: "Fatigue", ads_open_live: "Live",
      ads_channel_matrix: "Matrix", ads_model_refreshed: "Refreshed", ads_col_channel: "Ch",
      ads_col_spend: "Spend", ads_col_revenue: "Rev", ads_col_roas: "ROAS", ads_col_cpa: "CPA",
      ads_col_conversions: "Conv",
      customers_title: "Cust", customers_dim_segment: "Seg",
      customers_pii_masked: "Masked", customers_segment_new: "New", customers_segment_returning: "Ret",
      customers_segment_vip: "VIP", customers_aov: "AOV", customers_ltv: "LTV", customers_repeat_rate: "Rep",
      customers_open_cohorts_live: "Cohorts", customers_cohort_title: "Title",
      customers_metric_returning: "Returning", customers_cohort_label: "Cohort",
      customers_month_label: "Month", customers_model_note: "Note", products_title: "Prod",
      products_dim_sku: "SKU", products_stock_signal: "Stock", products_col_sku: "SKU",
      products_col_product: "Product", products_col_units: "Units", products_col_revenue: "Rev",
      products_col_margin: "Margin", products_col_stock: "Stock", products_col_status: "Status",
      products_status_ok: "Healthy", products_status_low: "Low", products_status_crit: "Crit",
      products_suggestion: "Sugg", products_restock_prefix: "Restock ", products_restock_suffix: " units",
      products_open_inventory_live: "Inv", products_price_signal: "Price", products_elasticity_model: "Elast",
      products_discount_opt: "Disc", products_bundle_opt: "Bundle", products_risk_stockout: "Risk",
      products_return_risk: "Ret", products_note_best_for: "Best for", products_note_bundle: "Note",
      products_note_risk_stockout: "Warning", products_note_return_risk: "Returns",
      products_open_pricing_lab: "Pricing",
      alerts_title: "Alerts",
      alerts_stream: "Stream",
      alerts_ack_required: "Ack",
      alerts_action_prefix: "Act: ", alerts_ack: "Ack", alerts_acked: "Acked", alerts_open_runbook: "Runbook",
      alerts_notify_policy: "Policy", alerts_channel_email: "Email", alerts_channel_slack: "Slack",
      alerts_channel_sms: "SMS", alerts_quiet_hours: "Quiet", alerts_quiet_hours_window: "Window",
      alerts_connect_live_channels: "Connect", alerts_severity_alert: "Alert",
      alerts_severity_security: "Security", alerts_severity_warning: "Warning", alerts_severity_info: "Info",
      integrations_connector_count: "Count",
      settings_title: "Settings",
      settings_read_safe: "Safe",
      settings_region: "Region",
      settings_gdpr_enforced: "GDPR",
      settings_data_retention: "Data Retention",
      settings_pii_masking: "PII Masking",
      settings_masking_desc: "Hide sensitive data",
      settings_days: "days", settings_connector_tokens: "Tokens", settings_scoped_auth: "Scoped",
      settings_connector_shopify_label: "Shopify", settings_connector_shopify_desc: "Desc",
      settings_connector_allegro_label: "Allegro", settings_connector_allegro_desc: "Desc",
      settings_connector_google_ads_label: "GAds", settings_connector_google_ads_desc: "Desc",
      settings_connector_meta_capi_label: "Meta", settings_connector_meta_capi_desc: "Desc",
      settings_connector_ga4_label: "GA4", settings_connector_ga4_desc: "Desc",
      settings_connector_email_label: "Email", settings_connector_email_desc: "Desc",
      settings_apply_live: "Apply", status_enabled: "Enabled", status_disabled: "Disabled", status_on: "On", status_off: "Off",
      status_monitor: "Monitor", status_healthy: "Healthy", status_syncing: "Sync",
      status_high: "High", status_low: "Low", tenant_mode_delay: "Delay", tenant_mode_demo: "Demo",
      tenant_mode_live: "Live", workspace_mode_label: "Mode", btn_pin: "Pin", btn_unpin: "Unpin",
      pnl_gross_margin_short: "GM",
      ads_channels: [
        { id: "meta_ads", label: "Meta Ads", short_label: "Meta" },
        { id: "google_ads", label: "Google Ads", short_label: "Google" },
        { id: "tiktok_ads", label: "TikTok Ads", short_label: "TikTok" },
        { id: "affiliates", label: "Affiliates", short_label: "Aff" }
      ],
      products_catalog: [],
      cohort_week_prefix: "W", cohort_month_prefix: "M", guardian_logs: [],
      range_1d: "1d", range_7d: "7d", range_30d: "30d", range_90d: "90d", range_mtd: "MTD",
      range_qtd: "QTD", range_ytd: "YTD", range_custom: "Custom", compare_prev: "Prev",
      compare_yoy: "YoY", compare_y: "Y", attribution_last_click: "Last", attribution_data_driven: "Data",
      attribution_diff_badge: "Diff", attribution_undo: "Undo", filter_channel: "Channel",
      filter_account: "Account", filter_campaign: "Campaign", filter_country: "Country",
      filter_device: "Device", filter_segment: "Segment", filter_category: "Category",
      filter_source: "Source", filter_option_all: "All", filter_option_meta: "Meta",
      filter_option_google: "Google", filter_option_tiktok: "TikTok", filter_option_affiliate: "Aff",
      filter_option_account_a: "A", filter_option_account_b: "B", filter_option_brand: "Brand",
      filter_option_prospecting: "Prosp", filter_option_retargeting: "Ret", filter_option_pl: "PL",
      filter_option_de: "DE", filter_option_cz: "CZ", filter_option_uk: "UK",
      filter_option_mobile: "Mob", filter_option_desktop: "Desk", filter_option_tablet: "Tab",
      filter_option_new: "New", filter_option_returning: "Ret", filter_option_vip: "VIP",
      filter_option_top_sellers: "Top", filter_option_low_margin: "Low", filter_option_bundles: "Bundles",
      filter_option_shopify: "Shopify", filter_option_allegro: "Allegro", filter_option_pos: "POS",
      sidebar_tagline: "Tag", nav_group_start: "Start", nav_group_ai: "AI",
      nav_group_performance: "Perf", nav_group_fundamentals: "Fund", nav_group_ops: "Ops",
      nav_group_settings: "Sett", nav_overview: "Over", nav_growth: "Grow", nav_ads: "Ads",
      nav_products: "Prod", nav_customers: "Cust", nav_pandl: "P&L", nav_alerts: "Alrt",
      nav_integrations: "Int", nav_guardian: "Guard", nav_reports: "Rep", nav_pipeline: "Pipe",
      nav_knowledge: "Know", nav_settings_workspace: "Work", nav_settings_org: "Org",
      sidebar_pin: "Pin", sidebar_unpin: "Unpin", session_label: "Sess", session_ready: "Ready",
      session_processing: "Proc", session_error: "Err", mode_demo: "Demo", mode_live: "Live",
      workspace_label: "Work", workspace_papastore_pl: "PL", workspace_papastore_pl_detail: "Detail",
      workspace_papastore_eu: "EU", workspace_papastore_eu_detail: "Detail",
      workspace_demo: "Demo", workspace_demo_detail: "Detail",
      workspace_last_sync_recent: "Now", workspace_last_sync_delay: "Delay",
      workspace_last_sync_error: "Err", workspace_search: "Search", workspace_pinned_label: "Pin",
      workspace_recent_label: "Rec", workspace_empty: "Empty", status_ok: "OK", status_delay: "Dly",
      status_error: "Err", data_freshness_label: "Fresh", command_open: "Open",
      command_shortcut: "K", command_title: "Palette", command_desc: "Run",
      command_placeholder: "Type", command_group_navigation: "Nav",
      command_group_actions: "Act", command_group_resources: "Res", command_empty: "None",
      command_nav_hint: "Hint", command_action_report: "Rep", command_action_report_desc: "Desc",
      command_action_alert: "Alrt", command_action_alert_desc: "Desc",
      command_action_pipeline: "Pipe", command_action_pipeline_desc: "Desc",
      command_action_integrations: "Int", command_action_integrations_desc: "Desc",
      command_action_go_live: "Live", command_action_go_live_desc: "Desc",
      command_action_workspace: "Work", command_action_workspace_desc: "Desc",
      command_resource_roas: "ROAS", command_resource_roas_desc: "Desc",
      command_resource_bigquery: "BQ", command_resource_bigquery_desc: "Desc",
      command_resource_ai: "AI", command_resource_ai_desc: "Desc",
      notifications_title: "Notif", notification_roas_title: "ROAS",
      notification_roas_desc: "Desc", notification_roas_time: "Time",
      notification_delay_title: "Delay", notification_delay_desc: "Desc",
      notification_delay_time: "Time", notification_action_explain: "Explain",
      notification_action_open: "Open", notification_action_quality: "Qual",
      context_meta_roas: "Meta", context_label: "Context", context_clear: "Clear",
      filters_clear: "Clear", filters_empty: "Empty", settings_shortcut: "S",
      account_title: "ACC", account_profile: "PROF", account_access: "ACC",
      account_billing: "BILL", account_logout: "LOG", account_end_session: "END",
      cta_go_live: "GO", demo_banner_title: "DEMO", demo_banner_desc: "SYNTH",
      demo_banner_cta_primary: "LIVE", demo_banner_cta_secondary: "UP",
      demo_banner_cta_tertiary: "LEARN", demo_banner_dismiss: "X",
      confirm_unsaved_changes: "Confirm"
    },
    promo: {
      title: "BOOST YOUR E-COMMERCE WITH AI",
      desc: "Connect your data and get ready-to-use recommendations in minutes.",
      btn_trial: "Start 14-day trial",
      btn_demo: "Watch demo",
      dismiss_7_days: "Dismiss for 7 days",
      minimized_label: "Special Offer",
      minimized_title: "Free Trial Available",
      features: ["Up to 15 data sources", "Daily AI insights", "PDF & Interactive reports"],
      meta: {
        sid_label: "",
        security_tag: "",
        limited_mode_tag: "LIMITED_TIME_OFFER",
        compliance_tag: "GDPR_COMPLIANT"
      }
    },
    promo_v2: {
      main: {
        title: "Start your 14-day trial",
        subhead: "Connect sources and see KPIs + alerts on your own data. Most chosen: Professional.",
        cta_pro: "Start Professional trial",
        cta_starter: "Start Starter trial",
        cta_demo: "Watch demo (2 min)",
        microcopy: "No charges for 14 days. You can change your plan at any time.",
        omnibus_note: "If a promo is active, we show the lowest price from the last 30 days.",
        reasons_title: "Why this plan",
        reasons_pro: ["Daily alerts", "Higher AI limits", "Priority support"],
        reasons_starter: ["Quick setup", "Weekly reports", "Core KPIs"],
        pro_card: {
          name: "PROFESSIONAL",
          desc: "Daily reports and alerts + higher AI limit.",
          tag: "RECOMMENDED",
          bullets: ["Up to 15 data sources", "Daily reports and alerts", "Priority support", "Higher AI limit"]
        },
        starter_card: {
          name: "STARTER",
          desc: "Quick start and data work validation.",
          bullets: ["Up to 3 data sources", "Weekly PDF reports", "Standard support", "AI Analysis"]
        }
      },
      intercept: {
        title: "Before you choose Starter…",
        subhead: "If you plan more than 3 sources or want daily alerts, Professional will save you time from day one.",
        bullets: [
          "Daily anomaly alerts (ROAS/CPA/spend) instead of weekly summaries",
          "More data sources (up to 15) — no hitting limits fast",
          "Higher AI limit + priority support"
        ],
        cta_pro: "I choose Professional (trial)",
        cta_starter: "Stay with Starter (trial)",
        microcopy: "You can switch plans later — without losing data or configuration."
      },
      system_label: "System Authorization",
      plan_meta: {
        premium_label: "PROTOCOL_PREMIUM_ACTIVE",
        standard_label: "STANDARD_ACCESS"
      },
      trust_bar: "EU Data (Warsaw) • Data Isolation • Encrypted Connections",
      trust_security_label: "AES_256_SECURED"
    },
    cookies: {
      meta_line: "Cookie Policy & Data Management",
      badge: "PRIVACY",
      title: "Cookie Settings",
      desc: "We use cookies and similar technologies to ensure the site works correctly, is secure, and (with your consent) to measure traffic and campaign performance (GA4, Google Ads, Meta). You can accept all, reject optional, or customize your settings.",
      policy_link: "/legal/cookies",
      policy_text: "Cookie Policy",
      policy_privacy_label: "Privacy policy",
      policy_cookies_label: "Cookies policy",
      policy_privacy_link: "/legal/privacy",
      policy_cookies_link: "/legal/cookies",
      accept_all: "Accept All",
      reject_optional: "Reject Optional",
      settings: "Settings",
      save_settings: "Save Settings",
      back: "Back",
      necessary_label: "Necessary",
      necessary_desc: "Ensure basic site operations, security, and core functions like session maintenance and fraud protection.",
      necessary_tag: "REQUIRED",
      analytical_label: "Analytical (GA4)",
      analytical_desc: "Help us understand how users interact with the site (e.g., number of visits, traffic sources) to improve products and content.",
      analytical_tag: "OPTIONAL",
      marketing_label: "Marketing (Google Ads, Meta)",
      marketing_desc: "Used to measure campaign effectiveness and—if you consent—to tailor advertisements (e.g., remarketing).",
      marketing_tag: "OPTIONAL",
      functional_label: "Functional / Preferences",
      functional_desc: "Remember additional settings like preferences to make your experience smoother.",
      functional_tag: "OPTIONAL",
      lead: "Choose which cookie categories you consent to. Necessary cookies are always enabled for the site to function correctly.",
      providers_title: "Providers",
      providers_desc: "Below is a list of tools used on our site. Details (storage time, data scope, legal basis) are in our Cookie Policy.",
      provider_ga4: "Google Analytics 4 (Google LLC) – measurement of site traffic and behavior (aggregates/stats).",
      provider_ads: "Google Ads (Google LLC) – conversion measurement and campaign effectiveness, remarketing (with consent).",
      provider_meta: "Meta Pixel (Meta Platforms, Inc.) – conversion measurement and campaign effectiveness, remarketing (with consent).",
      provider_gtm: "Google Tag Manager (Google LLC) – tool for firing tags; does not perform profiling on its own.",
      cookie_ids_label: "Sample cookie identifiers",
      cookie_ids_desc: "Cookie names may vary based on provider configuration and updates (e.g., _ga/_gid for GA4, gcl* for Google Ads, _fbp for Meta).",
      save_choice: "Save Choice",
      footer_note: "You can change your consent at any time in the footer (\"Cookie settings\").",
      footer_left: "GDPR COMPLIANT",
      footer_right: "HOSTED IN EU",
    }
  },
  pl: {
    langCode: 'pl-PL',
    common: {
      open_menu: 'Otwórz menu',
      close_menu: 'Zamknij menu',
      skip_to_content: 'Przejdź do treści',
      scroll_to_top: 'Przewiń do góry',
      coming_soon_title: 'W przygotowaniu',
      coming_soon_desc: 'Ta funkcja jest w przygotowaniu. Finalizujemy ostatnie szczegóły.',
      close: 'Zamknij',
      toggle_theme_light: 'Przełącz na tryb jasny',
      toggle_theme_dark: 'Przełącz na tryb ciemny',
      back_to_home: 'Powrót do strony głównej',
      error_title: 'Coś poszło nie tak',
      error_desc: 'Wystąpił nieoczekiwany błąd. Odśwież stronę lub wróć na stronę główną.',
      error_refresh: 'Odśwież stronę',
      error_home: 'Wróć na stronę główną',
      time_now: 'Teraz',
      time_minutes_ago: '{minutes} min temu',
      time_hours_ago: '{hours} h temu',
      main_nav_label: 'Główna nawigacja',
      home_link_label: 'Powrót do strony głównej',
      pin: 'Przypnij',
      unpin: 'Odepnij'
    },
    modals: {
      title: 'Dialog',
      desc: 'Okno modalne',
      initializingInterface: 'Inicjalizacja interfejsu'
    },
    nav: {
      items: [
        {
          key: "features",
          label: "Funkcje",
          dropdown: [
            { label: "Wyniki Kampanii", actionId: "feature_campaign_perf" },
            { label: "Asystent Marketingowy AI", actionId: "feature_ai_assistant" },
            { label: "Rekomendacje Wzrostu", actionId: "feature_growth_recs" },
            { label: "Wpływ Rabatów", actionId: "feature_discounts" },
            { label: "Analityka Produktów", actionId: "feature_products" },
            { label: "Automatyczne Raporty", actionId: "feature_reports" },
            { label: "Lejek Zakupowy", actionId: "feature_funnel" },
            { label: "Ścieżka Konwersji", actionId: "feature_conv_path" },
            { label: "Analiza Klientów", actionId: "feature_customers" }
          ]
        },
        { key: "pricing", label: "Cennik" },
        {
          key: "integrations",
          label: "Integracje",
          dropdown: [
            { label: "Platformy E-commerce", actionId: "integrations_ecommerce" },
            { label: "Platformy Reklamowe", actionId: "integrations_ads" },
            { label: "Platformy Analityczne", actionId: "integrations_analytics" },
            { label: "Wszystkie Integracje", actionId: "integrations_all" }
          ]
        },
        { key: "knowledge", label: "Baza Wiedzy" },
        { key: "about", label: "O nas" }
      ],
      login: "Zaloguj się",
      cta: "Demo PRO",
      mobile_dropdown_hint: "Stuknij, aby zobaczyć opcje"
    },
    features: {
      campaign_perf: {
        title: "Wyniki Kampanii",
        tag: "PERFORMANCE",
        desc: "Zobacz Google Ads, Meta i inne w jednym miejscu z ujednoliconą atrybucją i wynikami.",
        details: [
          "Wielokanałowy ROAS/CPA/CR",
          "Efektywność kampanii i kreacji",
          "Alerty o spadkach i odchyleniach",
          "Porównanie okresów"
        ],
        commonUses: [
          "Który kanał radzi sobie dziś gorzej?",
          "Co się zmieniło: koszt, CVR czy AOV?",
          "Które kreacje skalować, a które wyłączyć?"
        ],
        requiredData: "Google Ads / Meta Ads / TikTok Ads + Sprzedaż w sklepie"
      },
      ai_assistant: {
        title: "Asystent Marketingowy AI",
        tag: "AI_INSIGHTS",
        desc: "Zadawaj pytania: 'co spadło i dlaczego?' — otrzymuj odpowiedzi z liczbami i kontekstem.",
        details: [
          "Wykrywanie anomalii + przyczyna źródłowa",
          "Szybkie, możliwe do wdrożenia wnioski"
        ],
        commonUses: [
          "Dlaczego ROAS spadł wczoraj?",
          "Co najbardziej obniżyło marżę?",
          "Które SKU mają najwyższy zysk przy stałym budżecie?"
        ],
        requiredData: "Reklamy + Sprzedaż + (Opcjonalnie) GA4"
      },
      growth_recs: {
        title: "Rekomendacje Wzrostu",
        tag: "SCALE_ENGINE",
        desc: "Otrzymuj konkretne instrukcje: co zmienić żeby utrzymać rentowność.",
        details: [
          "Wskazówki dotyczące alokacji budżetu",
          "Możliwości skalowania",
          "Prognozowanie trendów i popytu"
        ],
        commonUses: [
          "Gdzie dodać budżet bez zabijania marży?",
          "Które segmenty rosną najszybciej?",
          "Co zmienić w miksie produktów/reklam?"
        ],
        requiredData: "Reklamy + Sprzedaż (rekomendowane Koszty/Marża)"
      },
      discounts: {
        title: "Wpływ Rabatów",
        tag: "MARGIN_SAFE",
        desc: "Oblicz, czy promocje napędzają zysk czy tylko wolumen — i gdzie ucieka marża.",
        details: [
          "Efektywność promocji (Inkrementalność vs. Organiczna Sprzedaż)",
          "Wpływ na zysk netto"
        ],
        commonUses: [
          "Czy ta promocja jest faktycznie rentowna?",
          "Których SKU nie należy przeceniać?",
          "Dlaczego przychody rosną, a zysk stoi w miejscu?"
        ],
        requiredData: "Sprzedaż + Rabaty (opcjonalnie zwroty/koszty)"
      },
      products: {
        title: "Analityka Produktów",
        tag: "SKU_LOGIC",
        desc: "Zysk i zwroty na poziomie SKU: dowiedz się, co napędza Twój wynik, a co go psuje.",
        details: [
          "Analiza \"Loss Leader\" czyli Przyciągacze koszyka",
          "Analiza współczynnika zwrotów",
          "Prognozowanie braków magazynowych"
        ],
        commonUses: [
          "Które kreacje skalować, a które wyłączyć?",
          "Co dało najlepszy zysk w ostatnich 14 dniach?",
          "Co wkrótce się wyprzeda i spowoduje wyłączenie reklam?"
        ],
        requiredData: "Sprzedaż + Katalog SKU (opcjonalnie zwroty/koszty)"
      },
      reports: {
        title: "Automatyczne Raporty",
        tag: "AUTOMATION",
        desc: "Tygodniowe i miesięczne raporty dla zespołu i zarządu.",
        details: [
          "Raporty PDF + podsumowania KPI",
          "Automatyczne planowanie i wysyłka"
        ],
        commonUses: [
          "Tygodniowy update dla zarządu w kilka sekund",
          "Jedno źródło prawdy dla zespołu i agencji",
          "Szybkie porównania okresów"
        ],
        requiredData: "Sprzedaż + Reklamy (opcjonalnie koszty/marża/zwroty)"
      },
      funnel: {
        title: "Lejek Zakupowy",
        tag: "CONV_OPT",
        desc: "Zobacz wąskie gardła w procesie sprzedaży i napraw spadki konwersji.",
        details: [
          "Optymalizacja procesu płatności",
          "Konwersja stron"
        ],
        commonUses: [
          "Dlaczego CPA rośnie mimo stabilnego ruchu?",
          "Który krok płatności zawodzi?",
          "Czy problem dotyczy tylko urządzeń mobilnych?"
        ],
        requiredData: "GA4 (lub zdarzenia) + Sprzedaż"
      },
      conv_path: {
        title: "Ścieżka Konwersji",
        tag: "ATTRIBUTION",
        desc: "Zobacz pełną ścieżkę klienta — budowanie popytu vs domykanie sprzedaży.",
        details: [
          "Udział urządzeń i kanałów",
          "Atrybucja oparta o zysk, czyli gdzie najlepiej zarabiasz.",
          "Touchpointy klienta."
        ],
        commonUses: [
          "Czy Meta buduje popyt, a Google domyka?",
          "Co jest niedoceniane przez last click?",
          "Jak przesunąć budżet między kanałami?"
        ],
        requiredData: "GA4 + Reklamy + Sprzedaż"
      },
      customers: {
        title: "Analiza Klientów",
        tag: "LTV_GROWTH",
        desc: "Kohorty, CAC, LTV i segmenty VIP, aby skalować mądrzej i budować wartość biznesu.",
        details: [
          "Retencja kohortowa",
          "Śledzenie LTV i CAC",
          "Identyfikacja VIP"
        ],
        commonUses: [
          "Który kanał przynosi najlepszych klientów?",
          "Retencja po 30/60/90 dniach?",
          "Kogo warto odzyskać?"
        ],
        requiredData: "Sprzedaż + Klienci (Opcjonalnie GA4/CRM)"
      }
    },
    featuresSection: {
      title: "Kluczowe Raporty Gotowe Dla Ciebie",
      desc: "Moduły działają na jednym modelu danych BigQuery — zapewniając spójne widoki kosztów, sprzedaży i zysku. Kontroluj kampanie, wykrywaj anomalie i skaluj dzięki głębokim wglądom."
    },
    featureModal: {
      capabilities_tag: "CO OTRZYMUJESZ",
      module_active_tag: "TYPOWE ZASTOSOWANIA",
      footer_left: "WYMAGANE DANE",
      footer_right: "GOTOWE DO WDROŻENIA"
    },
    hero: {
      pill: "PapaData Intelligence",
      h1_part1: "Analizuje dane e-commerce",
      h1_part2: "oraz daje rekomendacje dla wzrostu - PapaData,",
      h1_part3: "AI tworzony przez zawodowych marketerów dla e-commerce.",
      h2: "",
      desc: "Połącz dane ze sklepu, marketplace’ów i reklam w jeden spójny model w BigQuery. PapaData codziennie generuje raporty i alerty, żeby nie składać tego ręcznie. Wypróbuj inteligentną platformę marketingową PapaData.",
      primary: "Testuj 14 dni",
      secondary: "Zobacz Demo",
      badges: ["Bez karty", "Dane w UE (Warszawa)", "Bez kodowania"],
      meta_pipeline_tag: "PapaData Intelligence"
    },
    etl: {
      pill: "SILNIK DANYCH",
      title: "SILNIK PIPELINE'ÓW DANYCH",
      desc: "Zautomatyzowane potoki, które zmieniają chaos w gotowe do użycia dane w BigQuery dla raportów, alertów i AI.",
      step1_title: "POBIERANIE DANYCH",
      step1_desc: "Automatycznie pobiera dane z API, CSV i baz danych — bez ręcznych eksportów.",
      step2_title: "SMART TRANSFORMATION",
      step2_desc: "Czyści, normalizuje i wzbogaca dane: SKU, waluty, strefy czasowe i nazewnictwo kampanii.",
      step3_title: "INDEKSOWANIE",
      step3_desc: "Buduje kontekstowy indeks dla Asystenta AI, aby szybciej znajdował odpowiedzi i przyczyny źródłowe.",
      step4_title: "WYJŚCIE DO BIGQUERY",
      step4_desc: "Zapisuje gotowe tabele w BigQuery — natychmiast dostępne dla KPI, dashboardów i alertów.",
      meta_step_router: "",
      meta_active_label: "",
      meta_footer: ""
    },
    integrations: {
      pill: "INTEGRACJE I KONEKTORY",
      title_part1: "Połącz Swój",
      title_part2: "Cały Ekosystem",
      desc: "Połącz swój sklep, marketplace i reklamy w jedno miejsce. PapaData łączy źródła w spójny model w BigQuery, gotowy do KPI, P&L, alertów i AI.",
      proof: "",
      cat1_title: "Platformy E-commerce",
      cat2_title: "Platformy Reklamowe",
      cat3_title: "Platformy Analityczne",
      categories: {
        ecommerce: "SKLEP",
        marketplace: "MARKETPLACE",
        ads: "REKLAMY",
        analytics: "ANALITYKA",
        payments: "PŁATNOŚCI",
        email: "MARKETING",
        crm: "CRM",
        support: "WSPARCIE",
        data: "WŁASNY IMPORT",
        logistics: "LOGISTYKA",
        finance: "FINANSE",
        consent: "PRYWATNOŚĆ",
        affiliate: "AFILIACJA",
        productivity: "PRODUKTYWNOŚĆ"
      },
      btn_more: "Szczegóły",
      btn_all: "SPRAWDŹ LISTĘ INTEGRACJI",
      modal_title: "Integracje i Konektory",
      modal_desc: "Wybierz źródła danych — PapaData połączy je w jeden model w BigQuery i zapewni spójność (waluty, strefy czasowe, kampanie, SKU).",
      modal_search: "Szukaj integracji...",
      modal_footer_tag: "Zgłoś integrację • Obejrzyj Demo",
      tab_all: "Wszystkie",
      tab_ecommerce: "Sklep",
      tab_marketplace: "Marketplace",
      tab_ads: "Reklamy",
      tab_analytics: "Analityka",
      tab_payments: "Płatności",
      tab_email: "Marketing",
      tab_crm: "CRM",
      tab_support: "Wsparcie",
      tab_data: "Własne",
      tab_logistics: "Logistyka",
      tab_finance: "Finanse",
      tab_consent: "Prywatność",
      tab_affiliate: "Afiliacja",
      tab_productivity: "Produktywność",
      status_live: "Live",
      status_beta: "Beta",
      status_soon: "Wkrótce",
      empty_state: "Nie znaleziono integracji",
      empty_state_sub: "Spróbuj zmienić wyszukiwanie lub filtry.",
      section_footer_tag: "",
      marquee_label: "Obsługiwane integracje",
      marquee_items: ["Allegro", "WooCommerce", "PrestaShop", "BaseLinker", "Meta Ads", "Google Ads", "Google Analytics 4", "TikTok Ads"],
      coming_soon_context: "Łączenie z {name}",
      meta_hub_throughput: "",
      meta_api_latency: "",
      meta_status: "",
      meta_connections: "",
      meta_node_prefix: "",
      meta_mode_label: "",
      meta_mode_value: "",
      meta_sla_label: "",
      auth: {
        oauth2: "OAuth 2.0",
        api_key: "Klucz API",
        webhook: "Webhook",
        service_account: "Konto serwisowe",
        partner: "Integracja partnerska"
      },
      connect: {
        title: "Połącz {name}",
        desc: "Autoryzuj PapaData do bezpiecznego dostępu do Twoich danych.",
        steps_title: "Kroki połączenia",
        steps: ["Nadaj uprawnienia", "Wybierz workspace", "Inicjalizuj synchro"],
        workspace_label: "Workspace",
        workspace_placeholder: "Wybierz workspace",
        workspace_loading: "Ładowanie workspace...",
        workspace_empty: "Brak dostępnych workspace.",
        workspace_login_required: "Zaloguj się, aby wybrać workspace.",
        workspace_required: "Wybierz workspace, aby kontynuować.",
        workspace_retry: "Spróbuj ponownie",
        workspace_cta: "Przejdź do ustawień workspace",
        security_title: "Bezpieczeństwo przede wszystkim",
        security_desc: "Twoje dane są szyfrowane i zostają w UE.",
        cta_connect: "Połącz teraz"
      },
      items: {
        shopify: { name: "Shopify", detail: "Sklep" },
        woocommerce: { name: "WooCommerce", detail: "Sklep" },
        prestashop: { name: "PrestaShop", detail: "Sklep" },
        magento: { name: "Magento", detail: "Sklep" },
        bigcommerce: { name: "BigCommerce", detail: "Sklep" },
        shoper: { name: "Shoper", detail: "Sklep" },
        idosell: { name: "IdoSell", detail: "Sklep" },
        shopware: { name: "Shopware", detail: "Sklep" },
        comarch_esklep: { name: "Comarch e-Sklep", detail: "Sklep" },
        amazon_seller: { name: "Amazon Seller Central", detail: "Marketplace" },
        allegro: { name: "Allegro", detail: "Marketplace" },
        ebay: { name: "eBay", detail: "Marketplace" },
        etsy: { name: "Etsy", detail: "Marketplace" },
        baselinker: { name: "BaseLinker", detail: "Marketplace" },
        channelengine: { name: "ChannelEngine", detail: "Marketplace" },
        google_ads: { name: "Google Ads", detail: "Reklamy" },
        meta_ads: { name: "Meta Ads", detail: "Reklamy" },
        tiktok_ads: { name: "TikTok Ads", detail: "Reklamy" },
        microsoft_ads: { name: "Microsoft Advertising", detail: "Reklamy" },
        linkedin_ads: { name: "LinkedIn Ads", detail: "Reklamy" },
        amazon_ads: { name: "Amazon Ads", detail: "Reklamy" },
        allegro_ads: { name: "Allegro Ads", detail: "Reklamy" },
        zalando_zms: { name: "Zalando ZMS", detail: "Reklamy" },
        ga4: { name: "Google Analytics 4", detail: "Analityka" },
        gsc: { name: "Google Search Console", detail: "Analityka" },
        gtm: { name: "Google Tag Manager", detail: "Analityka" },
        firebase: { name: "Firebase Analytics", detail: "Analityka" },
        stripe: { name: "Stripe", detail: "Płatności" },
        paypal: { name: "PayPal", detail: "Płatności" },
        adyen: { name: "Adyen", detail: "Płatności" },
        braintree: { name: "Braintree", detail: "Płatności" },
        przelewy24: { name: "Przelewy24", detail: "Płatności" },
        payu: { name: "PayU", detail: "Płatności" },
        klaviyo: { name: "Klaviyo", detail: "Marketing" },
        mailchimp: { name: "Mailchimp", detail: "Marketing" },
        getresponse: { name: "GetResponse", detail: "Marketing" },
        salesmanago: { name: "SALESmanago", detail: "Marketing" },
        customerio: { name: "Customer.io", detail: "Marketing" },
        smsapi: { name: "SMSAPI", detail: "Marketing" },
        gmc: { name: "Google Merchant Center", detail: "Feed" }
      }
    },
    roi: {
      pill: "KALKULATOR ZYSKÓW",
      title: "Oblicz ile zyskasz i jakie problemy rozwiążesz dzięki PapaData:",
      desc: "Oszacuj wartość automatyzacji i AI w Twoim biznesie.",
      seg_ecommerce: "E-commerce",
      seg_agency: "Agencja",
      seg_enterprise: "Enterprise",
      input_analysts: "Koszt godziny pracownika (netto)",
      input_hours: "Ile raportów miesięcznie? (jeden = 1h)",
      input_analysis_hours: "Ile godzin manualnej analizy?",
      hours_suffix: "h",
      month_short: "msc",
      calculating_label: "OBLICZANIE...",
      net_efficiency_label: "EFEKTYWNOŚĆ NETTO +100%",
      time_savings_label: "OSZCZĘDNOŚĆ CZASU",
      annual_savings_label: "OSZCZĘDNOŚĆ ROCZNA",
      fte_suffix_label: "% etatu",
      reports_suffix: " szt.",
      savings_disclaimer: "Obliczenia oparte na wprowadzonych przez Ciebie danych oraz średnich wzrostach efektywności.",
      label_manual_cost: "Aktualny miesięczny koszt",
      label_recovered_time: "Czas poświęcany na analizy",
      label_total_savings: "Szacowane miesięczne oszczędności",
      time_suffix: "h",
      currency: "PLN",
      currency_pos: 'after',
      cta_btn: "Zacznij oszczędzać teraz",
      rate_eco: 180,
      rate_age: 250,
      rate_ent: 350,
      efficiency_note: "Odpowiednie decyzje bazowane na Twoich danych biznesowych i rekomendacjach PapaData, ukazywanie trendów i insighty z rynku, zwiększą efektywność Twojego biznesu o znacznie więcej niż jesteś w stanie zaoszczędzić z nami na samym starcie, dzięki oszczędności czasu."
    },
    security: {
      pill: "BEZPIECZEŃSTWO",
      title_p1: "STANDARDY KLASY",
      title_p2: "ENTERPRISE",
      title_p3: "OCHRONA DANYCH",
      title_p4: "BY DESIGN",
      desc: "Bezpieczeństwo wbudowane w produkt: dostęp, izolacja i szyfrowanie.",
      card1_tag: "UPRAWNIENIA",
      card1_title: "GRANULARNY DOSTĘP",
      card1_desc: "Kontrola dostępu zapewnia, że tylko upoważniony personel widzi konkretne dane i raporty.",
      card2_tag: "IZOLACJA",
      card2_title: "IZOLACJA DANYCH",
      card2_desc: "Środowisko każdego klienta jest izolowane na poziomie danych — brak mieszania danych.",
      card3_tag: "MASKOWANIE",
      card3_title: "MASKOWANIE DANYCH",
      card3_desc: "Dane PII są automatycznie maskowane przed analizą, aby ograniczyć ekspozycję danych wrażliwych.",
      card4_tag: "SZYFROWANIE",
      card4_title: "BEZPIECZNE POŁĄCZENIA",
      card4_desc: "Połączenia zewnętrzne są szyfrowane, a dane są chronione podczas przesyłania i w spoczynku.",
      cta_title: "GOTOWY NA BEZPIECZEŃSTWO?",
      cta_desc: "Poznaj protokoły izolacji danych i standardy zarządzania infrastrukturą SOC 2.",
      cta_btn: "ZOBACZ WHITEPAPER"
    },
    pricing: {
      pill: "",
      title: "Cennik bez ukrytych kosztów",
      desc: "Wybierz plan pasujący do Twojej skali. Żadnych ukrytych opłat.",
      per_month: "na miesiąc",
      billing_monthly: "Miesięcznie",
      billing_yearly: "Rocznie",
      yearly_discount: "-20%",
      net_prices: "Ceny netto.",
      compare_btn: "Porównaj plany",
      modal_title: "Szczegółowe porównanie planów",
      modal_highlights: ["Nielimitowane integracje", "Dane w UE", "Eksport do BigQuery"],
      modal_minimized_label: "Cennik",
      modal_minimized_title: "Zobacz Plany",
      currency: "PLN",
      starter: {
        name: "Starter",
        desc: "Dla sklepów zaczynających przygodę z automatyzacją danych.",
        price: "199",
        features: [
          "Do 3 źródeł danych",
          "Tygodniowe raporty",
          "Wsparcie e-mail",
          "Podstawowe wglądy AI"
        ],
        cta: "Rozpocznij trial"
      },
      professional: {
        name: "Professional",
        desc: "Dla rosnących firm potrzebujących codziennych wglądów.",
        price: "499",
        features: [
          "Do 15 źródeł danych",
          "Codzienne raporty",
          "Priorytetowe wsparcie",
          "Priorytetowe AI"
        ],
        cta: "Rozpocznij trial"
      },
      enterprise: {
        name: "Enterprise",
        desc: "Rozwiązania na dużą skalę.",
        price: "Indywidualnie",
        features: [
          "Nielimitowane źródła",
          "Raporty w czasie rzeczywistym",
          "Dedykowany opiekun",
          "Pełny dostęp AI"
        ],
        cta: "ZAPYTAJ O OFERTĘ"
      },
      plan_meta: {
        starter: { tag: "STABILNY", sid: "", infra: "", sla: "" },
        professional: { tag: "POPULARNY", sid: "", infra: "", sla: "" },
        enterprise: { tag: "DEDYKOWANY", sid: "", infra: "", sla: "" }
      },
      comparison: {
        feature_matrix_label: "Macierz funkcji",
        data_sources_label: "Źródła danych / integracje",
        data_sources_starter: "Do 3",
        data_sources_pro: "Do 15",
        report_frequency_label: "Częstotliwość raportów",
        report_frequency_weekly: "Tygodniowo",
        report_frequency_daily: "Codziennie",
        ai_semantic_label: "Analiza AI (Req/Mo)",
        ai_semantic_starter: "50",
        ai_semantic_pro: "200",
        custom_etl_label: "Niestandardowe pipeline ETL",
        bigquery_export_label: "Eksport do BigQuery",
        uptime_sla_label: "SLA dostępności",
        protocol_label: "",
        data_retention: "Retencja danych",
        data_retention_unit: "dni",
        support_label: "Standard wsparcia",
        support_standard: "Standard",
        support_priority: "Priorytet",
        support_dedicated: "Dedykowany",
        refresh_standard: "Dzienny",
        refresh_fast: "Godzinny",
        alert_standard: "Podstawowe",
        alert_high: "Zaawansowane",
        alert_ultra: "Custom",
        realtime: "Czas rzeczywisty",
        unlimited: "Bez limitu",
        swipe_hint: "Przesuń, aby porównać",
        header_tag: "",
        footer_system: "Bezpieczne płatności",
        footer_ssl: ""
      },
      meta: {
        recommended_label: "Polecany",
        capacity_label: "Pojemność",
        provisioning_label: "",
        ready_installation_prefix: "",
        sys_pricing_model: "Subskrypcja",
        tier_strategy: "Oparty na wolumenie",
        billing_cycle_label: "Cykl",
        ref_prefix: "",
        capacity_meter_label: "Użycie",
        features_label: "",
        contact_price_label: "Cena indywidualna",
        contact_desc: "Dla bardzo dużych zbiorów danych.",
        lowest_30d_note: "Najniższa cena z ostatnich 30 dni"
      },
      errors: {
        tenant_missing: "Nie można określić aktywnego tenanta. Zaloguj się ponownie.",
        tenant_missing_cta: "Wybierz workspace",
        payment_start: "Nie udało się uruchomić płatności.",
        payment_generic: "Wystąpił błąd podczas uruchamiania płatności."
      },
      actions: {
        processing: "Przetwarzanie...",
        enterprise_subject: "Zapytanie o ofertę Enterprise"
      }
    },
    faq: {
      pill: "",
      title: "Często zadawane pytania",
      items: [
        {
          q: "Czy moje dane są bezpieczne w PapaData?",
          a: "Tak. Używamy standardowego szyfrowania i przechowujemy dane wyłącznie w europejskich regionach Google Cloud. Jesteśmy zgodni z RODO i oferujemy automatyczne maskowanie PII."
        },
        {
          q: "Jak długo trwa proces integracji?",
          a: "Większość natywnych konektorów można skonfigurować w mniej niż 5 minut bez pisania kodu."

        },
        {
          q: "Czy mogę podłączyć własne repozytorium BigQuery?",
          a: "Tak. PapaData jest zbudowana tak, aby współpracować z Twoją istniejącą infrastrukturą. Możesz podlinkować własny projekt GCP, zachowując pełną własność danych."
        },
        {
          q: "Czy potrzebuję analityka do obsługi platformy?",
          a: "Nie. Nasz Asystent AI działa jak wirtualny analityk danych: odpowiada na pytania i wykrywa anomalie w języku naturalnym."
        },
        {
          q: "Jakie są koszty po darmowym okresie próbnym?",
          a: "Po 14-dniowym okresie próbnym wybierasz plan dopasowany do skali Twoich danych. Ceny zaczynają się od 199 PLN netto miesięcznie."
        }
      ],
      meta: {
        header_tag: "",
        ref_prefix: "",
        verified_label: "WERYFIKOWANE",
        response_label: "",
        footer_line1: "Potrzebujesz więcej pomocy?",
        footer_line2: "Skontaktuj się z nami."
      }
    },
    techFuture: {
      pill: "WIZJA",
      title: "Przyszłość e-commerce",
      desc: "Analityka predykcyjna i AI nie są już opcjonalne. Dostarczamy technologię klasy enterprise dla każdego biznesu.",
      stat1_label: "UPTIME",
      stat1_val: "99.9%",
      stat1_tag: "",
      stat2_label: "PRECYZJA",
      stat2_val: "99.9%",
      stat2_tag: "",
      stat3_label: "SETUP",
      stat3_val: "<5 min",
      stat3_tag: "",
      card1_title: "PREDYKCYJNE AI",
      card1_desc: "Poznaj swoje trendy, zanim się pojawią dzięki Gemini Pro.",
      card1_tag: "",
      card2_title: "AUTOMATYCZNE ETL",
      card2_desc: "Czyszczenie i normalizacja danych na autopilocie.",
      card2_tag: "",
      card3_title: "SYNC REAL-TIME",
      card3_desc: "Wszystkie aktualne dane w BigQuery i dashboardach.",
      card3_tag: ""
    },
    knowledgeBase: {
      pill: "BAZA WIEDZY",
      title: "Baza wiedzy",
      desc: "Poradniki, tutoriale i strategie wzrostu dla e-commerce.",
      btn_view: "Czytaj przewodnik",
      card1_title: "Architektura systemu",
      card1_desc: "Zobacz, jak przetwarzamy Twoje dane.",
      card2_title: "Strategie wzrostu",
      card2_desc: "Skaluj reklamy i rentowność.",
      card3_title: "Playbook AI",
      card3_desc: "Rozmawiaj z danymi jak analityk.",
      cards: [
        { id: "1", tag: "TECHNOLOGIA" },
        { id: "2", tag: "MARKETING" },
        { id: "3", tag: "AI" }
      ],
      footer_tag: ""
    },
    socialProof: {
      title: "Zaufali nam liderzy e-commerce",
      subtitle: "Dołącz do setek marek używających PapaData.",
      verified: "Zweryfikowana Opinia",
      omnibus: "Zgodne z dyrektywą Omnibus",
      reviews: [
        { quote: "PapaData zmieniła nasz proces raportowania.", author: "Jan Kowalski", role: "CEO w FashionBrand" }
      ]
    },
    vertexPlayer: {
      ariaLabel: "Odtwarzacz prezentacji produktu",
      tabs: {
        ai: { label: "Wnioski AI" },
        pipeline: { label: "Guardian" },
        exec: { label: "Matryca P&L" }
      },
      content: {
        ai: { title: "Analiza semantyczna", desc: "Zadaj dowolne pytanie o swoje dane w języku naturalnym." },
        pipeline: { title: "Wykrywanie Anomalii", desc: "Monitorowanie spadków wydajności w czasie rzeczywistym." },
        exec: { title: "Widok P&L", desc: "Skondensowane metryki dla zarządu." }
      }
    },
    finalCta: {
      title: "Gotowy na skalowanie?",
      desc: "Zacznij swój 14-dniowy darmowy okres próbny już dziś.",
      sub_text: "Karta nie jest wymagana. Możesz zrezygnować w dowolnym momencie.",
      btn_trial: "Zacznij Okres Próbny",
      btn_demo: "Zarezerwuj Demo",
      badges: ["BEZPIECZNIE", "HOSTOWANE W UE"],
      meta: {
        top_tag: "GOTOWE_DO_WDROŻENIA",
        system_ready_label: "",
        core_objective_label: "",
        deployment_status_label: "",
        bottom_tag: ""
      }
    },
    videoModal: {
      title: "Demo Produktu",
      close_aria_label: "Zamknij wideo"
    },
    about: {
      tag: "ZESPÓŁ",
      title: "O PapaData",
      subtitle: "Inteligencja danych zbudowana dla skali.",
      body: "Jesteśmy zespołem inżynierów danych i marketerów nastawionych na wzrost, których celem jest uczynienie analityki klasy enterprise dostępną dla każdego biznesu e-commerce. Założeni w Warszawie, skalujemy się globalnie, zachowując lokalną rezydencję danych.",
      points: ["Zbudowane w UE", "Obsesja na punkcie klienta", "Wizja AI-First", "GDPR Ready domyślnie"],
      footer_left: "Informacje prawne",
      footer_right: "Warszawa, Polska",
      meta_tag: ""
    },
    footer: {
      tagline: "Dane, które rosną razem z Tobą.",
      hosting: "Powered by Google Cloud",
      status: "System działa",
      col1_title: "Produkt",
      col1_links: [
        { label: "Funkcje", actionId: "features" },
        { label: "Cennik", actionId: "pricing" },
        { label: "Integracje", actionId: "integrations" }
      ],
      col2_title: "Firma",
      col2_links: [
        { label: "O nas", actionId: "about" },
        { label: "FAQ", actionId: "faq" },
        { label: "Kontakt", actionId: "contact" }
      ],
      col3_title: "Zasoby",
      col3_links: [
        { label: "Baza wiedzy", actionId: "knowledge" },
        { label: "Bezpieczeństwo", actionId: "security" }
      ],
      legal_links: [
        { label: "Warunki", actionId: "legal_terms" },
        { label: "Prywatność", actionId: "legal_privacy" },
        { label: "Cookies", actionId: "legal_cookies" },
        { label: "DPA", actionId: "legal_dpa" },
        { label: "Podwykonawcy", actionId: "legal_subprocessors" },
        { label: "AI Disclaimer", actionId: "legal_ai" },
        { label: "Dostępność", actionId: "legal_accessibility" }
      ],
      copyright: "© 2024 PapaData",
      region: "Europa (Warszawa)",
      meta: {
        network_status_label: "Status",
        infra_region_label: "Region",
        protocol_level_label: "Protokół",
        protocol_level_value: "HTTP/3",
        resources_title: "Zasoby",
        resources_desc: "Przewodniki deweloperskie i biznesowe.",
        resources_links: ["Dokumentacja API", "Changelog"],
        sys_log_label: "Log",
        contact_title: "Kontakt",
        contact_desc: "Wyślij zapytanie, odpowiemy w ciągu 2 godzin w dni robocze.",
        contact_email: "support@papadata.ai",
        contact_name_placeholder: "Imię i nazwisko",
        contact_email_placeholder: "E-mail firmowy",
        contact_message_placeholder: "W czym możemy pomóc?",
        contact_cta: "Wyślij zapytanie",
        contact_success_title: "Zapytanie wysłane",
        contact_success_desc: "Wkrótce skontaktujemy się z Tobą.",
        contact_message_ok: "OK",
        contact_message_min: "Min. 10 znaków"
      }
    },
    auth: {
      login_tab: "Logowanie",
      register_tab: "Rejestracja",
      email_label: "E-mail",
      email_work_hint: "Firmowy",
      email_invalid: "Podaj poprawny adres e-mail.",
      email_invalid_hint: "Wpisz poprawny e-mail, aby kontynuować.",
      pass_label: "Hasło",
      login_btn: "Zaloguj się",
      register_btn: "Utwórz Konto",
      forgot_pass: "Zapomniałeś hasła?",
      oauth_google: "Google",
      oauth_ms: "Microsoft",
      oauth_account_suffix: "Konto",
      nip_label: "NIP",
      nip_placeholder: "1234567890",
      nip_invalid: "Nieprawidłowy NIP",
      nip_required_hint: "Wpisz poprawny NIP, aby kontynuować.",
      email_placeholder_login: "twoj@email.com",
      email_placeholder_register: "pracowniczy@firma.pl",
      company_name_label: "Nazwa Firmy",
      company_name_placeholder: "Wpisz nazwę firmy",
      company_address_label: "Adres",
      company_street_label: "Ulica i numer",
      company_street_placeholder: "Ulica, numer",
      company_postal_code_label: "Kod pocztowy",
      company_postal_code_placeholder: "00-000",
      company_city_label: "Miasto",
      company_city_placeholder: "Miasto",
      company_regon_label: "REGON (opcjonalnie)",
      company_regon_placeholder: "REGON",
      company_krs_label: "KRS (opcjonalnie)",
      company_krs_placeholder: "KRS",
      company_not_found: "Nie znaleziono, uzupełnij ręcznie",
      company_autofill_badge: "Uzupełniono automatycznie",
      company_autofill_badge_gus_mf: "Uzupełniono z GUS/MF",
      nip_searching: "Przeszukiwanie baz...",
      entity_validating: "Weryfikacja podmiotu...",
      entity_validated_label: "PODMIOT_ZWERYFIKOWANY",
      pass_strength_weak: "Słabe",
      pass_strength_fair: "Średnie",
      pass_strength_strong: "Silne",
      password_invalid_hint: "Hasło musi spełniać wszystkie wymagania.",
      gateway_tag: "",
      oauth_divider: "LUB",
      next_protocol: "Kontynuuj",
      login_link_sent_title: "Link weryfikacyjny wysłany",
      login_link_sent_desc: "Sprawdź skrzynkę odbiorczą {email}.",
      verify_session: "Weryfikuj sesję",
      code_label: "Kod (6 cyfr)",
      code_placeholder: "______",
      code_title_login: "Zaloguj się kodem",
      code_title_register: "Potwierdź e-mail kodem",
      code_desc: "Wpisz 6-cyfrowy kod wysłany na adres e-mail.",
      resend_in: "Wyślij ponownie za",
      resend_code: "Wyślij kod ponownie",
      resend_link: "Wyślij link ponownie",
      code_invalid: "Nieprawidłowy kod. Wpisz 6 cyfr.",
      send_login_link: "Wyślij link logowania",
      back: "Wróć",
      proceed_security: "Przejdź dalej",
      entropy_analysis: "Siła",
      password_req_length: "8+ znaków",
      password_req_uppercase: "Wielka litera",
      password_req_special: "Znak specjalny",
      ssl_tag: "",
      back_to_site: "Wróć do strony",
      register_hint: "Nie masz konta?",
      create_account_cta: "Utwórz konto i rozpocznij trial",
      mock_company_name: "Przykładowa Firma Sp. z o.o.",
      mock_company_address: "ul. Danych 12, Warszawa"
    },
    papaAI: {
      title: "Papa AI",
      subtitle: "Inteligentny Asystent",
      intro: "W czym mogę Ci dzisiaj pomóc? Mam pełny kontekst Twoich danych.",
      close_label: "Zamknij asystenta",
      toggle_label: "Przełącz Papa AI",
      panel_label: "Panel AI",
      placeholder: "Wpisz wiadomość...",
      send: "Wyślij",
      cancel_label: "Anuluj",
      thinking: "Myślę...",
      evidence_label: "Dowody",
      add_to_report: "Dodaj do raportu",
      set_alert: "Ustaw alert",
      warning_stale: "Dane mogą być nieaktualne",
      warning_missing: "Brak danych z integracji",
      warning_locked: "Funkcja zablokowana przez plan",
      rate_limit: "Zbyt wiele zapytań. Spróbuj ponownie za {seconds}s.",
      footer_text: "PapaAI Enterprise v3.5 • Warsaw GCP Node",
      error_generic: "Wystąpił błąd połączenia z usługą AI. Spróbuj ponownie za chwilę.",
      suggestions: [
        { label: "🔍 Wykryj anomalie", prompt: "Przeanalizuj widok {view} pod kątem anomalii w ostatnich 24h." },
        { label: "📈 Rekomendacje budżetu", prompt: "Gdzie powinienem zwiększyć budżet, aby utrzymać marżę?" },
        { label: "⚖️ Audit P&L", prompt: "Zrób szybki audyt moich kosztów operacyjnych." }
      ]
    },
    postAuth: {
      welcome_title: "Witaj!",
      welcome_desc: "Gotowy na rozpoczęcie podróży z danymi?",
      connect_title: "Podłącz dane",
      connect_desc: "Wybierz swoje pierwsze źródło danych.",
      primary_connect: "Przejdź do integracji",
      secondary_close: "Eksploruj Dashboard",
      meta_tag: "ONBOARDING"
    },
    dashboard: {
      menu_overview: "Przegląd",
      menu_analytics: "Analityka",
      menu_growth: "Wzrost",
      menu_support: "Wsparcie",
      status_label: "Sesja",
      status_ready: "Gotowy",
      freshness_label: "Ostatnia aktualizacja",
      plan_professional: "Professional",
      trial_days_left: "Trial: {days} dni",
      trial_expired_title: "Trial zakończony",
      trial_expired_desc: "Funkcje produkcyjne są wstrzymane do czasu aktywacji subskrypcji. Dane i konfiguracje pozostają bez zmian.",
      trial_expired_cta: "Aktywuj subskrypcję",
      workspace_missing_title: "Wybierz workspace",
      workspace_missing_desc: "Ustaw aktywny workspace, aby załadować dane i włączyć integracje.",
      workspace_missing_cta: "Przejdź do ustawień workspace",
      billing: {
        trial_banner_tag: "TRIAL",
        trial_banner_owner: "Trial kończy się za {days} dni. Dodaj metodę płatności, aby zachować dostęp.",
        trial_banner_member: "Trial kończy się za {days} dni. Poproś właściciela o dodanie płatności.",
        cta_add_payment: "Dodaj metodę płatności",
        cta_activate: "Aktywuj plan",
        manage_link: "Zarządzaj subskrypcją",
        read_only_badge: "TYLKO ODCZYT",
        read_only_tooltip: "Wymagana aktywacja płatności",
        paywall_title: "Trial zakończony — tryb tylko do odczytu",
        paywall_desc: "Twoje dane są bezpieczne. Aktywuj subskrypcję, aby przywrócić pełny dostęp.",
        paywall_member_cta: "Poproś właściciela o aktywację płatności",
        paywall_allowed_title: "Dalej dostępne",
        paywall_allowed_items: ["Podgląd dashboardów", "Eksport raportów", "Integracje (tylko odczyt)"],
        paywall_blocked_title: "Zablokowane do aktywacji",
        paywall_blocked_items: ["Synchronizacja live", "Rekomendacje AI", "Alerty i automatyzacje"],
        trial_modal_tag: "TRIAL",
        trial_modal_title_7: "Trial kończy się za 7 dni",
        trial_modal_desc_7: "Trial kończy się za {days} dni. Dodaj metodę płatności, aby zachować ciągłość.",
        trial_modal_title_3: "Zostały {days} dni trialu",
        trial_modal_desc_3: "Dodaj płatność teraz, aby nie przejść w tryb tylko do odczytu.",
        trial_modal_title_1: "Ostatni dzień trialu",
        trial_modal_desc_1: "Trial kończy się za {days} dzień. Aktywuj plan, aby uniknąć blokad.",
        trial_modal_cta_primary: "Dodaj metodę płatności",
        trial_modal_cta_secondary: "Przypomnij później",
        trial_modal_member_hint: "Tylko właściciel może zarządzać płatnościami."
      },
      attribution_label: "Model atrybucji",
      demo_pill: "DEMO",
      demo_tooltip: "To jest DEMO",
      prod_pill: "PROD",
      // Fix: Added missing menu_pandl property
      menu_pandl: "P&L",
      menu_ads: "Reklamy",
      menu_reports: "Raporty",
      menu_customers: "Klienci",
      menu_products: "Produkty",
      menu_guardian: "Guardian",
      menu_alerts: "Alerty",
      menu_integrations: "Integracje",
      menu_pipeline: "DATA PIPELINE",
      menu_settings: "Ustawienia",
      menu_end_session: "Wyloguj",
      filter_1d: "24h",
      filter_7d: "7d",
      filter_30d: "30d",
      kpi_revenue: "Przychód",
      kpi_orders: "Zamówienia",
      kpi_roas: "ROAS",
      kpi_cac: "CAC",
      conversion_rate: "CVR",
      net_profit: "Zysk Netto",
      modal_upgrade_title: "Przejdź na PRO",
      modal_upgrade_desc: "Zyskaj nielimitowany dostęp i dane w czasie rzeczywistym.",
      modal_upgrade_btn: "Uruchom Live",
      modal_upgrade_close: "Później",
      cta_upgrade_live: "Ulepsz",
      chart_sales_velocity: "Dynamika sprzedaży",
      chart_revenue_split: "Podział przychodów",
      chart_ad_performance: "Wyniki reklam",
      chart_customer_cohorts: "Kohorty klientów",
      guardian_status_scanning: "Skanowanie...",
      guardian_threat_level: "Bezpiecznie",
      guardian_log_header: "Logi systemowe",
      guardian_type_warn: "WARN",
      guardian_type_security_alert: "SEC_ALERT",
      guardian_type_info: "INFO",
      guardian_type_alert: "ALERT",
      alert_title_conversions: "Spadek CVR",
      alert_desc_conversions: "CVR spadł o 12% w ciągu ostatnich 4 godzin.",
      settings_api_label: "Dostęp API",
      settings_webhook_label: "Webhooki",
      integrations_title: "Podłącz dane",
      integrations_desc: "Zsynchronizuj sklep i reklamy.",
      integrations_connect: "Połącz",
      integrations_connecting: "Łączenie...",
      integrations_connected: "Połączono",
      integrations_cta: "Zobacz wszystkie",
      integrations_mode_demo: "Tryb Demo",
      integrations_mode_live: "Live Sync",
      alerts_policy_demo: "Alerty Demo",
      alerts_policy_live: "Polityka Real-time",
      cohort_data_demo: "Przykładowe kohorty",
      cohort_data_live: "Aktywne kohorty",
      sidebar_session_ready: "SESJA_AKTYWNA",
      footer_peer_id: "WĘZEŁ",
      footer_session_time: "Sesja",
      footer_encryption: "E2E",
      overview_stream_label: "Live Stream",
      overview_legend_current: "Obecny",
      overview_legend_previous: "Poprzedni",
      overview_time_start: "Start",
      overview_time_peak: "Szczyt",
      overview_time_sync: "Sync",
      overview_source_shopify: "Shopify",
      overview_source_allegro: "Allegro",
      overview_source_other: "Inne",
      overview_connectors_title: "Status",
      overview_connectors_status: "Zdrowy",
      overview_connectors_col_connector: "Źródło",
      overview_connectors_col_latency: "Opóźnienie",
      overview_connectors_col_load: "Obciążenie",
      overview_connectors_col_rows: "Wiersze",
      overview_connectors_col_status: "Status",
      overview_connectors: [{ id: "1", label: "Shopify" }],
      ai_mode_label: "Papa AI",
      ai_mode_on: "Włączone",
      ai_mode_off: "Wyłączone",
      context_menu: {
        label: "Opcje",
        drill: "Szczegóły (Drill down)",
        explain_ai: "Wyjaśnij przez AI",
        add_report: "Dodaj do raportu",
        export: "Eksportuj CSV",
        set_alert: "Ustaw alert"
      },
      widget: {
        empty_title: "Brak Danych",
        empty_desc_filters: "Spróbuj zmienić filtry.",
        cta_clear_filters: "Wyczyść filtry",
        partial_badge: "Dane częściowe",
        partial_desc: "Trwa synchronizacja.",
        error_title: "Błąd danych",
        error_desc: "Nie udało się pobrać danych. Spróbuj ponownie.",
        cta_retry: "Spróbuj ponownie",
        offline_title: "Brak połączenia",
        offline_desc: "Brak internetu. Dane mogą być nieaktualne."
      },
      overview_v2: {
        alerts: {
          title: "Aktywne Alerty",
          desc: "Wykryto krytyczne zdarzenia.",
          live_label: "Aktywne Guardians",
          view_all: "Zobacz Wszystkie",
          action_open: "Napraw",
          action_ai: "Wyjaśnij",
          badge_delay: "Opóźnienie",
          badge_quality: "Jakość",
          severity_critical: "Krytyczny",
          severity_warning: "Ostrzeżenie",
          severity_info: "Info",
          items: [
            {
              id: "1",
              title: "Anomalia ROAS: Meta Ads",
              impact: "-14,2% vs wczoraj",
              time: "12m temu",
              severity: "critical",
              context: "Meta Ads",
              target: "ads"
            },
            {
              id: "2",
              title: "Prognozowany Stock-out",
              impact: "SKU-742 (3 dni)",
              time: "1h temu",
              severity: "warning",
              context: "Logistyka",
              target: "products"
            },
            {
              id: "3",
              title: "Opóźnienie ETL: Google Analytics",
              impact: "Lag: 42 min",
              time: "3h temu",
              severity: "info",
              context: "GA4 Stream",
              target: "guardian"
            }
          ]
        },
        ai: {
          title: "Papa AI",
          desc: "Analizuj swoje dane.",
          placeholder: "Zapytaj o cokolwiek...",
          submit: "Zapytaj",
          shortcut_hint: "⌘K",
          toggle_hint: "CMD + K, aby przełączyć",
          suggested_label: "Sugerowane",
          recent_label: "Ostatnie",
          cached_label: "Ostatnie zapytanie",
          disabled_title: "AI Wyłączone",
          disabled_desc: "Włącz AI, aby zacząć.",
          enable_cta: "Włącz",
          suggested: [],
          recent: [],
          prompt_template: "Wyjaśnij {context}",
          response: {
            title: "Wgląd AI",
            summary_label: "Podsumowanie",
            summary_text: "Analiza ukończona.",
            evidence_label: "Dowody",
            evidence_points: [],
            sources_label: "Źródła",
            sources: [],
            disclaimer: "AI może popełniać błędy.",
            actions: {
              open_view: "Widok",
              add_report: "Raport",
              set_alert: "Alert"
            }
          }
        },
        insights: {
          items: [
            { id: "ins-1", title: "Największy spadek ROAS w kampanii X", impact: "-18% vs tydzień", context: "Campaign X" },
            { id: "ins-2", title: "Zwroty rosną w SKU Y", impact: "+6% w 7d", context: "SKU Y" },
            { id: "ins-3", title: "Nowy segment VIP zwiększa LTV", impact: "+12% w 30d", context: "VIP Segment" }
          ]
        },
        kpis: {
          title: "KPI",
          cache_label: "Na żywo",
          badge_quality: "99.9%",
          explain_action: "Wyjaśnij",
          actions_hint: "Prawy przycisk dla opcji",
          labels: {
            spend: "Wydatki",
            profit: "Zysk",
            aov: "AOV",
            new_returning: "Nowi/Powr",
            ltv_30d: "LTV 30d"
          },
          defs: {
            revenue: "Całkowita sprzedaż",
            spend: "Wydatki na reklamy",
            roas: "Zwrot z reklamy",
            cpa: "Koszt pozyskania",
            profit: "Zysk brutto",
            aov: "Średnia wartość zamówienia",
            new_returning: "Ratio",
            ltv_30d: "30-dniowe LTV"
          }
        },
        charts: {
          revenue_spend: { title: "Przychód vs Wydatki", desc: "Przegląd", driver: "Meta Ads" },
          roas_cpa: { title: "Efektywność", desc: "ROAS i CPA", driver: "Google Ads" },
          series_labels: { revenue: "Przychód", spend: "Wydatki", roas: "ROAS", cpa: "CPA" },
          tooltip_delta: "Δ",
          tooltip_driver: "Powód",
          focus_label: "Focus",
          actions: { breakdown: "Rozbicie", show_campaigns: "Kampanie", explain: "Wyjaśnij", clear_focus: "Wyczyść" },
          range: { label: "Zakres", prompt: "Własny", apply_local: "Zastosuj", apply_global: "Globalnie", clear: "Wyczyść", start_label: "Od", end_label: "Do" },
          badges: { quality: "Zweryfikowane", freshness: "Real-time" },
          quality_desc: "Wysoka jakość danych",
          freshness_desc: "Ostatnia sync: 2m temu"
        },
        tables: {
          campaigns: {
            title: "Top Kampanie",
            desc: "Wyniki według kampanii",
            context_template: "Kampania: {name}",
            columns: { campaign: "Nazwa", spend: "Wydatki", revenue: "Przychód", roas: "ROAS", cpa: "CPA", ctr: "CTR", cvr: "Konw", delta: "Δ" },
            metric_defs: { roas: "Zwrot", cpa: "Koszt", ctr: "Klik", cvr: "Konw" },
            actions: { drill: "Widok", ai: "Analiza", report: "Raport", alert: "Alert", view_all: "Zobacz wszystkie reklamy" }
          },
          skus: {
            title: "Top SKU",
            desc: "Wyniki według produktu",
            context_template: "SKU: {name}",
            columns: { sku: "Nazwa", revenue: "Przych", profit: "Zysk", margin: "Marża", returns: "Zwr", stock: "STAN", trend: "Trend" },
            metric_defs: { margin: "Brutto", return_rate: "Zwroty", stock_risk: "Ryzyko" },
            tags: { toxic: "Toksyczny", high_margin: "Wysoka", stock_risk: "Ryzyko" },
            stock: { low: "Niski", medium: "Ok", high: "Wysoki" },
            actions: { drill: "Widok", ai: "Analiza", report: "Raport", alert: "Alert", inventory_hub: "Centrum Magazynowe" }
          },
          sample: {
            campaigns: [{ id: "1", name: "Letnia Wyprzedaż" }],
            skus: [{ id: "1", name: "Produkt A" }]
          }
        },
        actions: {
          title: "Sugerowane Działania",
          desc: "Priorytety AI",
          labels: { impact: "Wpływ", confidence: "Ufność", effort: "Wysiłek", risk: "Ryzyko", priority: "Prio", evidence: "Dowody" },
          status: { new: "Nowe", in_progress: "W toku", done: "Gotowe" },
          values: { low: "Niski", medium: "Średni", high: "Wysoki" },
          ctas: { explain_ai: "Wyjaśnij", save_task: "Zapisz", evidence: "Dowód", add_report: "Raport" },
          cards: []
        }
      },
      growth: {
        title: "SILNIK WZROSTU", desc: "Skaluj swoją sprzedaż",
        cards: {
          title: "Karty Rekomendacji", desc: "Sugerowane działania biznesowe",
          labels: { impact: "WPŁYW", confidence: "UFNOŚĆ", effort: "WYSIŁEK", risk: "RYZYKO", why_now: "DLACZEGO TERAZ?", evidence: "DOWODY", simulation: "SYMULACJA", status: "STATUS" },
          ctas: { evidence: "DOWODY", explain: "WYJAŚNIJ", save_task: "ZAPISZ", add_report: "RAPORT", open_measure: "WIDOK" },
          statuses: { new: "NOWE", approved: "OK", implemented: "WDROŻONE", measured: "SUKCES", closed: "X" },
          priorities: { low: "NISKI", medium: "ŚREDNI", high: "WYSOKI" },
          values: { low: "NISKI", medium: "ŚREDNI", high: "WYSOKI" },
          simulation: { before: "PRZED", after: "PO", delta: "Δ" },
          items: []
        },
        budget: {
          title: "Budżet", desc: "Optymalizacja alokacji", toggle_channels: "Kanały", toggle_campaigns: "Kampanie",
          current_label: "Obecny", suggested_label: "Sugerowany", aggressiveness_label: "Strategia",
          aggressiveness_steps: ["conservative", "standard", "aggressive"],
          aggressiveness_options: { conservative: "Konserwatywna", standard: "Std", aggressive: "Szybka" },
          assumptions_label: "Założenia", assumptions_text: "Oparte na historycznych trendach i AI.",
          channels: [], campaigns: []
        }
      },
      ads_v2: {
        title: "PŁATNE REKLAMY", desc: "Efektywność wielokanałowa",
        summary: { roas_label: "MIESZANY ROAS", roas_status: "STABILNY", model_label: "MODEL DDA" },
        media_mix: {
          title: "Media Mix", desc: "Alokacja budżetu", context_template: "Mix: {name}", metric_spend: "Wydatki", metric_revenue: "Przychód",
          granularity_day: "Dzień", granularity_week: "Tydzień", badge_freshness: "", badge_quality: "",
          action_breakdown: "Widok", action_explain: "Analizuj", tooltip_share: "Udział", tooltip_driver: "Powód"
        },
        efficiency: { title: "Efektywność", desc: "ROAS/CPA", metric_roas: "ROAS", metric_cpa: "CPA", action_show_campaigns: "Pokaż", action_explain: "Wyjaśnij" },
        share: { title: "Udział w rynku", desc: "Share of Voice", spend_label: "Udział w wydatkach", revenue_label: "Udział w przychodach", delta_label: "Δ", attention_badge: "UWAGA" },
        creatives: {
          title: "Reklamy", desc: "Wyniki kreacji", filters_label: "Filtry",
          filters: { format: "Format", placement: "Miejsce", campaign: "Kamp" },
          metrics: { ctr: "CTR", cvr: "CVR", cpa: "CPA", roas: "ROAS", spend: "Wyd", revenue: "Przych" },
          actions: { explain: "Analiza", report: "Raport", alert: "Alert", drill: "Widok" },
          items: []
        },
        drilldown: { level_campaign: "Kampania", level_adset: "Zestaw", level_creative: "Kreacja" },
        ai_prompt: "Wyjaśnij {name}"
      },
      products_v2: {
        title: "Inteligencja SKU", desc: "Dane produktowe i logistyczne", ai_prompt: "Analizuj {name}",
        items: [
          { id: "sku-01", name: "Premiumowe Słuchawki Bezprzewodowe V2" },
          { id: "sku-02", name: "Ergonomiczna Klawiatura Mechaniczna" },
          { id: "sku-03", name: "Ultraszeroki Monitor 4K" },
          { id: "sku-04", name: "Smart Home Hub Pro" },
          { id: "sku-05", name: "Słuchawki ANC" },
          { id: "sku-06", name: "Stacja Dokująca Thunderbolt 4" },
          { id: "sku-07", name: "Precyzyjna Mysz Optyczna" },
          { id: "sku-08", name: "Dysk SSD 2TB Extreme" },
          { id: "sku-09", name: "Webcam 4K HDR" },
          { id: "sku-10", name: "Lampka LED RGB" }
        ],
        scatter: {
          title: "Matryca SKU", desc: "Analiza marży vs wolumenu", context_template: "Produkt: {name}", size_label: "Wolumen", x_label: "Marża %", y_label: "Zysk netto",
          hint_top_right: "BESTSELLERY", hint_bottom_right: "DOJNE KROWY", hint_top_left: "POTENCJAŁ", hint_bottom_left: "OGONY",
          tooltip_profit: "Profit", tooltip_margin: "Marża", tooltip_units: "Sztuki", tooltip_returns: "Zwroty",
          tooltip_stock: "Stan", tooltip_trend: "Trend", tooltip_driver: "Powód",
          tags: { toxic: "TOKSYCZNY", high_margin: "WYSOKA MARŻA", stock_risk: "RYZYKO STANU" },
          multi_select_label: "Zaznaczone", compare: { cta_ai: "AI", cta_compare: "Porównaj", cta_clear: "X" }
        },
        details: {
          title: "Szczegóły SKU", empty: "Wybierz produkt z matrycy", empty_cta: "Wybierz najpierw",
          labels: { profit: "Zysk netto", volume: "Wolumen", returns: "Zwroty", stock: "Stan" },
          stock: { low: "NISKI", medium: "OK", high: "WYSOKI" },
          actions: { explain: "Analiza AI", alert: "Ustaw alert", report: "Do raportu" }
        },
        movers: {
          title: "Dynamika SKU", desc: "Największe zmiany", rising_label: "Wzrosty", falling_label: "Spadki", cta_alert: "Alert stanu", cta_ai: "Wyjaśnij",
          driver_viral: "Wirusowy trend", driver_search: "Popyt w wyszukiwaniu", driver_stock: "Optymalizacja stanów", driver_competition: "Presja konkurencji",
          rising: [], falling: []
        },
        table: {
          title: "Lista Produktów", desc: "Widok tabelaryczny", filters_label: "Filtry", filters: ["TOKSYCZNY", "BESTSELLER"],
          columns: { sku: "KOD SKU", revenue: "PRZYCHÓD", profit: "ZYSK", margin: "MARŻA", returns: "ZWR", stock: "STAN", trend: "7D" },
          metric_defs: { margin: "Marża wkładu", returns: "Stopa zwrotów", trend: "Trend 7-dniowy" },
          actions: { label: "AKCJE", drill: "WIDOK", ai: "AI", report: "RAPORT", alert: "ALERT" }
        }
      },
      customers_v2: {
        title: "ANALIZA LOJALNOŚCI", desc: "Retencja klientów i LTV", ai_prompt: "Wyjaśnij {name}",
        summary: { retention_label: "Śr. retencja", vip_label: "Aktywni VIP" },
        cohorts: {
          title: "Retencja Kohortowa", desc: "Powracalność klientów", mode_month: "Miesięcznie", mode_week: "Tygodniowo", row_label: "Data zakupu",
          row_prefix: "M", col_prefix: "M", small_sample: "Mała próba", context_label: "Kohorta",
          tooltip_retention: "Retencja", tooltip_size: "Rozmiar", tooltip_period: "Okres"
        },
        ltv: { title: "Krzywa LTV", desc: "Wartość życiowa klienta", def: "30-dniowe LTV", tooltip_month: "Miesiąc", tooltip_value: "Wartość" },
        churn: {
          title: "Ryzyko churnu",
          desc: "Segmenty zagrożone",
          actions: { explain: "Analiza", alert: "Alert" },
          segments: [],
          labels: {
            one_time_buyers: "Jednorazowi kupujący",
            recent_dropoffs: "Niedawne spadki",
            inactive_vips: "Nieaktywni VIP"
          }
        },
        vip: {
          title: "Klienci VIP",
          desc: "Segmentacja RFM",
          actions: { report: "Raport", alert: "Alert" },
          segments: [],
          labels: {
            top_spenders: "Top 1% wydatków",
            brand_advocates: "Ambasadorzy marki",
            bulk_buyers: "Kupujący hurtowo"
          }
        },
        month_label: "Miesiąc"
      },
      reports_v2: {
        title: "AUTOMATIC REPORTS", desc: "Zautomatyzowane podsumowania danych",
        last_report: {
          title: "Ostatni raport", desc: "Najnowszy plik", name: "Tygodniowe Podsumowanie", range_label: "Okres", range_value: "7 dni",
          date_label: "Data", date_value: "Dzisiaj", language_label: "Język", language_value: "PL",
          cta_preview: "Podgląd", cta_pdf: "Pobierz PDF", cta_resend: "Email"
        },
        list: { title: "Archiwum Raportów", items: [], actions: { preview: "Widok", download: "Pobierz", open: "Link" } },
        generate: { title: "Nowy Raport", desc: "Szybkie generowanie", cta: "Uruchom Silnik", fields: [{ label: "L", value: "V" }], sections: ["Overview", "Revenue", "Profit"] },
        diff: { title: "Kluczowe Różnice", items: ["ROAS -12%", "Przychód +6%"] }
      },
      pipeline_v2: {
        title: "DATA PIPELINE", desc: "Status ETL i synchronizacji", ai_prompt: "Analiza błędu {name}",
        actions: { open_guardian: "Uruchom Guardian" },
        sources: {
          title: "Źródła danych", desc: "Surowe pobieranie danych",
          columns: { source: "ŹRÓDŁO", status: "STATUS", last_sync: "SYNC", delay: "OPÓŹN", records: "WIERSZE", action: "AKCJA" },
          items: [], actions: { test: "Testuj", sync: "Sync", explain: "Analizuj" }
        },
        transforms: { title: "Transformacja", desc: "Cleaning and RAG", items: [], actions: { run: "Uruchom" } },
        rag: { title: "AI Index", desc: "Baza wektorowa", cta: "Odbuduj", status_label: "Stat", status_value: "OK", last_update_label: "Akt", last_update_value: "1h temu", coverage_label: "Pokr", coverage_value: "100%" },
        bigquery: {
          title: "Baza BigQuery", desc: "Hurtownia danych", cta_open: "Otwórz BQ", cta_export: "Eks", lineage_cta: "Lineage",
          columns: { table: "TABELA", desc: "OPIS", freshness: "ŚWIEŻOŚĆ", action: "AKCJA" }, items: []
        }
      },
      guardian_v2: {
        title: "DATA GUARDIAN", desc: "Monitorowanie jakości i świeżości", ai_prompt: "Problem z {name}",
        badge_label: "Aktywne protokoły bezpieczeństwa",
        health_label: "Zdrowie danych", health_status: "BARDZO DOBRE",
        uptime_label: "Dostępność (30d)",
        uptime_value: "99.98%",
        range_label: "Okres analizy", range_options: ["24h", "7d", "30d"], only_issues_label: "Tylko błędy",
        actions: { run_validations: "Waliduj", rebuild_index: "Indeksuj" },
        status_healthy: "ZDROWE",
        status_delayed: "OPÓŹNIONE",
        delay_under_2_min: "< 2 min",
        delay_na: "n/d",
        severity_critical: "Krytyczny",
        severity_warning: "Ostrzeżenie",
        severity_info: "Info",
        sources: [
          { id: "shopify_raw", name: "Shopify Orders (Webhooks)" },
          { id: "meta_capi", name: "Meta Conversions API" },
          { id: "google_ads_main", name: "Wyniki Google Ads" },
          { id: "ga4_events", name: "Strumień zdarzeń GA4" },
          { id: "allegro_orders", name: "Allegro Marketplace" },
          { id: "warehouse_erp", name: "Wewnętrzny ERP Stock" }
        ],
        freshness: {
          title: "Świeżość Danych", desc: "Monitor synchronizacji",
          menu_label: "Konfiguracja świeżości",
          columns: { source: "ŹRÓDŁO", status: "STATUS", last_sync: "SYNC", delay: "OPÓŹN", records: "WIERSZE", action: "AKCJA" },
          items: [], actions: { explain: "Analizuj" }
        },
        quality: {
          title: "Jakość i Anomalie",
          desc: "Wykryte niespójności",
          empty_state: "Brak incydentów jakościowych",
          items: [
            { id: "q1", title: "Wykryto duplikaty zamówień", impact: "Niespójność w przychodzie P&L", severity: "Krytyczny" },
            { id: "q2", title: "Rozjazd wydatków reklamowych", impact: "Meta Ads vs BigQuery różnica > 5%", severity: "Ostrzeżenie" },
            { id: "q3", title: "Brak metadanych SKU", impact: "Puste marże dla 12 nowych pozycji", severity: "Info" },
            { id: "q4", title: "Opóźnienie połączenia ETL", impact: "Latencja wzrosła do 450ms", severity: "Ostrzeżenie" }
          ],
          actions: { view: "Widok", fix: "Napraw" }
        },
        rag: {
          title: "Model RAG",
          desc: "Kontekst AI",
          status_heading: "Status modelu RAG",
          index_title: "Indeks wektorowy",
          index_subtitle: "Aktywna warstwa semantyczna",
          explain_context: "Stan indeksu RAG",
          cta: "Uruchom",
          status_label: "Status",
          status_value: "OK",
          last_update_label: "Ostatnia",
          last_update_value: "1h",
          coverage_label: "Pokr",
          coverage_value: "100%"
        }
      },
      integrations_v2: {
        title: "INTEGRACJE", desc: "Zarządzanie połączeniami", header_badge: "Centrum integracji aktywne", search_placeholder: "Szukaj konektora...",
        filters: { all: "Wszystkie", active: "Aktywne", disabled: "Wyłączone", attention: "Wymaga uwagi" },
        sorts: { issues: "Problemy", recent: "Ostatnie", name: "Nazwa" },
        status_active: "Aktywny", status_disabled: "Wyłączony", status_attention: "Problem", status_connecting: "Łączenie...", status_connected: "Połączono",
        active_connectors_label: "Aktywne integracje", records_synced_label: "Zsynchronizowane rekordy", uptime_label: "Dostępność (30 dni)", auth_prefix: "Autoryzacja", sync_prefix: "Sync",
        scope_label: "Zakres", scope_default: "Pełny dostęp", auth_label: "Autoryzacja", last_sync_label: "Sync",
        last_sync_recent: "Przed chwilą", last_sync_delay: "Opóźnienie", last_sync_disabled: "Wyłączone",
        freshness_label: "SLA", freshness_status: "99.9% OK", actions: { test: "Testuj", details: "Pokaż", refresh: "Sync" },
        security_badge_label: "Szyfrowanie aktywne",
        security_title: "Bezpieczna centralizacja",
        security_desc: "Wszystkie połączenia są szyfrowane kluczem AES-256. Twoje dane pozostają w izolowanym środowisku BigQuery w wybranym regionie UE.",
        security_cta_keys: "Zarządzaj kluczami",
        security_cta_sla: "Pobierz raport SLA"
      },
      knowledge_v2: {
        title: "BAZA WIEDZY", desc: "Przewodniki i strategie", search_placeholder: "Szukaj...", ai_prompt: "Pomoc: {name}",
        badge_label: "Centrum wiedzy aktywne",
        resources_label: "Biblioteka zasobów",
        empty_title: "Brak wyników",
        empty_desc: "Spróbuj zmienić filtry wyszukiwania.",
        clear_filters_label: "Wyczyść filtry",
        filters: {
          category: [
            { id: "all", label: "Wszystkie kategorie" },
            { id: "STRATEGY", label: "Strategia" },
            { id: "DATA", label: "Dane i inżynieria" },
            { id: "AI", label: "Sztuczna inteligencja" }
          ],
          level: [],
          type: [],
          module: []
        },
        card: { cta_open: "Czytaj", cta_ai: "Analiza AI" },
        detail: { title: "Treść", empty: "Wybierz poradnik", cta_apply: "Zastosuj", cta_report: "Do raportu" },
        empty_list: "Wybierz artykuł z listy, aby zobaczyć treść",
        booking: {
          title: "Zamów konsultację",
          subtitle: "Expert Strategic Sync 1:1",
          topic_label: "Temat sesji",
          topic_placeholder: "np. Skalowanie Meta Ads",
          date_label: "Preferowana data",
          budget_label: "Budżet miesięczny",
          budget_options: ["10k - 50k PLN", "50k - 200k PLN", "200k+ PLN"],
          guarantee_title: "Gwarancja Satysfakcji",
          guarantee_desc: "Sesja zostanie zafakturowana po potwierdzeniu terminu. Zwrot środków w przypadku braku konkretnych rekomendacji.",
          submit_cta: "Wyślij zgłoszenie",
          close_cta: "Zamknij"
        },
        expert: {
          pill: "Ekspercki Sync",
          title: "Potrzebujesz wsparcia?",
          desc: "Umów 45-minutową konsultację z architektem danych PapaData.",
          cta_label: "Zarezerwuj termin (349 PLN)",
          ai_context: "Konsultacja ekspercka"
        },
        actions: { open_article: "Otwórz artykuł", share_team: "Udostępnij zespołowi", bookmark: "Zapisz na później" },
        resources: [
          {
            id: "res-1",
            category: "STRATEGY",
            title: "Skalowanie Meta Ads w 2024",
            desc: "Jak efektywnie zarządzać budżetem przy rosnącym CPM.",
            author: "Adam Wiśniewski, Head of Growth",
            level: "Zaawansowany",
            type: "Artykuł",
            time: "12 min",
            module: "Ads",
            videoId: "meta-scaling-101",
            longContent: "Skalowanie kampanii Meta Ads wymaga przejścia od optymalizacji na poziomie zestawów reklam do podejścia opartego na Broad Targeting i silnych kreacjach. Dowiesz się, jak Advantage+ zmienia reguły gry oraz dlaczego retencja danych w BigQuery jest kluczowa dla modelowania atrybucji.\n\nKluczowe zagadnienia:\n- Struktura konta 2.0: Mniej znaczy więcej\n- Creative Testing framework: Wyłanianie zwycięzców\n- Wykorzystanie CAPI do stabilizacji wyników."
          },
          {
            id: "res-2",
            category: "DATA",
            title: "Architektura BigQuery dla e-commerce",
            desc: "Struktura tabel i optymalizacja kosztów zapytań.",
            author: "Marta Nowak, Data Engineer",
            level: "Ekspert",
            type: "Przewodnik",
            time: "25 min",
            module: "Pipeline",
            longContent: "Zrozumienie schematu danych w BigQuery to pierwszy krok do budowy zaawansowanych modeli LTV. Analizujemy różnice między strukturą zagnieżdżoną (NESTED) a płaską oraz wpływ partycjonowania na koszty operacyjne przy milionach rekordów zamówień."
          },
          {
            id: "res-3",
            category: "AI",
            title: "Prompt Engineering dla Analityków",
            desc: "Jak rozmawiać z Papa AI, aby uzyskać głębokie wglądy.",
            author: "AI Agent Unit-01",
            level: "Średniozaawansowany",
            type: "Interaktywny",
            time: "8 min",
            module: "Overview",
            videoId: "ai-prompts-mastery",
            longContent: "Papa AI nie jest tylko chatbotem. To interfejs do Twojej hurtowni danych. Naucz się stosować technikę Chain-of-Thought, aby asystent nie tylko podawał liczby, ale tłumaczył korelacje między ROAS a porzuconymi koszykami w konkretnych segmentach klientów."
          }
        ]
      },
      settings_workspace_v2: {
        title: "Ustawienia Workspace", desc: "Konfiguracja przestrzeni roboczej",
        badge_label: "Konfiguracja Workspace",
        data: {
          title: "Dane",
          desc: "Lokalizacja i retencja",
          retention_label: "Retencja",
          retention_options: [
            { value: 30, label: "30 Dni (Plan Starter)" },
            { value: 60, label: "60 Dni (Plan Professional)" },
            { value: 365, label: "1 Rok (Custom / Enterprise)" }
          ],
          retention_help: "Pomoc",
          retention_warning: {
            title: "Uwaga przy obniżeniu retencji",
            desc: "Przy przejściu z 60 na 30 dni zalecamy eksport danych przed skróceniem retencji.",
            cta_export: "Eksportuj dane"
          },
          region_label: "Region",
          region_options: [{ value: "europe-central2", label: "Europe (Warsaw) - GCP Node" }]
        },
        privacy: { masking_label: "Maskowanie PII", masking_desc: "Ukryj dane wrażliwe" },
        attribution: {
          title: "Atrybucja",
          desc: "Model przypisania",
          models: [
            { id: "dda", label: "Data-Driven AI", desc: "Wykorzystuje ML do przypisania wagi każdemu punktowi styku.", default: true },
            { id: "last_click", label: "Last Click Paid", desc: "100% konwersji trafia do ostatniego płatnego kanału.", default: false },
            { id: "linear", label: "Liniowy", desc: "Równy podział zasług między wszystkie interakcje.", default: false },
            { id: "first_click", label: "First Click", desc: "Premiuje kanały budujące świadomość u góry lejka.", default: false }
          ]
        },
        integrations: {
          title: "Linki",
          desc: "Aktywne konektory",
          items: [
            { id: "shopify", label: "Shopify Storefront", desc: "Token: •••• a92f", status: "Aktywny" },
            { id: "meta", label: "Meta Ads Manager", desc: "Account: 942-011-222", status: "Aktywny" },
            { id: "ga4", label: "Google Analytics 4", desc: "Property: 28419201", status: "Aktywny" }
          ]
        },
        alerts: {
          title: "Powiadomienia",
          desc: "Zasady alertów",
          items: [
            { id: "roas_drop", label: "Spadek ROAS > 20% (Daily)", enabled: true },
            { id: "etl_lag", label: "Opóźnienie ETL > 60 min", enabled: true },
            { id: "stock_risk", label: "Ryzyko Braku Towaru < 5 dni", enabled: false },
            { id: "margin_anom", label: "Anomalia Marży Produktowej", enabled: true }
          ]
        },
        notifications: {
          channels_title: "Kanały powiadomień",
          email_label: "E-mail (MUST)",
          schedule_title: "Harmonogram raportów",
          schedules: [
            { id: "starter", label: "Starter", value: "Tygodniowo" },
            { id: "pro", label: "Professional", value: "Codziennie" },
            { id: "enterprise", label: "Enterprise", value: "Real-time / konfigurowalne" }
          ],
          recipients_title: "Odbiorcy alertów",
          recipients: ["alerts@papadata.ai", "ops@papadata.ai"],
          quiet_hours_label: "Quiet hours",
          quiet_hours_value: "22:00–06:00 (Europe/Warsaw)",
          export_title: "Eksport raportów",
          export_formats: ["PDF", "CSV", "JSON"]
        },
        ai: {
          title: "Model AI",
          desc: "Konfiguracja asystenta",
          items: [
            { label: "Model Engine", value: "Gemini 2.5 Pro" },
            { label: "Context Window", value: "1M Tokens" },
            { label: "Temperature", value: "0.4 (Analytical)" }
          ]
        },
        footer_note: "Wymagany zapis", cta_primary: "Wdróż w trybie produkcyjnym", cta_secondary: "Zapisz zmiany"
      },
      settings_org_v2: {
        title: "Organizacje", desc: "Zarządzanie kontem i rozliczeniami",
        company: { title: "Firma", fields: [] },
        users: { title: "Użytkownicy", items: [], cta_invite: "Zaproś" },
        billing: { title: "Rozliczenia", items: [], cta_change: "Zmień plan" },
        security: { title: "Bezpieczeństwo", items: [], cta_logout_all: "Wyloguj sesje" },
        audit: { title: "Audit Logs", items: [], cta_export: "Eksportuj" },
        privacy: { title: "Polityka Prywatności", items: [], cta_export: "Pobierz dane", cta_delete: "Usuń konto" },
        badge_label: "Centrum organizacji",
        license_label: "3 / 15 Licencji",
        mock: {
          company_fields: [
            { label: "Nazwa Prawna", value: "PapaData Intelligence Sp. z o.o." },
            { label: "Numer NIP", value: "PL5251234567" },
            { label: "Adres Siedziby", value: "ul. Danych 12, 00-001 Warszawa" },
            { label: "E-mail Rozliczeniowy", value: "billing@papadata.ai" }
          ],
          team_members: [
            { name: "Adam Wiśniewski", email: "adam@papadata.ai", role: "Owner", status: "Online" },
            { name: "Marta Nowak", email: "marta@papadata.ai", role: "Analyst", status: "Away" },
            { name: "Jan Kowalski", email: "jan.k@external.com", role: "Viewer", status: "Offline" }
          ],
          billing_info: [
            { label: "Aktualny Plan", value: "Professional PRO (Active Trial)" },
            { label: "Następna Faktura", value: "01.05.2024 (499.00 PLN)" },
            { label: "Metoda Płatności", value: "Google Identity Pay" },
            { label: "Status Subskrypcji", value: "Trial Mode" }
          ],
          billing_plans: [
            { id: "starter", name: "Starter", price: "159 PLN/mies. (rocznie) / 199 PLN/mies.", note: "Do 3 źródeł, raport tygodniowy" },
            { id: "pro", name: "Professional", price: "399 PLN/mies. (rocznie) / 499 PLN/mies.", note: "Do 15 źródeł, raport dzienny" },
            { id: "enterprise", name: "Enterprise", price: "Wycena indywidualna", note: "Nielimitowane źródła, real-time raporty" }
          ],
          invoices: [
            { id: "inv-0424", label: "Faktura 04/2024", status: "Opłacona", amount: "499.00 PLN" },
            { id: "inv-0324", label: "Faktura 03/2024", status: "Opłacona", amount: "499.00 PLN" },
            { id: "inv-0224", label: "Faktura 02/2024", status: "Opłacona", amount: "499.00 PLN" }
          ],
          audit_logs: [
            { label: "Login via Google", value: "Success (IP: 84.10.x.x) - 12:42" },
            { label: "Connector Update", value: "Meta Ads (by Adam W.) - 09:15" },
            { label: "Audit Log Export", value: "Requested - 08:30" }
          ],
          login_methods: ["Google", "Microsoft", "Firmowy e-mail (weryfikacja)"],
          sessions: [
            { id: "device-1", label: "MacBook Pro • Warszawa", value: "Aktywna • 12:40" },
            { id: "device-2", label: "Windows • Poznań", value: "Aktywna • 10:05" },
            { id: "device-3", label: "iPhone • Warszawa", value: "Aktywna • 08:12" }
          ],
          status_card: {
            label: "Status",
            value: "Aktywny Trial (Professional)",
            desc: "Wygasa za 14 dni. Po tym czasie funkcje zostaną wstrzymane."
          },
          payer: { label: "Płatnik", value: "Owner • Adam Wiśniewski" },
          billing_cycle: { label: "Okres rozliczeniowy", value: "Miesięczny" },
          payment_status: {
            label: "Status płatności",
            ok: "Aktywna",
            error: "Błąd płatności",
            fix_cta: "Napraw płatność",
            ok_tooltip: "Brak błędu płatności"
          },
          card_payment: {
            label: "Płatność kartą",
            desc: "Dodaj kartę lub zaktualizuj dane płatności"
          },
          plans_label: "Plany",
          invoices_label: "Historia faktur",
          invoice_pdf_cta: "PDF",
          approve_plan_cta: "Zatwierdź Plan Subskrypcji",
          security_title: "Logowanie & Bezpieczeństwo",
          login_method_label: "Metoda Logowania",
          login_method_value: "Google Identity Cloud",
          login_methods_label: "Dostępne metody",
          mfa_label: "MFA",
          mfa_value: "Zalecane (domyślnie)",
          sessions_label: "Sesje urządzeń",
          compliance: {
            title: "Zgodność & Dane (EOG)",
            desc: "Dane przetwarzane wyłącznie w regionie europe-central2 (Warszawa).",
            cta_dpa: "Pobierz DPA",
            cta_retention: "Polityka retencji",
            cta_confirmations: "Potwierdzenia",
            cta_delete_org: "Usuń Organizację"
          }
        },
        footer_note: "Zmiany w ustawieniach organizacji wpływają na wszystkie Workspace w ramach konta.",
        cta_save: "Zapisz zmiany"
      },
      alerts_v2: {
        title: "Alerty", desc: "Alerty systemowe", domain_label: "Domena", domains: ["Reklamy", "Produkty"],
        state_label: "Stan", states: ["Aktywne"],
        actions: { explain_ai: "AI", open_view: "Otwórz", set_alert: "Alert", mute: 'Mute' },
        filters: { all: "Wszystkie", critical: "Kryt", warning: "Ostrz", info: "Info" },
        empty_state: "Brak aktywnych alertów dla wybranych filtrów",
        impact_template: "Wpływ: {value} vs średnia",
        context_fallback: "Brak dodatkowego kontekstu.",
        prompt_template: "Wyjaśnij alert {title}. Kontekst: {context}.",
        mock_alerts: [
          { title: "Anomalia ROAS: Meta Ads", context: "Wyniki Meta Ads", target: "ads", severity: "critical", baseProb: 0.9 },
          { title: "Prognozowany Stock-out SKU-42", context: "Logistyka magazynu", target: "products", severity: "warning", baseProb: 0.7 },
          { title: "Wykryto duplikaty zamówień", context: "Integralność danych", target: "guardian", severity: "critical", baseProb: 0.8 },
          { title: "Opóźnienie ETL: Google Analytics", context: "Pipeline GA4", target: "guardian", severity: "warning", baseProb: 0.6 },
          { title: "Wzrost CPA: Search Brand", context: "Google Ads Search", target: "ads", severity: "warning", baseProb: 0.5 },
          { title: "Nowy segment VIP zidentyfikowany", context: "Segmentacja klientów", target: "customers", severity: "info", baseProb: 0.4 },
          { title: "Błąd walidacji marży", context: "Audyt P&L", target: "pandl", severity: "critical", baseProb: 0.85 },
          { title: "Niestabilność API Shopify", context: "Konektor Shopify", target: "integrations", severity: "warning", baseProb: 0.3 },
          { title: "Cel LTV osiągnięty: Kohorta M2", context: "Retencja kohort", target: "customers", severity: "info", baseProb: 0.2 },
          { title: "Wykryto ruch botów (Referral)", context: "Jakość analityki", target: "guardian", severity: "warning", baseProb: 0.45 }
        ]
      },
      // Fix: Added missing P&L and other properties to pl.dashboard required by DashboardData interface
      pnl_title: "P&L", pnl_model: "Model", pnl_net_margin_label: "Marża netto",
      pnl_contribution_margin_label: "Marża wkładu",
      pnl_tax_est_label: "Podatek (est.)",
      pnl_tab_summary: "Podsumowanie",
      pnl_tab_detail: "Szczegóły",
      pnl_live_calculation: "Obliczenia na żywo",
      pnl_status_stable: "Stabilny",
      pnl_status_high: "Wysokie",
      pnl_status_fixed: "Stałe",
      pnl_gross_profit: "Zysk brutto", pnl_net_profit: "Zysk netto", pnl_after_opex: "Po OpEx",
      pnl_waterfall: "Waterfall", pnl_region_label: "Region", pnl_final_state: "Stan końcowy",
      pnl_cost_breakdown: "Rozbicie kosztów", pnl_dim_category: "Kategoria", pnl_badge_audited: "Audytowane",
      pnl_revenue: "Przychód", pnl_cogs: "COGS", pnl_fees: "Prowizje", pnl_refunds: "Zwroty",
      pnl_shipping: "Wysyłka", pnl_ad_spend: "Wydatki na reklamy", pnl_payroll: "Płace",
      pnl_tools: "Narzędzia", pnl_contribution: "Kontrybucja", pnl_export_live: "Eksportuj Live",
      pnl_export_audit_pdf: "Pobierz Audyt PDF",
      pnl_context_template: "Linia P&L: {label} ({value})",
      pnl_ai_prompt_template: "Przeanalizuj pozycję P&L {label}. Czy wartość {value} jest optymalna przy przychodzie {revenue}?",
      pnl_ebitda_label: "EBITDA",
      pnl_analyze_profitability: "Analizuj rentowność",
      ads_title: "Reklamy", ads_attribution: "Atrybucja", ads_total_roas: "ROAS", ads_status_optimal: "Optymalny",
      ads_spend_vs_revenue: "W/P", ads_latency: "Opóźn", ads_label_spend: "Wyd", ads_label_revenue: "Przych",
      ads_automations: "Auto", ads_agent: "Agent", ads_auto_bid: "Bidding", ads_anomaly_detect: "Anomalia",
      ads_fraud_filter: "Fraud", ads_creative_fatigue: "Zmęczenie", ads_open_live: "Live",
      ads_channel_matrix: "Matryca", ads_model_refreshed: "Odświeżono", ads_col_channel: "Kn",
      ads_col_spend: "Wydatki", ads_col_revenue: "Przych", ads_col_roas: "ROAS", ads_col_cpa: "CPA",
      ads_col_conversions: "Konw", customers_title: "Klient", customers_dim_segment: "Seg",
      customers_pii_masked: "Zamaskowane", customers_segment_new: "Nowi", customers_segment_returning: "Powr",
      customers_segment_vip: "VIP", customers_aov: "AOV", customers_ltv: "LTV", customers_repeat_rate: "Powt",
      customers_open_cohorts_live: "Kohorty", customers_cohort_title: "Tytuł",
      customers_metric_returning: "Powracający", customers_cohort_label: "Kohorta",
      customers_month_label: "Miesiąc", customers_model_note: "Notka", products_title: "Prod",
      products_dim_sku: "SKU", products_stock_signal: "Stan", products_col_sku: "SKU",
      products_col_product: "Produkt", products_col_units: "Sztuki", products_col_revenue: "Przych",
      products_col_margin: "Marża", products_col_stock: "Stan", products_col_status: "Status",
      products_status_ok: "Zdrowy", products_status_low: "Niski", products_status_crit: "Kryt",
      products_suggestion: "Sug", products_restock_prefix: "Zamów ", products_restock_suffix: " szt.",
      products_open_inventory_live: "Mag", products_price_signal: "Cena", products_elasticity_model: "Elast",
      products_discount_opt: "Rab", products_bundle_opt: "Pakiet", products_risk_stockout: "Ryzyko",
      products_return_risk: "Zwr", products_note_best_for: "Najlepsze dla", products_note_bundle: "Notka",
      products_note_risk_stockout: "Ostrzeżenie", products_note_return_risk: "Zwroty",
      products_open_pricing_lab: "Cennik",
      alerts_title: "Alerty",
      alerts_stream: "Strumień",
      alerts_ack_required: "Potw",
      alerts_action_prefix: "Akcja: ", alerts_ack: "Potw", alerts_acked: "Potw", alerts_open_runbook: "Runbook",
      alerts_notify_policy: "Polityka", alerts_channel_email: "Email", alerts_channel_slack: "Slack",
      alerts_channel_sms: "SMS", alerts_quiet_hours: "Cisza", alerts_quiet_hours_window: "Okno",
      alerts_connect_live_channels: "Połącz", alerts_severity_alert: "Alert",
      alerts_severity_security: "Szyfr", alerts_severity_warning: "Ostrz", alerts_severity_info: "Info",
      integrations_connector_count: "Liczba",
      settings_title: "Ustawienia",
      settings_read_safe: "Bezpieczne",
      settings_region: "Region",
      settings_gdpr_enforced: "RODO",
      settings_data_retention: "Retencja",
      settings_pii_masking: "Maskowanie PII",
      settings_masking_desc: "Ukryj dane wrażliwe",
      settings_days: "dni", settings_connector_tokens: "Tokeny", settings_scoped_auth: "Dostęp",
      settings_connector_shopify_label: "Shopify", settings_connector_shopify_desc: "Opis",
      settings_connector_allegro_label: "Allegro", settings_connector_allegro_desc: "Opis",
      settings_connector_google_ads_label: "GAds", settings_connector_google_ads_desc: "Opis",
      settings_connector_meta_capi_label: "Meta", settings_connector_meta_capi_desc: "Opis",
      settings_connector_ga4_label: "GA4", settings_connector_ga4_desc: "Opis",
      settings_connector_email_label: "Email", settings_connector_email_desc: "Opis",
      settings_apply_live: "Zastosuj", status_enabled: "Włączone", status_disabled: "Wyłączone", status_on: "Wł", status_off: "Wył",
      status_monitor: "Monitor", status_healthy: "Zdrowy", status_syncing: "Sync",
      status_high: "Wysoki", status_low: "Niski", tenant_mode_delay: "Opóźn", tenant_mode_demo: "Demo",
      tenant_mode_live: "Live", workspace_mode_label: "Tryb", btn_pin: "Przypnij", btn_unpin: "Odepnij",
      pnl_gross_margin_short: "GM",
      ads_channels: [
        { id: "meta_ads", label: "Meta Ads", short_label: "Meta" },
        { id: "google_ads", label: "Google Ads", short_label: "Google" },
        { id: "tiktok_ads", label: "TikTok Ads", short_label: "TikTok" },
        { id: "affiliates", label: "Afiliacje", short_label: "Aff" }
      ],
      products_catalog: [],
      cohort_week_prefix: "T", cohort_month_prefix: "M", guardian_logs: [],
      range_1d: "1d", range_7d: "7d", range_30d: "30d", range_90d: "90d", range_mtd: "MTD",
      range_qtd: "QTD", range_ytd: "YTD", range_custom: "Własny", compare_prev: "Poprz",
      compare_yoy: "YoY", compare_y: "R", attribution_last_click: "Last", attribution_data_driven: "Data",
      attribution_diff_badge: "Diff", attribution_undo: "Cofnij", filter_channel: "Kanał",
      filter_account: "Konto", filter_campaign: "Kampania", filter_country: "Kraj",
      filter_device: "Urządzenie", filter_segment: "Segment", filter_category: "Kategoria",
      filter_source: "Źródło", filter_option_all: "Wszystkie", filter_option_meta: "Meta",
      filter_option_google: "Google", filter_option_tiktok: "TikTok", filter_option_affiliate: "Afil",
      filter_option_account_a: "A", filter_option_account_b: "B", filter_option_brand: "Brand",
      filter_option_prospecting: "Prosp", filter_option_retargeting: "Ret", filter_option_pl: "PL",
      filter_option_de: "DE", filter_option_cz: "CZ", filter_option_uk: "UK",
      filter_option_mobile: "Mob", filter_option_desktop: "Desk", filter_option_tablet: "Tab",
      filter_option_new: "Nowi", filter_option_returning: "Powr", filter_option_vip: "VIP",
      filter_option_top_sellers: "Top", filter_option_low_margin: "Low", filter_option_bundles: "Pakiety",
      filter_option_shopify: "Shopify", filter_option_allegro: "Allegro", filter_option_pos: "POS",
      sidebar_tagline: "Tagline", nav_group_start: "Start", nav_group_ai: "AI",
      nav_group_performance: "Perf", nav_group_fundamentals: "Fund", nav_group_ops: "Ops",
      nav_group_settings: "Ust", nav_overview: "Przeg", nav_growth: "Wzr", nav_ads: "Rekl",
      nav_products: "Prod", nav_customers: "Klient", nav_pandl: "P&L", nav_alerts: "Alert",
      nav_integrations: "Int", nav_guardian: "Guard", nav_reports: "Rap", nav_pipeline: "Pipe",
      nav_knowledge: "Wiedza", nav_settings_workspace: "Prac", nav_settings_org: "Org",
      sidebar_pin: "Pin", sidebar_unpin: "Unpin", session_label: "Sesja", session_ready: "Gotowy",
      session_processing: "Proc", session_error: "Błąd", mode_demo: "Demo", mode_live: "Live",
      workspace_label: "Workspace", workspace_papastore_pl: "PL", workspace_papastore_pl_detail: "Sklep PL",
      workspace_papastore_eu: "EU", workspace_papastore_eu_detail: "Sklep EU",
      workspace_demo: "Demo", workspace_demo_detail: "Dane demo",
      workspace_last_sync_recent: "Teraz", workspace_last_sync_delay: "Opóźn",
      workspace_last_sync_error: "Błąd", workspace_search: "Szukaj", workspace_pinned_label: "Pin",
      workspace_recent_label: "Ost", workspace_empty: "Pusto", status_ok: "OK", status_delay: "Dly",
      status_error: "Err", data_freshness_label: "Świeże", command_open: "Otwórz",
      command_shortcut: "K", command_title: "Paleta", command_desc: "Run",
      command_placeholder: "Wpisz", command_group_navigation: "Naw",
      command_group_actions: "Akcje", command_group_resources: "Zasoby", command_empty: "Brak",
      command_nav_hint: "Hint", command_action_report: "Rap", command_action_report_desc: "Opis",
      command_action_alert: "Alert", command_action_alert_desc: "Opis",
      command_action_pipeline: "Pipe", command_action_pipeline_desc: "Opis",
      command_action_integrations: "Int", command_action_integrations_desc: "Opis",
      command_action_go_live: "Live", command_action_go_live_desc: "Opis",
      command_action_workspace: "Work", command_action_workspace_desc: "Opis",
      command_resource_roas: "ROAS", command_resource_roas_desc: "Opis",
      command_resource_bigquery: "BQ", command_resource_bigquery_desc: "Opis",
      command_resource_ai: "AI", command_resource_ai_desc: "Opis",
      notifications_title: "Powiad", notification_roas_title: "ROAS",
      notification_roas_desc: "Opis", notification_roas_time: "Czas",
      notification_delay_title: "Opóźn", notification_delay_desc: "Opis",
      notification_delay_time: "Czas", notification_action_explain: "Wyjaśnij",
      notification_action_open: "Otwórz", notification_action_quality: "Qual",
      context_meta_roas: "Meta", context_label: "Kontekst", context_clear: "Wyczyść",
      filters_clear: "Wyczyść", filters_empty: "Puste", settings_shortcut: "S",
      account_title: "Konto", account_profile: "PROFIL", account_access: "DOSTĘP",
      account_billing: "BILL", account_logout: "WYLOGUJ", account_end_session: "KONIEC",
      cta_go_live: "GO", demo_banner_title: "DEMO", demo_banner_desc: "SYNTH",
      demo_banner_cta_primary: "LIVE", demo_banner_cta_secondary: "UP",
      demo_banner_cta_tertiary: "LEARN", demo_banner_dismiss: "X",
      confirm_unsaved_changes: "Potwierdź"
    },
    promo: {
      title: "WZMOCNIJ SWÓJ E-COMMERCE DZIĘKI AI",
      desc: "Podłącz swoje dane i otrzymaj gotowe rekomendacje w kilka minut.",
      btn_trial: "Zacznij 14-dniowy okres próbny",
      btn_demo: "Obejrzyj demo",
      dismiss_7_days: "Ukryj na 7 dni",
      minimized_label: "Oferta specjalna",
      minimized_title: "Darmowy okres próbny",
      features: ["Do 15 źródeł danych", "Codzienne raporty i alerty", "Raporty PDF i interaktywne"],
      meta: {
        sid_label: "",
        security_tag: "",
        limited_mode_tag: "OFERTA_LIMITOWANA",
        compliance_tag: "RODO_READY"
      }
    },
    promo_v2: {
      main: {
        title: "Zacznij 14-dniowy okres próbny",
        subhead: "Podłącz źródła i zobacz KPI + alerty na własnych danych. Najczęściej wybierany: Professional.",
        cta_pro: "Zacznij trial Professional",
        cta_starter: "Zacznij trial Starter",
        cta_demo: "Obejrzyj demo (2 min)",
        microcopy: "Brak opłat przez 14 dni. Możesz zmienić plan w dowolnym momencie.",
        omnibus_note: "Jeśli jest promocja, pokazujemy najniższą cenę z 30 dni.",
        reasons_title: "Dlaczego ten plan",
        reasons_pro: ["Codzienne alerty", "Wyższe limity AI", "Priorytetowe wsparcie"],
        reasons_starter: ["Szybki start", "Raporty tygodniowe", "Kluczowe KPI"],
        pro_card: {
          name: "PROFESSIONAL",
          desc: "Codzienne raporty i alerty + wyższy limit AI.",
          tag: "POLECANY",
          bullets: ["Do 15 źródeł danych", "Codzienne raporty i alerty", "Priorytetowe wsparcie", "Wyższy limit AI"]
        },
        starter_card: {
          name: "STARTER",
          desc: "Szybki start i walidacja pracy z danymi.",
          bullets: ["Do 3 źródeł danych", "Tygodniowe raporty PDF", "Standardowe wsparcie", "Analiza AI"]
        }
      },
      intercept: {
        title: "Zanim wybierzesz Starter…",
        subhead: "Jeśli planujesz więcej niż 3 źródła lub chcesz otrzymywać codzienne alerty, Professional oszczędzi Twój czas od pierwszego dnia.",
        bullets: [
          "Codzienne alerty o anomaliach (ROAS/CPA/wydatki) zamiast cotygodniowych podsumowań",
          "Więcej źródeł danych (do 15) — brak szybkiego uderzenia w limity",
          "Wyższy limit AI + priorytetowe wsparcie"
        ],
        cta_pro: "Wybieram Professional (trial)",
        cta_starter: "Zostaję przy Starter (trial)",
        microcopy: "Możesz zmienić plan później — bez utraty danych i konfiguracji."
      },
      system_label: "Autoryzacja systemu",
      plan_meta: {
        premium_label: "PROTOKÓŁ_PREMIUM_AKTYWNY",
        standard_label: "STANDARDOWY_DOSTĘP"
      },
      trust_bar: "Dane w UE (Warszawa) • Izolacja danych • Szyfrowane połączenia",
      trust_security_label: "AES_256_SECURED"
    },
    cookies: {
      meta_line: "Polityka Cookies i Zarządzanie Danymi",
      badge: "PRYWATNOŚĆ",
      title: "Ustawienia cookies",
      desc: "Używamy cookies i podobnych technologii, aby strona działała poprawnie, była bezpieczna oraz (za Twoją zgodą) mierzyć ruch i skuteczność kampanii (GA4, Google Ads, Meta). Możesz zaakceptować wszystkie, odrzucić opcjonalne lub dostosować ustawienia.",
      policy_link: "/legal/cookies",
      policy_text: "Polityka cookies",
      policy_privacy_label: "Polityka prywatności",
      policy_cookies_label: "Polityka cookies",
      policy_privacy_link: "/legal/privacy",
      policy_cookies_link: "/legal/cookies",
      accept_all: "Akceptuj wszystkie",
      reject_optional: "Odrzuć opcjonalne",
      settings: "Ustawienia",
      save_settings: "Zapisz Ustawienia",
      back: "Wróć",
      necessary_label: "Niezbędne",
      necessary_desc: "Zapewniają działanie strony, bezpieczeństwo i podstawowe funkcje (np. utrzymanie sesji, ochrona przed nadużyciami).",
      necessary_tag: "WYMAGANE",
      analytical_label: "Analityczne (GA4)",
      analytical_desc: "Pomagają nam zrozumieć, jak użytkownicy korzystają ze strony (np. liczba odwiedzin, źródła ruchu), aby poprawiać produkt i treści.",
      analytical_tag: "OPCJONALNE",
      marketing_label: "Marketingowe (Google Ads, Meta)",
      marketing_desc: "Służą do pomiaru skuteczności kampanii i — jeśli wyrazisz zgodę — do dopasowania reklam (np. remarketing).",
      marketing_tag: "OPCJONALNE",
      functional_label: "Funkcjonalne / Preferencje",
      functional_desc: "Zapamiętują dodatkowe ustawienia (np. preferencje) i ułatwiają korzystanie ze strony.",
      functional_tag: "OPCJONALNE",
      lead: "Wybierz, na jakie kategorie cookies wyrażasz zgodę. Cookies niezbędne są zawsze włączone, aby strona działała prawidłowo.",
      providers_title: "Dostawcy",
      providers_desc: "Poniżej znajdziesz listę narzędzi używanych na stronie. Szczegóły (czas przechowywania, zakres danych, podstawy prawne) opisujemy w Polityce cookies.",
      provider_ga4: "Google Analytics 4 (Google LLC) – pomiar ruchu i zachowań na stronie (agregaty/statystyki).",
      provider_ads: "Google Ads (Google LLC) – konwersja pomiaru i skuteczności kampanii, remarketing (za zgodą).",
      provider_meta: "Meta Pixel (Meta Platforms, Inc.) – konwersja pomiaru i skuteczności kampanii, remarketing (za zgodą).",
      provider_gtm: "Google Tag Manager (Google LLC) – narzędzie do uruchamiania tagów; samo w sobie nie służy do profilowania.",
      cookie_ids_label: "Przykładowe identyfikatory cookies",
      cookie_ids_desc: "Nazwy cookies mogą się różnić w zależności od konfiguracji i aktualizacji dostawców (np. _ga/_gid dla GA4, gcl* dla Google Ads, _fbp dla Meta).",
      save_choice: "Zapisz wybór",
      footer_note: "Zgodę możesz zmienić w dowolnym momencie w stopce (\"Ustawienia cookies\").",
      footer_left: "ZGODNE Z RODO",
      footer_right: "HOSTOWANE W UE",
    }
  }
};
