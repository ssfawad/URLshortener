output "db_password_secret_id" {
  description = "Secret Manager secret ID (short name) for use in Cloud Run secret_key_ref"
  value       = google_secret_manager_secret.db_password.secret_id
}
