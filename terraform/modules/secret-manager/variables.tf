variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "app_name" {
  description = "Application name prefix"
  type        = string
}

variable "db_password" {
  description = "Database password to store in Secret Manager"
  type        = string
  sensitive   = true
}
