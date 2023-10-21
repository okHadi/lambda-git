provider "aws" {
  region = "us-east-1" # Change this to your desired AWS region
}

resource "aws_lambda_function" "lambda-git-tf" {
  function_name = "lambda-git-tf"
  handler = "index.handler"
  runtime = "nodejs18.x" # Change this to your desired runtime

  # Your Lambda layer ARN
  layers = ["arn:aws:lambda:us-east-1:553035198032:layer:git-lambda2:8"]

  role = aws_iam_role.lambda_exec_role.arn

  # The function code can be inline or refer to a ZIP archive. You can modify this section as needed.
  filename = "lambda-git.zip" # The path to your Lambda function code ZIP archive
  source_code_hash = filebase64sha256("lambda-git.zip")


}

resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "lambda_exec_policy" {
    name = "lambda-exec-policy"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  roles = [aws_iam_role.lambda_exec_role.name]
}
