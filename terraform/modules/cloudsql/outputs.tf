output "instance_connection_name" {
  description = "Cloud SQL connection name (project:region:instance) — used by Cloud SQL Auth Proxy"
  value       = google_sql_database_instance.postgres.connection_name
}

output "instance_name" {
  description = "Cloud SQL instance name"
  value       = google_sql_database_instance.postgres.name
}
