variable "project_id" {
  type        = string
  description = "GCP project id"
}

variable "region" {
  type        = string
  description = "GCP region for Cloud Run"
  default     = "europe-central2"
}

variable "domain" {
  type        = string
  description = "Primary domain (e.g. www.papadata.pl)"
}

variable "additional_domains" {
  type        = list(string)
  description = "Additional domains for the managed certificate"
  default     = []
}

variable "api_service_name" {
  type        = string
  description = "Cloud Run service name for API"
  default     = "papadata-api-v2"
}

variable "web_service_name" {
  type        = string
  description = "Cloud Run service name for Web"
  default     = "papadata-frontend-v2"
}

variable "api_image" {
  type        = string
  description = "Container image for API"
}

variable "web_image" {
  type        = string
  description = "Container image for Web"
}

variable "api_env" {
  type        = map(string)
  description = "Plain env vars for API"
  default     = {}
}

variable "web_env" {
  type        = map(string)
  description = "Plain env vars for Web"
  default     = {}
}

variable "secret_names" {
  type        = list(string)
  description = "Secret Manager secret names to create (versions added separately)"
  default     = []
}

variable "api_secret_env" {
  type        = map(string)
  description = "Map env var name => Secret Manager secret name (uses version 'latest')"
  default     = {}
}

variable "web_secret_env" {
  type        = map(string)
  description = "Map env var name => Secret Manager secret name (uses version 'latest')"
  default     = {}
}

variable "api_path_prefix" {
  type        = string
  description = "Path-based routing prefix for API"
  default     = "/api/*"
}

variable "enable_cloud_armor" {
  type        = bool
  description = "Attach Cloud Armor policy to API backend"
  default     = true
}

variable "cloud_armor_policy_name" {
  type        = string
  description = "Cloud Armor policy name"
  default     = "papadata-security-policy"
}

variable "cloud_armor_rate_limit_count" {
  type        = number
  description = "Rate limit count per interval"
  default     = 300
}

variable "cloud_armor_rate_limit_interval_sec" {
  type        = number
  description = "Rate limit interval in seconds"
  default     = 60
}

variable "cloud_armor_rate_limit_ban_sec" {
  type        = number
  description = "Ban duration in seconds when rate limit exceeded"
  default     = 600
}

variable "enable_http_to_https_redirect" {
  type        = bool
  description = "Enable HTTP to HTTPS redirect on port 80"
  default     = true
}

variable "enable_dns" {
  type        = bool
  description = "Create DNS records in Cloud DNS"
  default     = false
}

variable "dns_zone_name" {
  type        = string
  description = "Existing Cloud DNS zone name (if enable_dns=true and create_dns_zone=false)"
  default     = ""
}

variable "create_dns_zone" {
  type        = bool
  description = "Create a new Cloud DNS zone"
  default     = false
}

variable "dns_zone_dns_name" {
  type        = string
  description = "DNS name for the managed zone, e.g. papadata.pl. (required when create_dns_zone=true)"
  default     = ""
}

variable "enable_identity_platform" {
  type        = bool
  description = "Enable Identity Platform base config"
  default     = true
}

variable "identity_platform_authorized_domains" {
  type        = list(string)
  description = "Authorized domains for Identity Platform"
  default     = []
}

variable "identity_platform_google_client_id" {
  type        = string
  description = "Google OAuth client id for Identity Platform"
  default     = ""
}

variable "identity_platform_google_client_secret" {
  type        = string
  description = "Google OAuth client secret for Identity Platform"
  default     = ""
  sensitive   = true
}

variable "identity_platform_microsoft_client_id" {
  type        = string
  description = "Microsoft OAuth client id for Identity Platform"
  default     = ""
}

variable "identity_platform_microsoft_client_secret" {
  type        = string
  description = "Microsoft OAuth client secret for Identity Platform"
  default     = ""
  sensitive   = true
}

variable "cloud_sql_instance_name" {
  type        = string
  description = "Cloud SQL instance name"
  default     = "papadata-sql"
}

variable "cloud_sql_database_version" {
  type        = string
  description = "Cloud SQL database version, e.g. POSTGRES_15"
  default     = "POSTGRES_15"
}

variable "cloud_sql_tier" {
  type        = string
  description = "Cloud SQL machine tier"
  default     = "db-f1-micro"
}

variable "cloud_sql_disk_size_gb" {
  type        = number
  description = "Cloud SQL disk size in GB"
  default     = 20
}

variable "cloud_sql_ipv4_enabled" {
  type        = bool
  description = "Enable public IPv4 for Cloud SQL (disable for private IP setup)"
  default     = true
}

variable "cloud_sql_database_name" {
  type        = string
  description = "Cloud SQL database name"
  default     = "papadata"
}

variable "cloud_sql_user_name" {
  type        = string
  description = "Cloud SQL database user name"
  default     = "papadata"
}

variable "cloud_sql_user_password" {
  type        = string
  description = "Cloud SQL database user password"
  sensitive   = true
  default     = ""
}

variable "enable_cloud_sql_private_ip" {
  type        = bool
  description = "Enable Cloud SQL Private IP with PSC/VPC peering"
  default     = true
}

variable "cloud_sql_private_only" {
  type        = bool
  description = "Disable public IPv4 and require private connectivity"
  default     = false
}

variable "enable_cloud_sql_auth_proxy" {
  type        = bool
  description = "Enable Cloud SQL Auth Proxy integration for Cloud Run"
  default     = true
}

variable "generate_cloud_sql_password" {
  type        = bool
  description = "Generate Cloud SQL password and store in Secret Manager"
  default     = true
}

variable "cloud_sql_password_secret_name" {
  type        = string
  description = "Secret Manager secret name for Cloud SQL password"
  default     = "CLOUD_SQL_PASSWORD"
}

variable "enable_secret_rotation" {
  type        = bool
  description = "Enable Secret Manager rotation policy on generated secrets"
  default     = true
}

variable "secret_rotation_period" {
  type        = string
  description = "Rotation period for secrets, e.g. 2592000s (30 days)"
  default     = "2592000s"
}

variable "vpc_network_name" {
  type        = string
  description = "VPC network name for private services"
  default     = "papadata-vpc"
}

variable "vpc_subnet_name" {
  type        = string
  description = "VPC subnet name"
  default     = "papadata-subnet"
}

variable "vpc_subnet_cidr" {
  type        = string
  description = "VPC subnet CIDR range"
  default     = "10.10.0.0/24"
}

variable "vpc_connector_name" {
  type        = string
  description = "Serverless VPC Access connector name"
  default     = "papadata-connector"
}

variable "vpc_connector_cidr" {
  type        = string
  description = "Serverless VPC Access connector CIDR range"
  default     = "10.8.0.0/28"
}

variable "vpc_connector_min_instances" {
  type        = number
  description = "Serverless VPC Access connector min instances"
  default     = 2
}

variable "vpc_connector_max_instances" {
  type        = number
  description = "Serverless VPC Access connector max instances"
  default     = 3
}

variable "private_service_range_prefix_length" {
  type        = number
  description = "Prefix length for private service range"
  default     = 24
}

variable "enabled_apis" {
  type        = list(string)
  description = "GCP APIs to enable"
  default = [
    "run.googleapis.com",
    "compute.googleapis.com",
    "secretmanager.googleapis.com",
    "dns.googleapis.com",
    "iam.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "identitytoolkit.googleapis.com",
    "servicenetworking.googleapis.com",
    "vpcaccess.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
    "aiplatform.googleapis.com",
    "bigquery.googleapis.com",
    "sqladmin.googleapis.com",
    "artifactregistry.googleapis.com"
  ]
}
