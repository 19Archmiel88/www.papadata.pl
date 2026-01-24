locals {
  managed_domains = distinct(concat([var.domain], var.additional_domains))
}

resource "google_project_service" "enabled" {
  for_each           = toset(var.enabled_apis)
  service            = each.value
  disable_on_destroy = false
}

resource "google_service_account" "cloud_run" {
  account_id   = "papadata-cloudrun"
  display_name = "Papadata Cloud Run"
}

resource "google_compute_network" "vpc" {
  count                   = var.enable_cloud_sql_private_ip ? 1 : 0
  name                    = var.vpc_network_name
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet" {
  count         = var.enable_cloud_sql_private_ip ? 1 : 0
  name          = var.vpc_subnet_name
  ip_cidr_range = var.vpc_subnet_cidr
  region        = var.region
  network       = google_compute_network.vpc[0].id
}

resource "google_vpc_access_connector" "serverless" {
  count  = var.enable_cloud_sql_private_ip ? 1 : 0
  name   = var.vpc_connector_name
  region = var.region
  network = google_compute_network.vpc[0].name

  ip_cidr_range = var.vpc_connector_cidr
  min_instances = var.vpc_connector_min_instances
  max_instances = var.vpc_connector_max_instances
}

resource "google_compute_global_address" "private_service_range" {
  count         = var.enable_cloud_sql_private_ip ? 1 : 0
  name          = "${var.cloud_sql_instance_name}-psc-range"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = var.private_service_range_prefix_length
  network       = google_compute_network.vpc[0].id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  count   = var.enable_cloud_sql_private_ip ? 1 : 0
  network = google_compute_network.vpc[0].id
  service = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_service_range[0].name]
}

resource "google_secret_manager_secret" "secrets" {
  for_each  = toset(var.secret_names)
  secret_id = each.value

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret" "cloud_sql_password" {
  count     = var.generate_cloud_sql_password ? 1 : 0
  secret_id = var.cloud_sql_password_secret_name

  replication {
    automatic = true
  }

  dynamic "rotation" {
    for_each = var.enable_secret_rotation ? [1] : []
    content {
      rotation_period = var.secret_rotation_period
    }
  }
}

resource "random_password" "cloud_sql" {
  count   = var.generate_cloud_sql_password ? 1 : 0
  length  = 32
  special = true
}

resource "google_secret_manager_secret_version" "cloud_sql_password" {
  count       = var.generate_cloud_sql_password ? 1 : 0
  secret      = google_secret_manager_secret.cloud_sql_password[0].id
  secret_data = random_password.cloud_sql[0].result
}

resource "google_cloud_run_service" "api" {
  name     = var.api_service_name
  location = var.region

  metadata {
    annotations = var.enable_cloud_sql_auth_proxy ? {
      "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.main.connection_name
    } : {}
  }

  template {
    metadata {
      annotations = var.enable_cloud_sql_auth_proxy ? {
        "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.main.connection_name
      } : {}
    }

    spec {
      service_account_name = google_service_account.cloud_run.email

      dynamic "vpc_access" {
        for_each = var.enable_cloud_sql_private_ip ? [1] : []
        content {
          connector = google_vpc_access_connector.serverless[0].id
          egress    = "ALL_TRAFFIC"
        }
      }

      containers {
        image = var.api_image

        dynamic "env" {
          for_each = var.api_env
          content {
            name  = env.key
            value = env.value
          }
        }

        dynamic "env" {
          for_each = var.api_secret_env
          content {
            name = env.key
            value_from {
              secret_key_ref {
                name    = env.value
                version = "latest"
              }
            }
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service" "web" {
  name     = var.web_service_name
  location = var.region

  template {
    spec {
      service_account_name = google_service_account.cloud_run.email

      dynamic "vpc_access" {
        for_each = var.enable_cloud_sql_private_ip ? [1] : []
        content {
          connector = google_vpc_access_connector.serverless[0].id
          egress    = "ALL_TRAFFIC"
        }
      }

      containers {
        image = var.web_image

        dynamic "env" {
          for_each = var.web_env
          content {
            name  = env.key
            value = env.value
          }
        }

        dynamic "env" {
          for_each = var.web_secret_env
          content {
            name = env.key
            value_from {
              secret_key_ref {
                name    = env.value
                version = "latest"
              }
            }
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service_iam_member" "api_invoker" {
  service  = google_cloud_run_service.api.name
  location = google_cloud_run_service.api.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_service_iam_member" "web_invoker" {
  service  = google_cloud_run_service.web.name
  location = google_cloud_run_service.web.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_compute_region_network_endpoint_group" "api_neg" {
  name                  = "${var.api_service_name}-neg"
  region                = var.region
  network_endpoint_type = "SERVERLESS"

  cloud_run {
    service = google_cloud_run_service.api.name
  }
}

resource "google_compute_region_network_endpoint_group" "web_neg" {
  name                  = "${var.web_service_name}-neg"
  region                = var.region
  network_endpoint_type = "SERVERLESS"

  cloud_run {
    service = google_cloud_run_service.web.name
  }
}

resource "google_compute_security_policy" "api" {
  count = var.enable_cloud_armor ? 1 : 0
  name  = var.cloud_armor_policy_name

  rule {
    action   = "rate_based_ban"
    priority = 1000
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    rate_limit_options {
      enforce_on_key = "IP"
      rate_limit_threshold {
        count        = var.cloud_armor_rate_limit_count
        interval_sec = var.cloud_armor_rate_limit_interval_sec
      }
      ban_duration_sec = var.cloud_armor_rate_limit_ban_sec
      conform_action   = "allow"
      exceed_action    = "deny(429)"
    }
    description = "Basic rate limiting"
  }

  rule {
    action   = "allow"
    priority = 2147483647
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    description = "Default allow"
  }
}

resource "google_compute_backend_service" "api" {
  name                  = "${var.api_service_name}-backend"
  protocol              = "HTTP"
  load_balancing_scheme = "EXTERNAL_MANAGED"

  backend {
    group = google_compute_region_network_endpoint_group.api_neg.id
  }

  security_policy = var.enable_cloud_armor ? google_compute_security_policy.api[0].id : null
}

resource "google_compute_backend_service" "web" {
  name                  = "${var.web_service_name}-backend"
  protocol              = "HTTP"
  load_balancing_scheme = "EXTERNAL_MANAGED"

  backend {
    group = google_compute_region_network_endpoint_group.web_neg.id
  }
}

resource "google_compute_url_map" "main" {
  name            = "papadata-url-map"
  default_service = google_compute_backend_service.web.id

  host_rule {
    hosts        = [var.domain]
    path_matcher = "papadata-matcher"
  }

  path_matcher {
    name            = "papadata-matcher"
    default_service = google_compute_backend_service.web.id

    path_rule {
      paths   = [var.api_path_prefix]
      service = google_compute_backend_service.api.id
    }
  }
}

resource "google_compute_managed_ssl_certificate" "main" {
  name = "papadata-managed-cert"

  managed {
    domains = local.managed_domains
  }
}

resource "google_compute_target_https_proxy" "main" {
  name             = "papadata-https-proxy"
  url_map          = google_compute_url_map.main.id
  ssl_certificates = [google_compute_managed_ssl_certificate.main.id]
}

resource "google_compute_url_map" "http_redirect" {
  count = var.enable_http_to_https_redirect ? 1 : 0
  name  = "papadata-http-redirect"

  default_url_redirect {
    https_redirect = true
    strip_query    = false
  }
}

resource "google_compute_target_http_proxy" "http_redirect" {
  count   = var.enable_http_to_https_redirect ? 1 : 0
  name    = "papadata-http-proxy"
  url_map = google_compute_url_map.http_redirect[0].id
}

resource "google_compute_global_address" "lb" {
  name = "papadata-lb-ip"
}

resource "google_compute_global_forwarding_rule" "https" {
  name                  = "papadata-https-forwarding-rule"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  port_range            = "443"
  target                = google_compute_target_https_proxy.main.id
  ip_address            = google_compute_global_address.lb.address
}

resource "google_compute_global_forwarding_rule" "http" {
  count                 = var.enable_http_to_https_redirect ? 1 : 0
  name                  = "papadata-http-forwarding-rule"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  port_range            = "80"
  target                = google_compute_target_http_proxy.http_redirect[0].id
  ip_address            = google_compute_global_address.lb.address
}

resource "google_dns_managed_zone" "zone" {
  count    = var.enable_dns && var.create_dns_zone ? 1 : 0
  name     = var.dns_zone_name
  dns_name = var.dns_zone_dns_name
}

data "google_dns_managed_zone" "existing" {
  count = var.enable_dns && !var.create_dns_zone ? 1 : 0
  name  = var.dns_zone_name
}

resource "google_dns_record_set" "www" {
  count = var.enable_dns ? 1 : 0

  name = "${var.domain}."
  type = "A"
  ttl  = 300

  managed_zone = var.create_dns_zone ? google_dns_managed_zone.zone[0].name : data.google_dns_managed_zone.existing[0].name
  rrdatas      = [google_compute_global_address.lb.address]
}

resource "google_identity_platform_config" "default" {
  provider = google-beta
  count    = var.enable_identity_platform ? 1 : 0

  authorized_domains = var.identity_platform_authorized_domains

  sign_in {
    email {
      enabled           = true
      password_required = true
    }
  }
}

resource "google_identity_platform_default_supported_idp_config" "google" {
  provider = google-beta
  count    = var.enable_identity_platform && var.identity_platform_google_client_id != "" ? 1 : 0

  idp_id   = "google.com"
  enabled  = true
  client_id     = var.identity_platform_google_client_id
  client_secret = var.identity_platform_google_client_secret
}

resource "google_identity_platform_default_supported_idp_config" "microsoft" {
  provider = google-beta
  count    = var.enable_identity_platform && var.identity_platform_microsoft_client_id != "" ? 1 : 0

  idp_id   = "microsoft.com"
  enabled  = true
  client_id     = var.identity_platform_microsoft_client_id
  client_secret = var.identity_platform_microsoft_client_secret
}

resource "google_sql_database_instance" "main" {
  name             = var.cloud_sql_instance_name
  region           = var.region
  database_version = var.cloud_sql_database_version

  settings {
    tier              = var.cloud_sql_tier
    disk_size         = var.cloud_sql_disk_size_gb
    disk_autoresize   = true

    ip_configuration {
      ipv4_enabled    = var.cloud_sql_private_only ? false : (var.enable_cloud_sql_private_ip ? false : var.cloud_sql_ipv4_enabled)
      private_network = var.enable_cloud_sql_private_ip ? google_compute_network.vpc[0].id : null
    }
  }
}

resource "google_sql_database" "main" {
  name     = var.cloud_sql_database_name
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "main" {
  name     = var.cloud_sql_user_name
  instance = google_sql_database_instance.main.name
  password = var.generate_cloud_sql_password ? random_password.cloud_sql[0].result : var.cloud_sql_user_password
}

resource "google_project_iam_member" "cloudsql_client" {
  role   = "roles/cloudsql.client"
  member = "serviceAccount:${google_service_account.cloud_run.email}"
}
