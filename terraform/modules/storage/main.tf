# Regional bucket — qualifies for GCS Always Free tier (5 GB/month)
resource "google_storage_bucket" "frontend" {
  name     = "${var.project_id}-${var.app_name}-frontend"
  location = var.region

  uniform_bucket_level_access = true
  force_destroy               = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html" # SPA client-side routing fallback
  }
}

resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.frontend.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}
