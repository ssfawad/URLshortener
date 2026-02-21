terraform {
  backend "gcs" {
    # bucket and prefix are set via -backend-config flags or terraform init -reconfigure
    # Example: terraform init -backend-config="bucket=my-tf-state-bucket"
    prefix = "urlshortener/prod"
  }
}
