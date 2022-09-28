terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 3.74.0, < 5.0.0"
    }    
    github = {
      source  = "integrations/github"
      version = ">= 4.20.0, < 5.0.0"
    }
  }
}
