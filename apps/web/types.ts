export interface DropdownItem {
  label: string;
  actionId: string;
}

export interface FooterLink {
  label: string;
  actionId: string;
}

export interface NavItem {
  key: string;
  label: string;
  dropdown?: DropdownItem[];
}

export interface CommonData {
  open_menu: string;
  close_menu: string;
  main_nav_label: string;
  home_link_label: string;
  error_title: string;
  error_desc: string;
  error_refresh: string;
  error_home: string;
  time_now: string;
  time_minutes_ago: string;
  time_hours_ago: string;
  scroll_to_top: string;
  coming_soon_title: string;
  coming_soon_desc: string;
  close: string;
  toggle_theme_light: string;
  toggle_theme_dark: string;
  back_to_home: string;
  pin: string;
  unpin: string;
}

export interface FeatureDetail {
  title: string;
  desc: string;
  details: string[];
  tag: string;
  commonUses?: string[];
  requiredData?: string;
}

export interface HeroData {
  pill: string;
  h1_part1: string;
  h1_part2: string;
  h1_part3: string;
  h2: string;
  h3_part1?: string;
  h3_part2?: string;
  desc: string;
  primary: string;
  secondary: string;
  badges?: string[];
  meta_pipeline_tag: string;
}

export interface EtlData {
  pill: string;
  title: string;
  desc: string;
  step1_title: string;
  step1_desc: string;
  step2_title: string;
  step2_desc: string;
  step3_title: string;
  step3_desc: string;
  step4_title: string;
  step4_desc: string;
  meta_step_router: string;
  meta_active_label: string;
  meta_footer: string;
}

export interface IntegrationsData {
  pill: string;
  title_part1: string;
  title_part2: string;
  desc: string;
  proof: string;
  cat1_title: string;
  cat2_title: string;
  cat3_title: string;
  categories: {
    ecommerce: string;
    marketplace: string;
    ads: string;
    analytics: string;
    payments: string;
    email: string;
    crm: string;
    support: string;
    data: string;
    logistics: string;
    finance: string;
    consent: string;
    affiliate: string;
    productivity: string;
  };
  btn_more: string;
  btn_all: string;
  modal_title: string;
  modal_desc: string;
  modal_search: string;
  modal_footer_tag: string;
  tab_all: string;
  tab_ecommerce: string;
  tab_marketplace: string;
  tab_ads: string;
  tab_analytics: string;
  tab_payments: string;
  tab_email: string;
  tab_crm: string;
  tab_support: string;
  tab_data: string;
  tab_logistics: string;
  tab_finance: string;
  tab_consent: string;
  tab_affiliate: string;
  tab_productivity: string;
  status_live: string;
  status_beta: string;
  status_soon: string;
  empty_state: string;
  empty_state_sub: string;
  section_footer_tag: string;
  marquee_label: string;
  marquee_items: string[];
  coming_soon_context: string;
  meta_hub_throughput: string;
  meta_api_latency: string;
  meta_status: string;
  meta_connections: string;
  meta_node_prefix: string;
  meta_mode_label: string;
  meta_mode_value: string;
  meta_sla_label: string;
  auth: {
    oauth2: string;
    api_key: string;
    webhook: string;
    service_account: string;
    partner: string;
  };
  connect: {
    title: string;
    desc: string;
    steps_title: string;
    steps: string[];
    workspace_label: string;
    workspace_placeholder: string;
    workspace_loading: string;
    workspace_empty: string;
    workspace_login_required: string;
    workspace_required: string;
    workspace_retry: string;
    workspace_cta: string;
    security_title: string;
    security_desc: string;
    cta_connect: string;
  };
  items: Record<
    string,
    {
      name: string;
      detail?: string;
    }
  >;
}

export interface RoiData {
  pill: string;
  title: string;
  desc: string;
  seg_ecommerce: string;
  seg_agency: string;
  seg_enterprise: string;
  input_analysts: string;
  input_hours: string;
  input_analysis_hours: string;
  hours_suffix: string;
  month_short: string;
  calculating_label: string;
  net_efficiency_label: string;
  time_savings_label: string;
  annual_savings_label: string;
  fte_suffix_label: string;
  reports_suffix: string;
  savings_disclaimer: string;
  label_manual_cost: string;
  label_recovered_time: string;
  label_total_savings: string;
  time_suffix: string;
  currency: string;
  currency_pos: 'before' | 'after';
  cta_btn: string;
  rate_eco: number;
  rate_age: number;
  rate_ent: number;
  // Fix: Added missing efficiency_note used in translations and ROI section
  efficiency_note: string;
}

export interface SecurityData {
  pill: string;
  title_p1: string;
  title_p2: string;
  title_p3: string;
  title_p4: string;
  desc: string;
  card1_tag: string;
  card1_title: string;
  card1_desc: string;
  card2_tag: string;
  card2_title: string;
  card2_desc: string;
  card3_tag: string;
  card3_title: string;
  card3_desc: string;
  card4_tag: string;
  card4_title: string;
  card4_desc: string;
  cta_title: string;
  cta_desc: string;
  cta_btn: string;
}

export interface PricingData {
  pill: string;
  title: string;
  desc: string;
  per_month: string;
  billing_monthly: string;
  billing_yearly: string;
  yearly_discount: string;
  net_prices: string;
  compare_btn: string;
  modal_title: string;
  modal_highlights: string[];
  modal_minimized_label: string;
  modal_minimized_title: string;
  currency: string;
  starter: {
    name: string;
    desc: string;
    price: string;
    features: string[];
    cta: string;
  };
  professional: {
    name: string;
    desc: string;
    price: string;
    features: string[];
    cta: string;
  };
  enterprise: {
    name: string;
    desc: string;
    price: string;
    features: string[];
    cta: string;
  };
  plan_meta: {
    starter: {
      tag: string;
      sid: string;
      infra: string;
      sla: string;
    };
    professional: {
      tag: string;
      sid: string;
      infra: string;
      sla: string;
    };
    enterprise: {
      tag: string;
      sid: string;
      infra: string;
      sla: string;
    };
  };
  comparison: {
    feature_matrix_label: string;
    data_sources_label: string;
    data_sources_starter: string;
    data_sources_pro: string;
    report_frequency_label: string;
    report_frequency_weekly: string;
    report_frequency_daily: string;
    ai_semantic_label: string;
    ai_semantic_starter: string;
    ai_semantic_pro: string;
    custom_etl_label: string;
    bigquery_export_label: string;
    uptime_sla_label: string;
    protocol_label: string;
    data_retention: string;
    data_retention_unit: string;
    support_label: string;
    support_standard: string;
    support_priority: string;
    support_dedicated: string;
    refresh_standard: string;
    refresh_fast: string;
    alert_standard: string;
    alert_high: string;
    alert_ultra: string;
    realtime: string;
    unlimited: string;
    swipe_hint: string;
    header_tag: string;
    footer_system: string;
    footer_ssl: string;
  };
  meta: {
    recommended_label: string;
    capacity_label: string;
    provisioning_label: string;
    ready_installation_prefix: string;
    sys_pricing_model: string;
    tier_strategy: string;
    billing_cycle_label: string;
    ref_prefix: string;
    capacity_meter_label: string;
    features_label: string;
    contact_price_label?: string;
    contact_desc?: string;
    lowest_30d_note: string;
  };
  errors: {
    tenant_missing: string;
    tenant_missing_cta: string;
    payment_start: string;
    payment_generic: string;
  };
  actions: {
    processing: string;
    enterprise_subject: string;
  };
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqData {
  pill: string;
  title: string;
  items: FaqItem[];
  meta: {
    header_tag: string;
    ref_prefix: string;
    verified_label: string;
    response_label: string;
    footer_line1: string;
    footer_line2: string;
  };
}

export interface TechFutureData {
  pill: string;
  title: string;
  desc: string;
  stat1_label: string;
  stat1_val: string;
  stat1_tag: string;
  stat2_label: string;
  stat2_val: string;
  stat2_tag: string;
  stat3_label: string;
  stat3_val: string;
  stat3_tag: string;
  card1_title: string;
  card1_desc: string;
  card1_tag: string;
  card2_title: string;
  card2_desc: string;
  card2_tag: string;
  card3_title: string;
  card3_desc: string;
  card3_tag: string;
}

export interface FeaturesSectionData {
  title: string;
  desc: string;
}

export interface KnowledgeBaseData {
  pill: string;
  title: string;
  desc: string;
  btn_view: string;
  card1_title: string;
  card1_desc: string;
  card2_title: string;
  card2_desc: string;
  card3_title: string;
  card3_desc: string;
  cards: {
    id: string;
    tag: string;
  }[];
  footer_tag: string;
}

export interface FinalCtaData {
  title: string;
  desc: string;
  sub_text: string;
  btn_trial: string;
  btn_demo: string;
  badges: string[];
  meta: {
    top_tag: string;
    system_ready_label: string;
    core_objective_label: string;
    deployment_status_label: string;
    bottom_tag: string;
  };
}

export interface AboutData {
  tag: string;
  title: string;
  subtitle: string;
  body: string;
  points: string[];
  footer_left: string;
  footer_right: string;
  meta_tag: string;
}

export interface FooterData {
  tagline: string;
  hosting: string;
  status: string;
  col1_title: string;
  col1_links: FooterLink[];
  col2_title: string;
  col2_links: FooterLink[];
  col3_title: string;
  col3_links: FooterLink[];
  legal_links: FooterLink[];
  copyright: string;
  region: string;
  meta: {
    network_status_label: string;
    infra_region_label: string;
    protocol_level_label: string;
    protocol_level_value: string;
    resources_title: string;
    resources_desc: string;
    resources_links: string[];
    sys_log_label: string;
    contact_title: string;
    contact_desc: string;
    contact_email: string;
    contact_name_placeholder: string;
    contact_email_placeholder: string;
    contact_message_placeholder: string;
    contact_cta: string;
    contact_success_title: string;
    contact_success_desc: string;
    contact_message_ok: string;
    contact_message_min: string;
  };
}

export interface AuthData {
  login_tab: string;
  register_tab: string;
  email_label: string;
  email_work_hint: string;
  email_invalid: string;
  email_invalid_hint: string;
  pass_label: string;
  login_btn: string;
  register_btn: string;
  forgot_pass: string;
  oauth_google: string;
  oauth_ms: string;
  oauth_account_suffix: string;
  nip_label: string;
  nip_placeholder: string;
  nip_invalid: string;
  nip_required_hint: string;
  email_placeholder_login: string;
  email_placeholder_register: string;
  company_name_label: string;
  company_name_placeholder: string;
  company_address_label: string;
  company_street_label: string;
  company_street_placeholder: string;
  company_postal_code_label: string;
  company_postal_code_placeholder: string;
  company_city_label: string;
  company_city_placeholder: string;
  company_regon_label: string;
  company_regon_placeholder: string;
  company_krs_label: string;
  company_krs_placeholder: string;
  company_not_found: string;
  company_autofill_badge: string;
  company_autofill_badge_gus_mf: string;
  nip_searching: string;
  entity_validating: string;
  entity_validated_label: string;
  pass_strength_weak: string;
  pass_strength_fair: string;
  pass_strength_strong: string;
  password_invalid_hint: string;
  gateway_tag: string;
  oauth_divider: string;
  next_protocol: string;
  login_link_sent_title: string;
  login_link_sent_desc: string;
  verify_session: string;
  code_label: string;
  code_placeholder: string;
  code_title_login: string;
  code_title_register: string;
  code_desc: string;
  resend_in: string;
  resend_code: string;
  resend_link: string;
  code_invalid: string;
  send_login_link: string;
  back: string;
  proceed_security: string;
  entropy_analysis: string;
  password_req_length: string;
  password_req_uppercase: string;
  password_req_special: string;
  ssl_tag: string;
  back_to_site: string;
  register_hint: string;
  create_account_cta: string;
  mock_company_name: string;
  mock_company_address: string;
}

export interface PapaAISuggestion {
  label: string;
  prompt: string;
}

export interface PapaAIData {
  title: string;
  subtitle: string;
  intro: string;
  close_label: string;
  toggle_label: string;
  panel_label: string;
  placeholder: string;
  send: string;
  cancel_label: string;
  thinking: string;
  // Fix: added missing properties used in PapaAI component and translations
  evidence_label: string;
  add_to_report: string;
  set_alert: string;
  warning_stale: string;
  warning_missing: string;
  warning_locked: string;
  rate_limit: string;
  suggestions: PapaAISuggestion[];
  footer_text: string;
  error_generic: string;
}

export interface PostAuthData {
  welcome_title: string;
  welcome_desc: string;
  connect_title: string;
  connect_desc: string;
  primary_connect: string;
  secondary_close: string;
  meta_tag: string;
}

export interface FeatureModalMetaData {
  capabilities_tag: string;
  module_active_tag: string;
  footer_left: string;
  footer_right: string;
}

export interface VideoModalData {
  title: string;
  close_aria_label: string;
}

export interface DashboardOverviewV2Alert {
  id: string;
  title: string;
  impact: string;
  time: string;
  context: string;
  prompt: string;
  target: 'ads' | 'products' | 'pipeline' | 'customers' | 'alerts' | 'pandl' | 'guardian';
  badge?: 'delay' | 'quality';
  severity: 'critical' | 'warning' | 'info';
}

export interface DashboardOverviewV2ActionCard {
  id: string;
  title: string;
  desc: string;
  impact: string;
  confidence: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  risk: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high';
  evidence: string;
  status: 'new' | 'in_progress' | 'done';
}

export interface DashboardGrowthCard {
  id: string;
  title: string;
  desc: string;
  priority: 'low' | 'medium' | 'high';
  segments: string[];
  impact: string;
  confidence: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  risk: 'low' | 'medium' | 'high';
  why_now: string;
  evidence: string;
  simulation: {
    before: string;
    after: string;
    delta: string;
  };
  status: 'new' | 'approved' | 'implemented' | 'measured' | 'closed';
  context: string;
  route: string;
  prompt: string;
}

export interface DashboardGrowth {
  title: string;
  desc: string;
  cards: {
    title: string;
    desc: string;
    labels: {
      impact: string;
      confidence: string;
      effort: string;
      risk: string;
      why_now: string;
      evidence: string;
      simulation: string;
      status: string;
    };
    ctas: {
      evidence: string;
      explain: string;
      save_task: string;
      add_report: string;
      open_measure: string;
    };
    statuses: {
      new: string;
      approved: string;
      implemented: string;
      measured: string;
      closed: string;
    };
    priorities: {
      low: string;
      medium: string;
      high: string;
    };
    values: {
      low: string;
      medium: string;
      high: string;
    };
    simulation: {
      before: string;
      after: string;
      delta: string;
    };
    items: DashboardGrowthCard[];
  };
  budget: {
    title: string;
    desc: string;
    toggle_channels: string;
    toggle_campaigns: string;
    current_label: string;
    suggested_label: string;
    aggressiveness_label: string;
    aggressiveness_steps: string[];
    aggressiveness_options: {
      conservative: string;
      standard: string;
      aggressive: string;
    };
    assumptions_label: string;
    assumptions_text: string;
    channels: {
      id: string;
      label: string;
      current: number;
      suggested: number;
    }[];
    campaigns: {
      id: string;
      label: string;
      current: number;
      suggested: number;
    }[];
  };
}

export interface DashboardAdsV2 {
  title: string;
  desc: string;
  summary: {
    roas_label: string;
    roas_status: string;
    model_label: string;
  };
  media_mix: {
    title: string;
    desc: string;
    context_template: string;
    metric_spend: string;
    metric_revenue: string;
    granularity_day: string;
    granularity_week: string;
    badge_freshness: string;
    badge_quality: string;
    action_breakdown: string;
    action_explain: string;
    tooltip_share: string;
    tooltip_driver: string;
  };
  efficiency: {
    title: string;
    desc: string;
    metric_roas: string;
    metric_cpa: string;
    action_show_campaigns: string;
    action_explain: string;
  };
  share: {
    title: string;
    desc: string;
    spend_label: string;
    revenue_label: string;
    delta_label: string;
    attention_badge: string;
  };
  creatives: {
    title: string;
    desc: string;
    filters_label: string;
    filters: {
      format: string;
      placement: string;
      campaign: string;
    };
    metrics: {
      ctr: string;
      cvr: string;
      cpa: string;
      roas: string;
      spend: string;
      revenue: string;
    };
    actions: {
      explain: string;
      report: string;
      alert: string;
      drill: string;
    };
    items: Array<{
      id: string;
      name: string;
      format: string;
      placement: string;
    }>;
  };
  drilldown: {
    level_campaign: string;
    level_adset: string;
    level_creative: string;
  };
  ai_prompt: string;
}

export interface DashboardProductsV2 {
  title: string;
  desc: string;
  ai_prompt: string;
  items: {
    id: string;
    name: string;
  }[];
  scatter: {
    title: string;
    desc: string;
    context_template: string;
    size_label: string;
    x_label: string;
    y_label: string;
    hint_top_right: string;
    hint_bottom_right: string;
    hint_top_left: string;
    hint_bottom_left: string;
    tooltip_profit: string;
    tooltip_margin: string;
    tooltip_units: string;
    tooltip_returns: string;
    tooltip_stock: string;
    tooltip_trend: string;
    tooltip_driver: string;
    tags: {
      toxic: string;
      high_margin: string;
      stock_risk: string;
    };
    multi_select_label: string;
    compare: {
      cta_ai: string;
      cta_compare: string;
      cta_clear: string;
    };
  };
  details: {
    title: string;
    empty: string;
    empty_cta: string;
    labels: {
      profit: string;
      volume: string;
      returns: string;
      stock: string;
    };
    stock: {
      low: string;
      medium: string;
      high: string;
    };
    actions: {
      explain: string;
      alert: string;
      report: string;
    };
  };
  movers: {
    title: string;
    desc: string;
    rising_label: string;
    falling_label: string;
    cta_alert: string;
    cta_ai: string;
    driver_viral?: string;
    driver_search?: string;
    driver_stock?: string;
    driver_competition?: string;
    rising: {
      id: string;
      label: string;
      impact: string;
      driver: string;
    }[];
    falling: {
      id: string;
      label: string;
      impact: string;
      driver: string;
    }[];
  };
  table: {
    title: string;
    desc: string;
    filters_label: string;
    filters: string[];
    columns: {
      sku: string;
      revenue: string;
      profit: string;
      margin: string;
      returns: string;
      stock: string;
      trend: string;
    };
    metric_defs: {
      margin: string;
      returns: string;
      trend: string;
    };
    actions: {
      label: string;
      drill: string;
      ai: string;
      report: string;
      alert: string;
    };
  };
}

export interface DashboardCustomersV2 {
  title: string;
  desc: string;
  ai_prompt: string;
  summary?: {
    retention_label: string;
    vip_label: string;
  };
  cohorts: {
    title: string;
    desc: string;
    mode_month: string;
    mode_week: string;
    row_label: string;
    row_prefix: string;
    col_prefix: string;
    small_sample: string;
    context_label: string;
    tooltip_retention: string;
    tooltip_size: string;
    tooltip_period: string;
  };
  ltv: {
    title: string;
    desc: string;
    def: string;
    tooltip_month: string;
    tooltip_value: string;
  };
  churn: {
    title: string;
    desc: string;
    actions: {
      explain: string;
      alert: string;
    };
    segments: {
      id: string;
      label: string;
      count: string;
      impact: string;
    }[];
    labels?: {
      one_time_buyers: string;
      recent_dropoffs: string;
      inactive_vips: string;
    };
  };
  vip: {
    title: string;
    desc: string;
    actions: {
      report: string;
      alert: string;
    };
    segments: {
      id: string;
      label: string;
      share: string;
      trend: string;
    }[];
    labels?: {
      top_spenders: string;
      brand_advocates: string;
      bulk_buyers: string;
    };
  };
  month_label: string;
}

export interface DashboardReportsV2 {
  title: string;
  desc: string;
  last_report: {
    title: string;
    desc: string;
    name: string;
    range_label: string;
    range_value: string;
    date_label: string;
    date_value: string;
    language_label: string;
    language_value: string;
    cta_preview: string;
    cta_pdf: string;
    cta_resend: string;
  };
  list: {
    title: string;
    empty_title?: string;
    empty_desc?: string;
    items: {
      id: string;
      name: string;
      range: string;
      status: string;
    }[];
    actions: {
      preview: string;
      download: string;
      open: string;
    };
  };
  generate: {
    title: string;
    desc: string;
    cta: string;
    fields: {
      label: string;
      value: string;
    }[];
    sections: string[];
  };
  diff: {
    title: string;
    items: string[];
  };
  history_title?: string;
  export_formats: string[];
  export_history: {
    id: string;
    name: string;
    format: string;
    range: string;
    created: string;
    urlLabel: string;
  }[];
}

export interface DashboardPipelineV2 {
  title: string;
  desc: string;
  ai_prompt: string;
  actions: {
    open_guardian: string;
  };
  sources: {
    title: string;
    desc: string;
    columns: {
      source: string;
      status: string;
      last_sync: string;
      delay: string;
      records: string;
      action: string;
    };
    items: {
      id: string;
      name: string;
      status: string;
      last_sync: string;
      delay: string;
      records: string;
    }[];
    actions: {
      test: string;
      sync: string;
      explain: string;
    };
  };
  transforms: {
    title: string;
    desc: string;
    items: {
      id: string;
      name: string;
      status: string;
      desc: string;
    }[];
    actions: {
      run: string;
    };
  };
  rag: {
    title: string;
    desc: string;
    cta: string;
    status_label: string;
    status_value: string;
    last_update_label: string;
    last_update_value: string;
    coverage_label: string;
    coverage_value: string;
  };
  bigquery: {
    title: string;
    desc: string;
    cta_open: string;
    cta_export: string;
    lineage_cta: string;
    columns: {
      table: string;
      desc: string;
      freshness: string;
      action: string;
    };
    items: {
      id: string;
      name: string;
      desc: string;
      freshness: string;
    }[];
  };
}

export interface DashboardGuardianV2 {
  title: string;
  desc: string;
  ai_prompt: string;
  badge_label: string;
  health_label: string;
  health_status: string;
  uptime_label: string;
  uptime_value: string;
  range_label: string;
  range_options: string[];
  only_issues_label: string;
  status_healthy: string;
  status_delayed: string;
  delay_under_2_min: string;
  delay_na: string;
  severity_critical: string;
  severity_warning: string;
  severity_info: string;
  sources?: {
    id: string;
    name: string;
  }[];
  actions: {
    run_validations: string;
    rebuild_index: string;
  };
  freshness: {
    title: string;
    desc: string;
    menu_label: string;
    columns: {
      source: string;
      status: string;
      last_sync: string;
      delay: string;
      records: string;
      action: string;
    };
    items: {
      id: string;
      name: string;
      status: string;
      last_sync: string;
      delay: string;
      records: string;
    }[];
    actions: {
      explain: string;
    };
  };
  quality: {
    title: string;
    desc: string;
    empty_state: string;
    items: {
      id: string;
      title: string;
      impact: string;
      severity: string;
    }[];
    actions: {
      view: string;
      fix: string;
    };
  };
  rag: {
    title: string;
    desc: string;
    status_heading: string;
    index_title: string;
    index_subtitle: string;
    explain_context: string;
    cta: string;
    status_label: string;
    status_value: string;
    last_update_label: string;
    last_update_value: string;
    coverage_label: string;
    coverage_value: string;
  };
}

export interface DashboardIntegrationsV2 {
  title: string;
  desc: string;
  header_badge: string;
  search_placeholder: string;
  filters: {
    all: string;
    active: string;
    disabled: string;
    attention: string;
  };
  sorts: {
    issues: string;
    recent: string;
    name: string;
  };
  status_active: string;
  status_disabled: string;
  status_attention: string;
  status_connecting: string;
  status_connected: string;
  active_connectors_label: string;
  records_synced_label: string;
  uptime_label: string;
  auth_prefix: string;
  sync_prefix: string;
  latency_prefix?: string;
  health_label?: string;
  scope_label: string;
  scope_default: string;
  auth_label: string;
  last_sync_label: string;
  last_sync_recent: string;
  last_sync_delay: string;
  last_sync_disabled: string;
  freshness_label: string;
  freshness_status: string;
  security_badge_label: string;
  security_title: string;
  security_desc: string;
  security_cta_keys: string;
  security_cta_sla: string;
  actions: {
    test: string;
    details: string;
    refresh: string;
  };
}

export interface DashboardKnowledgeV2 {
  title: string;
  desc: string;
  search_placeholder: string;
  ai_prompt: string;
  badge_label?: string;
  resources_label: string;
  empty_title: string;
  empty_desc: string;
  clear_filters_label: string;
  filters: {
    category: { id: string; label: string }[];
    level: { id: string; label: string }[];
    type: { id: string; label: string }[];
    module: { id: string; label: string }[];
  };
  card: {
    cta_open: string;
    cta_ai: string;
  };
  detail: {
    title: string;
    empty: string;
    cta_apply: string;
    cta_report: string;
  };
  empty_list?: string;
  booking: {
    title: string;
    subtitle: string;
    topic_label: string;
    topic_placeholder: string;
    date_label: string;
    budget_label: string;
    budget_options: string[];
    guarantee_title: string;
    guarantee_desc: string;
    submit_cta: string;
    close_cta: string;
  };
  expert?: {
    pill: string;
    title: string;
    desc: string;
    cta_label: string;
    ai_context: string;
  };
  actions: {
    open_article: string;
    share_team: string;
    bookmark: string;
  };
  resources: {
    id: string;
    category: string;
    title: string;
    desc: string;
    longContent?: string;
    level: string;
    type: string;
    time: string;
    module: string;
    videoId?: string;
    author?: string;
  }[];
}

export interface DashboardSettingsWorkspaceV2 {
  title: string;
  desc: string;
  badge_label: string;
  data: {
    title: string;
    desc: string;
    retention_label: string;
    retention_options: { value: number; label: string }[];
    retention_help: string;
    retention_warning?: {
      title: string;
      desc: string;
      cta_export: string;
    };
    region_label: string;
    region_options: { value: string; label: string }[];
  };
  privacy: {
    masking_label: string;
    masking_desc: string;
  };
  attribution: {
    title: string;
    desc: string;
    models: { id: string; label: string; desc: string; default?: boolean }[];
  };
  integrations: {
    title: string;
    desc: string;
    items: { id: string; label: string; desc: string; status: string }[];
  };
  alerts: {
    title: string;
    desc: string;
    items: { id: string; label: string; enabled: boolean }[];
  };
  notifications?: {
    channels_title: string;
    email_label: string;
    schedule_title: string;
    schedules: { id: string; label: string; value: string }[];
    recipients_title: string;
    recipients: string[];
    quiet_hours_label: string;
    quiet_hours_value: string;
    export_title: string;
    export_formats: string[];
  };
  ai: {
    title: string;
    desc: string;
    items: { label: string; value: string }[];
  };
  footer_note: string;
  cta_primary: string;
  cta_secondary: string;
}

export interface DashboardSettingsOrgV2 {
  title: string;
  desc: string;
  badge_label: string;
  license_label: string;
  company: {
    title: string;
    fields: { label: string; value: string }[];
  };
  users: {
    title: string;
    items: { name: string; email: string; role: string }[];
    cta_invite: string;
  };
  billing: {
    title: string;
    items: { label: string; value: string }[];
    cta_change: string;
  };
  security: {
    title: string;
    items: { label: string; value: string }[];
    cta_logout_all: string;
  };
  audit: {
    title: string;
    items: { label: string; value: string }[];
    cta_export: string;
  };
  privacy: {
    title: string;
    items: { label: string; value: string }[];
    cta_export: string;
    cta_delete: string;
  };
  mock?: {
    company_fields: { label: string; value: string }[];
    team_members: { name: string; email: string; role: string; status: string }[];
    billing_info: { label: string; value: string }[];
    billing_plans: { id: string; name: string; note: string; price: string }[];
    invoices: { id: string; label: string; status: string; amount: string }[];
    audit_logs: { label: string; value: string }[];
    login_methods: string[];
    sessions: { id: string; label: string; value: string }[];
    status_card: { label: string; value: string; desc: string };
    payer: { label: string; value: string };
    billing_cycle: { label: string; value: string };
    payment_status: {
      label: string;
      ok: string;
      error: string;
      fix_cta: string;
      ok_tooltip: string;
    };
    card_payment: { label: string; desc: string };
    plans_label: string;
    invoices_label: string;
    invoice_pdf_cta: string;
    approve_plan_cta: string;
    security_title: string;
    login_method_label: string;
    login_method_value: string;
    login_methods_label: string;
    mfa_label: string;
    mfa_value: string;
    sessions_label: string;
    compliance: {
      title: string;
      desc: string;
      cta_dpa: string;
      cta_retention: string;
      cta_confirmations: string;
      cta_delete_org: string;
    };
  };
  footer_note: string;
  cta_save: string;
}

export interface DashboardAlertsV2 {
  title: string;
  desc: string;
  filters: {
    all: string;
    critical: string;
    warning: string;
    info: string;
  };
  context_fallback: string;
  prompt_template: string;
  domain_label: string;
  domains: string[];
  state_label: string;
  states: string[];
  empty_state: string;
  impact_template: string;
  mock_alerts: {
    title: string;
    context: string;
    target: string;
    severity: 'critical' | 'warning' | 'info';
    baseProb: number;
  }[];
  actions: {
    explain_ai: string;
    open_view: string;
    set_alert: string;
    mute: string;
  };
}

export interface DashboardOverviewV2 {
  alerts: {
    title: string;
    desc: string;
    live_label?: string;
    view_all: string;
    action_open: string;
    action_ai: string;
    badge_delay: string;
    badge_quality: string;
    severity_critical: string;
    severity_warning: string;
    severity_info: string;
    items: DashboardOverviewV2Alert[];
  };
  insights?: {
    title?: string;
    desc?: string;
    cta?: string;
    items: {
      id: string;
      title: string;
      impact: string;
      context?: string;
    }[];
  };
  ai: {
    title: string;
    desc: string;
    placeholder: string;
    submit: string;
    shortcut_hint: string;
    toggle_hint?: string;
    suggested_label: string;
    recent_label: string;
    cached_label: string;
    disabled_title: string;
    disabled_desc: string;
    enable_cta: string;
    suggested: string[];
    recent: string[];
    prompt_template: string;
    response: {
      title: string;
      summary_label: string;
      summary_text: string;
      evidence_label: string;
      evidence_points: string[];
      sources_label: string;
      sources: string[];
      disclaimer: string;
      actions: {
        open_view: string;
        add_report: string;
        set_alert: string;
      };
    };
  };
  kpis: {
    title: string;
    cache_label: string;
    badge_quality: string;
    badge_stale?: string;
    explain_action: string;
    actions_hint: string;
    labels: {
      revenue?: string;
      spend: string;
      roas?: string;
      profit: string;
      aov: string;
      new_returning: string;
      ltv_30d: string;
    };
    defs: {
      revenue: string;
      spend: string;
      roas: string;
      cpa: string;
      profit: string;
      aov: string;
      new_returning: string;
      ltv_30d: string;
    };
  };
  charts: {
    revenue_spend: {
      title: string;
      desc: string;
      driver: string;
    };
    roas_cpa: {
      title: string;
      desc: string;
      driver: string;
    };
    series_labels: {
      revenue: string;
      spend: string;
      roas: string;
      cpa: string;
    };
    tooltip_delta: string;
    tooltip_driver: string;
    focus_label: string;
    actions: {
      breakdown: string;
      show_campaigns: string;
      explain: string;
      clear_focus: string;
    };
    range: {
      label: string;
      prompt: string;
      apply_local: string;
      apply_global: string;
      clear: string;
      start_label: string;
      end_label: string;
    };
    badges: {
      quality: string;
      freshness: string;
    };
    quality_desc: string;
    freshness_desc: string;
  };
  tables: {
    campaigns: {
      title: string;
      desc: string;
      context_template: string;
      columns: {
        campaign: string;
        spend: string;
        revenue: string;
        roas: string;
        cpa: string;
        ctr: string;
        cvr: string;
        delta: string;
      };
      metric_defs: {
        roas: string;
        cpa: string;
        ctr: string;
        cvr: string;
      };
      actions: {
        drill: string;
        ai: string;
        report: string;
        alert: string;
        view_all?: string;
      };
    };
    skus: {
      title: string;
      desc: string;
      context_template: string;
      columns: {
        sku: string;
        revenue: string;
        profit: string;
        margin: string;
        returns: string;
        stock: string;
        trend: string;
      };
      metric_defs: {
        margin: string;
        return_rate: string;
        stock_risk: string;
      };
      tags: {
        toxic: string;
        high_margin: string;
        stock_risk: string;
      };
      stock: {
        low: string;
        medium: string;
        high: string;
      };
      actions: {
        drill: string;
        ai: string;
        report: string;
        alert: string;
        inventory_hub?: string;
      };
    };
    sample: {
      campaigns: {
        id: string;
        name: string;
      }[];
      skus: {
        id: string;
        name: string;
      }[];
    };
  };
  actions: {
    title: string;
    desc: string;
    labels: {
      impact: string;
      confidence: string;
      effort: string;
      risk: string;
      priority: string;
      evidence: string;
    };
    status: {
      new: string;
      in_progress: string;
      done: string;
    };
    values: {
      low: string;
      medium: string;
      high: string;
    };
    ctas: {
      explain_ai: string;
      save_task: string;
      evidence: string;
      add_report: string;
    };
    cards: DashboardOverviewV2ActionCard[];
  };
}

export type DashboardViewSchema = {
  title?: string;
  desc?: string;
  tags?: string[];
  ctas?: Record<string, string>;
  badges?: string[];
  [key: string]: string | number | boolean | string[] | Record<string, string> | undefined;
};

export type DashboardPnlSection = Record<string, string>;

export interface DashboardProductCatalogItem {
  id: string;
  name: string;
  detail?: string;
}

export interface DashboardGuardianLog {
  id?: string;
  title: string;
  desc?: string;
  context?: string;
}

export interface DashboardData {
  menu_overview: string;
  // Fix: added missing fields used in components and translations
  menu_analytics: string;
  menu_growth: string;
  menu_support: string;
  status_label: string;
  status_ready: string;
  freshness_label: string;
  plan_professional: string;
  trial_days_left: string;
  attribution_label: string;
  prod_pill: string;
  menu_pandl: string;
  menu_ads: string;
  menu_reports: string;
  menu_customers: string;
  menu_products: string;
  menu_guardian: string;
  menu_alerts: string;
  menu_integrations: string;
  nav_knowledge: string;
  menu_settings: string;
  menu_end_session: string;
  demo_pill: string;
  demo_tooltip: string;
  filter_1d: string;
  filter_7d: string;
  filter_30d: string;
  kpi_revenue: string;
  kpi_orders: string;
  kpi_roas: string;
  kpi_cac: string;
  conversion_rate: string;
  net_profit: string;
  modal_upgrade_title: string;
  modal_upgrade_desc: string;
  modal_upgrade_btn: string;
  modal_upgrade_close: string;
  cta_upgrade_live: string;
  chart_sales_velocity: string;
  chart_revenue_split: string;
  chart_ad_performance: string;
  chart_customer_cohorts: string;
  guardian_status_scanning: string;
  guardian_threat_level: string;
  guardian_log_header: string;
  guardian_type_warn: string;
  guardian_type_security_alert: string;
  guardian_type_info: string;
  guardian_type_alert: string;
  alert_title_conversions: string;
  alert_desc_conversions: string;
  settings_api_label: string;
  settings_webhook_label: string;
  integrations_title: string;
  integrations_desc: string;
  integrations_connect: string;
  integrations_connecting: string;
  integrations_connected: string;
  integrations_cta: string;
  empty_title?: string;
  empty_desc_filters?: string;
  cta_clear_filters?: string;
  integrations_mode_demo: string;
  integrations_mode_live: string;
  alerts_policy_demo: string;
  alerts_policy_live: string;
  cohort_data_demo: string;
  cohort_data_live: string;
  // NOWE: prefiksy dla nazw kohort (CustomersViewV2)
  cohort_month_prefix: string;
  cohort_week_prefix: string;
  sidebar_session_ready: string;
  sidebar_tagline: string;
  footer_peer_id: string;
  footer_session_time: string;
  footer_encryption: string;
  overview_stream_label: string;
  overview_legend_current: string;
  overview_legend_previous: string;
  overview_time_start: string;
  overview_time_peak: string;
  overview_time_sync: string;
  overview_source_shopify: string;
  overview_source_allegro: string;
  overview_source_other: string;
  overview_connectors_title: string;
  overview_connectors_status: string;
  overview_connectors_col_connector: string;
  overview_connectors_col_latency: string;
  overview_connectors_col_load: string;
  overview_connectors_col_rows: string;
  overview_connectors_col_status: string;
  overview_connectors: { id: string; label: string }[];
  ai_mode_label: string;
  ai_mode_on: string;
  ai_mode_off: string;
  // Added missing properties
  mode_trial?: string;
  filter_store?: string;
  menu_pipeline: string;
  nav_group_actions?: string;
  nav_group_trust?: string;
  nav_group_start: string;
  nav_group_ai: string;
  nav_group_performance: string;
  nav_group_fundamentals: string;
  nav_group_ops: string;
  data_stale_badge?: string;
  trial_expired_title: string;
  trial_expired_desc: string;
  trial_expired_cta: string;
  workspace_missing_title: string;
  workspace_missing_desc: string;
  workspace_missing_cta: string;
  billing: {
    trial_banner_tag: string;
    trial_banner_owner: string;
    trial_banner_member: string;
    cta_add_payment: string;
    cta_activate: string;
    manage_link: string;
    read_only_badge: string;
    read_only_tooltip: string;
    paywall_title: string;
    paywall_desc: string;
    paywall_member_cta: string;
    paywall_allowed_title: string;
    paywall_allowed_items: string[];
    paywall_blocked_title: string;
    paywall_blocked_items: string[];
    trial_modal_tag: string;
    trial_modal_title_7: string;
    trial_modal_desc_7: string;
    trial_modal_title_3: string;
    trial_modal_desc_3: string;
    trial_modal_title_1: string;
    trial_modal_desc_1: string;
    trial_modal_cta_primary: string;
    trial_modal_cta_secondary: string;
    trial_modal_member_hint: string;
  };
  // Added remaining missing properties to resolve TypeScript errors in DashboardSection.tsx
  session_processing: string;
  session_error: string;
  filter_country: string;
  filter_device: string;
  filter_channel: string;
  filter_source: string;
  filter_option_all: string;
  filter_option_pl: string;
  filter_option_de: string;
  filter_option_cz: string;
  filter_option_uk: string;
  filter_option_meta: string;
  filter_option_google: string;
  filter_option_tiktok: string;
  filter_option_affiliate: string;
  filter_option_account_a: string;
  filter_option_account_b: string;
  filter_option_brand: string;
  filter_option_prospecting: string;
  filter_option_retargeting: string;
  filter_option_new: string;
  filter_option_returning: string;
  filter_option_vip: string;
  filter_option_top_sellers: string;
  filter_option_low_margin: string;
  filter_option_bundles: string;
  filter_option_mobile: string;
  filter_option_desktop: string;
  filter_option_tablet: string;
  filter_option_shopify: string;
  filter_option_allegro: string;
  filter_option_pos: string;
  attribution_data_driven: string;
  attribution_last_click: string;
  attribution_diff_badge: string;
  attribution_undo: string;
  account_title: string;
  account_access: string;
  account_billing: string;
  account_logout: string;
  context_label: string;
  btn_pin: string;
  btn_unpin: string;
  // Added missing property
  filters_clear: string;
  // Added missing properties for AdsViewV2
  ads_channels: { id: string; label: string; short_label: string }[];
  ads_v2: DashboardAdsV2;
  // === Dashboard v2 – główne sekcje widoków ===
  growth?: DashboardGrowth;
  guardian_v2?: DashboardGuardianV2;
  integrations_v2?: DashboardIntegrationsV2;
  knowledge_v2?: DashboardKnowledgeV2;
  overview_v2?: DashboardOverviewV2;
  pipeline_v2?: DashboardPipelineV2;
  products_v2?: DashboardProductsV2;
  reports_v2?: DashboardReportsV2;
  settings_org_v2: DashboardSettingsOrgV2;
  settings_workspace_v2: DashboardSettingsWorkspaceV2;

  // === P&L v2 – używane w PandLViewV2.tsx ===
  pnl_revenue?: string;
  pnl_cogs?: string;
  pnl_fees?: string;
  pnl_refunds?: string;
  pnl_shipping?: string;
  pnl_ad_spend?: string;
  pnl_payroll?: string;
  pnl_tools?: string;

  pnl_title?: string;
  pnl_model?: string;
  pnl_net_margin_label?: string;
  pnl_contribution_margin_label?: string;
  pnl_tax_est_label?: string;
  pnl_tab_summary?: string;
  pnl_tab_detail?: string;
  pnl_live_calculation?: string;
  pnl_status_stable?: string;
  pnl_status_high?: string;
  pnl_status_fixed?: string;
  pnl_export_audit_pdf?: string;
  pnl_context_template?: string;
  pnl_ebitda_label?: string;
  pnl_analyze_profitability?: string;
  pnl_ai_prompt_template?: string;

  pnl_gross_profit?: string;
  pnl_net_profit?: string;
  pnl_after_opex?: string;
  pnl_waterfall?: string;
  pnl_region_label?: string;
  pnl_final_state?: string;
  pnl_cost_breakdown?: DashboardPnlSection;
  pnl_dim_category?: string;
  pnl_badge_audited?: string;
  pnl_contribution?: string;

  pnl_export_live?: string;

  ads_title?: string;
  ads_attribution?: string;
  ads_total_roas?: string;
  ads_status_optimal?: string;
  ads_spend_vs_revenue?: string;
  ads_latency?: string;
  ads_label_spend?: string;
  ads_label_revenue?: string;
  ads_automations?: string;
  ads_agent?: string;
  ads_auto_bid?: string;
  ads_anomaly_detect?: string;
  ads_fraud_filter?: string;
  ads_creative_fatigue?: string;
  ads_open_live?: string;
  ads_channel_matrix?: string;
  ads_model_refreshed?: string;
  ads_col_channel?: string;
  ads_col_spend?: string;
  ads_col_revenue?: string;
  ads_col_roas?: string;
  ads_col_cpa?: string;
  ads_col_conversions?: string;

  customers_title?: string;
  customers_dim_segment?: string;
  customers_pii_masked?: string;
  customers_segment_new?: string;
  customers_segment_returning?: string;
  customers_segment_vip?: string;
  customers_aov?: string;
  customers_ltv?: string;
  customers_repeat_rate?: string;
  customers_open_cohorts_live?: string;
  customers_cohort_title?: string;
  customers_metric_returning?: string;
  customers_cohort_label?: string;
  customers_month_label?: string;
  customers_model_note?: string;

  products_title?: string;
  products_dim_sku?: string;
  products_stock_signal?: string;
  products_col_sku?: string;
  products_col_product?: string;
  products_col_units?: string;
  products_col_revenue?: string;
  products_col_margin?: string;
  products_col_stock?: string;
  products_col_status?: string;
  products_status_ok?: string;
  products_status_low?: string;
  products_status_crit?: string;
  products_suggestion?: string;
  products_restock_prefix?: string;
  products_restock_suffix?: string;
  products_open_inventory_live?: string;
  products_price_signal?: string;
  products_elasticity_model?: string;
  products_discount_opt?: string;
  products_bundle_opt?: string;
  products_risk_stockout?: string;
  products_return_risk?: string;
  products_note_best_for?: string;
  products_note_bundle?: string;
  products_note_risk_stockout?: string;
  products_note_return_risk?: string;
  products_open_pricing_lab?: string;
  products_catalog?: DashboardProductCatalogItem[];

  alerts_connect_live_channels?: string;
  alerts_severity_alert?: string;
  alerts_severity_security?: string;
  alerts_severity_warning?: string;
  alerts_severity_info?: string;

  integrations_connector_count?: string;

  settings_title?: string;
  settings_read_safe?: string;
  settings_region?: string;
  settings_gdpr_enforced?: string;
  settings_data_retention?: string;
  settings_pii_masking?: string;
  settings_masking_desc?: string;
  settings_days?: string;
  settings_connector_tokens?: string;
  settings_scoped_auth?: string;
  settings_connector_shopify_label?: string;
  settings_connector_shopify_desc?: string;
  settings_connector_allegro_label?: string;
  settings_connector_allegro_desc?: string;
  settings_connector_google_ads_label?: string;
  settings_connector_google_ads_desc?: string;
  settings_connector_meta_capi_label?: string;
  settings_connector_meta_capi_desc?: string;
  settings_connector_ga4_label?: string;
  settings_connector_ga4_desc?: string;
  settings_connector_email_label?: string;
  settings_connector_email_desc?: string;
  settings_apply_live?: string;

  status_enabled?: string;
  status_disabled?: string;
  status_on?: string;
  status_off?: string;
  status_monitor?: string;
  status_healthy?: string;
  status_syncing?: string;
  status_high?: string;
  status_low?: string;

  tenant_mode_delay?: string;
  tenant_mode_demo?: string;
  tenant_mode_live?: string;
  workspace_mode_label?: string;

  pnl_gross_margin_short?: string;
  guardian_logs?: DashboardGuardianLog[];
  range_1d?: string;
  range_7d?: string;
  range_30d?: string;
  range_90d?: string;
  range_mtd?: string;
  range_qtd?: string;
  range_ytd?: string;
  range_custom?: string;
  compare_prev?: string;
  compare_yoy?: string;
  compare_y?: string;
  filter_account?: string;
  filter_campaign?: string;
  filter_segment?: string;
  filter_category?: string;

  // NOWE: dane do CustomersViewV2
  customers_v2: DashboardCustomersV2;

  // NOWE: dane do AlertsViewV2
  alerts_v2: DashboardAlertsV2;

  context_menu: {
    /** NOWE – nagłówek / label do menu kontekstowego */
    label: string;
    drill: string;
    explain_ai: string;
    add_report: string;
    export: string;
    set_alert: string;
  };
  widget: {
    empty_desc: string;
    error_title: string;
    error_desc: string;
    cta_retry: string;
    // Nowe pola do stanów pustych, używane m.in. w IntegrationsViewV2
    empty_title: string;
    empty_desc_filters: string;
    cta_clear_filters: string;
    partial_badge: string;
    partial_desc: string;
    offline_title: string;
    offline_desc: string;
  };
  alerts_title: string;
  alerts_stream: string;
  alerts_ack_required: string;
  alerts_action_prefix: string;
  alerts_ack: string;
  alerts_acked: string;
  alerts_open_runbook: string;
  alerts_notify_policy: string;
  alerts_channel_email: string;
  alerts_channel_slack: string;
  alerts_channel_sms: string;
  alerts_quiet_hours: string;
  alerts_quiet_hours_window: string;
  demo_banner_title: string;
  demo_banner_desc: string;
  demo_banner_cta_primary: string;

  // Allow additional dashboard translation keys without strict excess property errors
  [key: string]:
    | string
    | number
    | string[]
    | DashboardViewSchema
    | DashboardPnlSection
    | DashboardProductCatalogItem[]
    | DashboardGuardianLog[]
    | undefined;
}

export interface PromoData {
  title: string;
  desc: string;
  btn_trial: string;
  btn_demo: string;
  dismiss_7_days: string;
  minimized_label: string;
  minimized_title: string;
  features: string[];
  meta: {
    sid_label: string;
    security_tag: string;
    limited_mode_tag: string;
    compliance_tag: string;
  };
}

export interface PromoDataV2 {
  main: {
    title: string;
    subhead: string;
    cta_pro: string;
    cta_starter: string;
    cta_demo: string;
    microcopy: string;
    omnibus_note: string;
    reasons_title: string;
    reasons_pro: string[];
    reasons_starter: string[];
    pro_card: {
      name: string;
      desc: string;
      tag: string;
      bullets: string[];
    };
    starter_card: {
      name: string;
      desc: string;
      bullets: string[];
    };
  };
  intercept: {
    title: string;
    subhead: string;
    bullets: string[];
    cta_pro: string;
    cta_starter: string;
    microcopy: string;
  };
  system_label: string;
  plan_meta: {
    premium_label: string;
    standard_label: string;
  };
  trust_bar: string;
  trust_security_label: string;
}

export interface CookieData {
  meta_line: string;
  badge: string;
  title: string;
  desc: string;
  footer_note: string;
  policy_privacy_label: string;
  policy_cookies_label: string;
  policy_privacy_link: string;
  policy_cookies_link: string;
  policy_link: string;
  policy_text: string;
  accept_all: string;
  reject_optional: string;
  settings: string;
  save_settings: string;
  back: string;
  necessary_label: string;
  necessary_desc: string;
  necessary_tag: string;
  analytical_label: string;
  analytical_desc: string;
  analytical_tag: string;
  marketing_label: string;
  marketing_desc: string;
  marketing_tag: string;
  functional_tag: string;
  footer_left: string;
  footer_right: string;
  // Extended for Layer 2 Modal
  lead: string;
  functional_label: string;
  functional_desc: string;
  providers_title: string;
  providers_desc: string;
  provider_ga4: string;
  provider_ads: string;
  provider_meta: string;
  provider_gtm: string;
  cookie_ids_label: string;
  cookie_ids_desc: string;
  save_choice: string;
}

export interface SocialProofData {
  title: string;
  subtitle: string;
  verified: string;
  omnibus: string;
  reviews: {
    quote: string;
    author: string;
    role: string;
  }[];
}

export interface VertexPlayerData {
  ariaLabel?: string;
  tabs: {
    ai: { label: string };
    pipeline: { label: string };
    exec: { label: string };
  };
  content: {
    ai: { title: string; desc: string };
    pipeline: { title: string; desc: string };
    exec: { title: string; desc: string };
  };
}

export interface Translation {
  langCode: 'en-US' | 'pl-PL';
  common: CommonData;
  modals: {
    title: string;
    desc: string;
    initializingInterface: string;
  };
  nav: {
    items: NavItem[];
    login: string;
    cta: string;
    mobile_dropdown_hint: string;
  };
  features: {
    ai_assistant: FeatureDetail;
    growth_recs: FeatureDetail;
    campaign_perf: FeatureDetail;
    reports: FeatureDetail;
    products: FeatureDetail;
    conv_path: FeatureDetail;
    customers: FeatureDetail;
    discounts: FeatureDetail;
    funnel: FeatureDetail;
  };
  featuresSection: FeaturesSectionData;
  featureModal: FeatureModalMetaData;
  hero: HeroData;
  etl: EtlData;
  integrations: IntegrationsData;
  roi: RoiData;
  security: SecurityData;
  pricing: PricingData;
  faq: FaqData;
  techFuture: TechFutureData;
  knowledgeBase: KnowledgeBaseData;
  socialProof: SocialProofData;
  vertexPlayer: VertexPlayerData;
  finalCta: FinalCtaData;
  videoModal: VideoModalData;
  about: AboutData;
  footer: FooterData;
  auth: AuthData;
  papaAI: PapaAIData;
  postAuth: PostAuthData;
  dashboard: DashboardData;
  promo: PromoData;
  promo_v2: PromoDataV2;
  cookies: CookieData;
}

export interface Translations {
  en: Translation;
  pl: Translation;
}
