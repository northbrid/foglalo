resource "aws_iam_user" "foglalo_user" {
  name = "foglalo_user"
}

resource "aws_iam_access_key" "foglalo_user_key" {
  user = aws_iam_user.foglalo_user.name
}

data "aws_iam_policy_document" "foglalo_user_policy_doc" {
  statement {
    effect = "Allow"
    actions = [
      "sts:AssumeRole"
    ]
    resources = [
      aws_iam_role.foglalo_publish_role.arn
    ]
  }
}

resource "aws_iam_user_policy" "foglalo_user_policy" {
  name   = "foglalo_user_policy"
  user   = aws_iam_user.foglalo_user.name
  policy = data.aws_iam_policy_document.foglalo_user_policy_doc.json
}

output "secret" {
  value = aws_iam_access_key.foglalo_user_key.encrypted_secret
}
