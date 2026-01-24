output "lb_ip" {
  description = "Global load balancer IP address"
  value       = google_compute_global_address.lb.address
}

output "api_url" {
  description = "API base URL (path-based)"
  value       = "https://${var.domain}/api"
}

output "web_url" {
  description = "Web URL"
  value       = "https://${var.domain}"
}

output "cloud_sql_instance_connection_name" {
  description = "Cloud SQL instance connection name"
  value       = google_sql_database_instance.main.connection_name
}

output "cloud_sql_database_name" {
  description = "Cloud SQL database name"
  value       = google_sql_database.main.name
}

output "cloud_sql_password_secret_name" {
  description = "Secret Manager secret name for Cloud SQL password (if generated)"
  value       = var.generate_cloud_sql_password ? google_secret_manager_secret.cloud_sql_password[0].secret_id : ""
}
