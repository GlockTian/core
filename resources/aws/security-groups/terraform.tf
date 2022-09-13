terraform {
  backend "s3" {
    encrypt        = true
    bucket         = "jfp-terraform-state"
    dynamodb_table = "jfp-terraform-state-lock"
    region         = "us-east-2"
    key            = "aws/security-groups/terraform.tfstate"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.15"
    }
  }
  required_version = ">= 1.1.7"
}

provider "aws" {
  region = "us-east-2"
  default_tags {
    tags = local.tags
  }
}
