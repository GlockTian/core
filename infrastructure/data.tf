data "aws_ssm_parameter" "doppler_api_gateway_prod_token" {
  name = "/terraform/prd/DOPPLER_API_GATEWAY_PROD_TOKEN"
}

data "aws_ssm_parameter" "doppler_api_journeys_prod_token" {
  name = "/terraform/prd/DOPPLER_API_JOURNEYS_PROD_TOKEN"
}

data "aws_ssm_parameter" "doppler_api_languages_prod_token" {
  name = "/terraform/prd/DOPPLER_API_LANGUAGES_PROD_TOKEN"
}

data "aws_ssm_parameter" "doppler_api_users_prod_token" {
  name = "/terraform/prd/DOPPLER_API_USERS_PROD_TOKEN"
}

data "aws_ssm_parameter" "doppler_api_videos_prod_token" {
  name = "/terraform/prd/DOPPLER_API_VIDEOS_PROD_TOKEN"
}

data "aws_ssm_parameter" "doppler_faktory_stage_token" {
  name = "/terraform/prd/DOPPLER_FAKTORY_STAGE_TOKEN"
}

data "aws_ssm_parameter" "doppler_faktory_prod_token" {
  name = "/terraform/prd/DOPPLER_FAKTORY_PROD_TOKEN"
}
