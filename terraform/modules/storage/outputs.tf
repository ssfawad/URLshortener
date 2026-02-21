output "bucket_name" {
  description = "GCS bucket name — set as FRONTEND_BUCKET in GitHub Actions secrets"
  value       = google_storage_bucket.frontend.name
}

output "bucket_url" {
  description = "Public HTTPS URL for the frontend (index.html)"
  value       = "https://storage.googleapis.com/${google_storage_bucket.frontend.name}/index.html"
}
