data "aws_vpc" "main" {
  tags = { Name = "Main VPC" }
}

data "aws_subnet" "prod_apps_1a" {
  vpc_id            = data.aws_vpc.main.id
  availability_zone = "us-east-2a"
  tags = {
    env  = "prod"
    type = "apps"
  }
}

data "aws_subnet" "prod_apps_1b" {
  vpc_id            = data.aws_vpc.main.id
  availability_zone = "us-east-2b"
  tags = {
    env  = "prod"
    type = "apps"
  }
}
