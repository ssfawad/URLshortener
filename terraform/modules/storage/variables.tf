variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "app_name" {
  description = "Application name prefix"
  type        = string
}

variable "region" {
  description = "GCP region (should be a single region to qualify for free tier)"
  type        = string
}
