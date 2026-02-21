variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region for all regional resources"
  type        = string
  default     = "us-central1"
}

variable "app_name" {
  description = "Application name — used as prefix for all resource names"
  type        = string
  default     = "urlshortener"
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "urlshortener"
}

variable "db_user" {
  description = "PostgreSQL application user"
  type        = string
  default     = "urlshortener"
}

