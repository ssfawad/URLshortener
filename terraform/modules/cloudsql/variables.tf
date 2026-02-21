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

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
}

variable "db_user" {
  description = "PostgreSQL application user"
  type        = string
}

variable "db_password" {
  description = "PostgreSQL application user password"
  type        = string
  sensitive   = true
}

