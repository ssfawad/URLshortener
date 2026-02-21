variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
}

variable "app_name" {
  description = "Application name prefix"
  type        = string
}

variable "image" {
  description = "Full Artifact Registry image URL (including tag)"
  type        = string
}

variable "cloudsql_connection_name" {
  description = "Cloud SQL instance connection name (project:region:instance) for Auth Proxy"
  type        = string
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
}

variable "db_user" {
  description = "PostgreSQL application user"
  type        = string
}

variable "db_password_secret_id" {
  description = "Secret Manager secret ID for the DB password"
  type        = string
}

variable "cors_origin" {
  description = "Allowed CORS origin for the API (e.g. the frontend GCS URL origin)"
  type        = string
}
