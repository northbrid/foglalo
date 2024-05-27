resource "aws_iam_role" "foglalo_publish_role" {
  name = "foglalo_publish_role"
  max_session_duration = 28800
  inline_policy {
    name = "foglalo_publish_policy"
    policy = jsonencode(
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Action": [
              "sns:Publish",
            ],
            "Effect": "Allow",
            "Resource": [
              aws_sns_topic.foglalo_notification_topic.arn
            ]
          }
        ]
      }
    )
  }
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid = ""
        Principal = {
          AWS = "211125513326"
        }
      }
    ]
  })
}
