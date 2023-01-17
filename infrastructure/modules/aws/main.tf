module "vpc" {
  source = "./vpc"
  env    = var.env
  cidr   = var.cidr
}

module "internal_alb_security_group" {
  source        = "./security-group"
  name          = "jfp-internal-alb-sg-${var.env}"
  vpc_id        = module.vpc.vpc_id
  ingress_rules = local.internal_alb_config.ingress_rules
  egress_rules  = local.internal_alb_config.egress_rules
}

module "public_alb_security_group" {
  source        = "./security-group"
  name          = "jfp-public-alb-sg-${var.env}"
  vpc_id        = module.vpc.vpc_id
  ingress_rules = local.public_alb_config.ingress_rules
  egress_rules  = local.public_alb_config.egress_rules
}

module "internal_alb" {
  source            = "./alb"
  name              = "jfp-internal-alb-${var.env}"
  subnets           = module.vpc.internal_subnets
  vpc_id            = module.vpc.vpc_id
  internal          = true
  listener_port     = 80
  listener_protocol = "HTTP"
  listeners         = local.internal_alb_config.listeners
  security_groups   = [module.internal_alb_security_group.security_group_id]
}

module "public_alb" {
  source            = "./alb"
  name              = "jfp-public-alb-${var.env}"
  subnets           = module.vpc.public_subnets
  vpc_id            = module.vpc.vpc_id
  internal          = false
  listener_port     = 443
  listener_protocol = "HTTPS"
  listeners         = local.public_alb_config.listeners
  redirects         = local.public_alb_config.redirects
  security_groups   = [module.public_alb_security_group.security_group_id]
  certificate_arn   = var.certificate_arn
}

module "route53_private_zone" {
  source            = "./route53"
  internal_url_name = var.internal_url_name
  alb               = module.internal_alb
  vpc_id            = module.vpc.vpc_id
}

module "ecs" {
  source                      = "./ecs"
  name                        = "jfp-ecs-cluster-${var.env}"
  vpc_id                      = module.vpc.vpc_id
  internal_alb_security_group = module.internal_alb_security_group
  public_alb_security_group   = module.public_alb_security_group
}
